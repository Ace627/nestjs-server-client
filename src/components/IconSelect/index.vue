<template>
  <div class="icon-select-container">
    <el-input v-model="name" clearable placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons" class="mb-10px" icon="Search"> </el-input>

    <ApWrapList class="icon-list" :min-width="100" :gap="4">
      <div class="icon-item" v-for="(name, i) in iconList" :key="i" @click="selectedIcon(name)" :class="{ active: activeIcon === name }">
        <IconFont :name />
        <span class="icon-title">{{ name }}</span>
      </div>
    </ApWrapList>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'IconSelect' })
import iconfont from '@/styles/iconfont/iconfont.json'

/** 接受父组件传递的属性 */
defineProps({ activeIcon: { type: String } })

/** 接受父组件传递的事件 */
const emits = defineEmits(['selected'])

const iconfonts = computed(() => iconfont.glyphs.map((v) => v.font_class))
/** 选中图标的名称 */
const name = ref<string>('')
/** 阿里字体图标列表 */
const iconList = ref(iconfonts.value)

/** 根据关键字筛选图标 */
function filterIcons() {
  iconList.value = iconfonts.value
  if (name.value) {
    iconList.value = iconList.value.filter((item) => item.includes(name.value))
  }
}

/** 处理选中图标的操作 */
function selectedIcon(name: string) {
  emits('selected', name)
  document.body.click()
}

/** 重置 */
function reset() {
  name.value = ''
  iconList.value = iconfonts.value
}

/** 暴露组件的方法属性 便于父组件访问 */
defineExpose({ reset })
</script>

<style lang="scss" scoped>
.icon-select-container {
  width: 100%;
  padding: 10px;
  .icon-list {
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    .icon-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color 0.28s;
      .iconfont {
        flex-shrink: 0;
        margin-right: 4px;
        font-size: 16px;
      }
      .icon-title {
        font-size: 12px;
      }
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
      &.active {
        background-color: var(--el-color-primary-light-9);
        border-radius: 5px;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
