import type { IconLakeAPI } from './api';

(async () => {
  const iconlakeAPI = (window as any).iconlakeAPI as IconLakeAPI
  if (!iconlakeAPI) {
    console.error('window.iconlakeAPI is not defined')
    return
  }
  const iconlakeDom = document.querySelector('iconlake-nft')
  if (!iconlakeDom) {
    return
  }

  const info = await iconlakeAPI.nft.getInfo()
  const verify = await fetch(
    `/api/blacklist/verify/nft?address=${info.data.author}&projectId=${iconlakeAPI.project.id}&nftId=${iconlakeAPI.nft.id}`
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
      iconlakeDom.innerHTML = '<h1 class="blocked">This NFT has been blocked.</h1>'
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

  import('./default-template-nft.js').then((module) => {
    customElements.define('iconlake-nft', module.default)
  })
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
