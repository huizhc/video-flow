<script setup>
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NDropdown,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NScrollbar,
} from 'naive-ui'
import {
  Apps,
  ChevronDown,
  Cloud,
  Currency,
  Document,
  DocumentTasks,
  Folder,
  Gift,
  Grid,
  Headset,
  Image,
  Language,
  Menu,
  Music,
  Task,
  TextCreation,
  User,
  Video,
} from '@vicons/carbon'
import { useAuthStore } from '@/stores/auth'
import { useSupportStore } from '@/stores/support'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const supportStore = useSupportStore()

const isLoggedIn = computed(() => auth.isLoggedIn)

const collapsed = ref(false)
const activeKey = ref(null)

const langOptions = [
  { label: '简体中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]

watch(
  () => route.meta.menuKey,
  (k) => {
    if (typeof k === 'string') activeKey.value = k
    else activeKey.value = null
  },
  { immediate: true },
)

function menuIcon(IconComp) {
  return () => h(NIcon, { size: 18, component: IconComp })
}

const menuOptions = computed(() => [
  {
    type: 'group',
    label: '项目',
    key: 'group-project',
    children: [
      { label: '任务广场', key: 'task-square', icon: menuIcon(Grid) },
      { label: '我的任务', key: 'my-tasks', icon: menuIcon(Task) },
    ],
  },
  {
    type: 'group',
    label: '工具',
    key: 'group-tools',
    children: [
      { label: '全部', key: 'all-catalog', icon: menuIcon(Folder) },
      { label: '文字工具', key: 'text-tools', icon: menuIcon(TextCreation) },
      { label: '图片工具', key: 'image-tools', icon: menuIcon(Image) },
      { label: '音频工具', key: 'audio-tools', icon: menuIcon(Music) },
      { label: '视频工具', key: 'video-tools', icon: menuIcon(Video) },
    ],
  },
  {
    type: 'group',
    label: '其他',
    key: 'group-other',
    children: [
      { label: '云盘空间', key: 'cloud', icon: menuIcon(Cloud) },
      { label: '后台任务', key: 'background', icon: menuIcon(Apps) },
      { label: '个人中心', key: 'profile', icon: menuIcon(User) },
    ],
  },
].filter((g) => g.key !== 'group-project' || isLoggedIn.value))

const menuRouteByKey = {
  'my-tasks': 'my-tasks',
  'task-square': 'task-square',
  'all-catalog': 'tools-all',
  'text-tools': 'tools-text',
  'image-tools': 'tools-image',
  'audio-tools': 'tools-audio',
  'video-tools': 'tools-video',
  cloud: 'cloud-disk',
  background: 'background-tasks',
  profile: 'personal-center',
}

function onMenuUpdate(key) {
  const name = menuRouteByKey[key]
  if (name) router.push({ name })
}

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
</script>

<template>
  <n-layout class="h-screen bg-[#121212]">
    <n-layout-header
      bordered
      class="flex items-center justify-between px-4 h-14 shrink-0 bg-[#121212] border-[#ffffff0f]"
    >
      <div class="flex items-center gap-2.5">
        <span
          class="w-9 h-9 rounded-full bg-gradient-to-br from-[#14b8a6] via-[#0ea5e9] to-[#8b5cf6] shrink-0 shadow-lg shadow-teal-900/30"
        />
        <span class="text-white font-semibold text-sm tracking-tight">AIKC</span>
        <span
          class="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]"
        >
          AI
        </span>
      </div>
      <div v-if="!isLoggedIn" class="flex items-center gap-5 text-sm text-gray-400">
        <button
          type="button"
          class="top-nav-pill-button top-nav-placeholder-button"
          @click="goTerms"
        >
          <n-icon :size="16" :component="DocumentTasks" />
          服务条款
        </button>
        <button
          type="button"
          class="top-nav-pill-button top-nav-placeholder-button"
          @click="goPrivacy"
        >
          <n-icon :size="16" :component="Document" />
          隐私政策
        </button>
        <n-button type="primary" size="small" @click="onLoginClick">登录</n-button>
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

      <div v-else class="flex items-center gap-5 text-sm text-gray-400">
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
          class="flex items-center gap-1.5 text-amber-400/90 bg-transparent border-0 p-0 cursor-pointer hover:text-amber-300 transition-colors"
          @click="goRechargeTab"
        >
          <n-icon :size="16" :component="Currency" />
          5000 算力
        </button>
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

    <n-layout has-sider class="bg-[#121212]" style="height: calc(100vh - 3.5rem)">
      <n-layout-sider
        v-model:collapsed="collapsed"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        class="bg-[#1e1e1e]! border-[#ffffff0f]!"
        content-style="display: flex; flex-direction: column; height: 100%;"
      >
        <n-scrollbar class="flex-1 min-h-0">
          <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :indent="18"
            :options="menuOptions"
            class="mt-1"
            @update:value="onMenuUpdate"
          />
        </n-scrollbar>
        <div
          v-if="!collapsed"
          class="px-2 py-2 text-[10px] text-gray-600 text-center leading-snug border-t border-[#ffffff0f]"
        >
          © 2026 AIKC
        </div>
        <div class="p-3 border-t border-[#ffffff0f] shrink-0 flex justify-center">
          <n-button circle quaternary @click="collapsed = !collapsed">
            <n-icon :size="20" :component="Menu" />
          </n-button>
        </div>
      </n-layout-sider>

      <n-layout-content class="bg-[#121212] overflow-auto">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
