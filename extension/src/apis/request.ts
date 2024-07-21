import Browser from 'webextension-polyfill'

export const domain = import.meta.env.DEV ? 'https://test.iconlake.com' : 'https://iconlake.com'

export async function request<T> (input: URL | RequestInfo, init?: RequestInit | undefined) {
  const _init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    ...init
  }
  return await fetch(input, _init).then(e => e.json()).then(e => {
    if (e.error) {
      if (e.error === 'userNotLogin' || e.error === 'tokenExpired') {
        Browser.tabs.create({
          url: `${domain}/login`
        })
      }
      throw new Error(e.error)
    }
    return e as T
  }).catch(console.error)
}
