(async () => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'
  const projectId = location.pathname.split('/')[2]
  if (!projectId) {
    return
  }

  const iconlakeDom = document.querySelector('iconlake-exhibition')

  fetch(`${lcd}/iconlake/icon/class?id=${projectId}`).then(e => e.json()).then(info => {
    iconlakeDom?.setAttribute('info', info.class ? JSON.stringify(info.class) : '{}')
  }).catch(console.error)

  import('./default-template-project.js').then(module => {
    customElements.define('iconlake-exhibition', module.default)
  })

  fetch(`${lcd}/iconlake/icon/nfts?class_id=${projectId}`).then(e => e.json()).then(data => {
    iconlakeDom?.setAttribute('nfts', JSON.stringify(data.nfts))
    iconlakeDom?.setAttribute('pagination', JSON.stringify(data.pagination))
  })
})()
