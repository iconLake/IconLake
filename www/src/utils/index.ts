import { locale, messages } from '../i18n'
import { DROP_DENOM, DROP_DENOM_MINI, LAKE_DENOM, PUBLIC_PAGES } from './const'

const toastList: {
  params: {
    msg: string
    type?: 'success'|'warn'|'error'
  }
  timer: NodeJS.Timeout
  dom: Element
  createTime: number
}[] = []

const toastContainer = document.createElement('div')
toastContainer.className = 'toast-container'
document.body.appendChild(toastContainer)

/**
 * 提示消息
 */
export function toast (msg: string, type?: 'success'|'warn'|'error') {
  if (toastList.length > 0) {
    const lastToast = toastList[toastList.length - 1]
    if (lastToast.params.msg === msg && lastToast.params.type === type && Date.now() - lastToast.createTime < 500) {
      return
    }
  }
  const dom = document.createElement('div')
  dom.className = `toast ${type || ''}`
  dom.innerText = msg
  toastContainer.appendChild(dom)
  let timer = setTimeout(() => {
    toastContainer.removeChild(dom)
  }, 3000)
  dom.addEventListener('mouseenter', () => {
    clearTimeout(timer)
  })
  dom.addEventListener('mouseleave', () => {
    timer = setTimeout(() => {
      toastContainer.removeChild(dom)
    }, 500)
  })
  toastList.push({
    params: {
      msg,
      type
    },
    timer,
    dom,
    createTime: Date.now()
  })
}

toast.success = (msg: string) => {
  toast(msg, 'success')
}

toast.error = (msg: string) => {
  toast(msg, 'error')
}

toast.warn = (msg: string) => {
  toast(msg, 'warn')
}


export function confirm (msg: string|Element, ok: Function, options?: {
  cancel?: Function
  confirmText?: string
  cancelText?: string
}) {
  const dom = document.createElement('div')
  dom.className = 'confirm-container'
  const contentDom = document.createElement('div')
  contentDom.className = 'confirm'
  dom.appendChild(contentDom)
  const bodyDom = document.createElement('div')
  bodyDom.className = 'confirm-body'
  if (typeof msg === 'string') {
    bodyDom.innerText = msg
  } else {
    bodyDom.appendChild(msg)
  }
  contentDom.appendChild(bodyDom)
  const footerDom = document.createElement('div')
  footerDom.className = 'confirm-footer'
  const okDom = document.createElement('div')
  okDom.className = 'confirm-btn confirm-ok'
  okDom.innerText = options?.confirmText || messages[locale].confirm
  const cancelDom = document.createElement('div')
  cancelDom.className = 'confirm-btn confirm-cancel'
  cancelDom.innerText = options?.cancelText || messages[locale].cancel
  footerDom.appendChild(cancelDom)
  footerDom.appendChild(okDom)
  contentDom.appendChild(footerDom)
  okDom.addEventListener('click', (e) => {
    document.body.removeChild(dom)
    ok(e)
  })
  cancelDom.addEventListener('click', (e) => {
    document.body.removeChild(dom)
    if (typeof options?.cancel === 'function') {
      (<Function>options.cancel)(e)
    }
  })
  document.body.appendChild(dom)
}

export function copy (str: string) {
  if (typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(str)
  }
}

export function formatTime(time: string) {
  const t = new Date(time)
  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`
}

export function formatLakeAmount(lakeAmount: number, hasDenom = true) {
  return `${(lakeAmount / 1000000).toFixed(6)}${hasDenom ? LAKE_DENOM : ''}`
}

export function formatDropAmount(dropAmount: number, hasDenom = true) {
  return `${(dropAmount / 10000).toFixed(4)}${hasDenom ? DROP_DENOM : ''}`
}

export function parseDropAmount(dropAmount: string) {
  const matches = dropAmount.match(new RegExp(`^(\d+)(${DROP_DENOM}|${DROP_DENOM_MINI})$`, 'i'))
  if (!matches) {
    return null
  }
  return {
    denom: DROP_DENOM_MINI,
    amount: matches[1].toUpperCase() === DROP_DENOM ? +matches[0] * 10000 : +matches[0]
  }
}

export function waitFor(until: Function) {
  return new Promise(resolve => {
    if (until()) {
      resolve(null)
      return
    }
    const timer = setInterval(() => {
      if (until()) {
        clearInterval(timer)
        resolve(null)
      }
    }, 100)
  })
}

export function isPagePublic(path = location.pathname) {
  return PUBLIC_PAGES.some(p => p.test(path))
}

export function getExt(name: string) {
  const i = name.lastIndexOf('.')
  return i === -1 ? '' : name.substring(i)
}

export function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function readFileAsBlob(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (!reader.result) {
        reject()
      } else {
        resolve(new Blob([reader.result], { type: file.type }))
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
