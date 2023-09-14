(async () => {
  const isProduction = !/test|debug|dev|localhost|127\.0\.0\.1/i.test(location.href)
  if (!isProduction) {
    console.warn('You are in the developing mode.')
  }
  // referer
  if (location.search && URL) {
    const url = new URL(location.href)
    const referer = url.searchParams.get('referer')
    if (referer) {
      document.cookie = `referer=${referer};path=/`
    }
  }
  // 获取参数
  const params: {
    clientId: {
      gitee: string
      github: string
    }
    login: {
      code: boolean
      gitee: boolean
      github: boolean
      keplr: boolean
    }
  } = await fetch('/api/login/params').then(res => res.json())

  const domain = encodeURIComponent(location.origin)

  // login with gitee
  const giteeDom = document.querySelector('.auth .gitee') as HTMLDivElement
  if (params.login.gitee) {
    giteeDom.classList.add('active')
    giteeDom.addEventListener('click', () => {
      location.href = `https://gitee.com/oauth/authorize?client_id=${params.clientId.gitee}&redirect_uri=${domain}%2Fapi%2Foauth%2Fgitee&response_type=code`
    })
  } else {
    giteeDom.style.display = 'none'
  }

  // login with github
  const githubDom = document.querySelector('.auth .github') as HTMLDivElement
  if (params.login.github) {
    githubDom.classList.add('active')
    githubDom.addEventListener('click', () => {
      location.href = `https://github.com/login/oauth/authorize?client_id=${params.clientId.github}&redirect_uri=${domain}%2Fapi%2Foauth%2Fgithub`
    })
  } else {
    githubDom.style.display = 'none'
  }

  // login with code
  const codeDom = document.querySelector('.auth .code') as HTMLDivElement
  if (params.login.code) {
    codeDom.classList.add('active')
    codeDom.addEventListener('click', () => {
      const id = prompt('Input Code:')
      if (id) {
        location.href = `/api/oauth/code?id=${id}`
      }
    })
  } else {
    codeDom.style.display = 'none'
  }

  // login with Keplr
  const keplrDom = document.querySelector('.auth .keplr') as HTMLDivElement
  if (params.login.keplr) {
    keplrDom.classList.add('active')
    if (!('keplr' in window)) {
      keplrDom.classList.add('uninstall')
    }
    keplrDom.addEventListener('click', async () => {
      if ('keplr' in window) {
        const keplr = window.keplr as any
        const chainId = isProduction ? 'iconlake-1' : 'iconlake-testnet-1'
        try {
          await keplr.enable(chainId)
        } catch (err) {
          const chainInfo = await fetch(`/common/chain-${isProduction ? 'main' : 'test'}net.json`)
            .then(res => res.json())
          await keplr.experimentalSuggestChain(chainInfo)
          await new Promise(resolve => {
            setTimeout(resolve, 200)
          })
          await keplr.enable(chainId)
        }
        const offlineSigner = keplr.getOfflineSigner(chainId)
        const accounts = await offlineSigner.getAccounts()
        const msg = `Login iconLake\n${new Date().toISOString()}\n${accounts[0].address}`
        const sig = await keplr.signArbitrary(chainId, accounts[0].address, msg)
        fetch('/api/oauth/blockchain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({
            msg,
            sig: sig.signature,
            pubkey: sig.pub_key
          })
        }).then(res => res.json()).then(res => {
          if (res.error) {
            alert(res.error)
          } else {
            window.location.href = res.redirect
          }
        })
      } else {
        location.href = 'https://www.keplr.app/download'
      }
    })
  } else {
    codeDom.style.display = 'none'
  }
})()
