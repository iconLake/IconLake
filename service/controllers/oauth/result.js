import crypto from 'crypto'
import { createReadStream, rm } from 'fs'
import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { AVATAR_PATH, ERROR_CODE, TOKEN_MAX_AGE } from '../../utils/const.js'
import { download, save as saveFile } from '../../utils/file.js'
import { checkLogin } from '../user/middleware.js'
import { getConfig } from '../../config/index.js'

const config = getConfig()
const hostname = new URL(config.domain).hostname

/**
 * 生成token
 * @returns {{token: string, tokenExpire: date}}
 */
export function generateToken () {
  return {
    token: nanoid(),
    tokenExpire: new Date(Date.now() + TOKEN_MAX_AGE)
  }
}

/**
 * 设置token
 * @param {Response} res
 * @param {User} user
 */
export function setToken (res, user) {
  res.cookie('token', `${user.id}:${user.token}`, {
    domain: hostname,
    maxAge: TOKEN_MAX_AGE,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    priority: 'high'
  })
}

/**
 * 保存头像
 * @param {string} uid
 * @param {string} url
 * @param {string} oldAvatar
 * @returns {Promise<string>}
 */
export async function saveAvatar (uid, url, oldAvatar) {
  const path = `${AVATAR_PATH}${uid}/`
  const name = crypto.createHash('md5').update(url, 'utf-8').digest('hex')
  const newAvatar = `${path}${name}`
  if (newAvatar !== oldAvatar) {
    const file = await download(url)
    await saveFile(name, createReadStream(file), path)
    rm(file, err => {
      if (err) {
        console.error('remove avatar error', err)
      }
    })
  }
  return newAvatar
}

/**
 * 登录成功
 * @param {{ id: string; name: string; from: string; avatar: string; }} userInfo
 * @param {Request} req
 * @param {Response} res
 */
export async function success (userInfo, req, res) {
  if (userInfo.id && userInfo.from) {
    const { token, tokenExpire } = generateToken()
    let user = await User.findOne({
      [`${userInfo.from}.id`]: userInfo.id
    })
    if (user) {
      userInfo.name && (user.name = userInfo.name)
      user.token = token
      user.tokenExpire = tokenExpire
      user[userInfo.from] = userInfo
    } else {
      const currentLogin = await checkLogin(req)
      if (currentLogin.user) {
        user = currentLogin.user
        user[userInfo.from] = userInfo
      } else {
        user = new User({
          name: userInfo.name,
          avatar: '',
          token,
          tokenExpire,
          [userInfo.from]: userInfo
        })
      }
    }
    if (userInfo.avatar) {
      user.avatar = await saveAvatar(user.id, userInfo.avatar, user.avatar)
    }
    await user.save()
    setToken(res, user)
    let referer = '/manage/'
    if (req.cookies.referer) {
      referer = req.cookies.referer
      res.clearCookie('referer')
    }
    if (req.xhr) {
      res.json({
        redirect: referer,
        userId: user._id
      })
    } else {
      res.redirect(referer)
    }
  } else {
    console.error('user info error', userInfo)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}

export function fail (error, req, res) {
  let referer = '/manage/'
  if (req.cookies.referer) {
    referer = req.cookies.referer
    res.clearCookie('referer')
  }
  if (req.xhr) {
    res.json(error)
  } else {
    res.redirect(referer)
  }
}
