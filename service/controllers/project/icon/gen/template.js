/**
 * 使用：
 * <icon-svg name="home"></icon-svg>
 */
(function () {
  const data = ['__DATA__']
  const iconMap = {}
  data.forEach(function (e) {
    iconMap[e[0]] = {
      content: e[1]
    }
  })
  // web component
  if (window.customElements) {
    class Icon extends HTMLElement {
      constructor () {
        super()
        this.root = this.attachShadow({
          mode: 'open'
        })
      }

      static get version () {
        return '__HASH__'
      }

      setName (name) {
        const info = iconMap[name] || {
          content: ''
        }
        this.root.innerHTML = info.content
        this.setWidth('100%')
        this.setHeight('100%')
      }

      setWidth (width) {
        const svg = this.root.querySelector('svg')
        if (width) {
          svg.setAttribute('width', width)
        } else {
          svg.removeAttribute('width')
        }
      }

      setHeight (height) {
        const svg = this.root.querySelector('svg')
        if (height) {
          svg.setAttribute('height', height)
        } else {
          svg.removeAttribute('height')
        }
      }

      setPure (pure) {
        const info = iconMap[this.getAttribute('name')] || {
          content: ''
        }
        this.root.innerHTML = (pure === null) ? info.content : info.content.replace(/fill=".*?"/ig, '')
      }

      static get observedAttributes () {
        return ['name', 'width', 'height', 'pure']
      }

      attributeChangedCallback (name, oldV, newV) {
        const fn = {
          name: this.setName.bind(this),
          width: this.setWidth.bind(this),
          height: this.setHeight.bind(this),
          pure: this.setPure.bind(this)
        }
        fn[name](newV)
      }
    }
    window.customElements.define('icon-svg', Icon)
  } else {
    console.error('icon-svg requires customElements.')
  }
})()
