export interface UserInfo {
  _id: string
  name: string
  avatar: string
  tokenExpire: Date
  blockchain?: {
    id: string
  }
  gitee?: {
    id: string
  }
  github?: {
    id: string
  }
  code?: {
    id: string
  }
}

export enum LoginType {
  Gitee = 'gitee',
  Github = 'github',
  Code = 'code',
  Blockchain = 'blockchain',
}

import { cache } from '@/utils/cache'
import request from '../utils/request'

const baseURL = '/api/user/'

let userId = ''

export const userApis = {
  get info() {
    return cache.user.enable({
      executor: info
    })
  },
  get clearCache() {
    return clearUserCache
  },
  get userId() {
    return getUserId
  },
  get loginParams() {
    return cache.user.enable({
      // maxAge: ONE_DAY_SECONDS,
      executor: loginParams
    })
  },

  unbind,
  logout,
  loginByBlockchain,
  loginByCode,
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
  const uid = await userApis.userId()
  await cache.user.clear(uid)
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
  }) as Promise<loginRes>
}

export function loginByCode(data: {
  code: string
}) {
  return request({
    url: '/api/oauth/code',
    method: 'GET',
    params: {
      id: data.code
    }
  }) as Promise<loginRes>
}

export interface loginRes {
  error?: string
  userId?: string
}

export interface LoginParams {
  clientId: {
    gitee: string
    github: string
  }
  domain: string
  login: {
    gitee: boolean
    github: boolean
    keplr: boolean
    code: boolean
  }
}

/**
 * 获取登陆参数
 */
export function loginParams() {
  return request({
    url: '/api/login/params',
    method: 'GET',
  }) as Promise<LoginParams>
}

/**
 * 解除绑定
 */
export function unbind(type: string) {
  return request({
    url: '/setting/unbind',
    method: 'GET',
    params: {
      type
    },
    baseURL,
  }) as Promise<void>
}
