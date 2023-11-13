export interface UserInfo {
  _id: string
  name: string
  avatar: string
  tokenExpire: Date
  blockchain?: {
    id: string
  }
}

import request from '../utils/request'

const baseURL = '/api/user/'

let userInfo: UserInfo

/**
 * 获取用户信息
 */
export async function info(isRefresh?: boolean) {
  if (userInfo && !isRefresh) {
    return userInfo
  }
  userInfo = await request({
    url: '/info',
    baseURL
  }) as UserInfo
  if (typeof userInfo.tokenExpire === 'string') {
    userInfo.tokenExpire = new Date(userInfo.tokenExpire)
  }
  return userInfo
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
