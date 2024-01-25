import crypto from 'crypto'
import fs from 'fs'
import { writeFile, mkdir, readFile, rm, rename } from 'fs/promises'
import { webfont } from 'webfont'
import UglifyJS from 'uglify-js'
import { nanoid } from 'nanoid'
import CleanCSS from 'clean-css'
import { Project } from '../../../../models/project.js'
import { ERROR_CODE, ONE_DAY_SECONDS, TEMPORARY_FILE_EXPIRE } from '../../../../utils/const.js'
import { getConfig } from '../../../../config/index.js'
import { deleteObjects, getBucket, isActive as isCosActive, putObject } from '../../../../utils/cos.js'
import mongoose from 'mongoose'
import { getText } from '../../../../utils/file.js'

const config = getConfig()
const domain = isCosActive ? config.cos.domain : config.domain

const cleanCSS = new CleanCSS()

/**
 * icon生成资源路径
 */
export const srcPath = new URL('../../../../public/src/', import.meta.url)

if (!fs.existsSync(srcPath)) {
  fs.mkdirSync(srcPath)
}

/**
 * 记录生成的文件
 * @param {*} req
 * @param {string} projectId
 * @param {'css'|'js'} fileType
 * @param {{createTime: date, hash: string}} file
 */
export async function recordGenFile (req, projectId, fileType, file) {
  const project = await Project.findById(projectId, 'files')
  if (
    project.files &&
    project.files[fileType] &&
    project.files[fileType].length > 0 &&
    file.hash === project.files[fileType][project.files[fileType].length - 1].hash
  ) {
    return
  }
  file._id = new mongoose.Types.ObjectId()
  file.expire = TEMPORARY_FILE_EXPIRE
  return await Project.updateOne({
    _id: projectId,
    members: {
      $elemMatch: {
        userId: req.user._id
      }
    }
  }, {
    $push: {
      [`files.${fileType}`]: file
    }
  })
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
  await Promise.all(project.icons.map(async icon => {
    const file = new URL(`${icon.code}.svg`, svgsPath)
    if (!icon.svg.url) {
      return
    }
    const svgContent = await getText(icon.svg.url).catch(err => {
      console.error('Cannot get svg content:', `${icon.code}.svg`, icon.svg.url, err)
    })
    if (!svgContent) {
      return
    }
    await writeFile(file, svgContent)
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
      await putObject(`${destPath}iconlake.css`, cleanCSS.minify(result.template).styles)
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
      writeFile(new URL('iconlake.css', dir), cleanCSS.minify(result.template).styles)
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
      createTime: new Date(),
      hash: result.hash
    }
    await recordGenFile(req, projectId, 'css', info)
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
  const icons = await Promise.all(project.icons.filter(icon => icon.svg.url).map(async icon => {
    const svgContent = await getText(icon.svg.url).catch(err => {
      console.error('Cannot get svg content:', `${icon.code}.svg`, icon.svg.url, err)
    })
    return [icon.code, svgContent]
  }))
  const data = JSON.stringify(icons)
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
    createTime: new Date(),
    hash
  }
  await recordGenFile(req, projectId, 'js', info)
  res.json(info)
}

/**
 * 生成vue
 */
export async function genVUE (req, res, projectId, project) {
  const icons = await Promise.all(project.icons.filter(icon => icon.svg.url).map(async icon => {
    const svgContent = await getText(icon.svg.url)
    return [icon.code, svgContent]
  }))
  const data = JSON.stringify(icons)
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const vueTemp = await readFile(new URL('./template.vue', import.meta.url))
  res.json({
    content: vueTemp.toString().replace('["__DATA__"]', data).replace('__HASH__', hash)
  })
}

/**
 * 生成react
 */
export async function genReact (req, res, projectId, project) {
  const icons = await Promise.all(project.icons.filter(icon => icon.svg.url).map(async icon => {
    const svgContent = await getText(icon.svg.url)
    return [icon.code, svgContent]
  }))
  const data = JSON.stringify(icons)
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const reactTemp = await readFile(new URL('./template.react', import.meta.url))
  res.json({
    content: reactTemp.toString().replace('["__DATA__"]', data).replace('__HASH__', hash)
  })
}

/**
 * 清理历史文件
 * @param {string} projectId
 * @param {{\
 *  _id: ObjectId\
 *  createTime: date\
 *  hash: string\
 *  expire: number\
 * }[]} files
 * @param {'css'|'js'} type
 */
export async function deleteOldFiles (projectId, files, type) {
  (isCosActive ? deleteOldCloudFiles : deleteOldLocalFiles)(projectId, files)
  await Project.updateOne({
    _id: projectId
  }, {
    $pull: {
      [`files.${type}`]: {
        _id: {
          $in: files.map(f => f._id)
        }
      }
    }
  })
}

/**
 * 清理本地历史文件
 * @param {string} projectId
 * @param {{\
 *  createTime: date\
 *  hash: string\
 *  expire: number\
 * }[]} files
 */
async function deleteOldLocalFiles (projectId, files) {
  const projectPath = new URL(`${projectId}/`, srcPath)
  if (!fs.existsSync(projectPath)) {
    return
  }
  for (let i = 0; i < files.length; i++) {
    const e = files[i]
    if ((Date.now() - e.createTime) / ONE_DAY_SECONDS > e.expire) {
      await rm(new URL(e.hash, projectPath), {
        force: true,
        recursive: true
      })
    }
  }
}

/**
 * 清理本地历史文件
 * @param {string} projectId
 * @param {{\
 *  createTime: date\
 *  hash: string\
 *  expire: number\
 * }[]} files
 */
async function deleteOldCloudFiles (projectId, files) {
  const basePath = `src/${projectId}/`
  const list = []
  for (let i = 0; i < files.length; i++) {
    const e = files[i]
    if ((Date.now() - e.createTime) / ONE_DAY_SECONDS > e.expire) {
      const data = await getBucket(`${basePath}${e.hash}/`)
      data.contents.forEach(obj => {
        list.push(obj.key)
      })
    }
  }
  if (list.length === 0) {
    return
  }
  await deleteObjects(list)
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
