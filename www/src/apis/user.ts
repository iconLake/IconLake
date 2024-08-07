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
import { ONE_DAY_SECONDS } from '@/utils/const'

const baseURL = '/api/user/'

let userId = ''

export const userApis = {
  get info() {
    return cache.user.enable({
      maxAge: ONE_DAY_SECONDS,
      executor: info
    })
  },
  get clearCache() {
    return clearUserCache
  },
  get userId() {
    return getUserId
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

async function getUserId() {
  await userApis.info().onUpdate(async (userInfo) => {
    userId = userInfo._id
  })
  return userId
}

async function clearUserCache() {
  await cache.user.clear(userId)
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
