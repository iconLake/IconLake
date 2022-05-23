import { User } from '../../models/user.js'

export default async function middleware (req, res, next) {
  if (!req.cookies.token) {
    res.json({
      error: 'userNotLogin'
    })
    return
  }
  const user = await User.findOne({
    token: req.cookies.token,
    tokenExpire: {
      $gt: new Date()
    }
  })
  if (user) {
    req.user = user
    next()
  } else {
    res.json({
      error: 'tokenExpired'
    })
  }
}
