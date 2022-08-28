import crypto from 'crypto'
import fs from 'fs'
import { writeFile, mkdir, readFile, rm, rename, readdir, stat } from 'fs/promises'
import { webfont } from 'webfont'
import UglifyJS from 'uglify-js'
import { nanoid } from 'nanoid'
import { minify } from 'csso'
import { Project } from '../../../../models/project.js'
import { ERROR_CODE, FILES_MAX_LENGTH } from '../../../../utils/const.js'
import { getConfig } from '../../../../config/index.js'
import { deleteObjects, getBucket, isActive as isCosActive, putObject } from '../../../../utils/cos.js'

const config = getConfig()
const domain = isCosActive ? config.cos.domain : config.domain

/**
 * icon生成资源路径
 */
export const srcPath = new URL('../../../../public/src/', import.meta.url)

if (!fs.existsSync(srcPath)) {
  fs.mkdirSync(srcPath)
}

/**
 * 生成css
 */
export async function genCSS (req, res, projectId, project) {
  const dirRelativePath = `${projectId}/${nanoid()}/`
  const dir = new URL(dirRelativePath, srcPath)
  await mkdir(dir, {
    recursive: true
  })
  const svgsRelativePath = 'svgs/'
  const svgsPath = new URL(svgsRelativePath, dir)
  await mkdir(svgsPath)
  const metaMap = new Map()
  let unicode = 2000 // 预防unicode不存在
  await Promise.all(project.icons.map(async icon => {
    const file = new URL(`${icon.code}.svg`, svgsPath)
    if (!icon.unicode) {
      icon.unicode = ++unicode
      console.error('UnicodeError:', projectId, icon.code)
    }
    await writeFile(file, `<svg viewBox="${icon.svg.viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg">${icon.svg.path}</svg>`)
    metaMap.set(icon.code, {
      unicode: [String.fromCodePoint(+`0x${icon.unicode}`)],
      unicodeNum: icon.unicode
    })
  }))
  webfont({
    files: `public/src/${dirRelativePath}${svgsRelativePath}*.svg`,
    template: './controllers/project/icon/gen/template.css.njk',
    templateFontPath: `${domain}/src/${projectId}/`,
    fontName: project.class,
    classPrefix: project.prefix,
    addHashInFontUrl: true,
    formats: ['ttf', 'woff', 'woff2'],
    glyphTransformFn (obj) {
      const meta = metaMap.get(obj.name)
      Object.assign(obj, meta)
      return obj
    },
    svgicons2svgfont: {
      normalize: true,
      fontHeight: 1024,
      log () {}
    }
  }).then(async (result) => {
    if (isCosActive) {
      const destPath = `src/${projectId}/${result.hash}/`
      await putObject(`${destPath}iconlake.ttf`, result.ttf)
      await putObject(`${destPath}iconlake.woff`, result.woff)
      await putObject(`${destPath}iconlake.woff2`, Buffer.from(result.woff2))
      await putObject(`${destPath}iconlake.css`, minify(result.template).css)
      await rm(new URL(projectId, srcPath), {
        recursive: true,
        force: true
      })
    } else {
      const destPath = new URL(`${projectId}/${result.hash}/`, srcPath)
      if (fs.existsSync(destPath)) {
        await rm(destPath, {
          force: true,
          recursive: true
        })
      }
      writeFile(new URL('iconlake.css', dir), minify(result.template).css)
      writeFile(new URL('iconlake.ttf', dir), result.ttf)
      writeFile(new URL('iconlake.woff', dir), result.woff)
      writeFile(new URL('iconlake.woff2', dir), result.woff2)
      await rm(svgsPath, {
        recursive: true,
        force: true
      })
      await rename(dir, destPath)
    }
    const info = {
      updateTime: new Date(),
      hash: result.hash
    }
    await Project.updateOne({
      _id: projectId,
      members: {
        $elemMatch: {
          userId: req.user._id
        }
      }
    }, {
      $set: {
        'file.css': info
      }
    })
    res.json(info)
    return null
  }).catch(err => {
    console.error(err)
    res.json({
      error: ERROR_CODE.FAIL
    })
  })
}

/**
 * 生成js
 */
export async function genJS (req, res, projectId, project) {
  const data = JSON.stringify(project.icons.map(e => [e.code, e.svg.viewBox, e.svg.path]))
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const jsTemp = await readFile(new URL('./template.js', import.meta.url))
  const ugResult = UglifyJS.minify(
    jsTemp.toString().replace('[\'__DATA__\']', data).replace('__HASH__', hash)
  )
  if (ugResult.error) {
    res.json({
      error: ERROR_CODE.FAIL
    })
    return
  }
  if (isCosActive) {
    await putObject(`src/${projectId}/${hash}/iconlake.js`, ugResult.code)
  } else {
    const dir = new URL(`${projectId}/${hash}/`, srcPath)
    if (fs.existsSync(dir)) {
      await rm(dir, {
        force: true,
        recursive: true
      })
    }
    await mkdir(dir, {
      recursive: true
    })
    await writeFile(
      new URL('iconlake.js', dir),
      ugResult.code
    )
  }
  const info = {
    updateTime: new Date(),
    hash
  }
  await Project.updateOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, {
    $set: {
      'file.js': info
    }
  })
  res.json(info)
}

/**
 * 生成vue
 */
export async function genVUE (req, res, projectId, project) {
  const data = JSON.stringify(project.icons.map(e => [e.code, e.svg.viewBox, e.svg.path]))
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const vueTemp = await readFile(new URL('./template.vue', import.meta.url))
  res.json({
    content: vueTemp.toString().replace('[\'__DATA__\']', data).replace('__HASH__', hash)
  })
}

/**
 * 清理历史文件
 */
export const deleteOldFiles = isCosActive ? deleteOldCloudFiles : deleteOldLocalFiles

/**
 * 清理本地历史文件
 * @param {string} projectId
 */
async function deleteOldLocalFiles (projectId) {
  const projectPath = new URL(`${projectId}/`, srcPath)
  const files = await readdir(projectPath)
  if (files.length <= FILES_MAX_LENGTH) {
    return
  }
  const list = await Promise.all(files.map(async (name) => {
    const statInfo = await stat(new URL(name, projectPath))
    return {
      name,
      time: statInfo.mtimeMs
    }
  }))
  list.sort((a, b) => a.time - b.time)
  for (let i = 0, n = files.length - FILES_MAX_LENGTH; i < n; ++i) {
    await rm(new URL(list[i].name, projectPath), {
      force: true,
      recursive: true
    })
  }
}

/**
 * 清理本地历史文件
 * @param {string} projectId
 */
async function deleteOldCloudFiles (projectId) {
  const data = await getBucket(`src/${projectId}/`)
  const objs = {}
  data.contents.forEach(e => {
    const id = e.key.split(/\//g)[2]
    if (!objs[id]) {
      objs[id] = {
        id,
        time: +new Date(e.lastModified),
        keys: [e.key]
      }
    } else {
      const t = +new Date(e.lastModified)
      if (t > objs[id].time) {
        objs[id].time = t
      }
      objs[id].keys.push(e.key)
    }
  })
  const list = Object.values(objs)
  if (list.length <= FILES_MAX_LENGTH) {
    return
  }
  list.sort((a, b) => a.time - b.time)
  const keys = []
  for (let i = 0, n = list.length - FILES_MAX_LENGTH; i < n; ++i) {
    keys.push(...list[i].keys)
  }
  await deleteObjects(keys)
}

/**
 * 删除项目
 * @param {string} projectId
 */
export const deleteProjectDir = isCosActive ? deleteProjectCloudDir : deleteProjectLocalDir

/**
 * 删除云端项目目录
 * @param {string} projectId
 */
async function deleteProjectCloudDir (projectId) {
  const data = await getBucket(`src/${projectId}/`)
  if (data.contents.length > 0) {
    await deleteObjects(data.contents.map(e => e.key))
  }
}

/**
 * 删除本地项目目录
 * @param {string} projectId
 */
async function deleteProjectLocalDir (projectId) {
  const dir = new URL(projectId, srcPath)
  if (fs.existsSync(dir)) {
    await rm(dir, {
      recursive: true,
      force: true
    })
  }
}
