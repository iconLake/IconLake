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
  document.querySelector('.auth .gitee').addEventListener('click', () => {
    location.href = 'https://gitee.com/oauth/authorize?client_id=9a960b9a3ed10a781639e685f282460567119b0c47dd5cbe6f048b2da84d05a8&redirect_uri=https%3A%2F%2Ficonlake.com%2Fapi%2Foauth%2Fgitee&response_type=code'
  })
  document.querySelector('.auth .github').addEventListener('click', () => {
    location.href = 'https://github.com/login/oauth/authorize?client_id=96241f9bf8efb7bfad22&redirect_uri=https%3A%2F%2Ficonlake.com%2Fapi%2Foauth%2Fgithub'
  })
  document.querySelector('.auth .code').addEventListener('click', () => {
    const id = prompt('请填写Code：')
    location.href = `/api/oauth/code?id=${id}`
  })
})()
