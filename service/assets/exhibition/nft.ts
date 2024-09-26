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

  const info = await iconlakeAPI.nft.getInfo()
  if (!info) {
    rootDom.innerHTML = '<h1 class="blocked">This NFT have not been published to the chain.</h1>'
    iconlakeAPI.loading.isShow = false
    return
  }
  const verify = await fetch(
    `/api/blacklist/verify/nft?address=${info.data.author}&projectId=${iconlakeAPI.class.id}&nftId=${iconlakeAPI.nft.id}`
  )
    .then((e) => e.json())
    .catch(console.error)
  if (verify.error) {
    return
  }
  if (verify.block.nftId) {
    const isAdmin = await fetch(
      '/api/admin/info/verify'
    ).then((e) => e.json()).then((data) => data.isAdmin)
    if (!isAdmin) {
      rootDom.innerHTML = '<h1 class="blocked">This NFT has been blocked.</h1>'
      iconlakeAPI.loading.isShow = false
      return
    }
    const blockIcon = document.createElement('div')
    let blockTarget = 'NFT'
    if (verify.block.address) {
      blockTarget = '作者'
    } else if (verify.block.projectId) {
      blockTarget = '项目'
    }
    blockIcon.innerText = `封:${blockTarget}`
    blockIcon.className = 'blocked-admin'
    document.body.appendChild(blockIcon)
  }

  let themeUrl = '/themes/default/nft-CWxVoVvK.js'
  if (!iconlakeAPI.isProduction || (iconlakeAPI.isProduction && location.origin !== iconlakeAPI.domain.master)) {
    const diyTheme = await fetch(`/api/project/theme/info?id=${iconlakeAPI.class.id}`).then((e) => e.json())
    if (diyTheme?.nft) {
      themeUrl = `${iconlakeAPI.config.cdn}/${diyTheme.nft}`
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
