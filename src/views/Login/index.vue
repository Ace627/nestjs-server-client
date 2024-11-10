<template>
  <div class="login-container flex-center">
    <el-form ref="loginFormRef" :model="loginInfo" :rules="loginRules">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginInfo.username" placeholder="账号">
          <template #prefix> <IconFont name="User" /> </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginInfo.password" show-password placeholder="密码">
          <template #prefix> <IconFont name="Lock" /> </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <div class="flex items-center w-full">
          <el-input v-model="loginInfo.captcha" placeholder="请输入验证码">
            <template #prefix> <IconFont name="Guard" /> </template>
          </el-input>
          <img :src="captchaURL ?? defaultCaptcha" alt="captcha" @click="getCaptcha" class="cursor-pointer ml-10px" draggable="false" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginInfo.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item>
        <el-button :loading type="primary" class="w-full" size="large" @click.prevent="handleLogin">
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
import defaultCaptcha from '@/assets/images/default/default-captcha.png'

const { loading, captchaURL, loginInfo, loginRules, getCaptcha, handleLogin } = useLogin()

getCaptcha()
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
