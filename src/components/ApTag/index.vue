<template>
  <div class="ap-tag flex-center">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ApTag' })

const props = defineProps({
  color: { type: String, default: 'var(--el-color-primary)' },
})

const color = computed(() => props.color ?? 'var(--el-color-primary)')
</script>

<style lang="scss" scoped>
.ap-tag {
  --ap-tag-color: v-bind(color);
  cursor: pointer;
  display: inline-flex;
  line-height: 1;
  font-size: var(--el-font-size-base);
  color: var(--ap-tag-color);
  letter-spacing: 1px;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--ap-tag-color), #fff 80%);
    box-shadow: 0 0 0 2px var(--ap-tag-color);
  }
}
</style>
