import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted, reloadPersisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS, seedBusinessSpaces } from '@/services/seed'
import { SPACE_CATEGORIES, SPACE_COLORS } from '@/services/catalog'
import { useSpaceStore } from './space'

const RUNTIME_FIELDS = [
  'memberLimit',
  'scheduleStrategy',
  'tagRouting',
  'jwtEnabled',
  'jwtTtl',
  'schedulerEnabled',
  'sessionRetainDays',
  'sessionMaxCount',
  'concurrency',
  'integrated'
]

export const useBusinessSpaceStore = defineStore('businessSpaces', () => {
  const spaces = persisted(KEYS.businessSpaces, seedBusinessSpaces())
  const activeId = persisted(KEYS.activeSpaceId, '')
  const spaceStore = useSpaceStore()

  const total = computed(() => spaces.value.length)
  const activeCount = computed(() => spaces.value.filter((s) => s.status === 'active').length)
  const activeSpace = computed(() => spaces.value.find((s) => s.id === activeId.value) || null)
  const categories = computed(() => SPACE_CATEGORIES.filter((c) => spaces.value.some((s) => s.category === c)))

  const byId = (id) => spaces.value.find((s) => s.id === id) || null
  const nameExists = (name, exceptId = '') =>
    spaces.value.some((s) => s.name.trim() === String(name).trim() && s.id !== exceptId)

  const colorOf = (value) => SPACE_COLORS.find((c) => c.value === value) || SPACE_COLORS[0]

  function uniqueName(name) {
    if (!nameExists(name)) return name
    let index = 2
    while (nameExists(`${name} ${index}`)) index += 1
    return `${name} ${index}`
  }

  function create(payload) {
    const now = new Date().toISOString()
    const item = {
      ...payload,
      id: uid('spc'),
      name: uniqueName(String(payload.name).trim()),
      tags: [...(payload.tags || [])],
      status: payload.status || 'active',
      createdAt: now,
      updatedAt: now
    }
    spaces.value.unshift(item)
    spaceStore.log('业务空间', '新增空间', `${item.name} · ${item.category}`)
    return item
  }

  function update(id, patch) {
    const index = spaces.value.findIndex((s) => s.id === id)
    if (index < 0) return null
    const next = { ...spaces.value[index], ...patch, updatedAt: new Date().toISOString() }
    spaces.value[index] = next
    if (id === activeId.value) syncActive(next)
    spaceStore.log('业务空间', '修改空间配置', next.name)
    return next
  }

  function remove(id) {
    const target = byId(id)
    spaces.value = spaces.value.filter((s) => s.id !== id)
    if (activeId.value === id) activeId.value = ''
    if (target) spaceStore.log('业务空间', '删除空间', target.name)
  }

  function clone(id) {
    const source = byId(id)
    if (!source) return null
    const now = new Date().toISOString()
    const copy = {
      ...source,
      id: uid('spc'),
      name: uniqueName(`${source.name} 副本`),
      tags: [...source.tags],
      status: 'active',
      createdAt: now,
      updatedAt: now
    }
    const index = spaces.value.findIndex((s) => s.id === id)
    spaces.value.splice(index + 1, 0, copy)
    spaceStore.log('业务空间', '克隆空间', `${source.name} → ${copy.name}`)
    return copy
  }

  function toggleArchive(id) {
    const target = byId(id)
    if (!target) return
    const status = target.status === 'archived' ? 'active' : 'archived'
    update(id, { status })
    if (status === 'archived' && activeId.value === id) activeId.value = ''
  }

  function syncActive(item) {
    const runtime = Object.fromEntries(RUNTIME_FIELDS.map((key) => [key, item[key]]))
    spaceStore.updateSpace({
      ...runtime,
      spaceId: item.id,
      name: item.name,
      subtitle: item.org,
      description: item.description
    })
  }

  function enter(id) {
    const target = byId(id)
    if (!target) return null
    activeId.value = id
    syncActive(target)
    spaceStore.log('业务空间', '进入空间', target.name)
    return target
  }

  function reload() {
    reloadPersisted(spaces, KEYS.businessSpaces, seedBusinessSpaces())
    reloadPersisted(activeId, KEYS.activeSpaceId, '')
  }

  return {
    spaces,
    activeId,
    total,
    activeCount,
    activeSpace,
    categories,
    byId,
    nameExists,
    colorOf,
    create,
    update,
    remove,
    clone,
    toggleArchive,
    enter,
    reload
  }
})
