(async () => {
  // TODO: Verify blacklist

  import('./default-template-project.js').then(module => {
    customElements.define('iconlake-exhibition', module.default)
  })
})()
