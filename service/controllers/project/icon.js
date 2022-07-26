import fs from 'fs'
import crypto from 'crypto'
import { writeFile, mkdir, readFile, rm, rename } from 'fs/promises'
import { webfont } from 'webfont'
import UglifyJS from 'uglify-js'
import { Analyse } from '../../models/analyse.js'
import { History } from '../../models/history.js'
import { Project } from '../../models/project.js'
import { ERROR_CODE } from '../../utils/const.js'
import { nanoid } from 'nanoid'
import { minify } from 'csso'

/**
 * @api {get} /project/icon/info 获取图标信息
 */
export async function info (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, 'icons sources')
  if (!project) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const info = project.icons.id(req.query._id)
  const source = info.sourceId ? project.sources.id(info.sourceId) : {}
  res.json({
    info,
    source
  })
}

/**
 * @api {post} /project/icon/add 添加图标
 */
export async function add (req, res) {
  const icons = req.body.icons
  const _id = req.body.projectId
  if (typeof _id !== 'string' || _id.length === 0 || !(icons instanceof Array) || icons.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findById(_id, 'iconIndex')
  const startIndex = (project.iconIndex || 0) + 1
  icons.forEach((e, i) => {
    e.unicode = (startIndex + i).toString(16)
  })
  await Project.updateOne({
    _id
  }, {
    $push: {
      icons: {
        $each: icons
      }
    },
    $inc: {
      iconIndex: icons.length
    },
    $set: {
      iconUpdateTime: new Date()
    }
  })
  res.json({})
}

/**
 * @api {post} /project/icon/del 删除图标
 */
export async function del (req, res) {
  const _ids = req.body._ids
  const projectId = req.body.projectId
  if (!projectId || !(_ids instanceof Array) || _ids.length === 0) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findById(projectId, 'members icons')
  const uid = req.user.id
  if (!project || !project.members.some(e => e.isAdmin && e.userId.toString() === uid)) {
    res.json({
      error: 'noPermission'
    })
    return
  }
  await Project.updateOne({
    _id: projectId
  }, {
    $pull: {
      icons: {
        _id: {
          $in: _ids
        }
      }
    },
    $set: {
      iconUpdateTime: new Date()
    }
  })
  // 记录历史
  const icons = []
  _ids.forEach(e => {
    icons.push(project.icons.id(e))
  })
  await History.updateOne({
    _id: projectId
  }, {
    $push: {
      icons: {
        $each: icons
      }
    }
  })
  res.json({})
}

/**
 * @api {post} /project/icon/edit 编辑图标信息
 */
export async function edit (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId || typeof req.body._id !== 'string' || !req.body._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  let isEmpty = true
  const $set = {}
  if (req.body.name) {
    $set['icons.$.name'] = req.body.name
    isEmpty = false
  }
  if (req.body.code) {
    $set['icons.$.code'] = req.body.code
    $set.iconUpdateTime = new Date()
    isEmpty = false
  }
  if (typeof req.body.groupId === 'string') {
    $set['icons.$.groupId'] = req.body.groupId ? req.body.groupId : null
    isEmpty = false
  }
  if (isEmpty) {
    res.json({})
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'icons._id': req.body._id
  }, {
    $set
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {post} /project/icon/addTag 添加标签
 */
export async function addTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'icons._id': req.body._id
  }, {
    $push: {
      'icons.$.tags': req.body.tag
    }
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {post} /project/icon/delTag 删除标签
 */
export async function delTag (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  typeof req.body._id !== 'string' || !req.body._id ||
  typeof req.body.tag !== 'string' || !req.body.tag) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    },
    'icons._id': req.body._id
  }, {
    $pull: {
      'icons.$.tags': req.body.tag
    }
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * @api {get} /project/icon/pages 获取引用图标的页面
 */
export async function pages (req, res) {
  if (typeof req.query.projectId !== 'string' || !req.query.projectId ||
  typeof req.query._id !== 'string' || !req.query._id) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const project = await Project.findOne({
    _id: req.query.projectId,
    'members.userId': req.user._id
  }, '_id')
  if (!project) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const analyse = await Analyse.findById(req.query.projectId)
  let pages = []
  if (analyse) {
    const iconAnalyse = analyse.icons.id(req.query._id)
    pages = iconAnalyse ? iconAnalyse.pages : []
  }
  res.json({
    updateTime: analyse.updateTime,
    pages
  })
}

/**
 * @api {post} /project/icon/batchGroup 批量分组
 */
export async function batchGroup (req, res) {
  if (typeof req.body.projectId !== 'string' || !req.body.projectId ||
  !(req.body._ids instanceof Array) || req.body._ids.length === 0 || req.body._ids.some(e => typeof e !== 'string')) {
    res.json({
      error: 'argsError'
    })
    return
  }
  const $set = {
    'icons.$[element].groupId': req.body.groupId || null
  }
  const result = await Project.updateOne({
    _id: req.body.projectId,
    members: {
      $elemMatch: {
        userId: req.user._id,
        isAdmin: true
      }
    }
  }, {
    $set
  }, {
    arrayFilters: [
      {
        'element._id': { $in: req.body._ids }
      }
    ]
  })
  res.json(result.matchedCount > 0 ? {} : { error: 'argsError' })
}

/**
 * icon生成资源路径
 */
export const srcPath = new URL('../../public/src/', import.meta.url)

if (!fs.existsSync(srcPath)) {
  fs.mkdirSync(srcPath)
}

/**
 * @api {post} /project/icon/gen 生成字体或者js
 */
export async function gen (req, res) {
  const { projectId, type } = req.body
  if (!projectId || !type || !/^(js|css|vue)$/.test(type)) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const project = await Project.findById(projectId, 'class prefix icons')
  if (!project) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  if (project.icons.length === 0) {
    res.json({})
    return
  }
  const fn = {
    css: genCSS,
    js: genJS,
    vue: genVUE
  }
  fn[type](req, res, projectId, project)
}

/**
 * 生成css
 */
async function genCSS (req, res, projectId, project) {
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
    await writeFile(file, `<svg viewBox="${icon.svg.viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg">${icon.svg.path}</svg>`)
    metaMap.set(icon.code, {
      unicode: [String.fromCodePoint(+`0x${icon.unicode}`)],
      unicodeNum: icon.unicode
    })
  }))
  webfont({
    files: `public/src/${dirRelativePath}${svgsRelativePath}*.svg`,
    template: './controllers/project/icon/gen/template.css.njk',
    fontName: project.class,
    classPrefix: project.prefix,
    formats: ['ttf', 'woff', 'woff2'],
    addHashInFontUrl: true,
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
    await rm(svgsPath, {
      recursive: true,
      force: true
    })
    await rename(dir, destPath)
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
async function genJS (req, res, projectId, project) {
  const data = JSON.stringify(project.icons.map(e => [e.code, e.svg.viewBox, e.svg.path]))
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const jsTemp = await readFile(new URL('./icon/gen/template.js', import.meta.url))
  const ugResult = UglifyJS.minify(
    jsTemp.toString().replace('[\'__DATA__\']', data).replace('__HASH__', hash)
  )
  if (ugResult.error) {
    res.json({
      error: ERROR_CODE.FAIL
    })
    return
  }
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
async function genVUE (req, res, projectId, project) {
  const data = JSON.stringify(project.icons.map(e => [e.code, e.svg.viewBox, e.svg.path]))
  const hash = crypto.createHash('md5').update(data).digest('hex')
  const vueTemp = await readFile(new URL('./icon/gen/template.vue', import.meta.url))
  res.json({
    content: vueTemp.toString().replace('[\'__DATA__\']', data).replace('__HASH__', hash)
  })
}
