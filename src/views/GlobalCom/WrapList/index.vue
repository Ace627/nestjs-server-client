<template>
  <div class="app-content flex flex-col h-full">
    <div class="alert">{{ description }}</div>

    <ApWrapList :minWidth="375" :gap="12" class="overflow-y-auto">
      <div class="item flex-center" v-for="(item, index) in 11" :key="index">{{ item }}</div>
    </ApWrapList>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WrapList' })

const description = ref(
  `最小宽度 minWidth 设为设计稿上的宽度，间距 gap 也设为设计稿的列表项之间的间距；切记：列表项不需要设置宽度，不需要设置宽度，不需要设置宽度，只需要将列表项的高度设置为设计稿上的高度即可；`,
)
</script>

<style lang="scss" scoped>
.alert {
  margin-bottom: 16px;
  padding: 8px 16px;
  line-height: 1.5;
  border-radius: 8px;
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.item {
  height: 150px;
  font-size: 32px;
  border-radius: 8px;
  background-color: pink;
}

.ap-wrap-list {
  padding: 0 6px;
  &::-webkit-scrollbar {
    margin-right: 6px;
  }
}
</style>
