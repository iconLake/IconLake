(async () => {
  const isProduction = !/test|localhost|127\.0\.0\.1/i.test(location.href)
  const lcd = isProduction ? 'https://lcd.iconlake.com' : 'https://lcd.testnet.iconlake.com'
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

  fetch(`${lcd}/cosmos/nft/v1beta1/nfts/${projectId}/${nftId}`).then(e => e.json()).then(info => {
    iconlakeDom?.setAttribute('info', JSON.stringify(info.nft))
  }).catch(console.error)

  import('./default-template-nft.js').then(module => {
    customElements.define('iconlake-nft', module.default)
  })
})()
