import userMiddleware from '../user/middleware.js'
import { ERROR_CODE } from '../../utils/const.js'
import { getConfig } from '../../config/index.js'

const adminList = getConfig().admin.userIds

export default function middleware (req, res, next) {
  userMiddleware(req, res, () => {
    if (!adminList.includes(req.user._id.toString())) {
      res.json({
        error: ERROR_CODE.PERMISSION_DENIED
      })
      return
    }
    next()
  })
}
