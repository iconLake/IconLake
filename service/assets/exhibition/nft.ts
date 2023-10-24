(async () => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction
    ? 'https://lcd.iconlake.com'
    : 'https://lcd.testnet.iconlake.com'
  const parts = location.pathname.split('/')
  const projectId = parts[2]
  if (!projectId) {
    return
  }
  const nftId = parts[3]
  if (!nftId) {
    return
  }

  const iconlakeDom = document.querySelector('iconlake-nft')
  if (!iconlakeDom) {
    return
  }

  const info = await fetch(
    `${lcd}/iconlake/icon/nft?classId=${projectId}&id=${nftId}`
  )
    .then((e) => e.json())
    .catch(console.error)
  if (!info) {
    return
  }

  const verify = await fetch(
    `/api/blacklist/verify/nft?address=${info.nft.data.author}&projectId=${projectId}&nftId=${nftId}`
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

  iconlakeDom.setAttribute('info', JSON.stringify(info.nft))

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
