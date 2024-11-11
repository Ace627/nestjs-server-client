<template>
  <div class="login-container flex-center">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="账号">
          <template #prefix> <IconFont name="User" /> </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" show-password placeholder="密码">
          <template #prefix> <IconFont name="Lock" /> </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <div class="flex items-center w-full">
          <el-input v-model="loginForm.captcha" placeholder="请输入验证码">
            <template #prefix> <IconFont name="Guard" /> </template>
          </el-input>
          <img :src="captchaURL ?? defaultCaptcha" alt="captcha" @click="getCaptcha" class="cursor-pointer ml-10px" draggable="false" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item>
        <el-button :loading type="primary" class="w-full" size="large" @click.prevent="handleLogin(loginFormRef)">
          <span>{{ loading ? `登录中...` : `登录` }}</span>
        </el-button>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="login-footer text-center">
      <span>Copyright © 2024-2024 legendary.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Login' })
import { pick } from 'lodash-es'
import { LoginService } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'
import defaultCaptcha from '@/assets/images/default/default-captcha.png'
import { getLoginInfo, removeLoginInfo, setLoginInfo } from '@/utils/cache'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 计算需要跳转的路径 */
const redirect = (route.query['redirect'] as string) ?? '/'
/** 登录表单实例 */
const loginFormRef = ref<FormInstance>()
/** 登录表单数据 */
const defaultModel: Readonly<Partial<LoginAccountDto>> = { rememberMe: false }
const loginForm = ref({ ...defaultModel } as LoginAccountDto)
/** 登录按钮 Loading */
const loading = ref<boolean>(false)
/** 验证码图片地址 */
const captchaURL = ref<string>()
/** 登录表单的校验规则 */
const loginRules: FormRules<LoginAccountDto> = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
}

/**
 * 获取图片验证码
 */
async function getCaptcha() {
  const data = await LoginService.getCaptcha()
  captchaURL.value = data.captcha
  loginForm.value.uuid = data.uuid
}

/**
 * 处理记住账号密码的操作
 */
function handleRememberMe() {
  const cacheInfo = pick(loginForm.value, ['username', 'password', 'rememberMe'])
  loginForm.value.rememberMe ? setLoginInfo(cacheInfo) : removeLoginInfo()
}

/**
 * 处理登录的操作
 */
async function handleLogin(formEl: FormInstance | undefined) {
  try {
    if (!formEl) return
    await formEl?.validate()
    loading.value = true
    await userStore.login(loginForm.value)
    handleRememberMe()
    await router.replace(redirect)
    loading.value = false
  } catch (error) {
    loading.value = false
    // getCaptcha() // 登录失败刷新验证码
  }
}

onMounted(() => {
  getCaptcha()
  Object.assign(loginForm.value, getLoginInfo())
})
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  background-image: url('../../assets/images/background/bg-image-02.jpg');
  background-size: cover;
  .el-form {
    width: 400px;
    padding: 25px 25px 5px 25px;
    border-radius: 6px;
    background-color: #fff;
    .title {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #707070;
      font-size: 20px;
      font-weight: 500;
    }
    .el-input {
      --el-input-height: 38px;
    }
  }
  .login-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: var(--el-color-white);
    font-size: var(--el-font-size-extra-small);
    letter-spacing: 1px;
  }
}
</style>
