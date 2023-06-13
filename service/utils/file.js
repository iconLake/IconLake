import crypto from 'crypto'
import fs, { createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import { pipeline } from 'stream/promises'
import { isActive, putObject } from './cos.js'
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
