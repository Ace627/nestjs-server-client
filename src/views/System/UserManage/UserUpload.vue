<template>
  <el-dialog v-model="dialogVisible" title="用户数据导入" width="500" :before-close="handleClose" :show-close="false" draggable class="custom-dialog">
    <el-upload ref="uploadRef" accept=".xls, .xlsx" :disabled="isUploading" :limit="1" action="#" :http-request="handleFileUpload" :auto-upload="false" drag>
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>

      <div class="el-upload__text">将文件拖到此处，或 <span class="c-primary">点击上传</span></div>

      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="flex-center">
            <el-checkbox v-model="updateSupport" :true-value="1" :false-value="0" />
            <span class="ml-8px">是否更新已经存在的用户数据</span>
          </div>
          <div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" class="font-size-inherit!" @click="downloadTemplate">下载模板</el-link>
          </div>
        </div>
      </template>
    </el-upload>

    <div slot="footer" class="dialog-footer mt-10px">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserUpload' })
import { UserService } from '@/api/system/user.service'
import type { UploadInstance, UploadRequestHandler } from 'element-plus'

/** 接收父组件传递的事件 */
const eimts = defineEmits(['getList'])

/** 是否显示 Dialog */
const dialogVisible = ref<boolean>(false)
/** 上传的地址 */
const isUploading = ref(false)
const updateSupport = ref(0)
const uploadInstance = useTemplateRef<UploadInstance>('uploadRef')

function handleOpen() {
  dialogVisible.value = true
}

function handleClose() {
  uploadInstance.value?.clearFiles()
  dialogVisible.value = false
}

const handleFileUpload: UploadRequestHandler = async (options) => {
  try {
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', options.file)
    const data = await UserService.importExcel(formData, { updateSupport: updateSupport.value })
    useModal().msgSuccess('上次成功')
    options.onSuccess(data) // 上传成功的图片会显示绿色的对勾
    isUploading.value = false
    handleClose()
    eimts('getList')
  } catch (error: any) {
    isUploading.value = false
    options.onError(error)
  }
}

function downloadTemplate() {
  UserService.downloadExcelTemplate('用户导入模板.xlsx')
}

/** 提交上传文件 */
function handleSubmit() {
  uploadInstance.value?.submit()
}

defineExpose({ handleOpen })
</script>

<style lang="scss" scoped></style>
