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
    domain: string
    nonce: string
    clientId: {
      gitee: string
      github: string
      google: string
    }
    login: {
      code: boolean
      gitee: boolean
      github: boolean
      keplr: boolean
      google: boolean
      webAuthn: boolean
      mail: boolean
    }
  } = await fetch('/api/login/params').then(res => res.json())

  // redirect
  if (params.domain !== location.origin && !/^https:\/\/localhost.iconlake.com:\d+$/.test(location.origin)) {
    location.href = `${params.domain}${location.pathname}`
    return
  }

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

  // login with google
  const googleDom = document.querySelector('.auth .google') as HTMLDivElement
  if (params.login.google) {
    googleDom.classList.add('active')
    googleDom.addEventListener('click', () => {
      location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile')}&access_type=offline&include_granted_scopes=true&response_type=code&state=${params.nonce}&client_id=${encodeURIComponent(params.clientId.google)}&redirect_uri=${domain}%2Fapi%2Foauth%2Fgoogle`
    })
  } else {
    googleDom.style.display = 'none'
  }

  // login with code
  const codeDom = document.querySelector('.auth .code') as HTMLDivElement
  if (params.login.code) {
    codeDom.classList.add('active')
    codeDom.addEventListener('click', () => {
      const prompt = document.querySelector('.prompt') as HTMLDivElement
      if (!prompt) {
        return
      }
      prompt.style.display = 'flex'
      const input = prompt.querySelector('input')
      if (!input) {
        return
      }
      input.setAttribute('placeholder', 'Input Code')
      input.focus()
      input.onkeyup = (e) => {
        if (e.key === 'Enter') {
          prompt.style.display = 'none'
          const code = input.value
          if (code) {
            location.href = `/api/oauth/code?id=${code}`
          }
        }
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
        setIsLoading(true)
        fetch('/api/oauth/blockchain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            msg,
            sig: sig.signature,
            pubkey: sig.pub_key
          })
        }).then(res => res.json()).then(res => {
          if (res.error) {
            setIsLoading(false)
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

  // login with webAuthn
  const webAuthnDom = document.querySelector('.auth .webAuthn') as HTMLDivElement
  if (params.login.webAuthn) {
    webAuthnDom.classList.add('active')
    webAuthnDom.querySelector('.create')?.addEventListener('click', (e) => {
      const t = new Date()
      const name = `iconLake Creator (${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${t.getMinutes()})`
      navigator.credentials.create({
        publicKey: {
          rp: {
            name: 'iconLake'
          },
          challenge: new TextEncoder().encode(`Login iconLake\n${new Date().toISOString()}`),
          user: {
            id: new TextEncoder().encode(name),
            name,
            displayName: name
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7
            },
            {
              type: 'public-key',
              alg: -257
            }
          ],
          timeout: 60000,
          attestation: 'none'
        }
      }).then((cred) => {
        setIsLoading(true)
        fetch('/api/oauth/webAuthn/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(cred)
        }).then(res => res.json()).then(res => {
          if (res.error) {
            setIsLoading(false)
            alert(res.error)
          } else {
            window.location.href = res.redirect
          }
        })
      })
      e.stopPropagation()
      return false
    })
    webAuthnDom.addEventListener('click', () => {
      navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(`Login iconLake\n${new Date().toISOString()}`),
          allowCredentials: []
        }
      }).then((cred) => {
        const data = JSON.stringify(cred)
        setIsLoading(true)
        fetch('/api/oauth/webAuthn/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: data
        }).then(res => res.json()).then(res => {
          if (res.error) {
            setIsLoading(false)
            alert(res.error)
          } else {
            window.location.href = res.redirect
          }
        })
      })
    })
  } else {
    webAuthnDom.style.display = 'none'
  }

  // login with mail
  const mailDom = document.querySelector('.auth .mail') as HTMLDivElement
  if (params.login.mail) {
    mailDom.classList.add('active')
    mailDom.addEventListener('click', () => {
      const prompt = document.querySelector('.prompt.mail') as HTMLDivElement
      if (!prompt) {
        return
      }
      prompt.style.display = 'flex'
      const input = prompt.querySelector('input')
      if (!input) {
        return
      }
      input.focus()
    })
    const mailSendDom = document.querySelector('#mail-send') as HTMLButtonElement
    let isMailSending = false
    mailSendDom.addEventListener('click', async () => {
      if (isMailSending) {
        return
      }
      isMailSending = true
      mailSendDom.innerText = mailSendDom.dataset.loadingText as string
      const mailInputDom = document.querySelector('.prompt.mail input[type="email"]') as HTMLInputElement
      const mail = mailInputDom.value
      if (!mail) {
        mailInputDom.focus()
        isMailSending = false
        mailSendDom.innerText = mailSendDom.dataset.defaultText as string
        return
      }
      const res = await fetch('/api/oauth/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          mail
        })
      }).then(res => res.json())
      if (res.error) {
        console.error(res.error)
        mailSendDom.innerText = mailSendDom.dataset[`${res.error.toLowerCase()}Text`] || res.error
      } else {
        mailSendDom.innerText = mailSendDom.dataset.doneText as string
      }
    })
    const mailLoginDom = document.querySelector('#mail-login') as HTMLButtonElement
    let isMailLogining = false
    mailLoginDom.addEventListener('click', async () => {
      if (isMailLogining) {
        return
      }
      isMailLogining = true
      mailLoginDom.innerText = mailLoginDom.dataset.loadingText as string
      const mailInputDom = document.querySelector('.prompt.mail input[type="email"]') as HTMLInputElement
      const mail = mailInputDom.value
      if (!mail) {
        mailInputDom.focus()
        isMailLogining = false
        mailLoginDom.innerText = mailLoginDom.dataset.defaultText as string
        return
      }
      const passwordInputDom = document.querySelector('.prompt.mail input[type="password"]') as HTMLInputElement
      const password = passwordInputDom.value
      if (!password) {
        passwordInputDom.focus()
        isMailLogining = false
        mailLoginDom.innerText = mailLoginDom.dataset.defaultText as string
        return
      }
      const res = await fetch('/api/oauth/mail/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          mail,
          password
        })
      }).then(res => res.json())
      if (res.error) {
        console.error(res.error)
        mailLoginDom.innerText = res.error === 'fail' ? mailLoginDom.dataset.failText as string : res.error
        isMailLogining = false
      } else {
        window.location.href = res.redirect
      }
    })
  } else {
    mailDom.style.display = 'none'
  }

  document.body.addEventListener('click', e => {
    if (e.target) {
      const targetDom = e.target as HTMLElement
      if (targetDom.classList.contains('prompt')) {
        targetDom.style.display = 'none'
      }
    }
  })

  const loadingDom = document.querySelector('#loading') as HTMLDivElement
  const itemsDom = document.querySelector('#items') as HTMLDivElement
  function setIsLoading (isLoading: boolean) {
    if (isLoading) {
      loadingDom.classList.remove('hide')
      itemsDom.classList.add('hide')
    } else {
      loadingDom.classList.add('hide')
      itemsDom.classList.remove('hide')
    }
  }

  // check login
  const startTime = Date.now()
  fetch('/api/user/info').then(res => res.json()).then(res => {
    setTimeout(() => {
      if (!res.error) {
        location.href = '/manage/home'
      } else {
        setIsLoading(false)
      }
    }, 1000 - (Date.now() - startTime))
  })
})()
