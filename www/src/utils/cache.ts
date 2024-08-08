import { Dexie, type EntityTable } from 'dexie'
import { CACHE_MAX_AGE } from './const'
import { userApis } from '@/apis/user'

Dexie.debug = import.meta.env.DEV

export enum ECacheModule {
  Project = 'project',
  User = 'user',
}

interface ICacheId {
  id: string
  userId?: string
}

interface ICacheSetProps extends ICacheId {
  value: any
}

interface ICacheGetProps {
  id?: string
  userId?: string
}

type Cache = ICacheId & ICacheSetProps & {
  createTime: number
}

interface IEnableProps<T> {
  module?: string
  code?: string | ((args: any[]) => string)
  maxAge?: number
  executor: (...args: any) => Promise<T>
}

const db = new Dexie('iconlake') as Dexie & {
  cache: EntityTable<Cache, 'id'>
}
db.version(1).stores({
  cache: '&id,userId,value,createTime',
})

export async function addCache(props: ICacheSetProps) {
  const userId = await userApis.userId()
  db.cache.add({...props, createTime: Date.now(), userId})
}

export async function getCache(props: ICacheGetProps) {
  const res = await db.cache.where(props).first().catch(() => null)
  if (!res) {
    throw new Error('cache not found')
  }
  return res
}

export async function updateCache(id: string, value: any) {
  await db.cache.update(id, {value, createTime: Date.now()})
}

export function enableCache<T>({ module, code, maxAge = CACHE_MAX_AGE, executor }: IEnableProps<T>) {
  return (...args: any) => {
    return {
      onUpdate: async (fn: (value: T) => Promise<void>) => {
        const key = JSON.stringify(args)
        let codeStr = typeof code === 'function' ? code(args) : code
        if (!codeStr) {
          codeStr = executor.name
        }
        const id = `${module}::${codeStr}::${key}`
        try {
          const {value, createTime} = await getCache({
            id,
          })
          if (Date.now() - createTime > maxAge) {
            executor(...args).then(res => {
              updateCache(id, res)
              fn(res)
            })
          }
          await fn(value)
        } catch (e) {
          const res = await executor(...args)
          addCache({
            id,
            value: res,
          })
          await fn(res)
        }
      }
    }
  }
}

export const cache = {
  project: {
    enable: <T>(props: IEnableProps<T>) => enableCache({...props, module: ECacheModule.Project}),
  },
  user: {
    enable: <T>(props: IEnableProps<T>) => enableCache({...props, module: ECacheModule.User}),
    clear: clearUserCache,
  },
}

export async function clearCache() {
  await db.delete()
}

async function clearUserCache(userId: string) {
  const list = await db.cache.where('userId').equals(userId).toArray()
  await db.cache.bulkDelete(list.map(i => i.id))
}
