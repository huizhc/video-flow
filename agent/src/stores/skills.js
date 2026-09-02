import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { useSpaceStore } from './space'

export const useSkillStore = defineStore('skills', () => {
  const skills = persisted(KEYS.skills, [])
  const spaceStore = useSpaceStore()

  const byId = (id) => skills.value.find((s) => s.id === id) || null
  const enabledSkills = computed(() => skills.value.filter((s) => s.status === 'enabled'))
  const sharedCount = computed(() => skills.value.filter((s) => s.shared && s.status === 'enabled').length)
  const totalCalls = computed(() => skills.value.reduce((sum, s) => sum + (s.calls || 0), 0))

  function create(payload) {
    const skill = {
      id: uid('skl'),
      code: payload.code,
      name: payload.name,
      category: payload.category,
      version: payload.version || 'v1.0.0',
      status: payload.status || 'enabled',
      shared: payload.shared !== false,
      description: payload.description || '',
      timeout: Number(payload.timeout) || 15,
      retry: Number(payload.retry) || 0,
      calls: 0,
      params: payload.params || [],
      versions: [{ version: payload.version || 'v1.0.0', at: new Date().toISOString(), note: '首次发布' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    skills.value.push(skill)
    spaceStore.log('技能管理', '新建技能', skill.name)
    return skill
  }

  function update(id, patch) {
    const index = skills.value.findIndex((s) => s.id === id)
    if (index < 0) return
    const prev = skills.value[index]
    const next = { ...prev, ...patch, updatedAt: new Date().toISOString() }
    if (patch.version && patch.version !== prev.version) {
      next.versions = [
        { version: patch.version, at: next.updatedAt, note: patch.versionNote || '配置更新' },
        ...(prev.versions || [])
      ]
    }
    delete next.versionNote
    skills.value[index] = next
    spaceStore.log('技能管理', '更新技能', next.name)
  }

  function remove(id) {
    const target = byId(id)
    skills.value = skills.value.filter((s) => s.id !== id)
    if (target) spaceStore.log('技能管理', '删除技能', target.name)
  }

  function toggleStatus(id) {
    const skill = byId(id)
    if (!skill) return
    skill.status = skill.status === 'enabled' ? 'disabled' : 'enabled'
    skill.updatedAt = new Date().toISOString()
    spaceStore.log('技能管理', skill.status === 'enabled' ? '启用技能' : '停用技能', skill.name)
  }

  function toggleShared(id) {
    const skill = byId(id)
    if (!skill) return
    skill.shared = !skill.shared
    spaceStore.log('技能管理', skill.shared ? '开启跨成员共享' : '关闭跨成员共享', skill.name)
  }

  function recordCall(id) {
    const skill = byId(id)
    if (!skill) return
    skill.calls += 1
  }

  return {
    skills,
    enabledSkills,
    sharedCount,
    totalCalls,
    byId,
    create,
    update,
    remove,
    toggleStatus,
    toggleShared,
    recordCall
  }
})
