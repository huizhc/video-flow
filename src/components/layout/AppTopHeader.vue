<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NDropdown, NIcon, NLayoutHeader } from 'naive-ui'
import {
  ArrowLeft,
  ChevronDown,
  Currency,
  Document,
  DocumentTasks,
  Gift,
  Headset,
  Language,
} from '@vicons/carbon'
import { useAuthStore } from '@/stores/auth'
import { useSupportStore } from '@/stores/support'

const props = defineProps({
  logoRouteName: {
    type: String,
    default: 'tools-all',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const supportStore = useSupportStore()

const isLoggedIn = computed(() => auth.isLoggedIn)

const langOptions = [
  { label: '简体中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]

function onLoginClick() {
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}

function goTerms() {
  const href = router.resolve({ name: 'terms' }).href
  window.open(href, '_blank', 'noopener,noreferrer')
}

function goPrivacy() {
  const href = router.resolve({ name: 'privacy' }).href
  window.open(href, '_blank', 'noopener,noreferrer')
}

function goInvite() {
  const href = router.resolve({ name: 'invite' }).href
  window.open(href, '_blank', 'noopener,noreferrer')
}

function goRechargeTab() {
  router.push({ name: 'personal-center', query: { tab: 'recharge' } })
}

function openSupportQr() {
  supportStore.openQr()
}

function goLogoTarget() {
  router.push({ name: props.logoRouteName })
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push({ name: props.logoRouteName })
}
</script>

<template>
  <n-layout-header
    bordered
    class="flex h-14 shrink-0 items-center justify-between border-[#ffffff0f] bg-[#121212] px-4"
  >
    <div class="flex items-center gap-[10px]">
      <button
        v-if="showBackButton"
        type="button"
        class="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full border border-white/8 bg-white/4 p-0 text-white/72 transition hover:bg-white/8 hover:text-white"
        @click="goBack"
      >
        <n-icon :size="18" :component="ArrowLeft" />
      </button>

      <button
        type="button"
        class="flex cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left"
        @click="goLogoTarget"
      >
        <span
          class="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#14b8a6] via-[#0ea5e9] to-[#8b5cf6] shadow-lg shadow-teal-900/30"
        />
        <span class="text-sm font-semibold tracking-tight text-white">AIKC</span>
        <span
          class="rounded bg-gradient-to-r from-[#0d9488] to-[#0ea5e9] px-1.5 py-0.5 text-[10px] font-semibold text-white"
        >
          AI
        </span>
      </button>
    </div>

    <div class="flex items-center gap-5 text-sm text-gray-400">
      <button
        type="button"
        class="top-nav-text-button top-nav-placeholder-button"
        @click="goTerms"
      >
        <n-icon :size="16" :component="DocumentTasks" />
        服务条款
      </button>
      <button
        type="button"
        class="top-nav-text-button top-nav-placeholder-button"
        @click="goPrivacy"
      >
        <n-icon :size="16" :component="Document" />
        隐私政策
      </button>

      <template v-if="!isLoggedIn">
        <n-button type="primary" size="small" @click="onLoginClick">登录</n-button>
      </template>
      <template v-else>
        <button
          type="button"
          class="top-nav-text-button top-nav-placeholder-button"
          @click="openSupportQr"
        >
          <n-icon :size="16" :component="Headset" />
          联系客服
        </button>
        <button
          type="button"
          class="top-nav-text-button top-nav-placeholder-button"
          @click="goInvite"
        >
          <n-icon :size="16" :component="Gift" />
          邀请有礼
        </button>
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-amber-400/90 transition-colors hover:text-amber-300"
          @click="goRechargeTab"
        >
          <n-icon :size="16" :component="Currency" />
          5000 算力
        </button>
      </template>

      <n-dropdown trigger="click" :options="langOptions">
        <n-button quaternary size="small" class="!text-gray-300">
          <span class="flex items-center gap-1">
            <n-icon :size="16" :component="Language" />
            简体中文
            <n-icon :size="14" :component="ChevronDown" />
          </span>
        </n-button>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>
