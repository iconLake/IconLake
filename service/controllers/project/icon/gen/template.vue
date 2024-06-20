<script setup lang="ts">
import { computed, watch, ref, onMounted } from "vue";

const props = defineProps({
  name: String,
  width: String,
  height: String,
  pure: Boolean,
});

const rootDom = ref();

const data = ["__DATA__"];
const iconMap = {};
data.forEach(function (e) {
  iconMap[e[0]] = {
    content: e[1],
  };
});

const content = computed(() => {
  let content = "";
  if (props.name in iconMap) {
    content = props.pure
      ? iconMap[props.name].content
          .replace(/fill=".*?"/gi, "")
          .replace(/stroke=".*?"/gi, "")
      : iconMap[props.name].content;
  }
  return content;
});

const updateStyle = (type: "width" | "height") => {
  const dom = rootDom.value.querySelector("svg");
  dom && dom.setAttribute(type, props[type] || "18px");
};

watch(
  () => props.width,
  () => {
    updateStyle("width");
  },
);

watch(
  () => props.height,
  () => {
    updateStyle("height");
  },
);

watch(
  () => content,
  () => {
    updateStyle("width");
    updateStyle("height");
  },
);

onMounted(() => {
  updateStyle("width");
  updateStyle("height");
});
</script>

<template>
  <span
    data-icon-version="__HASH__"
    v-html="content"
    ref="rootDom"
  ></span>
</template>
