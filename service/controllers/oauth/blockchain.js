import { fromBase64 } from '@cosmjs/encoding'
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto'
import { pubkeyToAddress } from '@cosmjs/amino'
import { makeADR36AminoSignDoc, serializeSignDoc } from '@keplr-wallet/cosmos'
import { getConfig } from '../../config/index.js'
import { fail, success } from './result.js'
import { ERROR_CODE } from '../../utils/const.js'

const config = getConfig()

const EXPIRE_TIME = 3 * 60 * 1000

/**
 * @api {post} /oauth/blockchain 通过区块链签名登录
 * @apiQuery {string} msg
 * @apiQuery {string} sig
 */
export async function login (req, res) {
  if (!config.login.keplr) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (
    typeof req.body.msg === 'string' &&
    typeof req.body.sig === 'string' &&
    req.body.pubkey &&
    typeof req.body.pubkey.type === 'string' &&
    typeof req.body.pubkey.value === 'string'
  ) {
    const time = Date.now() - (+new Date(req.body.msg.split('\n')[1]))
    if (time > -EXPIRE_TIME && time < EXPIRE_TIME) {
      const signer = pubkeyToAddress(req.body.pubkey, 'iconlake')
      const sig = Secp256k1Signature.fromFixedLength(fromBase64(req.body.sig))
      const msgHash = sha256(serializeSignDoc(makeADR36AminoSignDoc(signer, req.body.msg)))
      const isSigOk = await Secp256k1.verifySignature(sig, msgHash, fromBase64(req.body.pubkey.value))
      if (isSigOk) {
        success({
          id: signer,
          from: 'blockchain'
        }, req, res)
        return
      }
    }
  }
  console.error('blockchain login fail', req.body)
  fail({
    error: ERROR_CODE.FAIL
  }, req, res)
}
