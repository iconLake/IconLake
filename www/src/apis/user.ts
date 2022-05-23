interface UserInfo {
  _id: String,
  name: String,
  avatar: String,
  token: String,
  tokenExpire: Date,
}

import request from '../utils/request'

const baseURL = '/api/user/'

let userInfo: UserInfo

export async function info() {
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
