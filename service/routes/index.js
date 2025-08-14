import express, { Router } from 'express'
import { getLocale, setLocale } from '../utils/index.js'
import { ROOT as root, RESOURCE_MAX_AGE as maxAge } from '../utils/const.js'
import loginIndex from '../controllers/login/index.js'
import { view as exhibitionIndexView } from '../controllers/exhibition/index.js'
import { view as exhibitionNftView } from '../controllers/exhibition/nft.js'
import { view as exhibitionCreatorView } from '../controllers/exhibition/creator.js'

const router = Router()

router.get('/', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/home/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/download', (req, res) => {
  setLocale(req, res)
  res.sendFile(`./public/download/index.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/docs/:id', (req, res, next) => {
  if (/\.(js|css)$/i.test(req.params.id)) {
    return next()
  }
  setLocale(req, res)
  res.sendFile(`./public/docs/${req.params.id}.${getLocale(req)}.html`, {
    root,
    maxAge
  })
})

router.get('/login', loginIndex)

router.get('/exhibition/creator/:address', express.static('public', { maxAge }), exhibitionCreatorView)
router.get('/exhibition/:projectId/:nftId', express.static('public', { maxAge }), exhibitionNftView)
router.get('/exhibition/:projectId', express.static('public', { maxAge }), exhibitionIndexView)

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
