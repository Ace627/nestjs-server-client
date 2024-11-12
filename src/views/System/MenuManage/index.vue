<template>
  <div class="app-content">
    <div class="my-16px">
      <el-button type="primary" plain icon="Plus" @click="handleCreate()">新增</el-button>
      <el-button plain icon="Sort" type="info" @click="toggleExpandAll"> 展开/折叠 </el-button>
    </div>

    <ApTable :records="list" :columns :loading row-key="id" :default-expand-all="isExpandAll" v-if="refreshTable">
      <template #icon="{ row }">
        <IconFont :name="row.icon" v-if="row.icon" />
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="danger">停用</el-tag>
        <el-tag v-if="row.status === 1">正常</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="handleCreate(row)">新增</el-link>
        <el-link type="primary" @click="handleUpdate(row)">编辑</el-link>
        <el-link type="danger" @click="handleDelete(row)">删除</el-link>
      </template>
    </ApTable>

    <MenuAction ref="menuActionRef" @getList="getList" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MenuManage' })
import { MenuService } from '@/api'
import MenuAction from './MenuAction.vue'

const loading = ref(false)
/** 是否展开，默认全部折叠 */
const isExpandAll = ref(false)
/** 重新渲染表格状态 */
const refreshTable = ref(true)
const menuActionRef = ref<InstanceType<typeof MenuAction>>()
const list = ref<MenuEntity[]>([])
const columns = ref([
  { label: '菜单名称', prop: 'title', minWidth: '140px' },
  { label: '菜单图标', slot: 'icon' },
  { label: '菜单顺序', prop: 'order', minWidth: '90px' },
  { label: '权限标识', prop: 'permission', width: '160px' },
  { label: '组件路径', prop: 'component', minWidth: '160px' },
  { label: '菜单状态', slot: 'status', minWidth: '100px' },
  { label: '上次更新', prop: 'updateTime', minWidth: '160px' },
  { label: '操作', slot: 'action', minWidth: '130px' },
])

/**
 * 查询树状菜单列表
 */
async function getList() {
  try {
    loading.value = true
    list.value = await MenuService.findTreeList()
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

function handleCreate(record?: MenuEntity) {
  menuActionRef.value?.handleOpen(record)
}
function handleUpdate(record: MenuEntity) {
  menuActionRef.value?.handleDetail(record)
}
function handleDelete(record: MenuEntity) {}

/**
 * 展开/折叠操作
 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => (refreshTable.value = true))
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped></style>
