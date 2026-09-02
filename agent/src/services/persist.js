import { ref, watch } from 'vue'
import { read, write } from './storage'
import { KEYS, buildSeed } from './seed'

export function ensureInitialized() {
  const meta = read(KEYS.meta, null)
  if (meta) return
  const data = buildSeed()
  Object.entries(data).forEach(([key, value]) => write(key, value))
}

export function resetToInitial() {
  const data = buildSeed()
  Object.entries(data).forEach(([key, value]) => write(key, value))
}

export function persisted(key, fallback) {
  const state = ref(read(key, fallback))
  watch(state, (value) => write(key, value), { deep: true })
  return state
}

export function reloadPersisted(state, key, fallback) {
  state.value = read(key, fallback)
}
