import { CHAIN_ID } from './const'

export async function getSignMsg() {
  await window.keplr.enable(CHAIN_ID)
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts()
  return `Login iconLake\n${new Date().toISOString()}\n${accounts[0].address}`
}
