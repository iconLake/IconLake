import Browser from 'webextension-polyfill'

export const domain = import.meta.env.DEV ? 'https://iconlake.com:8443' : 'https://iconlake.com'

export function request (input: URL | RequestInfo, init?: RequestInit | undefined) {
  const _init = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    ...init
  }
  return fetch(input, _init).then(e => e.json()).then(e => {
    if (e.error) {
      if (e.error === 'userNotLogin') {
        Browser.tabs.create({
          url: `${domain}/login`
        })
      }
      throw new Error(e.error)
    }
    return e
  }).catch(console.error)
}
