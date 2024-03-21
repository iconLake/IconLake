import { CHAIN_ID } from './const'
import { detectKeplr } from '@/apis/blockchain'

export async function getSignMsg() {
  await detectKeplr()
  if (!window.keplr) return
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts()
  return `Login iconLake\n${new Date().toISOString()}\n${accounts[0].address}`
}
