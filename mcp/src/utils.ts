import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs'
import crypto from 'crypto'

export async function getEnvs() {
  const endpoint = process.env.ICONLAKE_ENDPOINT || 'https://iconlake.com'
  const accessKey = process.env.ICONLAKE_ACCESS_KEY || ''
  if (!accessKey) {
    throw new Error('ICONLAKE_ACCESS_KEY is required.')
  }
  return {
    endpoint,
    accessKey
  }
}

export async function query(url: string, requestInit?: RequestInit) {
  const { endpoint, accessKey } = await getEnvs()
  const res = await fetch(`${endpoint}${url}`, {
    ...requestInit,
    headers: {
      'ICONLAKE-ACCESS-KEY': accessKey,
      'Content-Type': 'application/json; charset=utf-8',
      ...requestInit?.headers
    },
  })
  return await res.json()
}

export async function upload({
  projectId,
  img,
  svg,
}: {
  projectId: string
  img?: string
  svg?: string
}) {
  let buf
  if (svg) {
    buf = Buffer.from(svg, 'utf-8')
  } else if (img) {
    if (!img.startsWith('data:image/')) {
      throw new Error('Invalid image. Must be a image of data URL format.')
    }
    buf = Buffer.from(img.replace(/^data:image\/[^;]+;base64,/i, ''), 'base64')
  } else {
    throw new Error('Image or SVG is required.')
  }
  const type = await fileTypeFromBuffer(buf)
  const body = new Blob([buf], { type: type?.mime })
  const hash = crypto.createHash('md5').update(buf).digest('hex')
  const imgRes = await query(`/api/project/file/upload?projectId=${projectId}&_id=${hash}${type?.ext ? `.${type.ext}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': typeof svg === 'string' ? 'text/plain; charset=utf-8' : 'application/octet-stream'
    },
    body
  })
  if (imgRes.error) {
    throw new Error('Upload failed.')
  }
  return imgRes
}

export function log (...args: any[]) {
  fs.appendFileSync('log.txt', `${new Date().toISOString()} ${JSON.stringify(args)}\n`)
}
