import { success, fail } from './result.js'
import { getConfig } from '../../config/index.js'
import { ERROR_CODE } from '../../utils/const.js'
import { verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server'
import { User } from '../../models/user.js'

const config = getConfig()
const EXPIRE_TIME = 3 * 60 * 1000

export async function register (req, res) {
  if (!config.login.webAuthn) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (!req.body.id ||
  !req.body.response ||
  !req.body.response.authenticatorData ||
  !req.body.response.clientDataJSON ||
  !req.body.response.transports) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  try {
    const data = JSON.parse(Buffer.from(req.body.response.clientDataJSON, 'base64').toString())
    const challenge = Buffer.from(data.challenge, 'base64').toString()
    const time = Date.now() - new Date(challenge.split('\n')[1]).getTime()
    if (time < -EXPIRE_TIME || time > EXPIRE_TIME) {
      console.error('webAuthn login time error', time)
      fail({
        error: ERROR_CODE.ARGS_ERROR
      }, req, res)
      return
    }
    const verify = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: data.challenge,
      expectedOrigin: config.domain,
      expectedType: 'webauthn.create'
    })
    if (verify.verified) {
      success({
        from: 'webAuthn',
        ...verify.registrationInfo.credential,
        publicKey: Buffer.from(verify.registrationInfo.credential.publicKey).toString('base64')
      }, req, res)
      return
    }
    console.error('webAuthn login verify error', verify)
    fail({
      error: data.error,
      message: data.error_description
    }, req, res)
  } catch (e) {
    console.error('webAuthn login error', e)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}

export async function login (req, res) {
  if (!config.login.webAuthn) {
    res.json({
      error: ERROR_CODE.NOT_ENABLED
    })
    return
  }
  if (!req.body.id ||
  !req.body.response ||
  !req.body.response.authenticatorData ||
  !req.body.response.clientDataJSON ||
  !req.body.response.signature) {
    res.json({
      error: ERROR_CODE.ARGS_ERROR
    })
    return
  }
  try {
    const data = JSON.parse(Buffer.from(req.body.response.clientDataJSON, 'base64').toString())
    const challenge = Buffer.from(data.challenge, 'base64').toString()
    const time = Date.now() - new Date(challenge.split('\n')[1]).getTime()
    if (time < -EXPIRE_TIME || time > EXPIRE_TIME) {
      console.error('webAuthn login time error', time)
      fail({
        error: ERROR_CODE.ARGS_ERROR
      }, req, res)
      return
    }
    const user = await User.findOne({
      'webAuthn.id': req.body.id
    }, '_id webAuthn')
    const verify = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: data.challenge,
      expectedOrigin: config.domain,
      expectedRPID: new URL(config.domain).hostname,
      credential: {
        ...user.webAuthn,
        publicKey: Buffer.from(user.webAuthn.publicKey, 'base64')
      },
      expectedType: 'webauthn.get'
    })
    if (verify.verified) {
      success({
        from: 'webAuthn',
        ...user.webAuthn,
        counter: verify.authenticationInfo.newCounter
      }, req, res)
      return
    }
    console.error('webAuthn login verify error', verify)
    fail({
      error: data.error,
      message: data.error_description
    }, req, res)
  } catch (e) {
    console.error('webAuthn login error', e)
    fail({
      error: ERROR_CODE.FAIL
    }, req, res)
  }
}
