import express, { Router } from 'express'
import { getLocale, setLocale } from '../utils/index.js'
import { User } from '../models/user.js'

const maxAge = process.env.NODE_ENV === 'production' ? 7 * 24 * 3600 * 1000 : 0
const root = process.cwd()

const router = Router()

router.get('/', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/home/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/login', async (req, res) => {
  setLocale(req, res)
  if (req.cookies.token) {
    const user = await User.findOne({
      token: req.cookies.token,
      tokenExpire: {
        $gt: new Date()
      }
    })
    if (user) {
      res.redirect(req.query.redirect || '/manage')
      return
    }
  }
  res.sendFile(`./public/login/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.use('/', express.static('public', { maxAge }), (req, res, next) => {
  if (/^\/manage\//i.test(req.path)) {
    res.sendFile('./public/manage/index.html', {
      root,
      maxAge
    })
  } else {
    next()
  }
})

export default router
