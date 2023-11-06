import type { IconLakeAPI, Nft } from './api'

export default class DefaultTemplate extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })

    const frag = document.createDocumentFragment()

    const css = document.createElement('link')
    css.setAttribute('rel', 'stylesheet')
    css.setAttribute('href', '/exhibition/default-template-nft.css')
    frag.appendChild(css)

    const dom = document.createElement('div')
    dom.className = 'info'
    frag.appendChild(dom)

    this.shadowRoot?.appendChild(frag)

    const iconlakeAPI = (window as any).iconlakeAPI as IconLakeAPI
    if (!iconlakeAPI) {
      console.error('window.iconlakeAPI is not defined')
      return
    }
    iconlakeAPI.nft.getInfo().then((info) => {
      this.shadowRoot && this.renderInfo(this.shadowRoot, info)
      iconlakeAPI.loading.isShow = false
    })
  }

  renderInfo (root: ShadowRoot, info: Nft | null) {
    const infoDom = root.querySelector('.info')
    if (!infoDom) {
      return
    }

    infoDom.innerHTML = ''
    const imgDom = new Image()
    imgDom.src = info?.uri ?? ''
    infoDom.appendChild(imgDom)
    const nameDom = document.createElement('h1')
    nameDom.innerText = info?.data.name ?? ''
    infoDom.appendChild(nameDom)
    if (info?.data.description) {
      const descDom = document.createElement('h2')
      descDom.innerText = info.data.description
      infoDom.appendChild(descDom)
    }
    const authorDom = document.createElement('h3')
    authorDom.innerText = info?.data.author ? `Created by ${info?.data.author}` : ''
    infoDom.appendChild(authorDom)

    root.appendChild(infoDom)
  }
}
