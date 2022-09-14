import crypto from 'crypto'
import { createReadStream, rm } from 'fs'
import { nanoid } from 'nanoid'
import { User } from '../../models/user.js'
import { AVATAR_PATH, TOKEN_MAX_AGE } from '../../utils/const.js'
import { download, save as saveFile } from '../../utils/file.js'

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
  res.cookie('token', `${user.id}.${user.token}`, {
    maxAge: TOKEN_MAX_AGE,
    httpOnly: true
  })
}

/**
 * 保存头像
 * @param {string} uid
 * @param {string} url
 * @param {string} oldAvatar
 * @returns {string}
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
        console.error('Remove Avatar Tmp Error:', err)
      }
    })
  }
  return newAvatar
}

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
      user = new User({
        name: userInfo.name,
        avatar: '',
        token,
        tokenExpire,
        [userInfo.from]: userInfo
      })
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
    res.redirect(referer)
  } else {
    fail({
      error: 'userAuthError'
    }, req, res)
  }
}

export function fail (error, req, res) {
  res.json(error)
}
