(async () => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'
  const projectId = location.pathname.split('/')[2]
  if (!projectId) {
    return
  }

  const info = await fetch(`${lcd}/cosmos/nft/v1beta1/classes/${projectId}`).then(e => e.json())

  const iconlakeDom = document.querySelector('iconlake-exhibition')
  iconlakeDom?.setAttribute('info', JSON.stringify(info.class))
  import('./default-template.js').then(module => {
    customElements.define('iconlake-exhibition', module.default)
  })

  // nfts
  fetch(`${lcd}/cosmos/nft/v1beta1/nfts?class_id=${projectId}`).then(e => e.json()).then(data => {
    iconlakeDom?.setAttribute('nfts', JSON.stringify(data.nfts))
    iconlakeDom?.setAttribute('pagination', JSON.stringify(data.pagination))
  })
})()
