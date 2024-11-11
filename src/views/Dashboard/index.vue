<template>
  <div class="app-content">
    <el-card>
      <div class="flex items-center">
        <img :src="userStore.avatar" alt="用户头像" class="b-rd-circle" draggable="false" />

        <div class="ml-16px">
          <div class="fw-bold text-20px tracking-widest">{{ userStore.userInfo.nickname }}</div>
          <div class="mt-8px text-14px">想当年，金戈铁马，气吞万里如虎。</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dashboard' })

const userStore = useUserStore()
</script>

<style lang="scss" scoped></style>
