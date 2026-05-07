import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'vf_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? '')

  const isLoggedIn = computed(() => Boolean(token.value))

  function login({ account, password }) {
    if (!account || !password) return false
    token.value = `mock_${Date.now()}`
    localStorage.setItem(TOKEN_KEY, token.value)
    return true
  }

  function logout() {
    token.value = ''
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, isLoggedIn, login, logout }
})
