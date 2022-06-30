(() => {
  // referer
  if (location.search && URL) {
    const url = new URL(location.href)
    const referer = url.searchParams.get('referer')
    if (referer) {
      document.cookie = `referer=${referer};path=/`
    }
  }
  // listen
  const giteeDom = document.querySelector('.auth .gitee')
  const githubDom = document.querySelector('.auth .github')
  const domain = encodeURIComponent(location.origin)
  if (giteeDom) {
    giteeDom.addEventListener('click', () => {
      location.href = `https://gitee.com/oauth/authorize?client_id=9a960b9a3ed10a781639e685f282460567119b0c47dd5cbe6f048b2da84d05a8&redirect_uri=${domain}%2Fapi%2Foauth%2Fgitee&response_type=code`
    })
  }
  if (githubDom) {
    githubDom.addEventListener('click', () => {
      location.href = `https://github.com/login/oauth/authorize?client_id=96241f9bf8efb7bfad22&redirect_uri=${domain}%2Fapi%2Foauth%2Fgithub`
    })
  }
  const codeDom: HTMLDivElement|null = document.querySelector('.auth .code')
  if (codeDom) {
    codeDom.addEventListener('click', () => {
      const id = prompt('请填写Code：')
      location.href = `/api/oauth/code?id=${id}`
    })
    if (/debug/i.test(location.search)) {
      codeDom.style.display = 'flex'
    }
  }
})()
