import { getConfig } from '../../config/index.js'

const adminList = getConfig().admin.userIds

export async function verify (req, res) {
  res.json({
    isAdmin: adminList.includes(req.user._id.toString())
  })
}
