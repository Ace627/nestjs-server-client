<template>
  <el-container class="layout-common layout-classical" :class="classes">
    <!-- mobile 端侧边栏遮罩层 -->
    <div v-if="appStore.isMobile && appStore.sidebar.opened" class="drawer-bg" @click="appStore.closeSidebar(false)"></div>

    <Sidebar class="sidebar-container" />

    <el-container class="main-container">
      <el-header class="px-0 h-auto">
        <Navbar />
      </el-header>

      <AppMain />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
defineOptions({ name: 'LayoutClassical' })
import { Sidebar, Navbar, AppMain } from '../components'

/** 读取 Pinia 仓库 */
const appStore = useAppStore()

/** 用来添加到根元素的动态类的集合 */
const classes = computed(() => [
  appStore.device,
  { 'open-sidebar': appStore.sidebar.opened },
  { 'hide-sidebar': !appStore.sidebar.opened },
  { withoutAnimation: appStore.sidebar.withoutAnimation }
])
</script>

<style lang="scss" scoped></style>
