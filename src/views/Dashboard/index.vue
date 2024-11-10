<template>
  <div class="app-content">
    <el-card class="flex">
      <img :src="userStore.avatar" alt="用户头像" class="b-rd-circle" draggable="false" />
      <div>
        <div>当时只道是寻常</div>
        <div></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dashboard' })

const userStore = useUserStore()
</script>

<style lang="scss" scoped></style>
