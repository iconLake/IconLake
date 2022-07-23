<template>
  <svg v-on="$listeners" v-bind="$attrs">
    <use :xlink:href="`#${name}`"/>
  </svg>
</template>

<script>
const id = 'iconlake-__HASH__'
let svg = document.querySelector(`svg#${id}`)
if (!svg) {
  svg = document.createElement('svg')
  svg.innerHTML = '__SVG__'
  svg.id = id
  document.body.append(svg)
}

export default  {
  props: {
    name: String
  }
}
</script>
