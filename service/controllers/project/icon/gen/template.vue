<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    v-on="$listeners"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    v-html="path"
  ></svg>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

const data = ['__DATA__']
const iconMap = {}
data.forEach(function (e) {
  iconMap[e[0]] = {
    viewBox: e[1],
    path: e[2]
  }
})

const Props = Vue.extend({
  props: {
    name: String,
    width: String,
    height: String,
    pure: Boolean // 纯色化
  }
})

@Component
export default class IconSvg extends Props {
  get version () {
    return '__HASH__'
  }

  get viewBox () {
    return this.name in iconMap ? iconMap[this.name].viewBox : '0 0 0 0'
  }

  get path () {
    let path = ''
    if (this.name in iconMap) {
      path = this.pure ? iconMap[this.name].path.replace(/fill=".*?"/ig, '').replace(/stroke=".*?"/ig, '') : iconMap[this.name].path
    }
    return path
  }
}
</script>
