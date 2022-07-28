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

const config = getConfig()

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
    templateFontPath: `${config.domain}/src/${projectId}/`,
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
export async function deleteOldFiles (projectId) {
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
    rm(new URL(list[i].name, projectPath), {
      force: true,
      recursive: true
    })
  }
}
