import Browser from "webextension-polyfill"

const localStorage = Browser.storage.local

const FILE_KEY_PREFIX = 'file_'

interface FileInfo {
  key: string
  data: string
}

export function handleStorage(msg: any) {
  switch (msg.method) {
    case 'getFiles':
      return getFiles(msg.params)
    case 'saveFiles':
      return saveFiles(msg.params)
  }
}

async function getFiles({
  keys
}: {
  keys: string[]
}) {
  const files = await localStorage.get(keys.map(f => FILE_KEY_PREFIX + f))
  return {
    files: keys.map(key => {
      return {
        key,
        data: files[FILE_KEY_PREFIX + key]
      }
    })
  }
}

async function saveFiles({
  files
}: {
  files: FileInfo[]
}) {
  const data: Record<string, string> = {}
  files.forEach(f => {
    if (!/data:/.test(f.data)) {
      throw new Error('Invalid file data.')
    }
    data[FILE_KEY_PREFIX + f.key] = f.data
  })
  await localStorage.set(data)
  return {
    files: files.map(f => {
      return {
        key: f.key,
        url: `https://dfs.iconlake.com/${f.key}`,
      }
    })
  }
}
