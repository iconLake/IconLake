/**
 * 使用：
 * <icon-svg name="home"></icon-svg>
 */
(function () {
  const data = ['__DATA__']
  const iconMap = {}
  data.forEach(function (e) {
    iconMap[e[0]] = {
      viewBox: e[1],
      path: e[2]
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
        // svg
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.version = '1.1'
        this.svg = svg
        this.setWidth('100%')
        this.setHeight('100%')
        this.root.append(svg)
      }

      static get version () {
        return '__HASH__'
      }

      setName (name) {
        const info = iconMap[name] || {
          viewBox: '0 0 0 0',
          path: ''
        }
        this.svg.setAttribute('viewBox', info.viewBox)
        this.svg.innerHTML = info.path
      }

      setWidth (width) {
        if (width) {
          this.svg.setAttribute('width', width)
        } else {
          this.svg.removeAttribute('width')
        }
      }

      setHeight (height) {
        if (height) {
          this.svg.setAttribute('height', height)
        } else {
          this.svg.removeAttribute('height')
        }
      }

      static get observedAttributes () {
        return ['name', 'width', 'height']
      }

      attributeChangedCallback (name, oldV, newV) {
        const fn = {
          name: this.setName.bind(this),
          width: this.setWidth.bind(this),
          height: this.setHeight.bind(this)
        }
        fn[name](newV)
      }
    }
    window.customElements.define('icon-svg', Icon)
  } else {
    console.error('icon-svg requires customElements.')
  }
})()
