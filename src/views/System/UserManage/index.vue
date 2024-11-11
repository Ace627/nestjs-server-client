<template>
  <div class="app-content">
    <ApWrapList :min-width="180">
      <el-input v-model="queryParams.username" placeholder="请输入用户账号"></el-input>
      <el-select v-model="queryParams.status" placeholder="请选择用户状态">
        <el-option label="启用" :value="1"></el-option>
        <el-option label="停用" :value="0"></el-option>
      </el-select>
      <el-input v-model="queryParams.nickname" placeholder="请输入用户昵称"></el-input>
      <el-input v-model="queryParams.phone" placeholder="请输入手机号码"></el-input>
      <div>
        <el-button plain type="danger" icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button plain type="primary" icon="Search" @click="handleQuery">查询</el-button>
      </div>
    </ApWrapList>

    <div class="my-16px">
      <el-button type="primary" plain icon="Plus" @click="handleCreate">新增</el-button>
      <el-button type="success" plain icon="Upload" @click="userUploadInstance?.handleOpen()">导入</el-button>
      <el-button type="warning" plain icon="Download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 用户列表展示 -->
    <ApTable :records="list" :columns :loading>
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="danger">停用</el-tag>
        <el-tag v-if="row.status === 1">正常</el-tag>
      </template>
      <template #action="{ row }">
        <el-link type="primary" @click="handleUpdate(row.id)">编辑</el-link>
        <el-link type="danger" @click="handleDelete(row)">删除</el-link>
      </template>
    </ApTable>

    <!-- 分页组件 -->
    <ApPagination v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" :total @pagination="getList" />

    <!-- 添加或修改用户配置对话框 -->
    <UserAction ref="userActionRef" @getList="getList" />

    <!-- 用户导入对话框 -->
    <UserUpload ref="userUploadRef" @getList="getList" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserManage' })
import { UserService } from '@/api'
import UserAction from './UserAction.vue'
import UserUpload from './UserUpload.vue'

const columns = [
  { label: '序号', type: 'index', minWidth: '80px' },
  { label: '用户账号', prop: 'username', minWidth: '120px' },
  { label: '真实姓名', prop: 'realname', minWidth: '90px' },
  // { label: '用户昵称', prop: 'nickname', minWidth: '100px' },
  { label: '手机号码', prop: 'phone', minWidth: '120px' },
  { label: '状态', minWidth: '100px', slot: 'status' },
  { label: '更新人员', prop: 'updateBy', minWidth: '100px' },
  // { label: '创建时间', prop: 'createTime', minWidth: '160px' },
  { label: '最近更新', prop: 'updateTime', minWidth: '160px' },
  { label: '操作', minWidth: '120px', slot: 'action' },
]

/** 列表查询状态 */
const loading = ref(false)
/** 列表数据 */
const list = ref<UserEntity[]>([])
/** 列表总条目数 */
const total = ref(0)
/** 查询参数 */
const queryParams = ref<TableQuery<UserEntity>>({ pageNo: 1, pageSize: 10 })
/** 获取用户操作对话框组件的实例 */
const userActionInstance = useTemplateRef<InstanceType<typeof UserAction>>('userActionRef')
const userUploadInstance = useTemplateRef<InstanceType<typeof UserUpload>>('userUploadRef')

/** 查询用户列表 */
async function getList() {
  try {
    loading.value = true
    const data = await UserService.findAll(queryParams.value)
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

/** 处理新增用户的操作 */
function handleCreate() {
  userActionInstance.value?.handleOpen()
}

/** 处理编辑用户的操作 */
function handleUpdate(userId: string) {
  userActionInstance.value?.handleOpen(userId)
}

/** 处理删除用户的操作 */
async function handleDelete(record: UserEntity) {
  try {
    await useModal().confirm(`确定要删除用户《${record.nickname}》吗？`, {})
    await UserService.deleteOneById({ userId: record.id })
    if (list.value.length <= 1) queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    getList()
    useModal().msgSuccess(`删除成功`)
  } catch (error: any) {
    if (error === 'cancel') return useModal().msg('操作取消')
    console.log('error: ', error.message || error)
  }
}

/** 处理下载的操作 */
function handleDownload() {
  UserService.exportExcel(`用户_${Date.now()}.xlsx`)
}

getList()
</script>

<style lang="scss" scoped></style>
