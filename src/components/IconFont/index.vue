<template>
  <i :class="classes" v-bind="$attrs"></i>
</template>

<script setup lang="ts">
defineOptions({ name: 'IconFont' })

const props = defineProps({
  /** 图标名字 */
  name: { type: String, required: true },
  /** 图标大小 */
  size: { type: [Number, String], default: '1em' },
  /** 图标颜色 */
  color: { type: String },
})

/** 解决图标颜色无法被 class 覆盖的问题 */
const hasColor = computed(() => Boolean(props.color))
const classes = computed(() => [`iconfont`, `icon-${props.name}`, { 'has-color': hasColor.value }])

/** 减少 CSS 权重 便于修改 */
const iconColor = computed(() => props.color)
const iconSize = computed(() => (typeof props.size === 'string' ? props.size : `${props.size}px`))
</script>

<style scoped>
.iconfont {
  cursor: pointer;
  font-size: v-bind(iconSize);
  font-style: normal;
}
.has-color {
  color: v-bind(iconColor);
}
</style>
