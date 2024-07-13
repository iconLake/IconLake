import userMiddleware from '../user/middleware.js'
import { ERROR_CODE } from '../../utils/const.js'
import { isAdmin } from './info.js'

export default function middleware (req, res, next) {
  userMiddleware(req, res, () => {
    if (!isAdmin(req.user._id.toString())) {
      res.json({
        error: ERROR_CODE.PERMISSION_DENIED
      })
      return
    }
    next()
  })
}
