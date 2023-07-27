import path from 'node:path'
import { Client } from '@iconlake/client'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import crypto from 'node:crypto'
import { stringToPath } from '@cosmjs/crypto'
import { ADDRESS_PREFIX } from '../../utils/const.js'
import { getConfig } from '../../config/index.js'

global.self = {
  crypto
}
global.__dirname = path.dirname(import.meta.url)

const config = getConfig()

const client = new Client({
  apiURL: config.blockchain.lcd,
  rpcURL: config.blockchain.rpc,
  prefix: ADDRESS_PREFIX
})

async function setSigner () {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(
    'icon lake ensure you own what you bring into exist any tiny',
    {
      hdPaths: [stringToPath("m/44'/1009'/0'/0/0")],
      prefix: ADDRESS_PREFIX
    }
  )
  client.useSigner(signer)
}

export async function getClient () {
  if (!client.signer) {
    await setSigner()
  }
  return client
}
