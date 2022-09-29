(async () => {
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
      gitee: string,
      github: string
    },
    login: {
      code: boolean,
      gitee: boolean,
      github: boolean
    }
  } = await fetch('/api/login/params').then(res => res.json())
  // listen
  const domain = encodeURIComponent(location.origin)
  const giteeDom = document.querySelector('.auth .gitee') as HTMLDivElement
  if (params.login.gitee) {
    giteeDom.classList.add('active')
    giteeDom.addEventListener('click', () => {
      location.href = `https://gitee.com/oauth/authorize?client_id=${params.clientId.gitee}&redirect_uri=${domain}%2Fapi%2Foauth%2Fgitee&response_type=code`
    })
  } else {
    giteeDom.style.display = 'none'
  }
  const githubDom = document.querySelector('.auth .github') as HTMLDivElement
  if (params.login.github) {
    githubDom.classList.add('active')
    githubDom.addEventListener('click', () => {
      location.href = `https://github.com/login/oauth/authorize?client_id=${params.clientId.github}&redirect_uri=${domain}%2Fapi%2Foauth%2Fgithub`
    })
  } else {
    githubDom.style.display = 'none'
  }
  const codeDom = document.querySelector('.auth .code') as HTMLDivElement
  if (params.login.code) {
    codeDom.classList.add('active')
    codeDom.addEventListener('click', () => {
      const id = prompt('请填写Code：')
      if (id) {
        location.href = `/api/oauth/code?id=${id}`
      }
    })
  } else {
    codeDom.style.display = 'none'
  }
})()
