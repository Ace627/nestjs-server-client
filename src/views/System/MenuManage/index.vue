<template>
  <div class="app-content flex flex-col h-full">
    <ApWrapList :min-width="180" v-permissions="['system:menu:query']">
      <el-input v-model="queryParams.title" placeholder="请输入菜单名称"></el-input>
      <el-select v-model="queryParams.status" placeholder="请选择菜单状态">
        <el-option label="启用" :value="1"></el-option>
        <el-option label="停用" :value="0"></el-option>
      </el-select>
      <div>
        <el-button plain type="danger" icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button plain type="primary" icon="Search" @click="handleQuery">查询</el-button>
      </div>
    </ApWrapList>

    <div class="my-16px">
      <el-button type="primary" plain icon="Plus" @click="handleCreate()" v-permissions="['system:menu:create']">新增</el-button>
      <el-button plain icon="Sort" type="info" @click="toggleExpandAll"> 展开/折叠 </el-button>
    </div>

    <ApTable :records="list" :columns :loading row-key="id" :default-expand-all="isExpandAll" v-if="refreshTable" border>
      <template #icon="{ row }">
        <IconFont :name="row.icon" v-if="row.icon" />
      </template>
      <template #type="{ row }">
        <el-tag v-if="row.type === 'M'" type="primary">目录</el-tag>
        <el-tag v-if="row.type === 'C'" type="warning">菜单</el-tag>
        <el-tag v-if="row.type === 'F'" type="success">按钮</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="danger">停用</el-tag>
        <el-tag v-if="row.status === 1">正常</el-tag>
      </template>
      <template #visible="{ row }">
        <el-tag v-if="row.visible === 0" type="danger">隐藏</el-tag>
        <el-tag v-if="row.visible === 1">显示</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="handleCreate(row)" v-permissions="['system:menu:create']">新增</el-link>
        <el-link type="warning" @click="handleUpdate(row)" v-permissions="['system:menu:update']">编辑</el-link>
        <el-link type="danger" @click="handleDelete(row)" v-permissions="['system:menu:delete']">删除</el-link>
      </template>
    </ApTable>

    <MenuAction ref="menuActionRef" @getList="getList" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'MenuManage' })
import { MenuService } from '@/api'
import MenuAction from './MenuAction.vue'

const queryParams = ref({} as Partial<MenuEntity>)
const loading = ref(false)
/** 是否展开，默认全部折叠 */
const isExpandAll = ref(false)
/** 重新渲染表格状态 */
const refreshTable = ref(true)
const menuActionRef = ref<InstanceType<typeof MenuAction>>()
const list = ref<MenuEntity[]>([])
const columns = ref([
  { label: '菜单名称', prop: 'title', minWidth: '150px' },
  { label: '菜单类型', slot: 'type', minWidth: '100px' },
  { label: '图标', slot: 'icon', minWidth: '60px' },
  { label: '显示顺序', prop: 'order', minWidth: '90px' },
  { label: '权限标识', prop: 'permission', width: '160px' },
  { label: '路由地址', prop: 'path', minWidth: '180px', showOverflowTooltip: true },
  { label: '页面地址', prop: 'component', minWidth: '200px' },
  { label: '菜单状态', slot: 'status', minWidth: '100px' },
  { label: '是否隐藏', slot: 'visible', minWidth: '100px' },
  { label: '上次更新', prop: 'updateTime', minWidth: '160px' },
  { label: '操作', slot: 'action', minWidth: '130px', fixed: 'right' },
])

/**
 * 查询树状菜单列表
 */
async function getList() {
  try {
    loading.value = true
    list.value = await MenuService.findTreeList(queryParams.value)
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
function resetQuery() {
  queryParams.value = {}
  handleQuery()
}

function handleQuery() {
  getList()
}

function handleCreate(record?: MenuEntity) {
  menuActionRef.value?.handleOpen(record)
}
function handleUpdate(record: MenuEntity) {
  menuActionRef.value?.handleDetail(record)
}
async function handleDelete(record: MenuEntity) {
  try {
    await useModal().confirm(`确定要删除《${record.title}》吗？`)
    await MenuService.deleteOneById({ menuId: record.id })
    useModal().msgSuccess(`删除成功`)
    getList()
  } catch (error) {
    if (error === 'cancel') return useModal().msg(`操作取消`)
  }
}

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
