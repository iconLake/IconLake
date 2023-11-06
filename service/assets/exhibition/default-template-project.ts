import type { IconLakeAPI, ProjectInfo, Nft } from './api'

export default class DefaultTemplate extends HTMLElement {
  constructor () {
    super()

    this.attachShadow({
      mode: 'open'
    })

    const frag = document.createDocumentFragment()

    const css = document.createElement('link')
    css.setAttribute('rel', 'stylesheet')
    css.setAttribute('href', '/exhibition/default-template-project.css')
    frag.appendChild(css)

    let dom = document.createElement('div')
    dom.className = 'info'
    frag.appendChild(dom)
    dom = document.createElement('div')
    dom.className = 'nfts'
    frag.appendChild(dom)

    this.shadowRoot?.appendChild(frag)

    const iconlakeAPI = (window as any).iconlakeAPI as IconLakeAPI
    if (!iconlakeAPI) {
      console.error('window.iconlakeAPI is not defined')
      return
    }
    iconlakeAPI.project.getInfo().then((info) => {
      this.shadowRoot && this.renderInfo(this.shadowRoot, info)
      iconlakeAPI.loading.isShow = false
    })
    iconlakeAPI.project.getNfts().then((res) => {
      this.shadowRoot && this.renderNfts(this.shadowRoot, res.nfts)
    })
  }

  renderInfo (root: ShadowRoot, info: ProjectInfo | null) {
    const infoDom = root.querySelector('.info')
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
    nameDom.innerText = info?.name || '尚未设置链上信息'
    contentDom.appendChild(nameDom)
    if (info?.description) {
      const descDom = document.createElement('h2')
      descDom.innerText = info.description
      contentDom.appendChild(descDom)
    }
    const authorDom = document.createElement('h3')
    authorDom.innerText = info?.data.author ? `Created by ${info?.data.author}` : ''
    contentDom.appendChild(authorDom)
  }

  renderNfts (root: ShadowRoot, nfts: Nft[]) {
    const nftsDom = root.querySelector('.nfts')
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
  }

  renderNft (root, nft: Nft) {
    const nftDom = document.createElement('a')
    nftDom.href = `/exhibition/${encodeURIComponent(nft.classId)}/${encodeURIComponent(nft.id)}`
    nftDom.className = 'nft'
    const coverDom = document.createElement('div')
    coverDom.className = 'nft-cover'
    nftDom.appendChild(coverDom)
    let dom = document.createElement('div')
    dom.className = 'nft-img'
    dom.style.backgroundImage = `url(${nft.uri})`
    coverDom.appendChild(dom)
    dom = document.createElement('div')
    dom.innerText = nft.data.name
    dom.className = 'nft-name'
    nftDom.appendChild(dom)
    root.appendChild(nftDom)
  }
}
