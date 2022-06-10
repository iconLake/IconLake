import { Router } from 'express'
import { pull } from '../controllers/task/index.js'

const router = Router()

router.get('/pull', pull)

export default router
