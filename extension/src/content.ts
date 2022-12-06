const handler = {
  getIcons: async () => {
    const svgDoms = document.querySelectorAll('svg')
    const icons = Array.from(svgDoms).map(e => ({
      svg: e.outerHTML,
      name: e.getAttribute('title') || e.parentElement?.getAttribute('title') || ''
    }))
    return icons
  }
}

browser.runtime.onMessage.addListener((msg, sender) => {
  console.log(msg, sender)
  return handler.getIcons()
})

console.log('browser.runtime.onMessage.addListener')

export {}
