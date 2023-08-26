import { ERROR_CODE, LAKE_DENOM_MINI } from '../../utils/const.js'
import { getClient } from './client.js'
import { User } from '../../models/user.js'

export async function init (req, res) {
  const client = await getClient()
  const accounts = await client.signer.getAccounts()
  if (accounts.length === 0) {
    return res.json({
      error: ERROR_CODE.INTERNAL_ERROR
    })
  }
  const creator = accounts[0].address
  const user = await User.findById(req.user._id, 'blockchain')
  if (!user.blockchain?.id) {
    return res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
  }
  const result = await client.IconlakeDrop.tx.sendMsgInit({
    value: {
      creator,
      address: user.blockchain.id
    },
    fee: {
      amount: [
        {
          amount: '0',
          denom: LAKE_DENOM_MINI
        }
      ],
      gas: '100000'
    }
  }).catch(err => {
    console.error(err)
    res.json({
      error: ERROR_CODE.FAIL,
      message: err.message
    })
  })
  if (result.code !== 0) {
    console.error(result)
    return res.json({
      error: ERROR_CODE.FAIL
    })
  }
  res.json({
    transactionHash: result.transactionHash
  })
}
