<template>
  <div class="ap-view-pdf flex flex-col h-full" v-loading="loading" element-loading-text="正在加载..." element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="flex items-center pt-8px px-16px">
      <el-button size="small" @click="handlePrev" :disabled="pageNo === 0">上一页</el-button>
      <el-button size="small" disabled>{{ pageNo }} / {{ total }}</el-button>
      <el-button size="small" @click="handleNext" :disabled="pageNo === 0">下一页</el-button>
      <el-button size="small" @click="handleDownload">下载</el-button>
      <el-button size="small" @click="handlePrint">打印</el-button>

      <div class="ml-auto flex-center">
        <div class="flex-center">
          <el-checkbox v-model="isShowTotal" @change="handleShowTotal" />
          <span class="ml-6px">显示所有页面</span>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <el-divider class="mt-8px! mb-0!" />

    <div class="flex flex-col items-center overflow-y-auto">
      <vue-pdf-embed ref="pdfRef" :style="{ width }" :page="pageNo" :scale :source @rendered="handleDocumentRender" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ApViewPdfEmbed' })
import VuePdfEmbed from 'vue-pdf-embed'

const props = defineProps({
  /** PDF 文件的路径，支持本地文件路径或网络 URL */
  source: { type: String, required: true },
  /** 设置 PDF 显示区域的宽度，默认 100% */
  width: { type: String, default: '100%' },
  /** 下载的 PDF 的文件名 默认当前时间戳 */
  fileName: { type: String, default: Date.now().toString() },
})

/** 获取 PDF 组件实例 方便调用其上的方法 */
const pdfRef = ref<InstanceType<typeof VuePdfEmbed>>()
/** PDF 加载状态 */
const loading = ref(true)
/** PDF 当前页码数 */
const pageNo = ref<number>(1)
/** PDF 总页码数 */
const total = ref<number>(0)
/** PDF 缩放系数 */
const scale = ref(window.devicePixelRatio)
/** 是否显示全部页面 */
const isShowTotal = ref(false)

/** 处理 PDF 文档加载完毕操作 */
function handleDocumentRender() {
  loading.value = false
  if (!pdfRef.value || !pdfRef.value.doc) return
  total.value = pdfRef.value.doc.numPages
}

/** 处理显示全部页面的操作 */
function handleShowTotal() {
  pageNo.value = isShowTotal.value ? 0 : 1
}

/** 处理点击上一页的操作 */
function handlePrev() {
  if (pageNo.value > 1) pageNo.value--
}

/** 处理点击下一页的操作 */
function handleNext() {
  if (pageNo.value < total.value) pageNo.value++
}

/** 处理下载的操作 */
function handleDownload() {
  pdfRef.value?.download(props.fileName)
}

async function handlePrint() {
  // 如果在打印时，打印页面是本身的两倍，在打印配置 页面 设置 仅限页码为奇数的页面 即可
  try {
    useModal().showLoading('正在打印，请稍候')
    await pdfRef.value?.print()
    useModal().closeLoading()
  } catch (error) {
    useModal().closeLoading()
    useModal().msgError(`打印失败，请检查后重试`)
  }
}
</script>

<style lang="scss" scoped>
.ap-view-pdf {
  border-radius: 8px;
  background-color: #fff;
  box-shadow: var(--el-box-shadow);
  overflow: hidden;
}
</style>
