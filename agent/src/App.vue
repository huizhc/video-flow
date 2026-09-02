<template>
  <div class="shell" :class="{ collapsed: ui.sidebarCollapsed }">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">{{ space.space.icon }}</div>
        <div v-if="!ui.sidebarCollapsed" class="brand-text">
          <div class="brand-name">{{ space.space.name }}</div>
          <div class="brand-sub">{{ space.space.subtitle }}</div>
        </div>
      </div>

      <nav class="menu">
        <template v-for="(item, index) in menu" :key="item.path">
          <div v-if="index === 2" class="menu-divider"></div>
          <router-link :to="item.path" class="menu-item" :title="item.title">
            <span class="mi-icon">{{ item.icon }}</span>
            <span v-if="!ui.sidebarCollapsed" class="mi-text">{{ item.title }}</span>
          </router-link>
        </template>
        <div id="sidebar-extra" class="sidebar-extra"></div>
      </nav>

      <div class="user" @click="accountOpen = true">
        <div class="avatar">{{ space.user.name.slice(0, 1) }}</div>
        <div v-if="!ui.sidebarCollapsed" class="user-text">
          <div class="user-name">{{ space.user.name }}</div>
          <div class="user-role">{{ space.roleLabel(space.user.role) }}</div>
        </div>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <button class="collapse" @click="ui.toggleSidebar()">☰</button>
        <span class="page-icon">{{ route.meta.icon }}</span>
        <span class="page-title">{{ route.meta.title }}</span>
        <span class="spacer"></span>
        <span class="clock">{{ clock }}</span>
        <div class="logo">
        </div>
      </header>

      <section class="content">
        <router-view />
      </section>
    </div>

    <BaseModal v-if="accountOpen" title="账号信息" :width="420" @close="accountOpen = false">
      <div class="kv">
        <div class="kv-item"><div class="k">姓名</div><div class="v">{{ space.user.name }}</div></div>
        <div class="kv-item"><div class="k">账号</div><div class="v">{{ space.user.account }}</div></div>
        <div class="kv-item"><div class="k">角色</div><div class="v">{{ space.roleLabel(space.user.role) }}</div></div>
        <div class="kv-item"><div class="k">加入时间</div><div class="v">{{ formatDate(space.user.joinedAt) }}</div></div>
      </div>
      <div class="acct-tags">
        <div class="k">业务标签</div>
        <div class="row" style="flex-wrap: wrap; margin-top: 6px">
          <span v-for="tag in space.user.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          <span v-if="!space.user.tags.length" class="section-desc">未分配业务标签</span>
        </div>
      </div>
      <template #footer>
        <button class="btn" @click="accountOpen = false">关闭</button>
        <button class="btn btn-primary" @click="goMembers">前往成员管理</button>
      </template>
    </BaseModal>

    <ConfirmDialog />
    <ToastHost />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ToastHost from '@/components/ToastHost.vue'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'

const ORDER = [
  '/overview',
  '/chat',
  '/agents',
  '/knowledge',
  '/skills',
  '/files',
  '/rules',
  '/members',
  '/spaces',
  '/system'
]

const route = useRoute()
const router = useRouter()
const space = useSpaceStore()
const ui = useUiStore()
const accountOpen = ref(false)
const clock = ref('')
let timer = null

const menu = computed(() =>
  router.getRoutes()
    .filter((r) => r.meta?.title)
    .map((r) => ({ path: r.path, title: r.meta.title, icon: r.meta.icon }))
    .sort((a, b) => ORDER.indexOf(a.path) - ORDER.indexOf(b.path))
)

function tick() {
  const d = new Date()
  clock.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
    d.getSeconds()
  ).padStart(2, '0')}`
}

function goMembers() {
  accountOpen.value = false
  router.push('/members')
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.shell {
  display: flex;
  height: 100%;
}

.sidebar {
  width: var(--sidebar-w);
  flex: none;
  background: var(--bg-side);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  transition: width 0.18s;
}

.collapsed .sidebar {
  width: var(--sidebar-w-collapsed);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
}

.brand-icon {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 16px;
  background: linear-gradient(135deg, #2563eb, #22d3ee);
}

.brand-name {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.brand-sub {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 1px;
}

.menu {
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px 12px;
}

.menu-divider {
  height: 1px;
  background: var(--line);
  margin: 8px 6px;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--text-2);
  font-size: 12.5px;
  margin-bottom: 2px;
  transition: 0.14s;
}

.menu-item:hover {
  background: #101923;
  color: var(--text);
}

.menu-item.router-link-active {
  background: rgba(34, 211, 238, 0.1);
  color: #e6f9ff;
}

.menu-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  bottom: 7px;
  width: 2px;
  border-radius: 2px;
  background: var(--cyan);
}

.mi-icon {
  width: 16px;
  text-align: center;
  font-size: 12.5px;
  flex: none;
}

.sidebar-extra {
  margin-top: 10px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-top: 1px solid var(--line);
  cursor: pointer;
}

.user:hover {
  background: #101923;
}

.avatar {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11.5px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: #fff;
}

.user-name {
  font-size: 12.5px;
}

.user-role {
  font-size: 11px;
  color: var(--text-3);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: var(--topbar-h);
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px 0 12px;
  background: var(--bg-top);
  border-bottom: 1px solid var(--line);
}

.collapse {
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  border-radius: 6px;
  font-size: 13px;
}

.collapse:hover {
  background: #131c27;
  color: var(--text);
}

.page-icon {
  font-size: 12.5px;
  color: var(--cyan);
}

.page-title {
  font-size: 13px;
  font-weight: 600;
}

.spacer {
  flex: 1;
}

.clock {
  color: var(--text-3);
  font-size: 11.5px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.logo-mark {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 1px;
  font-style: italic;
}

.slash {
  color: var(--cyan);
}

.logo-cn {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.acct-tags {
  margin-top: 16px;
}

.acct-tags .k {
  color: var(--text-3);
  font-size: 11.5px;
}
</style>
