import { CHAIN_ID, DROP_DENOM_MINI, IS_PRODUCTION } from '@/utils/const'
import request from '@/utils/request'
import { Client } from '@iconlake/client'
import type { MsgMint as MsgMintIcon, MsgBurn as MsgBurnIcon, MsgUpdateClass, MsgMint } from '@iconlake/client/types/iconlake.icon/module'
import { SHA256, lib } from 'crypto-js'
import i18n from '@/i18n'
import { toast } from '@/utils'
import camelcaseKeys from 'camelcase-keys'
import { phash } from '@/utils/phash'

const baseURL = '/api/blockchain/'

const apiURL = IS_PRODUCTION ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'
const rpcURL = IS_PRODUCTION ? 'https://rpc.iconlake.com' : 'https://rpc.testnet.iconlake.com'
const prefix = 'iconlake'

const { t } = i18n.global

export const env = {
  apiURL,
  rpcURL,
  prefix,
}

export const fee = {
  gas: '100000',
  amount: [
    {
      amount: '5000',
      denom: DROP_DENOM_MINI
    }
  ]
}

export const client = new Client(env)

let isKeplrDetected = false

export async function detectKeplr() {
  if (isKeplrDetected) {
    return window.keplr
  }
  if (!window.keplr) {
    toast('Please install keplr extension');
    throw new Error('keplr extension not found')
  } else {
    const chainId = CHAIN_ID;
    try {
      await window.keplr.enable(chainId)
    } catch (err) {
      console.error(err)
      const chainInfo = await fetch(`/common/chain-${IS_PRODUCTION ? 'main' : 'test'}net.json`)
        .then(res => res.json())
      await window.keplr.experimentalSuggestChain(chainInfo)
      await new Promise(resolve => {
        setTimeout(resolve, 200)
      })
      await window.keplr.enable(chainId)
    }
    const offlineSigner = await window.keplr.getOfflineSignerAuto(chainId);
    client.useSigner(offlineSigner)
    isKeplrDetected = true
  }
  return window.keplr
}

export async function getBalance(address: string, denom: string) {
  const res = await fetch(`${apiURL}/cosmos/bank/v1beta1/balances/${address}?denom=${denom}`).then<{
    balances: {
      amount: string;
      denom: string;
    }[]
  }>(res => res.json()).catch((e) => {
    console.error(e)
    return { balances: [] }
  })
  return res.balances.find(balance => balance.denom === denom)
}

export async function getAccount(address?: string) {
  const keplr = await detectKeplr()
  const offlineSigner = keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts().catch((e) => {
    console.error(e)
    toast.error(t('cannotGetKeplrAccount'))
    return []
  })
  if (address) {
    const account = accounts.find(account => account.address === address)
    if (!account) {
      toast.error(t('activeKeplrAccountAs', { addr: address }))
    } else {
      return account
    }
  }
  return accounts[0]
}

export async function getChainAccount(address: string) {
  const res = await fetch(`${apiURL}/cosmos/auth/v1beta1/accounts/${address}`).then<{
    account: {
      '@type': string;
      address: string;
      pubKey: {
        '@type': string;
        value: string;
      };
      accountNumber: string;
      sequence: string;
    }
  }>(res => res.json()).catch((e) => {
    console.error(e)
    return { account: undefined }
  })
  return res.account && camelcaseKeys(res.account)
}

export async function mintDrop(address: string, amount: string) {
  await detectKeplr()
  const account = await getAccount(address)
  if (!account) {
    return undefined
  }
  const res = await client.IconlakeDrop.tx.sendMsgMint({
    value: {
      creator: address,
      amount: {
        amount,
        denom: DROP_DENOM_MINI
      }
    },
    fee
  }).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('fail'))
    return undefined
  })
  return res
}

export async function signMsg(msg: string) {
  const keplr = await detectKeplr()
  const account = await getAccount()
  if (!account) {
    return undefined
  }
  const res = await keplr.signArbitrary(CHAIN_ID, account.address, msg).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('fail'))
    return undefined
  })
  return res
}

export async function getHash(uri: string) {
  const blob = await fetch(uri).then(res => res.blob())
  const fileReader = new FileReader()
  fileReader.readAsDataURL(blob)
  const dataUrl = await new Promise<string>((resolve) => {
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
  })
  const img = new Image()
  img.src = dataUrl
  await new Promise<void>(resolve => {
    img.onload = () => {
      resolve()
    }
  })
  const graphHash = await phash(img)

  const buf = await blob.arrayBuffer()
  const words = lib.WordArray.create()
  ;(words as any).init(buf)
  const fileHash = SHA256(words)
  return {
    graphHash: `p:${graphHash.toHexString()}`,
    fileHash: fileHash.toString(),
  }
}

export async function mintIcon(value: MsgMintIcon) {
  await detectKeplr()
  const account = await getAccount(value.creator)
  if (!account) {
    return undefined
  }
  const res = await client.IconlakeIcon.tx.sendMsgMint({
    value,
    fee
  }).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('fail'))
    return undefined
  })
  return res
}

export async function burnIcon(value: MsgBurnIcon) {
  await detectKeplr()
  const account = await getAccount(value.creator)
  if (!account) {
    return undefined
  }
  const res = await client.IconlakeIcon.tx.sendMsgBurn({
    value,
    fee
  }).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('fail'))
    return undefined
  })
  return res
}

export async function getTx(txHash: string) {
  const res = await fetch(`${apiURL}/cosmos/tx/v1beta1/txs/${txHash}`).then(res => res.json()).catch((e) => {
    console.error(e)
    return { tx: undefined }
  })
  return camelcaseKeys(res.tx, { deep: true })
}

export async function getDropInfo(address: string) {
  const res = await client.IconlakeDrop.query.queryInfo(address).catch((e) => {
    console.error(e)
    return undefined
  })
  return res?.data.info
}

export async function initDrop(creator: string, address: string, isBackendService: boolean) {
  if (isBackendService) {
    return <Promise<{transactionHash: string}>>request({
      url: '/api/blockchain/drop/init',
    })
  }
  await detectKeplr()
  const account = await getAccount(creator)
  if (!account) {
    return undefined
  }
  return await client.IconlakeDrop.tx.sendMsgInit({
    value: {
      creator,
      address,
    }
  }).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('fail'))
    return undefined
  })
}

export async function getNFTs(q: {
  owner: string
}) {
  const res = await client.IconlakeIcon.query.queryNFTs({
    owner: q.owner
  }).catch((e) => {
    console.error(e)
    return undefined
  })
  return res?.data
}

export async function getNftClass(id: string) {
  const res = await client.IconlakeIcon.query.queryClass({ id }).catch((e) => {
    console.error(e)
    return undefined
  })
  return res?.data
}

export async function getNftByTxHash(txHash: string) {
  const res = await getTx(txHash)
  if (res?.body?.messages[0]['@type'] === '/iconlake.icon.MsgMint') {
    return res.body.messages[0] as MsgMint
  }
  return undefined
}

export async function updateClass(value: MsgUpdateClass) {
  await detectKeplr()
  const account = await getAccount(value.creator)
  if (!account) {
    return undefined
  }
  const res = await client.IconlakeIcon.tx.sendMsgUpdateClass({
    value
  }).catch((err) => {
    console.error(err)
    toast.error(err.message ?? t('updateFailed'))
    return undefined
  })
  return res
}

interface verifyResult {
  checked: boolean
  url?: string
}

export async function verifyUriHash(uri: string | undefined, hash: string | undefined): Promise<verifyResult> {
  if (!uri || !hash) {
    return {
      checked: false
    }
  }
  const res = await fetch(uri, {
    headers: {
      "Cache-Control": "no-cache"
    }
  }).then(e => e.blob()).catch(() => undefined)
  if (!res) {
    return {
      checked: false
    }
  }
  const file = await res.arrayBuffer()
  const words = lib.WordArray.create()
  ;(words as any).init(file)
  const fileHash = SHA256(words)
  return {
    checked: hash === fileHash.toString(),
    url: URL.createObjectURL(res)
  }
}

export interface BlockchainInfo {
  config: {
    rpc: string
    lcd: string
    backendService: {
      initDROP: boolean
    }
  }
}

export function getInfo() {
  return <Promise<BlockchainInfo>>request({
    method: 'GET',
    url: '/info',
    baseURL,
  })
}
