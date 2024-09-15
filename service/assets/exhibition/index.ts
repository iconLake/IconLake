import type { IconLakeAPI } from './api'

(async () => {
  const iconlakeAPI = (window as unknown as Window & { iconlakeAPI: IconLakeAPI }).iconlakeAPI
  if (!iconlakeAPI) {
    console.error('window.iconlakeAPI is not defined')
    return
  }
  const iconlakeDom = document.querySelector('iconlake-exhibition')
  if (!iconlakeDom) {
    return
  }

  const info = await iconlakeAPI.class.getInfo()
  if (!info) {
    iconlakeDom.innerHTML = '<h1 class="blocked">This project has not been published to the chain.</h1>'
    iconlakeAPI.loading.isShow = false
    return
  }
  const verify = await fetch(
    `/api/blacklist/verify/project?address=${info.data.author}&projectId=${iconlakeAPI.class.id}`
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

  let themeUrl = '/themes/default/components/exhibition-0fd6aa8f.js'
  if (!iconlakeAPI.isProduction || (iconlakeAPI.isProduction && location.origin !== iconlakeAPI.domain.master)) {
    const diyTheme = await fetch(`/api/project/theme/components?id=${iconlakeAPI.class.id}`).then((e) => e.json())
    if (diyTheme?.class) {
      themeUrl = `${iconlakeAPI.config.cdn}/${diyTheme.class}`
    }
  }
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
