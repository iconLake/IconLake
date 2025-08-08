export interface UserInfo {
  _id: string
  name?: string
  desc?: string
  avatar?: string
  medias?: {
    name: string
    content: string
  }[]
  sex?: string
  birthday?: string
  location?: string
  tokenExpire: Date
  blockchain?: {
    id: string
  }
  gitee?: {
    id: string
    name?: string
    avatar?: string
  }
  github?: {
    id: string
    name?: string
    avatar?: string
  }
  code?: {
    id: string
  }
  accessKey?: {
    id: string
  }
  theme?: {
    creator?: string
  }
  google?: {
    id: string
    name?: string
    avatar?: string
  }
  webAuthn?: {
    id: string
  }
  mail?: {
    id: string
  }
}

export enum LoginType {
  Gitee = 'gitee',
  Github = 'github',
  Code = 'code',
  Blockchain = 'blockchain',
  Google = 'google',
  WebAuthn = 'webAuthn',
  Mail = 'mail',
}

import { cache } from '@/utils/cache'
import request from '../utils/request'
import type { Res, StorageUsage } from './project'

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
      executor: loginParams
    })
  },
  get getTheme() {
    return cache.user.enable({
      executor: getTheme
    })
  },
  get getUsage() {
    return cache.user.enable({
      executor: getUsage
    })
  },
  get getTickets() {
    return cache.user.enable({
      executor: getTickets
    })
  },

  unbind,
  regenAccessKey,
  logout,
  loginByBlockchain,
  loginByCode,
  editInfo,
  uploadFile,
  editTheme,
  generateTheme,
  webAuthnRegister,
  mailLogin,
  sendMail,
  claimTicket,
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
function logout() {
  return request({
    url: '/logout',
    baseURL
  })
}

/**
 * 登录或者绑定区块链账户
 */
function loginByBlockchain(data: {
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

function loginByCode(data: {
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
    google: string
  }
  domain: string
  nonce: string
  login: {
    gitee: boolean
    github: boolean
    keplr: boolean
    code: boolean
    google: boolean
    webAuthn: boolean
    mail: boolean
  }
}

/**
 * 获取登陆参数
 */
function loginParams() {
  return request({
    url: '/api/login/params',
    method: 'GET',
  }) as Promise<LoginParams>
}

/**
 * 解除绑定
 */
function unbind(type: string) {
  return request({
    url: '/setting/unbind',
    method: 'GET',
    params: {
      type
    },
    baseURL,
  }) as Promise<void>
}

function regenAccessKey() {
  return <Promise<Res>>request({
    method: 'GET',
    url: '/setting/regenAccessKey',
    baseURL,
  })
}

function editInfo(data: {
  name?: string
  desc?: string
  avatar?: string
  medias?: {
    name?: string
    content: string
  }[]
  sex?: string
  birthday?: string
  location?: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/info/edit',
    baseURL,
    data,
  })
}

function uploadFile(params: {
  _id: string
  data: string | ArrayBuffer | Blob
  dir?: string
}) {
  return <Promise<{key: string, url: string}>>request({
    method: 'POST',
    url: '/file/upload',
    baseURL,
    headers: {
      'Content-Type': typeof params.data === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream'
    },
    params: {
      _id: params._id,
      dir: params.dir,
    },
    data: params.data,
    timeout: 1000 * 60 * 3,
  })
}

function editTheme(data: {
  creator?: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/theme/edit',
    baseURL,
    data,
  })
}

function getTheme(data: {
  address: string
}) {
  return <Promise<Res>>request({
    method: 'GET',
    url: '/theme/info',
    baseURL,
    data,
  })
}

function generateTheme({ prompt }: {
  prompt: string
}) {
  return <Promise<{
    codes: string
  }>>request({
    method: 'POST',
    url: '/theme/generate',
    baseURL,
    data: {
      prompt
    }
  })
}

export interface AIUsage {
  tokens: {
    used: number
    total: number
  }
}

function getUsage() {
  return <Promise<{
    storage: StorageUsage
    ai: AIUsage
  }>>request({
    method: 'GET',
    url: '/info/usage',
    baseURL,
  })
}

function webAuthnRegister(data: any) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/webAuthn/register',
    baseURL: '/api/oauth',
    data,
  })
}

function mailLogin(data: {
  mail: string
  password: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/mail/login',
    baseURL: '/api/oauth',
    data,
  })
}

function sendMail(data: {
  mail: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/mail/send',
    baseURL: '/api/oauth',
    data,
  })
}

function claimTicket(data: {
  projectId: string
  code: string
}) {
  return <Promise<Res>>request({
    method: 'POST',
    url: '/ticket/claim',
    baseURL,
    data,
  })
}

export interface IUserTicket {
  _id: string
  projectId: string
  userId: string
  expired: string
  createTime: string
  project: {
    _id: string
    name: string
    desc: string
    cover: string
  }
}

function getTickets() {
  return <Promise<{
    tickets: IUserTicket[]
  }>>request({
    method: 'GET',
    url: '/ticket/list',
    baseURL,
  })
}
