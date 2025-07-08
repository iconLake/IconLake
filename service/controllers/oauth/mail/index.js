import { Cache } from '../../../models/cache.js'
import { User } from '../../../models/user.js'
import { ERROR_CODE, ONE_DAY_SECONDS } from '../../../utils/const.js'
import crypto from 'node:crypto'
import { mail } from '../../../utils/mail.js'
import { getConfig } from '../../../config/index.js'
import { readFile } from 'node:fs/promises'
import { success } from '../result.js'

const config = getConfig()

function generatePassword () {
  return crypto.randomBytes(16).toString('hex')
}

function encryptPassword ({ mail, password }) {
  return crypto.createHash('sha256').update(mail).update(password).digest('hex')
}

async function sendEmail ({ to, password }) {
  let html = await readFile(new URL('./template.html', import.meta.url), { encoding: 'utf-8' })
  html = html.replace('{{password}}', password)
  const info = await mail.send({
    from: `iconLake Auth <${config.mail.user}>`,
    to,
    subject: 'iconLake登录密码',
    html
  })
  return info
}

export async function send (req, res) {
  const { mail } = req.body

  if (!mail || typeof mail !== 'string' || !mail.includes('@')) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }

  const user = await User.findOne({ 'mail.id': mail }, 'mail')

  if (user) {
    const now = Date.now()
    if (now - user.mail.updateTime < ONE_DAY_SECONDS) {
      return res.json({
        error: 'sentIn24Hours'
      })
    }

    const password = generatePassword()
    user.mail.password = encryptPassword({
      mail,
      password
    })
    user.mail.updateTime = now
    await user.save()

    await sendEmail({
      to: mail,
      password
    })
    return res.json({})
  } else {
    const password = generatePassword()
    const encryptedPassword = encryptPassword({
      mail,
      password
    })
    const cached = await Cache.findOne({
      key: `password:${mail}`
    })
    if (cached && cached.updateTime.getTime() + ONE_DAY_SECONDS > Date.now()) {
      return res.json({
        error: 'sentIn24Hours'
      })
    }
    await Cache.updateOne({
      key: `password:${mail}`
    }, {
      $set: {
        value: encryptedPassword,
        updateTime: new Date()
      }
    }, {
      upsert: true
    })
    await sendEmail({
      to: mail,
      password
    })
    return res.json({})
  }
}

export async function login (req, res) {
  const { mail, password } = req.body

  if (!mail || typeof mail !== 'string' || !mail.includes('@') || !password || typeof password !== 'string') {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }

  const encryptedPassword = encryptPassword({
    mail,
    password
  })
  const user = await User.findOne({ 'mail.id': mail, 'mail.password': encryptedPassword }, 'mail')
  if (!user) {
    const cached = await Cache.findOne({
      key: `password:${mail}`
    })
    if (encryptedPassword === cached.value) {
      return success({
        from: 'mail',
        id: mail,
        password: encryptedPassword,
        updateTime: new Date()
      }, req, res)
    }
    return res.json({
      error: ERROR_CODE.FAIL
    })
  }

  success({
    from: 'mail',
    ...user.mail
  }, req, res)
}
