export interface UserInfo {
  _id: string
  name: string
  avatar: string
  tokenExpire: Date
  blockchain?: {
    id: string
  }
}

import { cache } from '@/utils/cache'
import request from '../utils/request'

const baseURL = '/api/user/'

export const userApis = {
  get info() {
    return cache.user.enable({
      code: 'info',
      executor: info
    })
  },
  get clearCache() {
    return clearUserCache
  }
}

/**
 * 获取用户信息
 */
async function info() {
  const userInfo = await request({
    url: '/info',
    baseURL
  }) as UserInfo
  if (typeof userInfo.tokenExpire === 'string') {
    userInfo.tokenExpire = new Date(userInfo.tokenExpire)
  }
  return userInfo
}

export async function clearUserCache() {
  await cache.user.trigger({
    code: 'info',
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/logout',
    baseURL
  })
}

/**
 * 登录或者绑定区块链账户
 */
export function loginByBlockchain(data: {
  msg: string
  sig: string
  pubkey: {
    type: string
    value: string
  }
}) {
  return request({
    url: '/api/oauth/blockchain',
    method: 'POST',
    data
  }) as Promise<loginByBlockchainRes>
}

export interface loginByBlockchainRes {
  error?: string
  userId?: string
}
