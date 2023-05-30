import { waitFor } from '.'
import { STORAGE_KEY } from './const'
import { getLocalStorageSafely, setLocalStorageSafely } from './storage'

const mintDropData = {
  amount: 0,
  LastMintDropTime: 0
}

export async function mintDrop() {
  if (mintDropData.amount !== 0) {
    return
  }
  try {
    const mintDropStorage = JSON.parse(await getLocalStorageSafely(STORAGE_KEY.mintDrop))
    Object.assign(mintDropData, mintDropStorage)
  } catch (e) {}
  const timeSpace = 10 * 1000
  if (Date.now() - mintDropData.LastMintDropTime > timeSpace) {
    mintDropData.LastMintDropTime = Date.now()
  }
  setInterval(() => {
    const timeNow = Date.now()
    mintDropData.amount += Math.floor((timeNow - mintDropData.LastMintDropTime) / 1000)
    mintDropData.LastMintDropTime = timeNow
    setLocalStorageSafely(STORAGE_KEY.mintDrop, JSON.stringify(mintDropData))
  }, timeSpace)
}

export async function getLocalDrop() {
  await waitFor(() => mintDropData.amount !== 0)
  return mintDropData.amount
}
