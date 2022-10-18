/* eslint-disable @typescript-eslint/no-explicit-any */
(() => {
  /**
   * 非中文环境隐藏备案
   */
  const beianDom: HTMLLinkElement | null = document.querySelector('#footer-beian')
  if (beianDom && (window as any).locale && (window as any).locale !== 'zh-cn') {
    beianDom.style.display = 'none'
  }
  /**
   * 百度统计
   */
  if (!((window as any)._hmt instanceof Array)) {
    (window as any)._hmt = []
  }
  const hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?ca9958613563db708c30668d0920fce3'
  const s = document.getElementsByTagName('script')[0]
  s.parentNode?.insertBefore(hm, s)
})()
