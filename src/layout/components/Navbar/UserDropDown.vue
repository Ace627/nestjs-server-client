<template>
  <el-dropdown>
    <div class="flex-center">
      <el-avatar :src="userStore.avatar" :size="36" alt="avatar" />
    </div>

    <template #dropdown>
      <el-dropdown-item @click="handleLogout()">
        <IconFont name="SwitchButton" />
        <span>退出登录</span>
      </el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserDropDown' })

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingStore = useSettingStore()
const { handleLogout } = useLogin()
</script>

<style lang="scss" scoped>
/* 取消头像周围的环形阴影效果 */
.el-tooltip__trigger:focus-visible {
  outline: none;
}
</style>
