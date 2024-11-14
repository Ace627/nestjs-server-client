<template>
  <el-dialog v-model="visible" :title :width :before-close="handleClose" :show-close="false" draggable class="custom-dialog">
    <el-form :model :rules label-width="80px" ref="formRef">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select v-model="model.parentId" check-strictly node-key="id" :data="menuTreeSelectOption" :props="{ label: 'title' }" place="请选择上级菜单" clearable>
            </el-tree-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model.trim="model.type" size="small">
              <el-radio label="目录" value="M" border />
              <el-radio label="菜单" value="C" border />
              <el-radio label="按钮" value="F" border />
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="model.type !== 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="iconSelectRef?.reset">
              <IconSelect ref="iconSelectRef" :active-icon="model.icon" @selected="selectMenuIcon" />
              <template #reference>
                <el-input v-model.trim="model.icon" placeholder="请选择菜单图标" readonly>
                  <template #prefix> <IconFont :name="`${model.icon ? model.icon : 'Search'}`" /> </template>
                </el-input>
              </template>
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model.trim="model.title" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="order">
            <el-input-number v-model.number="model.order" controls-position="right" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="model.type !== 'F'">
          <el-form-item label="是否外链" prop="frame">
            <el-radio-group v-model="model.frame" size="small">
              <el-radio label="是" :value="1" border />
              <el-radio label="否" :value="0" border />
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="model.type !== 'F'">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model.trim="model.path" placeholder="请输入路由地址" @change="onPathChange" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="model.type === 'C' && model.frame === 0">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model.trim="model.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="model.type !== 'M'">
          <el-form-item label="权限字符" prop="permission">
            <el-input v-model.trim="model.permission" placeholder="请输入权限标识" maxlength="100" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="model.type !== 'F'">
          <el-form-item label="显示状态" prop="visible">
            <el-radio-group v-model="model.visible" size="small">
              <el-radio label="显示" :value="1" border />
              <el-radio label="隐藏" :value="0" border />
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="model.status" size="small">
              <el-radio label="正常" :value="1" border />
              <el-radio label="停用" :value="0" border />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'MenuAction' })
import { GlobalComponents } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { MenuService } from '@/api'

/** 接收父组件传递的事件 */
const eimts = defineEmits(['getList'])

const visible = ref<boolean>(false)
const width = computed(() => (useAppStore().isDesktop ? '600px' : 'calc(100% - 32px)'))
const isUpdate = computed(() => Reflect.has(model.value, 'id'))
const title = computed(() => (isUpdate.value ? '更新菜单信息' : '新增菜单信息'))
const submitMessage = computed(() => `菜单${isUpdate.value ? '更新' : '新增'}成功`)

const iconSelectRef = ref<InstanceType<GlobalComponents['IconSelect']>>() // 图标选择组件实例
const formRef = ref<FormInstance>()
const defaultModel: Partial<MenuEntity> = { status: 1, type: 'M', visible: 1, frame: 0, order: 1 }
const model = ref({ ...defaultModel } as MenuEntity)
const menuTreeSelectOption = ref<MenuEntity[]>([]) // 菜单下拉树选项
const rules: FormRules<MenuEntity> = {
  path: { required: true, message: '路由地址不可为空', trigger: 'blur' },
  order: { required: true, message: '菜单顺序不能为空', trigger: 'blur' },
  title: { required: true, message: '菜单名称不可为空', trigger: 'blur' },
}

function onPathChange() {
  if (model.value.frame === 1 || model.value.type !== 'C') return
  model.value.component = `${model.value.path.replace('/', '')}/index`
}

/**
 * 处理弹框打开的操作
 */
async function handleOpen(record?: MenuEntity) {
  const parentId = record ? (record.type === 'F' ? record.parentId : record.id) : '0'
  model.value = { ...defaultModel, parentId } as MenuEntity
  if (record && record.type === 'F') model.value.type = 'F'
  menuTreeSelectOption.value = await MenuService.findParentList()
  visible.value = true
}

/**
 * 响应父组件的编辑操作
 */
async function handleDetail(record: MenuEntity) {
  menuTreeSelectOption.value = await MenuService.findParentList()
  model.value = await MenuService.findOneById({ menuId: record.id })
  visible.value = true
}

/**
 * 处理对话框关闭的操作
 */
function handleClose() {
  formRef.value?.resetFields()
  model.value = defaultModel as MenuEntity
  visible.value = false
}

/** 选择图标 */
function selectMenuIcon(name: string) {
  model.value.icon! = name
}

/**
 * 处理表单提交的操作
 */
async function handleSubmit() {
  try {
    await formRef.value?.validate()
    isUpdate.value ? await MenuService.update(model.value) : await MenuService.create(model.value)
    useModal().msgSuccess(submitMessage.value)
    handleClose()
    eimts('getList')
  } catch (error) {
    console.log('error: ', error)
  }
}

defineExpose({ handleOpen, handleDetail })
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
