import { CHAIN_ID, DROP_DENOM_MINI, IS_PRODUCTION } from '@/utils/const'
import request, { handleResponse } from '@/utils/request'
import { Client } from '@iconlake/client'
import type { V1Beta1GetTxResponse } from '@iconlake/client/types/cosmos.tx.v1beta1/rest'
import type { DropQueryGetInfoResponse } from '@iconlake/client/types/iconlake.drop/rest'
import type { MsgMint as MsgMintIcon, MsgUpdateClass } from '@iconlake/client/types/iconlake.icon/module'
import type { IconQueryHashResponse, IconlakeiconQueryClassResponse, IconlakeiconQueryNFTsResponse } from '@iconlake/client/types/iconlake.icon/rest'
import { SHA256, lib } from 'crypto-js'
import i18n from '@/i18n'

const baseURL = '/api/blockchain/'

const apiURL = IS_PRODUCTION ? 'https://lcd.mainnet.iconlake.com' : 'https://lcd.testnet.iconlake.com'
const rpcURL = IS_PRODUCTION ? 'https://rpc.mainnet.iconlake.com' : 'https://rpc.testnet.iconlake.com'
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

async function detectKeplr() {
  if (isKeplrDetected) return
  if (!window.keplr) {
    alert('Please install keplr extension');
  } else {
    const chainId = CHAIN_ID;
    try {
      await window.keplr.enable(chainId)
    } catch (err) {
      const chainInfo = await fetch(`/common/chain-${IS_PRODUCTION ? 'main' : 'test'}net.json`)
        .then(res => res.json())
      await window.keplr.experimentalSuggestChain(chainInfo)
      await new Promise(resolve => {
        setTimeout(resolve, 200)
      })
      await window.keplr.enable(chainId)
    }
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    client.useSigner(offlineSigner)
    isKeplrDetected = true
  }
}

export async function getBalance(address: string, denom: string) {
  const res = await client.CosmosBankV1Beta1.query.queryBalance(address, {
    denom
  })
  return res.data.balance
}

export async function getAccount() {
  await detectKeplr()
  if (!window.keplr) return
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts()
  return accounts[0]
}

export async function getChainAccount(address: string) {
  const res = await client.CosmosAuthV1Beta1.query.queryAccount(address)
  return res
}

export async function mintDrop(address: string, amount: string) {
  await detectKeplr()
  if (!isKeplrDetected) return
  const account = await getAccount()
  if (!account || account.address !== address) {
    return Promise.reject(new Error(t('activeKeplrAccountAs', { addr: address })))
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
  })
  return res
}

export async function signMsg(msg: string) {
  await detectKeplr()
  if (!window.keplr) return
  const account = await getAccount()
  if (!account) return
  const res = await window.keplr.signArbitrary(CHAIN_ID, account.address, msg)
  return res
}

export async function getHash(uri: string) {
  const res = await client.IconlakeIcon.query.queryHash({
    hash_type: 'p',
    uri
  })
  return await new Promise((resolve: (v: IconQueryHashResponse) => void, reject) => {
    handleResponse<IconQueryHashResponse>(res as any, resolve, reject);
  })
}

export async function mintIcon(value: MsgMintIcon) {
  await detectKeplr()
  if (!isKeplrDetected) return
  const account = await getAccount()
  if (!account || account.address !== value.creator) {
    return Promise.reject(new Error(t('activeKeplrAccountAs', { addr: value.creator })))
  }
  const res = await client.IconlakeIcon.tx.sendMsgMint({
    value,
    fee
  })
  return res
}

export async function getTx(txHash: string) {
  const res = await client.CosmosTxV1Beta1.query.serviceGetTx(txHash)
  return await new Promise((resolve: (v: V1Beta1GetTxResponse) => void, reject) => {
    handleResponse<V1Beta1GetTxResponse>(res as any, resolve, reject);
  })
}

export async function getDropInfo(address: string) {
  const res = await client.IconlakeDrop.query.queryInfo(address)
  return await new Promise((resolve: (v: DropQueryGetInfoResponse) => void, reject) => {
    handleResponse<DropQueryGetInfoResponse>(res as any, resolve, reject);
  })
}

export async function initDrop(creator: string, address: string, isBackendService: boolean) {
  if (isBackendService) {
    return <Promise<{transactionHash: string}>>request({
      url: '/api/blockchain/drop/init',
    })
  }
  await detectKeplr()
  if (!isKeplrDetected) return
  const account = await getAccount()
  if (!account || account.address !== creator) {
    return Promise.reject(new Error(t('activeKeplrAccountAs', { addr: creator })))
  }
  return await client.IconlakeDrop.tx.sendMsgInit({
    value: {
      creator,
      address,
    }
  })
}

export async function getNFTs(q: {
  owner: string
}) {
  const res = await client.IconlakeIcon.query.queryNFTs({
    owner: q.owner
  })
  return await new Promise((resolve: (v: IconlakeiconQueryNFTsResponse) => void, reject) => {
    handleResponse<IconlakeiconQueryNFTsResponse>(res as any, resolve, reject);
  })
}

export async function getNftClass(id: string) {
  const res = await client.IconlakeIcon.query.queryClass({ id })
  return await new Promise((resolve: (v: IconlakeiconQueryClassResponse) => void, reject) => {
    handleResponse<IconlakeiconQueryClassResponse>(res as any, resolve, reject);
  })
}

export async function updateClass(value: MsgUpdateClass) {
  await detectKeplr()
  if (!isKeplrDetected) return
  const account = await getAccount()
  if (!account || account.address !== value.creator) {
    return Promise.reject(new Error(t('activeKeplrAccountAs', { addr: value.creator })))
  }
  const res = await client.IconlakeIcon.tx.sendMsgUpdateClass({
    value
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
  const blob = await fetch(uri, {
    headers: {
      "Cache-Control": "no-cache"
    }
  }).then(e => e.blob())
  const file = await blob.arrayBuffer()
  const words = lib.WordArray.create()
  ;(words as any).init(file)
  const fileHash = SHA256(words)
  return {
    checked: hash === fileHash.toString(),
    url: URL.createObjectURL(blob)
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
