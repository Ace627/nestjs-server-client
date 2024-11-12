<template>
  <div class="app-content">
    <div class="my-16px">
      <el-button type="primary" plain icon="Plus" @click="handleCreate">新增</el-button>
    </div>

    <MenuAction ref="menuActionRef" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MenuManage' })
import MenuAction from './MenuAction.vue'

/** 是否展开，默认全部折叠 */
const isExpandAll = ref(false)
/** 重新渲染表格状态 */
const refreshTable = ref(true)
const menuActionRef = ref<InstanceType<typeof MenuAction>>()

function handleCreate() {
  menuActionRef.value?.handleOpen()
}
</script>

<style lang="scss" scoped></style>
