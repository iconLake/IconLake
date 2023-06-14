import { CHAIN_ID, DROP_DENOM_MINI } from '@/utils/const';
import { handleResponse } from '@/utils/request';
import { Client } from '@iconlake/client'
import { MsgMint as MsgMintIcon } from '@iconlake/client/iconlake.icon/module';
import { MsgMintDrop } from '@iconlake/client/iconlake.iconlake/module';

const apiURL = "http://127.0.0.1:1317";
const rpcURL = "http://127.0.0.1:26657";
const prefix = "iconlake";

export const env = {
  apiURL,
  rpcURL,
  prefix,
};

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
    alert("Please install keplr extension");
  } else {
    const chainId = CHAIN_ID;
    await window.keplr.enable(chainId);
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    client.useSigner(offlineSigner)
    isKeplrDetected = true
  }
}

export async function getBalance(address: string) {
  const res = await client.CosmosBankV1Beta1.query.queryBalance(address, {
    denom: 'udrop'
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

export async function mintDrop(address: string, amount: number) {
  await detectKeplr()
  if (!isKeplrDetected) return
  const res = await client.IconlakeIconlake.tx.sendMsgMintDrop({
    value: MsgMintDrop.fromJSON({
      creator: address,
      amount: {
        amount,
        denom: DROP_DENOM_MINI
      }
    }),
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

export interface HashRes {
  fileHash: string;
  graphHash: string;
}

export async function getHash(uri: string) {
  const res = await client.IconlakeIcon.query.queryHash({
    hashType: 'p',
    uri
  })
  return await new Promise((resolve: (v: HashRes) => void, reject) => {
    handleResponse<HashRes>(res as any, resolve, reject);
  })
}

export async function mintIcon(msg: MsgMintIcon) {
  await detectKeplr()
  if (!isKeplrDetected) return
  const account = await getAccount()
  if (!account) return
  const res = await client.IconlakeIcon.tx.sendMsgMint({
    value: MsgMintIcon.fromJSON(msg),
    fee
  })
  return res
}
