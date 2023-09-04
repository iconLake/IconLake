import express, { Router } from 'express'
import { getLocale, setLocale } from '../utils/index.js'
import { ROOT as root, RESOURCE_MAX_AGE as maxAge } from '../utils/const.js'
import loginIndex from '../controllers/login/index.js'
import { info as epInfo } from '../controllers/exhibition/project.js'
import { info as enInfo } from '../controllers/exhibition/nft.js'

const router = Router()

router.get('/', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/home/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/login', loginIndex)

router.get('/exhibition/:projectId/:nftId', express.static('public', { maxAge }), enInfo)

router.get('/exhibition/:projectId', express.static('public', { maxAge }), epInfo)

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
