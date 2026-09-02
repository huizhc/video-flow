import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { REGISTRY } from '@/services/catalog'
import { useSpaceStore } from './space'

export const useAgentStore = defineStore('agents', () => {
  const agents = persisted(KEYS.agents, [])
  const tasks = persisted(KEYS.tasks, [])
  const spaceStore = useSpaceStore()

  const mainAgent = computed(() => agents.value.find((a) => a.isMain) || null)
  const total = computed(() => agents.value.length)
  const runningCount = computed(() => agents.value.filter((a) => a.status === 'running').length)
  const pendingTasks = computed(() => tasks.value.filter((t) => t.status === 'pending').length)
  const runningTasks = computed(() => tasks.value.filter((t) => t.status === 'running').length)
  const importedCodes = computed(() => agents.value.map((a) => a.code))
  const registry = computed(() =>
    REGISTRY.map((r) => ({ ...r, imported: importedCodes.value.includes(r.code) }))
  )
  const byId = (id) => agents.value.find((a) => a.id === id) || null

  function create(payload) {
    const agent = {
      id: uid('agt'),
      code: payload.code,
      name: payload.name,
      category: payload.category,
      isMain: false,
      status: payload.status || 'stopped',
      version: payload.version || 'v1.0.0',
      protocol: 'v2.0.0',
      description: payload.description || '',
      prompt: payload.prompt || '',
      skillIds: payload.skillIds || [],
      kbIds: payload.kbIds || [],
      tags: payload.tags || [],
      calls: 0,
      source: payload.source || 'custom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    agents.value.push(agent)
    spaceStore.log('Agent管理', '新建Agent', agent.name)
    return agent
  }

  function update(id, patch) {
    const index = agents.value.findIndex((a) => a.id === id)
    if (index < 0) return
    agents.value[index] = { ...agents.value[index], ...patch, updatedAt: new Date().toISOString() }
    spaceStore.log('Agent管理', '更新配置', agents.value[index].name)
  }

  function remove(id) {
    const target = byId(id)
    agents.value = agents.value.filter((a) => a.id !== id)
    if (target) spaceStore.log('Agent管理', '移除Agent', target.name)
  }

  function toggleStatus(id) {
    const agent = byId(id)
    if (!agent) return
    agent.status = agent.status === 'running' ? 'stopped' : 'running'
    agent.updatedAt = new Date().toISOString()
    spaceStore.log('Agent管理', agent.status === 'running' ? '启用Agent' : '停用Agent', agent.name)
  }

  function setMain(id) {
    agents.value.forEach((a) => {
      a.isMain = a.id === id
    })
    const agent = byId(id)
    if (agent) {
      agent.status = 'running'
      agent.category = '调度中枢'
      spaceStore.log('Agent管理', '设为Main Agent', agent.name)
    }
  }

  function importFromRegistry(codes) {
    const created = []
    codes.forEach((code) => {
      const item = REGISTRY.find((r) => r.code === code)
      if (!item || importedCodes.value.includes(code)) return
      const agent = {
        id: uid('agt'),
        code: item.code,
        name: item.name,
        category: item.category,
        isMain: false,
        status: 'running',
        version: item.version,
        protocol: 'v2.0.0',
        description: item.description,
        prompt: `你是${item.name}，具备${item.capabilities.join('、')}能力，请结合团队空间知识库输出结论与依据。`,
        skillIds: [],
        kbIds: [],
        tags: [],
        calls: 0,
        source: 'registry',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      agents.value.push(agent)
      created.push(agent)
    })
    if (created.length) {
      spaceStore.log('Agent管理', '引入Agent', created.map((a) => a.name).join('、'))
    }
    return created
  }

  function recordCall(id) {
    const agent = byId(id)
    if (!agent) return
    agent.calls += 1
    agent.updatedAt = new Date().toISOString()
  }

  function importConfig(list) {
    let count = 0
    list.forEach((item) => {
      if (!item || !item.name || !item.code) return
      if (importedCodes.value.includes(item.code)) return
      create({ ...item, status: item.status || 'stopped' })
      count += 1
    })
    return count
  }

  return {
    agents,
    tasks,
    registry,
    mainAgent,
    total,
    runningCount,
    pendingTasks,
    runningTasks,
    byId,
    create,
    update,
    remove,
    toggleStatus,
    setMain,
    importFromRegistry,
    recordCall,
    importConfig
  }
})
