import express, { Router } from 'express'
import { getLocale, setLocale } from '../utils/index.js'
import { ROOT as root, RESOURCE_MAX_AGE as maxAge } from '../utils/const.js'
import loginIndex from '../controllers/login/index.js'
import { info as exhibitionIndexInfo } from '../controllers/exhibition/index.js'
import { info as exhibitionNftInfo } from '../controllers/exhibition/nft.js'
import { info as exhibitionCreatorInfo } from '../controllers/exhibition/creator.js'

const router = Router()

router.get('/', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/home/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/docs/:id', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/docs/${req.params.id}.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/login', loginIndex)

router.get('/exhibition/creator/:address', express.static('public', { maxAge }), exhibitionCreatorInfo)
router.get('/exhibition/:projectId/:nftId', express.static('public', { maxAge }), exhibitionNftInfo)
router.get('/exhibition/:projectId', express.static('public', { maxAge }), exhibitionIndexInfo)

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
