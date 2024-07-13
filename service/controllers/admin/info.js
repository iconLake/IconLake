import { getConfig } from '../../config/index.js'

const adminUsers = {}

getConfig().admin.userIds.forEach(e => {
  adminUsers[e] = true
})

export async function isAdmin (uid) {
  return adminUsers[uid]
}

export async function verify (req, res) {
  res.json({
    isAdmin: await isAdmin(req.user._id.toString())
  })
}
