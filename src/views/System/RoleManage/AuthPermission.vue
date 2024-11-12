<template>
  <el-drawer v-model="visible" title="角色权限分配" :with-header="false" :size="260">
    <el-tree
      ref="menuTreeRef"
      :data="treeList"
      node-key="id"
      :props="{ label: 'title' }"
      show-checkbox
      :check-strictly="!checkStrictly"
      default-expand-all
      :defaultCheckedKeys
    ></el-tree>

    <footer class="flex-center">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </footer>
  </el-drawer>
</template>

<script setup lang="ts">
defineOptions({ name: 'AuthPermission' })
import { ElTree } from 'element-plus'
import { MenuService, RoleService } from '@/api'

const emits = defineEmits(['getList'])

/** 抽屉是否可见 */
const visible = ref(false)
/** 是否开启父子联动 */
const checkStrictly = ref<boolean>(true)
/** 默认展开的节点的 key 的数组 */
const defaultCheckedKeys = ref<number[]>([])
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const treeList = ref<MenuEntity[]>([])
const roleId = ref<string>()

async function findTreeList() {
  const data = await MenuService.findTreeList({ status: 1 })
  treeList.value = data
}

/** 打开角色授权抽屉的操作 */
async function handleOpen(id: string) {
  roleId.value = id
  visible.value = true
  await findTreeList()
  const role = await RoleService.findOneById({ roleId: id })
  const menuIds = role.menus?.map((v) => v.id) || []
  menuTreeRef.value?.setCheckedKeys(menuIds)
}

/** 关闭角色授权抽屉的操作 */
function handleCancel() {
  visible.value = false
}

/** 提交角色授权数据 */
async function handleSubmit() {
  const menuIds = menuTreeRef.value?.getCheckedKeys() || []
  await RoleService.authPermission({ roleId: roleId.value!, menuIds: menuIds as string[] })
  useModal().msgSuccess(`授权成功`)
  visible.value = false
  emits('getList')
}

defineExpose({ handleOpen })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  padding: 0;
}

footer {
  position: absolute;
  left: 0;
  bottom: var(--el-drawer-padding-primary);
  width: 100%;
  padding-top: var(--el-drawer-padding-primary);
  // border-top: 1px solid red;
  .el-button {
    min-width: 100px;
  }
}
</style>
