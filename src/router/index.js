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
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/invite',
      name: 'invite',
      component: () => import('@/views/InviteView.vue'),
      meta: { menuKey: null },
    },
    {
      path: '/tool',
      component: () => import('@/layouts/ToolLayout.vue'),
      children: [
        {
          path: 'remove-watermark',
          name: 'tool-remove-watermark',
          component: () => import('@/views/RemoveWatermarkView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'video-translate-voice',
          name: 'tool-video-translate-voice',
          component: () => import('@/views/VideoTranslateVoiceView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'speech-subtitle',
          name: 'tool-speech-subtitle',
          component: () => import('@/views/SpeechSubtitleView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'general-translate',
          name: 'tool-general-translate',
          component: () => import('@/views/GeneralTranslateView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'batch-video-mix',
          name: 'tool-batch-video-mix',
          component: () => import('@/views/BatchVideoMixView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'batch-video-mix/project',
          name: 'tool-batch-video-mix-project',
          component: () => import('@/views/BatchVideoMixProjectView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'script-shot-analysis',
          name: 'tool-script-shot-analysis',
          component: () => import('@/views/ScriptShotAnalysisView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'text-to-speech',
          name: 'tool-text-to-speech',
          component: () => import('@/views/TextToSpeechView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'audio-driven-avatar',
          name: 'tool-audio-driven-avatar',
          component: () => import('@/views/AudioDrivenAvatarView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'script-driven-avatar',
          name: 'tool-script-driven-avatar',
          component: () => import('@/views/ScriptDrivenAvatarView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'text-to-video-toolkit',
          name: 'tool-text-to-video-toolkit',
          component: () => import('@/views/TextToVideoToolkitView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'voice-clone-audio',
          name: 'tool-voice-clone-audio',
          component: () => import('@/views/VoiceCloneAudioView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'nurture-video',
          name: 'tool-nurture-video',
          component: () => import('@/views/NurtureVideoView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'seedance-video',
          name: 'tool-seedance-video',
          component: () => import('@/views/SeedanceVideoView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'veo31-video',
          name: 'tool-veo31-video',
          component: () => import('@/views/Veo31VideoView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'quick-split-video',
          name: 'tool-quick-split-video',
          component: () => import('@/views/QuickSplitVideoView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'video-script-writer',
          name: 'tool-video-script-writer',
          component: () => import('@/views/VideoScriptWriterView.vue'),
          meta: { menuKey: null },
        },
        {
          path: 'title-and-script-copy',
          name: 'tool-title-and-script-copy',
          component: () => import('@/views/TitleAndScriptCopyView.vue'),
          meta: { menuKey: null },
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'my-tasks',
          component: () => import('@/views/MyTasksView.vue'),
          // meta: { menuKey: 'my-tasks', requiresAuth: true },
          meta: { menuKey: 'my-tasks' },
        },
        {
          path: 'task-square',
          name: 'task-square',
          component: () => import('@/views/TaskSquareView.vue'),
          // meta: { menuKey: 'task-square', requiresAuth: true },
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
          // meta: { menuKey: 'cloud', requiresAuth: true },
          meta: { menuKey: 'cloud' },
        },
        {
          path: 'background-tasks',
          name: 'background-tasks',
          component: () => import('@/views/BackgroundTasksView.vue'),
          // meta: { menuKey: 'background', requiresAuth: true },
          meta: { menuKey: 'background' },
        },
        {
          path: 'profile',
          name: 'personal-center',
          component: () => import('@/views/PersonalCenterView.vue'),
          // meta: { menuKey: 'profile', requiresAuth: true },
          meta: { menuKey: 'profile' },
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
