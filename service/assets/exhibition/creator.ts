import type { IconlakeAPI } from './api';

(async () => {
  const iconlakeAPI = (window as unknown as Window & { iconlakeAPI: IconlakeAPI }).iconlakeAPI
  if (!iconlakeAPI) {
    console.error('window.iconlakeAPI is not defined')
    return
  }

  const rootDom = document.querySelector('#iconlake-root')
  if (!rootDom) {
    console.error('rootDom is not defined')
    return
  }

  const info = await iconlakeAPI.creator.getInfo()
  if (!info) {
    rootDom.innerHTML = '<h1 class="blocked">This Creator have not been published to the chain.</h1>'
    iconlakeAPI.loading.isShow = false
    return
  }
  const verify = await fetch(
    `/api/blacklist/verify/address?address=${info.address}`
  )
    .then((e) => e.json())
    .catch(console.error)
  if (verify.error) {
    return
  }
  if (verify.block.creator) {
    const isAdmin = await fetch(
      '/api/admin/info/verify'
    ).then((e) => e.json()).then((data) => data.isAdmin)
    if (!isAdmin) {
      rootDom.innerHTML = '<h1 class="blocked">This Creator has been blocked.</h1>'
      iconlakeAPI.loading.isShow = false
      return
    }
    const blockIcon = document.createElement('div')
    const blockTarget = '作者'
    blockIcon.innerText = `封:${blockTarget}`
    blockIcon.className = 'blocked-admin'
    document.body.appendChild(blockIcon)
  }

  let themeUrl = '/themes/default/creator-Bfk1WGjm.js'
  if (!iconlakeAPI.isProduction || (iconlakeAPI.isProduction && location.origin !== iconlakeAPI.domain.master)) {
    const diyTheme = await fetch(`/api/user/theme/info?address=${info.address}`).then((e) => e.json())
    if (diyTheme?.creator) {
      themeUrl = `${iconlakeAPI.config.cdn}/${diyTheme.creator}`
    }
  }
  const qUrl = new URL(location.href)
  if (qUrl.searchParams.has('theme')) {
    const tUrl = qUrl.searchParams.get('theme')
    if (tUrl) {
      themeUrl = tUrl
    }
  }
  const scriptDom = document.createElement('script')
  scriptDom.src = themeUrl
  scriptDom.type = 'module'
  scriptDom.crossOrigin = 'anonymous'
  document.body.appendChild(scriptDom)
})();

(() => {
  // admin
  if (location.hash === '#admin') {
    fetch('/api/admin/info/verify')
      .then((e) => e.json())
      .then((data) => {
        if (data.isAdmin) {
          const js = document.createElement('script')
          js.src = '/admin/blacklist/init.js'
          document.body.appendChild(js)
        }
      })
  }
})()
