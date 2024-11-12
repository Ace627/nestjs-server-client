<template>
  <div class="app-content">
    <ApWrapList :min-width="170">
      <el-input v-model="queryParams.name" placeholder="请输入角色名称"></el-input>
      <el-input v-model="queryParams.code" placeholder="请输入角色编码"></el-input>
      <el-input v-model="queryParams.remark" placeholder="请输入角色备注"></el-input>
      <el-select v-model="queryParams.status" placeholder="请选择角色状态">
        <el-option label="启用" :value="1"></el-option>
        <el-option label="停用" :value="0"></el-option>
      </el-select>
      <div>
        <el-button plain type="danger" icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button plain type="primary" icon="Search" @click="handleQuery">查询</el-button>
      </div>
    </ApWrapList>

    <div class="my-16px">
      <el-button type="primary" plain icon="Plus" @click="handleCreate">新增</el-button>
    </div>

    <!-- 角色列表展示 -->
    <ApTable :records="list" :columns :loading show-overflow-tooltip>
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="danger">停用</el-tag>
        <el-tag v-if="row.status === 1">正常</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="handleUpdate(row)">编辑</el-link>
        <el-link type="danger" @click="handleDelete(row)">删除</el-link>
        <el-link type="warning" @click="handleAuth(row)">授权</el-link>
      </template>
    </ApTable>

    <!-- 分页组件 -->
    <ApPagination v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" :total @pagination="getList" />

    <!-- 添加或修改角色配置对话框 -->
    <RoleAction ref="roleActionRef" @getList="getList" />
    <AuthPermission ref="authPermissionRef" @getList="getList" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RoleManage' })
import { RoleService } from '@/api'
import RoleAction from './RoleAction.vue'
import AuthPermission from './AuthPermission.vue'

const queryParams = ref<TableQuery<RoleEntity>>({ pageNo: 1, pageSize: 10 })
const loading = ref<boolean>(false)
const list = ref<RoleEntity[]>([])
const total = ref<number>(0)
/** 获取角色操作对话框组件的实例 */
const roleActionInstance = useTemplateRef<InstanceType<typeof RoleAction>>('roleActionRef')
const authPermissionRef = ref<InstanceType<typeof AuthPermission>>()

const columns = [
  { label: '序号', type: 'index', minWidth: '80px' },
  { label: '角色名称', prop: 'name', minWidth: '120px' },
  { label: '角色编码', prop: 'code', minWidth: '90px' },
  { label: '状态', minWidth: '100px', slot: 'status' },
  // { label: '创建时间', prop: 'createTime', minWidth: '160px' },
  { label: '最近更新', prop: 'updateTime', minWidth: '160px' },
  { label: '操作', minWidth: '160px', slot: 'action' },
]

/** 查询角色列表 */
async function getList() {
  try {
    loading.value = true
    const data = await RoleService.findList(queryParams.value)
    list.value = data.records
    total.value = data.total
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  const keys = Object.keys(queryParams.value).filter((key) => key !== 'pageSize')
  keys.forEach((key) => Reflect.deleteProperty(queryParams.value, key))
  handleQuery()
}

/** 处理新增角色的操作 */
async function handleCreate() {
  roleActionInstance.value?.handleOpen()
}

/** 处理编辑角色的操作 */
async function handleUpdate(record: RoleEntity) {
  roleActionInstance.value?.handleOpen(record.id)
}

/** 处理删除角色的操作 */
async function handleDelete(record: RoleEntity) {
  try {
    await useModal().confirm(`确定要删除角色《${record.name}》吗？`, {})
    await RoleService.deleteOneById({ roleId: record.id })
    if (list.value.length <= 1) queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    getList()
    useModal().msgSuccess(`删除成功`)
  } catch (error) {
    if (error === 'cancel') return useModal().msg(`操作取消`)
  }
}

function handleAuth(record: RoleEntity) {
  authPermissionRef.value?.handleOpen(record.id)
}

getList()
</script>

<style lang="scss" scoped></style>
