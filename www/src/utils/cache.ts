import { Dexie, type EntityTable } from 'dexie'
import { CACHE_MAX_AGE } from './const'

Dexie.debug = import.meta.env.DEV

/**
 * code层级：
 * list -> <projectId> -> clean
 *                     -> <projectId>-members -> delMember
 *      -> create
 */

export enum ECacheModule {
  Project = 'project',
}

interface ICacheModule {
  module: ECacheModule
}

interface ICacheId {
  id: number
  userId?: string
}

interface ICacheGetProps {
  code: string
  key: string
}

type ICacheSetProps = ICacheGetProps & {
  parents: string[]
  value: any
}

type Cache = ICacheModule & ICacheId & ICacheSetProps & {
  createTime: number
}

interface IEnableProps<T> {
  code: string | ((args: any[]) => string)
  parents?: string[] | ((args: any[]) => string[])
  executor: (...args: any) => Promise<T>
}

interface ITriggerProps {
  code: string
  parents?: string[]
}

const db = new Dexie('iconlake') as Dexie & {
  cache: EntityTable<Cache, 'id'>
}
db.version(1).stores({
  cache: '++id,module,code,parents,key,value'
})

export async function addCache(props: ICacheModule & ICacheSetProps) {
  // todo: get user id
  await db.cache.add({...props, createTime: Date.now()})
}

export async function getCache(props: ICacheModule & ICacheGetProps) {
  const res = await db.cache.where(props).first().catch(() => null)
  if (!res) {
    throw new Error('cache not found')
  }
  return res
}

export async function updateCache(id: number, value: any) {
  await db.cache.update(id, {value, createTime: Date.now()})
}

export function enableCache<T>({ module, code, parents, executor }: ICacheModule & IEnableProps<T>) {
  return (...args: any) => {
    return {
      onUpdate: async (fn: (value: T) => Promise<void>) => {
        const key = JSON.stringify(args)
        const codeStr = typeof code === 'function' ? code(args) : code
        const parentsArray = (typeof parents === 'function' ? parents(args) : parents) || []
        try {
          const {value, createTime, id} = await getCache({module, code: codeStr, key})
          if (Date.now() - createTime > CACHE_MAX_AGE) {
            executor(...args).then(res => {
              updateCache(id, res)
              fn(res)
            })
          }
          await fn(value)
        } catch (e) {
          const res = await executor(...args)
          addCache({module, code: codeStr, key, value: res, parents: parentsArray})
          await fn(res)
        }
      }
    }
  }
}

const triggerTime: Record<string, number> = {}

export async function triggerEffect({module, code, parents}: ICacheModule & ITriggerProps) {
  const timeKey = `${module}-${code}-${parents?.toString()}`
  if (triggerTime[timeKey]) {
    const lastTime = triggerTime[timeKey]
    triggerTime[timeKey] = Date.now()
    if (Date.now() - lastTime < 200) {
      return
    }
  } else {
    triggerTime[timeKey] = Date.now()
  }
  try {
    const list = await db.cache.where({module, code}).toArray()
    for (const item of list) {
      db.cache.update(item.id, {createTime: 0})
      item.parents.forEach(parent => {
        triggerEffect({
          module: item.module,
          code: parent,
        })
      })
    }
  } catch (e) {
    console.error(e)
  }
  if (parents?.length) {
    parents.forEach(parent => {
      triggerEffect({
        module: module,
        code: parent,
      })
    })
  }
}

export const cache = {
  project: {
    enable: <T>(props: IEnableProps<T>) => enableCache({...props, module: ECacheModule.Project}),
    trigger: (props: ITriggerProps) => triggerEffect({...props, module: ECacheModule.Project}),
  }
}

export async function clearCache() {
  await db.cache.clear()
}
