/* eslint-disable no-var */
(function () {
  var id = 'iconlake-__HASH__'
  var svg = document.querySelector(`svg#${id}`)
  if (!svg) {
    svg = document.createElement('svg')
    svg.innerHTML = '__SVG__'
    svg.id = id
    document.body.append(svg)
  }
  // web component
  if (window.customElements) {
    class Icon extends HTMLElement {
      constructor () {
        super()
        var shadow = this.attachShadow()
        var svg = document.createElement('svg')
        var use = document.createElement('use')
        use.setAttribute('xlink:href', `#${this.getAttribute('name')}`)
        svg.append(use)
        shadow.append(svg)
      }
    }
    window.customElements.define('icon', Icon)
  }
})()
