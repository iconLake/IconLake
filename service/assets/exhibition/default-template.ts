interface Info {
  uri: string
  name: string
  description: string
}

interface Nft {
  class_id: string
  id: string
  uri: string
  uri_hash: string
  data: {
    author: string
    name: string
    description: string
    createTime: string
  }
}

export default class DefaultTemplate extends HTMLElement {
  static get observedAttributes () {
    return ['info', 'nfts', 'pagination']
  }

  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })

    const css = document.createElement('link')
    css.setAttribute('rel', 'stylesheet')
    css.setAttribute('href', './default-template.css')
    this.shadowRoot?.appendChild(css)

    let dom = document.createElement('div')
    dom.className = 'info'
    this.shadowRoot?.appendChild(dom)
    dom = document.createElement('div')
    dom.className = 'nfts'
    this.shadowRoot?.appendChild(dom)
  }

  attributeChangedCallback (name: string, _oldValue, newValue: string | null) {
    console.log(name, _oldValue, newValue)
    if (!this.shadowRoot) {
      return
    }
    switch (name) {
      case 'info':
        this.renderInfo(this.shadowRoot, newValue ? JSON.parse(newValue) : null)
        break
      case 'nfts':
        this.renderNfts(this.shadowRoot, newValue ? JSON.parse(newValue) : null)
        break
    }
  }

  renderInfo (root: ShadowRoot, info: Info | null) {
    const infoDom = this.shadowRoot?.querySelector('.info')
    if (!infoDom) {
      return
    }

    infoDom.innerHTML = ''
    const coverDom = document.createElement('div')
    coverDom.style.backgroundImage = `url(${info?.uri})`
    coverDom.className = 'cover'
    infoDom.appendChild(coverDom)
    const contentDom = document.createElement('div')
    contentDom.className = 'content'
    coverDom.appendChild(contentDom)
    const nameDom = document.createElement('h1')
    nameDom.innerText = info?.name ?? ''
    contentDom.appendChild(nameDom)
    if (info?.description) {
      const descDom = document.createElement('h2')
      descDom.innerText = info.description
      contentDom.appendChild(descDom)
    }

    root.appendChild(infoDom)
  }

  renderNfts (root, nfts: Nft[]) {
    const nftsDom = this.shadowRoot?.querySelector('.nfts')
    if (!nftsDom) {
      return
    }

    nftsDom.innerHTML = ''
    const containerDom = document.createElement('div')
    containerDom.className = 'nfts-container'
    nftsDom.appendChild(containerDom)
    nfts.forEach(e => {
      this.renderNft(containerDom, e)
    })

    root.appendChild(nftsDom)
  }

  renderNft (root, nft: Nft) {
    const nftDom = document.createElement('div')
    nftDom.className = 'nft'
    const imgDom = document.createElement('div')
    imgDom.className = 'nft-img'
    imgDom.style.backgroundImage = `url(${nft.uri})`
    nftDom.appendChild(imgDom)
    const nameDom = document.createElement('div')
    nameDom.innerText = nft.data.name
    nameDom.className = 'nft-name'
    nftDom.appendChild(nameDom)
    root.appendChild(nftDom)
  }
}
