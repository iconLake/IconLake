import crypto from 'crypto'
import fs, { createWriteStream } from 'node:fs'
import { writeFile, access, unlink, readFile } from 'node:fs/promises'
import fetch from 'node-fetch'
import { pipeline } from 'stream/promises'
import { getObject, isActive, putObject, getBucket, deleteObjects } from './cos.js'
import { getConfig } from '../config/index.js'
import { isURL } from './index.js'

const config = getConfig()

const publicPath = new URL('../public/', import.meta.url)

/**
 * 保存文件
 * @param {string} name
 * @param {string|Buffer} data
 * @param {string} [path]
 */
export async function save (name, data, path = 'file/') {
  const key = `${path}${name}`
  if (isActive) {
    await putObject(key, data)
  } else {
    const dir = new URL(path, publicPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
    await writeFile(new URL(name, dir), data)
  }
  return {
    key
  }
}

/**
 * 获取文件
 * @param {string} key
 */
export async function getData (key) {
  if (isURL(key)) {
    return await fetch(key).then(res => res.arrayBuffer()).then(e => Buffer.from(e))
  }
  if (isActive) {
    return await getObject(key)
  } else {
    const p = new URL(key, publicPath)
    if (!fs.existsSync(p)) {
      return null
    }
    return await readFile(p)
  }
}

/**
 * 获取文本文件
 * @param {string} key
 */
export async function getText (key) {
  const data = await getData(key)
  if (!data) {
    return null
  }
  return data.toString()
}

/**
 * 下载文件
 * @param {string} url
 * @param {string} path
 * @returns {Promise<URL>}
 */
export async function download (url, path = 'tmp/', fetchOptions) {
  const name = crypto.createHash('sha1').update(url).digest('hex')
  const dir = new URL(`../public/${path}`, import.meta.url)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    })
  }
  const file = new URL(name, dir)
  const res = await fetch(url, fetchOptions)
  if (!res.ok) {
    throw new Error(`Download Error: ${url} ${res.statusText}`)
  }
  await pipeline(res.body, createWriteStream(file))
  return file
}

/**
 * 删除文件
 * @param {string[]} keys
 */
export async function remove (keys) {
  const _keys = keys.map(e => {
    if (e.startsWith('http')) {
      if (e.startsWith(config.cos.domain)) {
        return slimURL(e)
      } else {
        return false
      }
    }
    return e
  }).filter(Boolean)
  if (isActive) {
    return await deleteObjects(_keys)
  } else {
    for (const key of _keys) {
      const p = new URL(key, publicPath)
      if (await access(p).then(() => true, () => false)) {
        await unlink(p)
      }
    }
  }
}

/**
 * 补全URL
 * @param {string} url
 * @returns {string}
 */
export function completeURL (url) {
  if (/^https?:\/\//.test(url)) {
    return url
  }
  return `${isActive ? config.cos.domain : ''}${/^\//.test(url) ? '' : '/'}${url}`
}

/**
 * 瘦身URL
 * @param {string} url
 * @returns {string}
 */
export function slimURL (url) {
  if (typeof url !== 'string') {
    return ''
  }
  const prefix = new RegExp(`^${isActive ? config.cos.domain : ''}/`, 'i')
  return url.replace(prefix, '')
}

/**
 * 统计文件夹
 * @param {string} dir
 * @returns {Promise<{count: number, size: number}>}
 */
export async function countDir (dir) {
  let count = 0
  let size = 0
  if (isActive) {
    const data = await getBucket(dir)
    if (data.contents.length > 0) {
      count += data.contents.length
      size += data.contents.reduce((a, b) => a + Number(b.size), 0)
    }
  } else {
    const dirPath = new URL(dir, publicPath)
    const files = await fs.promises.readdir(dirPath)
    for (const file of files) {
      const p = new URL(file, dirPath)
      if (fs.statSync(p).isDirectory()) {
        const data = await countDir(`${dir}/${file}`)
        count += data.count
        size += data.size
      } else {
        count++
        size += fs.statSync(p).size
      }
    }
  }
  return {
    count,
    size
  }
}

/**
 * 发送文件到自定义服务
 * @param {Object} params - 参数对象
 * @param {string} params.api - 服务API地址
 * @param {string} params.token - 认证token
 * @param {File} params.file - 要上传的文件
 * @param {string} params.key - 文件标识key
 * @returns {Promise<Object>} 返回服务端响应数据
 * @throws {Error} 当上传失败时抛出错误
 */
export async function sendFileToCustomService ({
  api,
  token,
  file,
  key
}) {
  const body = new FormData()
  body.append('file', file)
  body.append('key', key)
  const res = await fetch(api, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  })
  if (!res.ok) {
    throw new Error(`Upload Error: ${res.statusText}`)
  }
  return res.json()
}
