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
  constructor () {
    super()

    const root = this.attachShadow({
      mode: 'open'
    })

    const css = document.createElement('link')
    css.setAttribute('rel', 'stylesheet')
    css.setAttribute('href', './default-template.css')
    root.appendChild(css)

    const infoAttr = this.getAttribute('info')
    if (infoAttr) {
      try {
        const info = JSON.parse(infoAttr)

        this.renderInfo(root, info)
      } catch (err) {
        console.error(err)
      }
    }

    const nftsAttr = this.getAttribute('nfts')
    if (nftsAttr) {
      try {
        const nfts = JSON.parse(nftsAttr)
        this.renderNfts(root, nfts)
      } catch (e) {
        console.error(e)
      }
    }
  }

  renderInfo (root: ShadowRoot, info: Info) {
    const infoDom = document.createElement('div')
    infoDom.className = 'info'
    const coverDom = document.createElement('div')
    coverDom.style.backgroundImage = `url(${info.uri})`
    coverDom.className = 'cover'
    infoDom.appendChild(coverDom)
    const contentDom = document.createElement('div')
    contentDom.className = 'content'
    coverDom.appendChild(contentDom)
    const nameDom = document.createElement('h1')
    nameDom.innerText = info.name
    contentDom.appendChild(nameDom)
    if (info.description) {
      const descDom = document.createElement('h2')
      descDom.innerText = info.description
      contentDom.appendChild(descDom)
    }

    root.appendChild(infoDom)
  }

  renderNfts (root, nfts: Nft[]) {
    const nftsDom = document.createElement('div')
    nftsDom.className = 'nfts'

    root.appendChild(nftsDom)
  }
}
