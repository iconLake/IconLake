interface Info {
  uri: string
  data: {
    author: string
    name: string
    description: string
    create_time: string
  }
}

export default class DefaultTemplate extends HTMLElement {
  static get observedAttributes () {
    return ['info']
  }

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
  }

  attributeChangedCallback (name: string, _oldValue, newValue: string | null) {
    if (!this.shadowRoot) {
      return
    }
    switch (name) {
      case 'info':
        this.renderInfo(this.shadowRoot, newValue ? JSON.parse(newValue) : null)
        break
    }
  }

  renderInfo (root: ShadowRoot, info: Info | null) {
    const infoDom = this.shadowRoot?.querySelector('.info')
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
