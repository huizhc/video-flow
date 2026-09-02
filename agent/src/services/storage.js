const PREFIX = 'soa.space.'

const memory = new Map()

function hasLocalStorage() {
  try {
    const k = PREFIX + '__probe'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch (e) {
    return false
  }
}

const useLocal = typeof window !== 'undefined' && hasLocalStorage()

function rawGet(key) {
  return useLocal ? window.localStorage.getItem(PREFIX + key) : memory.get(key) ?? null
}

function rawSet(key, value) {
  if (useLocal) window.localStorage.setItem(PREFIX + key, value)
  else memory.set(key, value)
}

function rawRemove(key) {
  if (useLocal) window.localStorage.removeItem(PREFIX + key)
  else memory.delete(key)
}

export function read(key, fallback) {
  const raw = rawGet(key)
  if (raw === null || raw === undefined) return fallback
  try {
    return JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

export function write(key, value) {
  rawSet(key, JSON.stringify(value))
}

export function keys() {
  if (!useLocal) return [...memory.keys()]
  const out = []
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i)
    if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length))
  }
  return out
}

export function snapshot() {
  const data = {}
  keys().forEach((k) => {
    data[k] = read(k, null)
  })
  return {
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    data
  }
}

export function restore(payload) {
  if (!payload || typeof payload.data !== 'object' || payload.data === null) {
    throw new Error('文件内容不是有效的数据快照')
  }
  keys().forEach(rawRemove)
  Object.entries(payload.data).forEach(([k, v]) => write(k, v))
}

export function clearAll() {
  keys().forEach(rawRemove)
}

export function usedBytes() {
  return keys().reduce((sum, k) => sum + (rawGet(k) || '').length, 0)
}

let counter = 0

export function uid(prefix = 'id') {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
