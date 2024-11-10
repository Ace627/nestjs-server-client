<template>
  <div class="navbar flex items-center">
    <!-- 侧栏折叠控制 -->
    <Hamburger class="navbar-item" @toggleClick="appStore.toggleSidebar" />
    <!-- 面包屑导航 -->
    <Breadcrumb class="ml-8px" />

    <div class="right-menu h-full ml-auto">
      <UserDropDown class="navbar-item" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Navbar' })
import Hamburger from './Hamburger.vue'
import Breadcrumb from './Breadcrumb.vue'
import UserDropDown from './UserDropDown.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.navbar {
  height: var(--ap-navbar-height);
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

/* 菜单项的通用样式 */
.navbar-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  transition: background-color var(--el-transition-duration-fast);
  &:hover {
    background-color: rgba(0, 21, 41, 0.08);
  }
}
</style>
