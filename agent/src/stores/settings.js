import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS, defaultSpaceSettings } from '@/services/seed'
import { RESOURCE_GROUPS } from '@/services/catalog'
import { useSpaceStore } from './space'
import { useKnowledgeStore } from './knowledge'

const BASE_DEFAULT = { enabled: true, weight: 1 }
const TOTAL_RESOURCES = RESOURCE_GROUPS.reduce((sum, group) => sum + group.items.length, 0)

export const useSettingsStore = defineStore('settings', () => {
  const state = persisted(KEYS.spaceSettings, defaultSpaceSettings())
  const spaceStore = useSpaceStore()
  const knowledgeStore = useKnowledgeStore()

  const welcome = computed(() => state.value.welcome)
  const resources = computed(() => state.value.resources)
  const knowledge = computed(() => state.value.knowledge)
  const synonyms = computed(() => state.value.synonyms)

  const enabledResources = computed(() =>
    RESOURCE_GROUPS.reduce((sum, group) => sum + (state.value.resources[group.key] || []).length, 0)
  )
  const totalResources = computed(() => TOTAL_RESOURCES)

  const baseConfig = (id) => ({ ...BASE_DEFAULT, ...(state.value.knowledge.bases?.[id] || {}) })
  const activeBaseIds = computed(() =>
    knowledgeStore.bases.filter((base) => baseConfig(base.id).enabled).map((base) => base.id)
  )

  const retrieval = computed(() => ({
    topK: knowledge.value.topK,
    minScore: knowledge.value.minScore,
    loosen: knowledge.value.loosen,
    citation: knowledge.value.citation,
    fallback: knowledge.value.fallback,
    baseIds: activeBaseIds.value,
    synonyms: synonyms.value
  }))

  function saveWelcome(payload) {
    state.value.welcome = { ...payload, questions: payload.questions.map((q) => ({ ...q })) }
    spaceStore.log('空间设置', '保存对话欢迎词', `${payload.title} · ${payload.questions.length} 个默认问题`)
  }

  function saveResources(payload) {
    const next = {}
    RESOURCE_GROUPS.forEach((group) => {
      const allowed = group.items.map((item) => item.code)
      next[group.key] = (payload[group.key] || []).filter((code) => allowed.includes(code))
    })
    state.value.resources = next
    const detail = RESOURCE_GROUPS.map((group) => `${group.title} ${next[group.key].length}/${group.items.length}`).join('，')
    spaceStore.log('空间设置', '保存资源配置', detail)
  }

  function saveKnowledge(payload) {
    state.value.knowledge = { ...state.value.knowledge, ...payload }
    spaceStore.log('空间设置', '保存检索参数', `${payload.model} · 召回 ${payload.topK} 篇 · 阈值 ${payload.minScore}`)
  }

  function saveBases(map) {
    const next = {}
    Object.entries(map).forEach(([id, cfg]) => {
      next[id] = { enabled: !!cfg.enabled, weight: Number(cfg.weight) || 1 }
    })
    state.value.knowledge.bases = next
    const on = Object.values(next).filter((cfg) => cfg.enabled).length
    spaceStore.log('空间设置', '保存知识库接入', `${on}/${Object.keys(next).length} 个参与检索`)
  }

  function addSynonym(payload) {
    const item = {
      id: uid('syn'),
      term: payload.term,
      aliases: [...payload.aliases],
      note: payload.note || '',
      updatedAt: new Date().toISOString()
    }
    state.value.synonyms.unshift(item)
    spaceStore.log('空间设置', '新增术语同义词', item.term)
    return item
  }

  function updateSynonym(id, payload) {
    const index = state.value.synonyms.findIndex((item) => item.id === id)
    if (index < 0) return
    state.value.synonyms[index] = {
      ...state.value.synonyms[index],
      ...payload,
      aliases: [...payload.aliases],
      updatedAt: new Date().toISOString()
    }
    spaceStore.log('空间设置', '编辑术语同义词', state.value.synonyms[index].term)
  }

  function removeSynonym(id) {
    const target = state.value.synonyms.find((item) => item.id === id)
    state.value.synonyms = state.value.synonyms.filter((item) => item.id !== id)
    if (target) spaceStore.log('空间设置', '删除术语同义词', target.term)
  }

  function termExists(term, exceptId = '') {
    return state.value.synonyms.some((item) => item.term === String(term).trim() && item.id !== exceptId)
  }

  return {
    welcome,
    resources,
    knowledge,
    synonyms,
    enabledResources,
    totalResources,
    activeBaseIds,
    retrieval,
    baseConfig,
    termExists,
    saveWelcome,
    saveResources,
    saveKnowledge,
    saveBases,
    addSynonym,
    updateSynonym,
    removeSynonym
  }
})
