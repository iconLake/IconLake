import { checkNodejs } from "../process/theme"
import { log } from "../utils/log"
import { handleDetail, handleOption, handleSearch } from "./message/search"
import { Site } from "./message/search/types"
import { handleBuildTheme } from "./message/theme"

export interface InternalMessage {
  type: string
  id: string
  data?: any
  params?: any
  response?: any
  error?: any
}

export const requestMessagePrefix = 'iconlakeRequest:'
export const responseMessagePrefix = 'iconlakeResponse:'

export function getMessageType(type: string) {
  return type.split(':')[1]
}

export async function dealMessage(m: InternalMessage): Promise<InternalMessage> {
  const msgType = getMessageType(m.type)
  const params = m.params && m.params instanceof Array ? m.params : [m.params]
  const handlers: Record<string, Function> = {
    ping: handlePing,
    buildTheme: handleBuildTheme,
    search: handleSearch,
    option: handleOption,
    detail: handleDetail,
  }

  let response = null
  let error = null

  if (msgType in handlers) {
    try {
      response = await handlers[msgType](...params)
    } catch (e) {
      error = e?.message || 'unknown error'
    }
  } else {
    error = 'unknown message type'
  }

  return {
    type: `${responseMessagePrefix}${msgType}`,
    response,
    id: m.id,
    error
  }
}

export async function handlePing(): Promise<{
  timestemp: number
  search: {
    sites: string[]
  }
  isDesktop: boolean
  nodejs: {
    version: string
  }
}> {
  let nodejs = {
    version: ''
  }
  try {
    nodejs = await checkNodejs()
  } catch (e) {
    log.error(e)
  }
  return {
    timestemp: Date.now(),
    search: {
      sites: Object.values(Site)
    },
    isDesktop: true,
    nodejs,
  }
}
