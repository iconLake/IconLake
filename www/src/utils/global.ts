import { waitFor } from '.'
import { STORAGE_KEY } from './const'
import { getLocalStorageSafely, setLocalStorageSafely } from './storage'
import * as chainAPI from '@/apis/blockchain';

const mintDropData = {
  amount: 0,
  LastMintDropTime: 0,
  address: ''
}

export function getStorageKey(address: string) {
  return `${STORAGE_KEY.mintDrop}_${address.toUpperCase()}`
}

export async function mintDrop(address: string) {
  if (mintDropData.address === address && mintDropData.amount !== 0) {
    return
  }
  try {
    const mintDropStorage = JSON.parse(await getLocalStorageSafely(getStorageKey(address)))
    Object.assign(mintDropData, mintDropStorage)
  } catch (e) {}
  mintDropData.address = address
  const timeSpace = 10 * 1000
  if (Date.now() - mintDropData.LastMintDropTime > timeSpace) {
    mintDropData.LastMintDropTime = Date.now()
  }
  setInterval(saveLocalDrop, timeSpace)
}

export function saveLocalDrop(amountOffset = 0) {
  const timeNow = Date.now()
  mintDropData.amount += Math.floor((timeNow - mintDropData.LastMintDropTime) / 1000) + amountOffset
  mintDropData.LastMintDropTime = timeNow
  setLocalStorageSafely(getStorageKey(mintDropData.address), JSON.stringify(mintDropData))
}

export async function getLocalDrop() {
  await waitFor(() => mintDropData.amount !== 0)
  return mintDropData.amount
}

export async function confirmDrop(amount: number) {
  saveLocalDrop()
  const res = await chainAPI.mintDrop(mintDropData.address, amount)
  if (res.code === 0) {
    saveLocalDrop(-amount)
  }
  return res
}
