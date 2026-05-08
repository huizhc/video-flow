<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NDropdown, NForm, NFormItem, NInput } from 'naive-ui'

const router = useRouter()
const route = useRoute()

const form = reactive({
  phone: '',
  code: '',
  password: '',
  confirm: '',
})

const loading = ref(false)

const canSubmit = computed(() => {
  return (
    form.phone.trim() &&
    form.code.trim() &&
    form.password.trim() &&
    form.confirm.trim() &&
    form.password === form.confirm
  )
})

const langOptions = [
  { label: '简体中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]

function noop() {}

function goLogin() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push({ name: 'login', query: { redirect } })
}

async function onSubmit() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  try {
    goLogin()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-lang-switch">
      <n-dropdown trigger="click" :options="langOptions" @select="noop">
        <button type="button" class="auth-lang-button">
          <span class="inline-flex i-carbon-language text-lg" />
          简体中文
        </button>
      </n-dropdown>
    </div>

    <div class="auth-shell">
      <section class="auth-hero">
        <div class="auth-hero-overlay" />
        <div class="auth-hero-glow" />
        <div class="auth-hero-content">
          <div class="auth-hero-title">AIKC工具箱</div>
          <div class="auth-hero-desc">
            手机刮器，以一敌百，单枪匹马搞跨境
          </div>
          <button type="button" class="auth-hero-more">了解更多</button>
        </div>

        <svg
          class="auth-hero-arc"
          viewBox="0 0 520 520"
          fill="none"
        >
          <circle cx="260" cy="260" r="220" stroke="#14b8a6" stroke-width="1" opacity="0.55" />
          <circle cx="260" cy="260" r="260" stroke="#0ea5e9" stroke-width="1" opacity="0.35" />
          <circle cx="260" cy="260" r="300" stroke="#ef4444" stroke-width="1" opacity="0.25" />
        </svg>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <div class="auth-heading">
            <div class="auth-heading-title">找回密码</div>
            <div class="auth-heading-subtitle">通过手机号重置您的密码</div>
          </div>

          <div class="auth-form-wrap">
            <n-form :model="form" size="large" label-placement="left" :show-label="false">
              <n-form-item path="phone">
                <n-input
                  v-model:value="form.phone"
                  placeholder="手机号"
                  class="auth-input"
                  @keyup.enter="onSubmit"
                />
              </n-form-item>

              <n-form-item path="code">
                <div class="auth-code-row">
                  <n-input
                    v-model:value="form.code"
                    placeholder="验证码"
                    class="auth-input flex-1"
                    @keyup.enter="onSubmit"
                  />
                  <n-button
                    secondary
                    class="auth-code-btn !rounded-full !h-11 !px-4 shrink-0"
                    @click="noop"
                  >
                    获取验证码
                  </n-button>
                </div>
              </n-form-item>

              <n-form-item path="password">
                <n-input
                  v-model:value="form.password"
                  type="password"
                  show-password-on="click"
                  placeholder="新密码"
                  class="auth-input"
                  @keyup.enter="onSubmit"
                />
              </n-form-item>

              <n-form-item path="confirm">
                <n-input
                  v-model:value="form.confirm"
                  type="password"
                  show-password-on="click"
                  placeholder="确认密码"
                  class="auth-input"
                  @keyup.enter="onSubmit"
                />
              </n-form-item>

              <n-button
                type="primary"
                block
                size="large"
                class="auth-submit !rounded-full !h-11"
                :disabled="!canSubmit"
                :loading="loading"
                @click="onSubmit"
              >
                重置密码
              </n-button>

              <div class="auth-links-center">
                <button
                  type="button"
                  class="auth-link-primary"
                  @click="goLogin"
                >
                  返回登录
                </button>
              </div>
            </n-form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
