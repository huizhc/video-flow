import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/overview' },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
    meta: { title: '概览', icon: '📊' },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: 'Agent对话', icon: '💬' },
  },
  {
    path: '/agents',
    name: 'agents',
    component: () => import('@/views/AgentsView.vue'),
    meta: { title: 'Agent管理', icon: '🔧' },
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@/views/KnowledgeView.vue'),
    meta: { title: '知识库', icon: '📚' },
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('@/views/SkillsView.vue'),
    meta: { title: '技能管理', icon: '🧩' },
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('@/views/FilesView.vue'),
    meta: { title: '文件中心', icon: '📁' },
  },
  {
    path: '/rules',
    name: 'rules',
    component: () => import('@/views/RulesView.vue'),
    meta: { title: '业务规则', icon: '📋' },
  },
  // {
  //   path: '/members',
  //   name: 'members',
  //   component: () => import('@/views/MembersView.vue'),
  //   meta: { title: '成员管理', icon: '👥' },
  // },
  {
    path: '/spaces',
    name: 'spaces',
    component: () => import('@/views/BusinessSpacesView.vue'),
    meta: { title: '业务工作坊', icon: '🗂️' },
  },
  {
    path: '/space-settings',
    name: 'space-settings',
    component: () => import('@/views/SpaceSettingsView.vue'),
    meta: { title: '空间设置', icon: '⚙️' },
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('@/views/SystemView.vue'),
    meta: { title: '系统管理', icon: '🗄️' },
  },
]

export default createRouter({
  history: createWebHashHistory('/agent/'),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
