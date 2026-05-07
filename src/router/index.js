import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'my-tasks',
          component: () => import('@/views/MyTasksView.vue'),
          meta: { menuKey: 'my-tasks', requiresAuth: true },
        },
        {
          path: 'task-square',
          name: 'task-square',
          component: () => import('@/views/TaskSquareView.vue'),
          meta: { menuKey: 'task-square', requiresAuth: true },
        },
        {
          path: 'tools/all',
          name: 'tools-all',
          component: () => import('@/views/ToolsCatalogView.vue'),
          meta: { menuKey: 'all-catalog', toolFilter: 'all' },
        },
        {
          path: 'tools/text',
          name: 'tools-text',
          component: () => import('@/views/ToolsCatalogView.vue'),
          meta: { menuKey: 'text-tools', toolFilter: 'text' },
        },
        {
          path: 'tools/image',
          name: 'tools-image',
          component: () => import('@/views/ToolsCatalogView.vue'),
          meta: { menuKey: 'image-tools', toolFilter: 'image' },
        },
        {
          path: 'tools/audio',
          name: 'tools-audio',
          component: () => import('@/views/ToolsCatalogView.vue'),
          meta: { menuKey: 'audio-tools', toolFilter: 'audio' },
        },
        {
          path: 'tools/video',
          name: 'tools-video',
          component: () => import('@/views/ToolsCatalogView.vue'),
          meta: { menuKey: 'video-tools', toolFilter: 'video' },
        },
        {
          path: 'cloud',
          name: 'cloud-disk',
          component: () => import('@/views/CloudDiskView.vue'),
          meta: { menuKey: 'cloud', requiresAuth: true },
        },
        {
          path: 'background-tasks',
          name: 'background-tasks',
          component: () => import('@/views/BackgroundTasksView.vue'),
          meta: { menuKey: 'background', requiresAuth: true },
        },
        {
          path: 'profile',
          name: 'personal-center',
          component: () => import('@/views/PersonalCenterView.vue'),
          meta: { menuKey: 'profile', requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!auth.isLoggedIn && to.name === 'my-tasks') return { name: 'tools-all' }

  if (!auth.isLoggedIn && to.meta?.requiresAuth) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (auth.isLoggedIn && (to.name === 'login' || to.name === 'register' || to.name === 'forgot-password')) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    return redirect
  }

  return true
})

export default router
