<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NDropdown, NForm, NFormItem, NInput } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  account: '',
  password: '',
})

const loading = ref(false)

const canSubmit = computed(() => form.account.trim() && form.password.trim())

const langOptions = [
  { label: '简体中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]

async function onSubmit() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  try {
    const ok = auth.login({ account: form.account.trim(), password: form.password })
    if (!ok) return
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } finally {
    loading.value = false
  }
}

function noop() {}

function goRegister() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push({ name: 'register', query: { redirect } })
}

function goForgotPassword() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push({ name: 'forgot-password', query: { redirect } })
}
</script>

<template>
  <div class="min-h-screen bg-[#101010] text-white overflow-hidden">
    <div class="fixed right-6 top-6 z-10 text-white/80">
      <n-dropdown trigger="click" :options="langOptions" @select="noop">
        <button
          type="button"
          class="flex items-center gap-2 text-sm hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <span class="inline-flex i-carbon-language text-lg" />
          简体中文
        </button>
      </n-dropdown>
    </div>

    <div class="h-screen grid grid-cols-1 lg:grid-cols-2">
      <section
        class="relative hidden lg:flex items-center justify-center bg-[#0f0f0f]"
        style="box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.06)"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#0f0f0f] to-[#000000]" />
        <div class="absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_40%,rgba(255,255,255,0.10),rgba(0,0,0,0))]" />
        <div class="relative w-full max-w-[560px] px-10">
          <div class="text-4xl font-semibold tracking-wide">AIKC工具箱</div>
          <div class="mt-4 text-sm text-white/70 leading-6">
            手机刮器，以一敌百，单枪匹马搞跨境
          </div>
          <div class="mt-7">
            <button
              type="button"
              class="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-500 transition-colors text-sm font-semibold"
            >
              了解更多
            </button>
          </div>
        </div>

        <svg
          class="absolute -left-16 -bottom-36 w-[520px] h-[520px] opacity-70"
          viewBox="0 0 520 520"
          fill="none"
        >
          <circle cx="260" cy="260" r="220" stroke="#14b8a6" stroke-width="1" opacity="0.55" />
          <circle cx="260" cy="260" r="260" stroke="#0ea5e9" stroke-width="1" opacity="0.35" />
          <circle cx="260" cy="260" r="300" stroke="#ef4444" stroke-width="1" opacity="0.25" />
        </svg>
      </section>

      <section class="flex items-center justify-center bg-[#2a2a2a] px-6">
        <div class="w-full max-w-[420px]">
          <div class="text-center">
            <div class="text-xl font-semibold tracking-wide">光荣的奋斗者</div>
            <div class="mt-2 text-sm text-white/60">欢迎回来</div>
          </div>

          <div class="mt-8">
            <n-form :model="form" size="large" label-placement="left" :show-label="false">
              <n-form-item path="account">
                <n-input
                  v-model:value="form.account"
                  placeholder="手机号/账号"
                  class="auth-input bg-transparent! [&>div]:bg-#ffffff1a!"
                  @keyup.enter="onSubmit"
                />
              </n-form-item>
              <n-form-item path="password">
                <n-input
                  v-model:value="form.password"
                  type="password"
                  show-password-on="click"
                  placeholder="密码"
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
                登录
              </n-button>

              <div class="mt-4 flex items-center justify-between text-sm text-white/60">
                <button type="button" class="auth-link" @click="goForgotPassword">
                  忘记密码？
                </button>
                <button
                  type="button"
                  class="auth-link-primary"
                  @click="goRegister"
                >
                  注册
                </button>
              </div>

              <div class="mt-8 text-center text-[12px] text-white/40">
                用户服务协议 <span class="mx-2 opacity-60">|</span> 隐私与 Cookie 政策
              </div>
            </n-form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.auth-input :deep(.n-input__border),
.auth-input :deep(.n-input__state-border) {
  border-radius: 9999px;
}

.auth-input :deep(.n-input) {
  --n-border: 1px solid rgba(255, 255, 255, 0.12);
  --n-border-hover: 1px solid rgba(255, 255, 255, 0.18);
  --n-border-focus: 1px solid rgba(20, 184, 166, 0.65);
  --n-color: rgba(17, 24, 39, 0);
  --n-text-color: rgba(255, 255, 255, 0.85);
  --n-placeholder-color: rgba(255, 255, 255, 0.3);
  --n-caret-color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
}

.auth-input :deep(.n-input__input-el) {
  height: 44px;
}

.auth-submit {
  --n-color: #0f8b8d;
  --n-color-hover: #12a2a4;
  --n-color-pressed: #0b6e70;
  --n-border: 1px solid transparent;
  --n-text-color: rgba(255, 255, 255, 0.92);
}

.auth-link {
  color: rgba(255, 255, 255, 0.55);
  transition: color 150ms ease;
}

.auth-link:hover {
  color: rgba(45, 212, 191, 0.95);
}

.auth-link-primary {
  color: rgba(45, 212, 191, 0.95);
  transition: color 150ms ease;
}

.auth-link-primary:hover {
  color: rgba(94, 234, 212, 0.95);
}
</style>
