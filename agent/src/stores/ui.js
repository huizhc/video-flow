import { defineStore } from 'pinia'
import { ref } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  const confirmState = ref(null)
  const sidebarCollapsed = persisted('ui.sidebarCollapsed', false)

  function notify(message, type = 'success') {
    const id = uid('toast')
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 2600)
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function confirm(options) {
    return new Promise((resolve) => {
      confirmState.value = {
        title: '操作确认',
        message: '',
        confirmText: '确认',
        cancelText: '取消',
        danger: false,
        requireText: '',
        input: '',
        resolve
      }
      Object.assign(confirmState.value, options)
    })
  }

  function closeConfirm(result) {
    const pending = confirmState.value
    confirmState.value = null
    if (pending) pending.resolve(result)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { toasts, confirmState, sidebarCollapsed, notify, dismiss, confirm, closeConfirm, toggleSidebar }
})
