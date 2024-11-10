<template>
  <el-aside :class="{ 'has-logo': settingStore.showLogo }">
    <SidebarLogo v-if="settingStore.showLogo" />

    <el-menu :defaultActive :collapse unique-opened :collapse-transition="false" popper-class="layout-classical-menu-popper">
      <SidebarItem v-for="(route, index) in routeList" :key="index" :item="route" :basePath="route.path" />
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
defineOptions({ name: 'Sidebar' })
import SidebarLogo from './SidebarLogo.vue'
import SidebarItem from './SidebarItem.vue'

/** 构建路由和路由器 */
const route = useRoute()
const router = useRouter()
/** 读取 Pinia 仓库 */
const appStore = useAppStore()
const settingStore = useSettingStore()

/** 计算当前侧边栏的开关状态 */
const collapse = computed(() => !appStore.sidebar.opened)
/** 计算当前激活路径 */
const defaultActive: ComputedRef<string> = computed(() => route.meta.activeMenu ?? route.path)
/** 计算当前路由表 */
// const routeList = computed(() => permissionStore.routes)
const routeList = computed(() => router.options.routes)
</script>

<style lang="scss" scoped></style>
