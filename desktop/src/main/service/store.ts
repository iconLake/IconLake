import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

interface StoreType {
  config: {
    locale: string
  }
  requestReferers: {
    [key: string]: string
  }
}

class Store<T extends Object> {
  private store: T
  private path: string = path.join(app.getPath('userData'), 'store.json')

  constructor() {
    this.store = {} as T
    this.init()
  }

  init() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify({}))
    }
    const data = fs.readFileSync(this.path, 'utf8')
    this.store = JSON.parse(data)
  }

  get(key: keyof T) {
    return (key in this.store) ? JSON.parse(JSON.stringify(this.store[key])) : undefined
  }

  set(key: keyof T, value: T[keyof T]) {
    this.store[key] = value
    this.save()
  }

  remove(key: keyof T) {
    delete this.store[key]
    this.save()
  }

  private saveTimer: NodeJS.Timeout | null = null
  save() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
    } else {
      this.saveTimer = setTimeout(() => {
        fs.writeFileSync(this.path, JSON.stringify(this.store))
        this.saveTimer = null
      }, 1000)
    }
  }
}

export const store = new Store<StoreType>()

export function setConfig(key: keyof StoreType['config'], value: StoreType['config'][keyof StoreType['config']]) {
  const config = store.get('config') || {}
  config[key] = value
  store.set('config', config)
}

export function getConfig(key: keyof StoreType['config']) {
  return store.get('config')[key]
}

export function setRequestReferer(key: string, value: string) {
  const referers: StoreType['requestReferers'] = store.get('requestReferers') || {}
  referers[key] = value
  store.set('requestReferers', referers)
}

export function getRequestReferers(): StoreType['requestReferers'] {
  return store.get('requestReferers')
}
