import type { IconLakeAPI } from './api'

(async () => {
  const iconlakeAPI = (window as any).iconlakeAPI as IconLakeAPI
  if (!iconlakeAPI) {
    console.error('window.iconlakeAPI is not defined')
    return
  }
  const iconlakeDom = document.querySelector('iconlake-exhibition')
  if (!iconlakeDom) {
    return
  }

  const info = await iconlakeAPI.project.getInfo()
  if (!info) {
    iconlakeDom.innerHTML = '<h1 class="blocked">This project has not been published to the chain.</h1>'
    iconlakeAPI.loading.isShow = false
    return
  }
  const verify = await fetch(
    `/api/blacklist/verify/project?address=${info.data.author}&projectId=${iconlakeAPI.project.id}`
  )
    .then((e) => e.json())
    .catch(console.error)
  if (verify.error) {
    return
  }
  if (verify.block.projectId) {
    const isAdmin = await fetch(
      '/api/admin/info/verify'
    ).then((e) => e.json()).then((data) => data.isAdmin)
    if (!isAdmin) {
      iconlakeDom.innerHTML = '<h1 class="blocked">This project has been blocked.</h1>'
      iconlakeAPI.loading.isShow = false
      return
    }
    const blockIcon = document.createElement('div')
    let blockTarget = '项目'
    if (verify.block.address) {
      blockTarget = '作者'
    }
    blockIcon.innerText = `封:${blockTarget}`
    blockIcon.className = 'blocked-admin'
    document.body.appendChild(blockIcon)
  }

  let themeUrl = '/themes/default/components/exhibition-4b3bb7a6.js'
  const qUrl = new URL(location.href)
  if (qUrl.searchParams.has('theme')) {
    const tUrl = qUrl.searchParams.get('theme')
    if (tUrl) {
      themeUrl = tUrl
    }
  }
  import(themeUrl).then(module => {
    customElements.define('iconlake-exhibition', module.default)
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
