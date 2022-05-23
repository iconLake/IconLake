import { Router } from 'express'
import visitRecord from '../controllers/visit/record.js'
import visitMonitor from '../controllers/visit/monitor.js'

const router = Router()

router.post('/record/:id', visitRecord)
router.get(/\/monitor\/(\w+)\.js$/, visitMonitor)
router.options('/record/:id', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.end()
})

export default router
