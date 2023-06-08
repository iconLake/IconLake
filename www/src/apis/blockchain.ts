import { CHAIN_ID, DROP_DENOM_MINI } from '@/utils/const';
import { Client } from 'iconlake-client-ts'
import { MsgMintDrop } from 'iconlake-client-ts/iconlake.iconlake/module';

const apiURL = "http://127.0.0.1:1317";
const rpcURL = "http://127.0.0.1:26657";
const prefix = "iconlake";

export const env = {
  apiURL,
  rpcURL,
  prefix,
};

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
    fee: {
      gas: '100000',
      amount: [
        {
          amount: '5000',
          denom: DROP_DENOM_MINI
        }
      ]
    }
  })
  return res
}

export async function signMsg(msg: string) {
  await detectKeplr()
  if (!window.keplr) return
  await window.keplr.enable(CHAIN_ID)
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts()
  const res = await window.keplr.signArbitrary(CHAIN_ID, accounts[0].address, msg)
  return res
}
