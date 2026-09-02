import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted, resetToInitial } from '@/services/persist'
import { uid, snapshot, restore, usedBytes, write } from '@/services/storage'
import { KEYS, CURRENT_USER, DEFAULT_SPACE, SERVICE_NODES, LICENSE } from '@/services/seed'
import { ROLES } from '@/services/catalog'
import { formatBytes } from '@/utils/format'

const formatKb = (bytes) => formatBytes(Math.max(bytes, 0))

export const useSpaceStore = defineStore('space', () => {
  const space = persisted(KEYS.space, { ...DEFAULT_SPACE })
  const user = persisted(KEYS.user, { ...CURRENT_USER })
  const members = persisted(KEYS.members, [{ ...CURRENT_USER }])
  const logs = persisted(KEYS.logs, [])
  const apiKeys = persisted(KEYS.apiKeys, [])
  const meta = persisted(KEYS.meta, { registrySize: 0, bootedAt: new Date().toISOString() })

  const roleLabel = (value) => ROLES.find((r) => r.value === value)?.label || value
  const memberCount = computed(() => members.value.length)
  const activeMembers = computed(() => members.value.filter((m) => m.status === 'active'))
  const registrySize = computed(() => meta.value.registrySize || 0)
  const storageUsed = computed(() => usedBytes())
  const uptimeMs = computed(() => Date.now() - new Date(meta.value.bootedAt).getTime())

  const services = computed(() =>
    SERVICE_NODES.map((s) => ({
      ...s,
      status: 'healthy',
      uptime: '99.9%'
    }))
  )

  const license = computed(() => ({ ...LICENSE, seats: space.value.memberLimit }))

  function log(module, action, target, result = 'success') {
    logs.value.unshift({
      id: uid('log'),
      at: new Date().toISOString(),
      actor: user.value.name,
      module,
      action,
      target,
      result
    })
    if (logs.value.length > 500) logs.value.length = 500
  }

  function updateSpace(patch) {
    space.value = { ...space.value, ...patch }
  }

  function addMember(payload) {
    const member = {
      id: uid('usr'),
      name: payload.name,
      account: payload.account,
      role: payload.role,
      tags: payload.tags || [],
      status: 'active',
      joinedAt: new Date().toISOString()
    }
    members.value.push(member)
    log('成员管理', '邀请成员', `${member.name} · ${roleLabel(member.role)}`)
    return member
  }

  function updateMember(id, patch) {
    const index = members.value.findIndex((m) => m.id === id)
    if (index < 0) return
    members.value[index] = { ...members.value[index], ...patch }
    if (id === user.value.id) user.value = { ...user.value, ...patch }
    log('成员管理', '编辑成员', members.value[index].name)
  }

  function removeMember(id) {
    const target = members.value.find((m) => m.id === id)
    members.value = members.value.filter((m) => m.id !== id)
    if (target) log('成员管理', '移除成员', target.name)
  }

  function toggleMemberStatus(id) {
    const member = members.value.find((m) => m.id === id)
    if (!member) return
    member.status = member.status === 'active' ? 'disabled' : 'active'
    log('成员管理', member.status === 'active' ? '恢复成员' : '停用成员', member.name)
  }

  function createKey(name, scope) {
    const item = {
      id: uid('key'),
      name,
      scope,
      key: `sk-live-${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 12)}`.slice(0, 28),
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsedAt: null
    }
    apiKeys.value.unshift(item)
    log('系统管理', '创建密钥', name)
    return item
  }

  function revokeKey(id) {
    const item = apiKeys.value.find((k) => k.id === id)
    if (!item) return
    item.status = 'revoked'
    log('系统管理', '吊销密钥', item.name)
  }

  function removeKey(id) {
    const item = apiKeys.value.find((k) => k.id === id)
    apiKeys.value = apiKeys.value.filter((k) => k.id !== id)
    if (item) log('系统管理', '删除密钥', item.name)
  }

  function exportSnapshot() {
    return JSON.stringify(snapshot(), null, 2)
  }

  function importSnapshot(text) {
    restore(JSON.parse(text))
    window.location.reload()
  }

  function resetAll() {
    resetToInitial()
    window.location.reload()
  }

  function clearCache() {
    const before = usedBytes()
    write('cache.retrieval', [])
    const freed = Math.max(before - usedBytes(), 0)
    log('系统管理', '清理运行缓存', `释放 ${formatKb(freed)}`)
    return freed
  }

  return {
    space,
    user,
    members,
    logs,
    apiKeys,
    meta,
    memberCount,
    activeMembers,
    registrySize,
    storageUsed,
    uptimeMs,
    services,
    license,
    roleLabel,
    log,
    updateSpace,
    addMember,
    updateMember,
    removeMember,
    toggleMemberStatus,
    createKey,
    revokeKey,
    removeKey,
    exportSnapshot,
    importSnapshot,
    resetAll,
    clearCache
  }
})
