<template>
  <div class="app-content flex flex-col items-center justify-center h-full overflow-hidden">
    <div class="flex mb-32px">
      <div class="flex-center">
        <span class="mr-4px">浅色</span>
        <el-color-picker v-model="lightColor" />
      </div>
      <div class="flex-center ml-16px">
        <span class="mr-4px">深色</span>
        <el-color-picker v-model="darkColor" />
      </div>
      <div class="flex-center ml-16px w-220px">
        <span class="flex-none mr-20px">速度</span>
        <el-slider v-model="speed" :max="10" :min="0.1" />
      </div>
    </div>

    <ApTaiChi :lightColor :darkColor :speed />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TaiChi' })

const lightColor = ref('#fff')
const darkColor = ref('#000')
const speed = ref(1)
</script>

<style lang="scss" scoped></style>
