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
      iconlakeDom.innerHTML = '<h1 class="blocked">This Project has been blocked.</h1>'
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

  import('./default-template-project.js').then(module => {
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