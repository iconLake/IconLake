import CryptoJS from 'crypto-js'
import { waitFor } from '.'

let encryptKey = ''

export function updateEncryptKey(key: string) {
  encryptKey = key
}

export async function setLocalStorageSafely(key: string, value: string) {
  console.log(encryptKey, key, value)
  await waitFor(() => encryptKey !== '')
  localStorage.setItem(key, CryptoJS.AES.encrypt(value, encryptKey).toString())
}

export async function getLocalStorageSafely(key: string): Promise<string> {
  const value = localStorage.getItem(key)
  if (value === null) {
    return ''
  }
  await waitFor(() => encryptKey !== '')
  return CryptoJS.AES.decrypt(value, encryptKey).toString(CryptoJS.enc.Utf8)
}
