import { locale, messages } from '../i18n'

const toastContainer = document.createElement('div')
toastContainer.className = 'toast-container'
document.body.appendChild(toastContainer)

/**
 * 提示消息
 */
export function toast (msg: string, type?: 'success'|'warn'|'error') {
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
