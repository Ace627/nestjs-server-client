<template>
  <el-table
    highlight-current-row
    :data="records"
    class="custom-table"
    v-loading="loading"
    element-loading-text="正在加载..."
    element-loading-background="rgba(122, 122, 122, 0.8)"
    empty-text="暂时没有数据哟🌻"
  >
    <el-table-column v-for="(column, index) in columns" :key="index" v-bind="column">
      <template v-if="column.slot" #default="{ $index, row }">
        <slot :name="column.slot" :$index :row></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
defineOptions({ name: 'ApTable' })

const props = defineProps({
  /** 数据数组 */
  records: { type: Array, required: true },
  /** 表格列的配置描述 具体项见 https://element-plus.org/zh-CN/component/table.html#table-column-api */
  columns: { type: Array as PropType<Recordable>, required: true },
  /** 表格数据的请求加载态 */
  loading: { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped></style>
