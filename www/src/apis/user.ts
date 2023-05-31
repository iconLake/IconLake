export interface UserInfo {
  _id: string
  name: string
  avatar: string
  token: string
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
 * @param isRefresh 是否刷新
 * @returns {UserInfo}
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

export function logout() {
  return request({
    url: '/logout',
    baseURL
  })
}
