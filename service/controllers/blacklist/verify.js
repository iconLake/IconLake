import { Blacklist } from '../../models/blacklist.js'
import { ERROR_CODE } from '../../utils/const.js'

export async function verifyNFT (req, res) {
  if (typeof req.query.address !== 'string' || typeof req.query.projectId !== 'string' || typeof req.query.nftId !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  let result = await Blacklist.exists({
    nftId: '',
    projectId: '',
    address: req.query.address
  })
  if (result) {
    res.json({
      block: {
        address: true,
        projectId: true,
        nftId: true
      }
    })
    return
  }
  result = await Blacklist.exists({
    nftId: '',
    projectId: req.query.projectId,
    address: ''
  })
  if (result) {
    res.json({
      block: {
        address: false,
        projectId: true,
        nftId: true
      }
    })
    return
  }
  result = await Blacklist.exists({
    nftId: req.query.nftId,
    projectId: req.query.projectId,
    address: ''
  })
  if (result) {
    res.json({
      block: {
        address: false,
        projectId: false,
        nftId: true
      }
    })
    return
  }
  res.json({
    block: {
      address: false,
      projectId: false,
      nftId: false
    }
  })
}

export async function verifyProject (req, res) {
  if (typeof req.query.address !== 'string' || typeof req.query.projectId !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  let result = await Blacklist.exists({
    nftId: '',
    projectId: '',
    address: req.query.address
  })
  if (result) {
    res.json({
      block: {
        address: true,
        projectId: true
      }
    })
    return
  }
  result = await Blacklist.exists({
    nftId: '',
    projectId: req.query.projectId,
    address: ''
  })
  if (result) {
    res.json({
      block: {
        address: false,
        projectId: true
      }
    })
    return
  }
  res.json({
    block: {
      address: false,
      projectId: false
    }
  })
}

export async function verifyAddress (req, res) {
  if (typeof req.query.address !== 'string') {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  const result = await Blacklist.exists({
    address: req.query.address,
    projectId: '',
    nftId: ''
  })
  if (result) {
    res.json({
      block: {
        address: true
      }
    })
    return
  }
  res.json({
    block: {
      address: false
    }
  })
}
