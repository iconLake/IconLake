import crypto from 'crypto'
import fs, { createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import { pipeline } from 'stream/promises'
import { getObject, isActive, putObject } from './cos.js'
import { getConfig } from '../config/index.js'

const config = getConfig()

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
    const dir = new URL(path, new URL('../public/', import.meta.url))
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
  if (isActive) {
    return await getObject(key)
  } else {
    const p = new URL(key, new URL('../public/', import.meta.url))
    if (!fs.existsSync(p)) {
      return null
    }
    return await fs.readFile(p)
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
 * @returns {URL}
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
