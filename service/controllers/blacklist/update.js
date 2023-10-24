import { ERROR_CODE } from '../../utils/const.js'
import { Blacklist } from '../../models/blacklist.js'

export async function add (req, res) {
  if (
    ('projectId' in req.body && typeof req.body.projectId !== 'string') ||
    ('nftId' in req.body && typeof req.body.nftId !== 'string') ||
    ('address' in req.body && typeof req.body.address !== 'string')
  ) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const blacklist = new Blacklist({
    address: req.body.address ?? '',
    projectId: req.body.projectId ?? '',
    nftId: req.body.nftId ?? ''
  })
  await blacklist.save()
  res.json(blacklist.toJSON())
}

export async function del (req, res) {
  if (
    ('projectId' in req.body && typeof req.body.projectId !== 'string') ||
    ('nftId' in req.body && typeof req.body.nftId !== 'string') ||
    ('address' in req.body && typeof req.body.address !== 'string')
  ) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Blacklist.deleteOne({
    address: req.body.address ?? '',
    projectId: req.body.projectId ?? '',
    nftId: req.body.nftId ?? ''
  })
  res.json(result.deletedCount > 0 ? {} : { error: ERROR_CODE.FAIL })
}
