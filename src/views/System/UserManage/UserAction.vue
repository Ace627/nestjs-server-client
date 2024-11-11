<template>
  <el-dialog v-model="dialogVisible" :title :width :before-close="handleClose" :show-close="false" draggable class="custom-dialog">
    <el-form :model :rules label-width="80px" ref="formRef">
      <el-form-item label="登录账号" prop="username">
        <el-input v-model.trim="model.username" placeholder="请输入您的账号" :disabled="isUpdate"></el-input>
      </el-form-item>

      <el-form-item label="登录密码" prop="password" v-if="!isUpdate">
        <el-input type="password" v-model.trim="model.password" placeholder="请输入您的密码"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model.trim="model.realname" placeholder="请输入真实姓名"></el-input>
      </el-form-item>

      <el-form-item label="用户年龄" prop="age">
        <el-input v-model.number="model.age" placeholder="请输入您的年龄"></el-input>
      </el-form-item>

      <el-form-item label="角色分配" prop="roleIds">
        <el-select v-model="model.roleIds" multiple collapse-tags placeholder="请选择您的角色">
          <el-option v-for="(item, index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户性别" prop="gender">
        <el-radio-group v-model.number="model.gender" size="small">
          <el-radio v-for="{ label, value } in GenderOption" :key="value" :value border>{{ label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="用户状态" prop="status">
        <el-radio-group v-model.number="model.status" size="small">
          <el-radio label="启用" :value="1" border />
          <el-radio label="停用" :value="0" border />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model.trim="model.nickname" placeholder="请输入您的昵称"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.trim="model.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>

      <el-form-item label="上次更新" v-if="isUpdate">
        <el-input v-model="model.updateTime" :disabled="isUpdate"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserAction' })
import { RoleService, UserService } from '@/api'
import { GenderOption } from '@/config'
import { GenderEnum } from '@/enums'
import { validatePhone } from '@/utils/validator'
import type { FormInstance, FormRules } from 'element-plus'

/** 接收父组件传递的事件 */
const eimts = defineEmits(['getList'])

/** 是否显示 Dialog */
const dialogVisible = ref<boolean>(false)
const width = computed(() => (useAppStore().isDesktop ? '600px' : 'calc(100% - 32px)'))
/** 当前是否为编辑状态 */
const isUpdate = computed(() => Reflect.has(model.value, 'id'))
/** 对话框 Dialog 的标题 */
const title = computed(() => (isUpdate.value ? '更新用户信息' : '新增用户信息'))
/** 表单提交成功后的提示语 */
const submitMessage = computed(() => `用户${isUpdate.value ? '更新' : '新增'}成功`)
/** 用户表单默认信息  */
const defaultModel: Readonly<Partial<UserEntity>> = { gender: GenderEnum.UNKNOWN, password: '123456', status: 1 }
/** 用户表单信息 */
const model = ref({ ...defaultModel } as UserEntity)
/** 用户表单实例 */
const formInstance = useTemplateRef<FormInstance>('formRef')
/** 表单校验规则配置 */
const rules: FormRules<UserEntity> = {
  username: [{ required: true, message: '登录账号不可为空', trigger: 'blur' }],
  password: [{ required: true, message: '登录密码不可为空', trigger: 'blur' }],
  realname: [{ required: true, message: '真实姓名不可为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不可为空', trigger: 'blur' }],
  phone: [
    { required: true, message: '手机号码不可为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  age: [{ required: true, message: '用户年龄不可为空', trigger: 'blur' }],
}

const roleList = ref<RoleEntity[]>([])
async function getRoleList() {
  const data = await RoleService.findAll()
  roleList.value = data
}

/** 处理弹框打开的回调 */
async function handleOpen(userId?: string) {
  dialogVisible.value = true
  if (userId) model.value = await UserService.findOneById({ userId })
  getRoleList()
}

/** 处理弹框关闭前的回调 */
function handleClose() {
  formInstance.value?.resetFields()
  model.value = { ...defaultModel } as UserEntity
  dialogVisible.value = false
}

/** 处理表单提交的操作 */
async function handleSubmit() {
  try {
    await formInstance.value?.validate()
    isUpdate.value ? await UserService.update(model.value) : await UserService.create(model.value)
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
