<template>
  <el-dialog v-model="dialogVisible" :title :width :before-close="handleClose" :show-close="false" draggable class="custom-dialog">
    <el-form :model :rules label-width="80px" ref="formRef">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model.trim="model.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>

      <el-form-item label="角色编码" prop="code">
        <el-input v-model.trim="model.code" placeholder="请输入角色编码"></el-input>
      </el-form-item>

      <el-form-item label="角色状态" prop="status">
        <el-radio-group v-model.number="model.status" size="small">
          <el-radio label="启用" :value="1" border />
          <el-radio label="停用" :value="0" border />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="角色备注" prop="remark">
        <el-input type="textarea" :rows="4" resize="none" v-model.trim="model.remark" placeholder="请输入角色备注"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'RoleAction' })
import { RoleService } from '@/api/system/role.service'
import type { FormInstance, FormRules } from 'element-plus'

/** 接收父组件传递的事件 */
const eimts = defineEmits(['getList'])

/** 是否显示 Dialog */
const dialogVisible = ref<boolean>(false)
const width = computed(() => (useAppStore().isDesktop ? '600px' : 'calc(100% - 32px)'))
/** 当前是否为编辑状态 */
const isUpdate = computed(() => Reflect.has(model.value, 'id'))
/** 对话框 Dialog 的标题 */
const title = computed(() => (isUpdate.value ? '更新角色信息' : '新增角色信息'))
/** 表单提交成功后的提示语 */
const submitMessage = computed(() => `角色${isUpdate.value ? '更新' : '新增'}成功`)
/** 角色表单信息 */
const defaultModel: Partial<RoleEntity> = { status: 1 }
const model = ref({ ...defaultModel } as RoleEntity)
/** 角色表单实例 */
const formInstance = useTemplateRef<FormInstance>('formRef')
/** 表单校验规则配置 */
const rules: FormRules<RoleEntity> = {
  name: [{ required: true, message: '角色名称不可为空', trigger: 'blur' }],
  code: [{ required: true, message: '角色编码不可为空', trigger: 'blur' }],
  remark: [{ required: true, message: '角色备注不可为空', trigger: 'blur' }],
  status: [{ required: true, message: '角色状态不可为空', trigger: 'blur' }],
}

/** 处理弹框打开的回调 */
async function handleOpen(roleId?: string) {
  dialogVisible.value = true
  if (roleId) model.value = await RoleService.findOneById({ roleId })
}

/** 处理弹框关闭前的回调 */
function handleClose() {
  formInstance.value?.resetFields()
  model.value = defaultModel as RoleEntity
  dialogVisible.value = false
}

/** 处理表单提交的操作 */
async function handleSubmit() {
  try {
    await formInstance.value?.validate()
    isUpdate.value ? await RoleService.update(model.value) : await RoleService.create(model.value)
    eimts('getList')
    useModal().msgSuccess(submitMessage.value)
    handleClose()
  } catch (error: any) {
    console.log('error: ', error.message || error)
  }
}

defineExpose({ handleOpen })
</script>

<style lang="scss" scoped></style>
