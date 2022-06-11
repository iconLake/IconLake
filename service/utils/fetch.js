import fetch from 'node-fetch'

import { getConfig } from '../config/index.js'

const centerDomain = getConfig().center.domain

/**
 * 请求中心服务
 * @param {string} path 路径
 * @param {RequestInit} options 请求设置
 * @returns {object} json
 */
export async function center (path, options) {
  const res = await fetch(`${centerDomain}${path}`, options)
  return await res.json()
}
