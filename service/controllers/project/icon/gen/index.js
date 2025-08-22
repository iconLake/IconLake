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
import { getText, sendFileToCustomService } from '../../../../utils/file.js'

const config = getConfig()
const domain = isCosActive ? config.cos.domain : config.domain

const cleanCSS = new CleanCSS()

/**
 * icon生成资源路径
 */
export const srcPath = new URL('../../../../public/src/', import.meta.url)

if (!fs.existsSync(srcPath)) {
  try {
    fs.mkdirSync(srcPath)
  } catch (err) {
    console.error('Cannot create src directory:', err)
  }
}

/**
 * 保存项目文件
 * @param {string} projectId - 项目ID
 * @param {string} hash - 文件哈希值
 * @param {Object|Object[]} files - 要保存的文件，格式为 {name: string, content: string|Buffer}
 * @param {Object} options - 选项
 * @param {URL} options.sourceDir - 源目录
 * @param {URL} options.cleanDir - 要清理的目录
 * @returns {Promise<{files: {key: string; url: string}[]}>}
 */
async function saveProjectFile (projectId, hash, files, options = {}) {
  if (!Array.isArray(files)) {
    files = [files]
  }

  const project = await Project.findOne({
    _id: projectId
  }, '_id storage')
  if (!project) {
    throw new Error(ERROR_CODE.ARGS_ERROR)
  }

  let savedFiles = []
  let isCleaned = false
  if (project.storage.api) {
    savedFiles = await Promise.all(files.map(file =>
      sendFileToCustomService({
        api: project.storage.api,
        token: project.storage.token,
        file: new File([file.content], file.name, { type: 'application/octet-stream' }),
        key: `${projectId}/${hash}/${file.name}`
      })
    ))
  } else if (isCosActive) {
    const destPath = `src/${projectId}/${hash}/`

    savedFiles = await Promise.all(files.map(async file => {
      const key = `${destPath}${file.name}`
      await putObject(key, file.content)
      return {
        key,
        url: `${domain}/${key}`
      }
    }))
  } else {
    const destPath = new URL(`${projectId}/${hash}/`, srcPath)

    if (fs.existsSync(destPath)) {
      await rm(destPath, {
        force: true,
        recursive: true
      })
    }

    if (options.sourceDir) {
      await Promise.all(files.map(file =>
        writeFile(new URL(file.name, options.sourceDir), file.content)
      ))

      if (options.cleanDir) {
        isCleaned = true
        await rm(options.cleanDir, {
          recursive: true,
          force: true
        })
      }

      await rename(options.sourceDir, destPath)
    } else {
      await mkdir(destPath, {
        recursive: true
      })

      await Promise.all(files.map(file =>
        writeFile(new URL(file.name, destPath), file.content)
      ))
    }

    savedFiles = files.map(file => ({
      name: file.name,
      key: `${projectId}/${hash}/${file.name}`,
      url: `${domain}/src/${projectId}/${hash}/${file.name}`
    }))
  }

  if (options.cleanDir && !isCleaned) {
    await rm(options.cleanDir, {
      recursive: true,
      force: true
    })
  }

  return {
    files: savedFiles
  }
}

/**
 * 记录生成的文件
 * @param {*} req
 * @param {string} projectId
 * @param {'css'|'js'} fileType
 * @param {{createTime: date, hash: string, url: string}} file
 */
export async function recordGenFile (req, projectId, fileType, file) {
  const project = await Project.findById(projectId, 'files')
  if (
    project.files &&
    project.files[fileType] &&
    project.files[fileType].length > 0 &&
    file.hash === project.files[fileType][project.files[fileType].length - 1].hash &&
    file.url === project.files[fileType][project.files[fileType].length - 1].url
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
    const file = new URL(`${icon.unicode}.svg`, svgsPath)
    if (!icon.svg.url) {
      return
    }
    const svgContent = await getText(icon.svg.url).catch(err => {
      console.error('Cannot get svg content:', `${icon.unicode}.svg`, icon.svg.url, err)
    })
    if (!svgContent) {
      return
    }
    await writeFile(file, svgContent)
    metaMap.set(icon.unicode, {
      name: icon.code,
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
    const files = [
      { name: 'iconlake.ttf', content: result.ttf },
      { name: 'iconlake.woff', content: result.woff },
      { name: 'iconlake.woff2', content: Buffer.from(result.woff2) },
      { name: 'iconlake.css', content: cleanCSS.minify(result.template).styles }
    ]

    const fileInfo = await saveProjectFile(projectId, result.hash, files, {
      sourceDir: dir,
      cleanDir: svgsPath
    })

    const info = {
      createTime: new Date(),
      hash: result.hash,
      url: fileInfo.files[3].url
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

  const fileInfo = await saveProjectFile(projectId, hash, { name: 'iconlake.js', content: ugResult.code })

  const info = {
    createTime: new Date(),
    hash,
    url: fileInfo.files[0].url
  }
  await recordGenFile(req, projectId, 'js', info)
  res.json(info)
}

/**
 * 生成vue
 */
export async function genVUE (req, res, projectId, project) {
  const icons = await Promise.all(project.icons.filter(icon => icon.svg.url).map(async icon => {
    const svgContent = await getText(icon.svg.url).catch(err => {
      console.error('Cannot get svg content:', `${icon.code}.svg`, icon.svg.url, err)
    })
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
    const svgContent = await getText(icon.svg.url).catch(err => {
      console.error('Cannot get svg content:', `${icon.code}.svg`, icon.svg.url, err)
    })
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
  for (const cat of ['icon', 'theme', 'cover']) {
    const data = await getBucket(`${cat}/${projectId}/`)
    if (data.contents.length > 0) {
      await deleteObjects(data.contents.map(e => e.key))
    }
  }
}

/**
 * 删除本地项目目录
 * @param {string} projectId
 */
async function deleteProjectLocalDir (projectId) {
  for (const cat of ['icon', 'theme', 'cover']) {
    const dir = new URL(`${cat}/${projectId}`, srcPath)
    if (fs.existsSync(dir)) {
      await rm(dir, {
        recursive: true,
        force: true
      })
    }
  }
}
