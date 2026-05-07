import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'my-tasks',
          component: () => import('@/views/MyTasksView.vue'),
          meta: { menuKey: 'my-tasks' },
        },
        {
          path: 'task-square',
          name: 'task-square',
          component: () => import('@/views/TaskSquareView.vue'),
          meta: { menuKey: 'task-square' },
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
          meta: { menuKey: 'cloud' },
        },
        {
          path: 'background-tasks',
          name: 'background-tasks',
          component: () => import('@/views/BackgroundTasksView.vue'),
          meta: { menuKey: 'background' },
        },
        {
          path: 'profile',
          name: 'personal-center',
          component: () => import('@/views/PersonalCenterView.vue'),
          meta: { menuKey: 'profile' },
        },
      ],
    },
  ],
})

export default router
