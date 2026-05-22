<script setup>
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NMenu,
  NScrollbar,
} from 'naive-ui'
import {
  Apps,
  Cloud,
  Folder,
  Grid,
  Image,
  Menu,
  Music,
  Task,
  TextCreation,
  User,
  Video,
} from '@vicons/carbon'
import AppTopHeader from '@/components/layout/AppTopHeader.vue'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const activeKey = ref(null)

const showSider = computed(() => route.meta.showSider !== false)
const showBackButton = computed(() => route.meta.showBackButton === true)

watch(
  () => route.meta.menuKey,
  (k) => {
    if (typeof k === 'string') activeKey.value = k
    else activeKey.value = null
  },
  { immediate: true }
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
  // ].filter((g) => g.key !== 'group-project' || isLoggedIn.value))
]) // TODO

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
</script>

<template>
  <n-layout class="h-screen bg-[#141414]">
    <app-top-header
      logo-route-name="tools-all"
      :show-back-button="showBackButton"
    />

    <n-layout
      v-if="showSider"
      has-sider
      class="bg-[#141414]"
      style="height: calc(100vh - 3.5rem)"
    >
      <n-layout-sider
        v-model:collapsed="collapsed"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        class="bg-[#1b1b1d]! border-[#ffffff10]!"
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
          class="px-2 py-2 text-[10px] text-white/50 text-center leading-snug border-t border-[#ffffff0f]"
        >
          © 2026 AIKC
        </div>
        <div
          class="p-3 border-t border-[#ffffff0f] shrink-0 flex justify-center"
        >
          <n-button circle quaternary @click="collapsed = !collapsed">
            <n-icon :size="20" :component="Menu" />
          </n-button>
        </div>
      </n-layout-sider>

      <n-layout-content class="bg-[#141414] overflow-auto">
        <router-view />
      </n-layout-content>
    </n-layout>

    <n-layout-content
      v-else
      class="h-[calc(100vh-3.5rem)] overflow-auto bg-[#141414]"
    >
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
