import { ERROR_CODE } from '../../utils/const.js'

export async function accept (req, res) {
  const projectId = req.body.projectId
  if (!projectId) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  return res.json({})
}
