import { defineStore } from 'pinia'
import { computed } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { useSpaceStore } from './space'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const bases = persisted(KEYS.knowledgeBases, [])
  const documents = persisted(KEYS.documents, [])
  const spaceStore = useSpaceStore()

  const baseById = (id) => bases.value.find((b) => b.id === id) || null
  const docsOf = (baseId) => documents.value.filter((d) => d.kbId === baseId)
  const docCount = (baseId) => docsOf(baseId).length
  const totalDocs = computed(() => documents.value.length)

  const list = computed(() =>
    bases.value.map((b) => ({ ...b, docCount: docCount(b.id) }))
  )

  function createBase(payload) {
    const base = {
      id: uid('kb'),
      name: payload.name,
      domain: payload.domain,
      model: payload.model,
      visibility: payload.visibility || 'space',
      visibleTags: payload.visibleTags || [],
      description: payload.description || '',
      indexStatus: 'pending',
      indexedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    bases.value.push(base)
    spaceStore.log('知识库', '新建知识库', base.name)
    return base
  }

  function updateBase(id, patch) {
    const index = bases.value.findIndex((b) => b.id === id)
    if (index < 0) return
    bases.value[index] = { ...bases.value[index], ...patch, updatedAt: new Date().toISOString() }
    spaceStore.log('知识库', '编辑知识库', bases.value[index].name)
  }

  function removeBase(id) {
    const target = baseById(id)
    bases.value = bases.value.filter((b) => b.id !== id)
    documents.value = documents.value.filter((d) => d.kbId !== id)
    if (target) spaceStore.log('知识库', '删除知识库', target.name)
  }

  function rebuildIndex(id) {
    const base = baseById(id)
    if (!base) return
    base.indexStatus = 'building'
    base.updatedAt = new Date().toISOString()
    setTimeout(() => {
      base.indexStatus = 'ready'
      base.indexedAt = new Date().toISOString()
      base.updatedAt = base.indexedAt
    }, 1200)
    spaceStore.log('知识库', '重建索引', base.name)
  }

  function createDoc(payload) {
    const doc = {
      id: uid('doc'),
      kbId: payload.kbId,
      title: payload.title,
      category: payload.category || '未分类',
      tags: payload.tags || [],
      content: payload.content || '',
      updatedBy: spaceStore.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    documents.value.unshift(doc)
    const base = baseById(doc.kbId)
    if (base) {
      base.indexStatus = 'stale'
      base.updatedAt = doc.createdAt
    }
    spaceStore.log('知识库', '新增文档', doc.title)
    return doc
  }

  function updateDoc(id, patch) {
    const index = documents.value.findIndex((d) => d.id === id)
    if (index < 0) return
    documents.value[index] = {
      ...documents.value[index],
      ...patch,
      updatedBy: spaceStore.user.name,
      updatedAt: new Date().toISOString()
    }
    const base = baseById(documents.value[index].kbId)
    if (base) base.indexStatus = 'stale'
    spaceStore.log('知识库', '编辑文档', documents.value[index].title)
  }

  function removeDoc(id) {
    const target = documents.value.find((d) => d.id === id)
    documents.value = documents.value.filter((d) => d.id !== id)
    if (target) {
      const base = baseById(target.kbId)
      if (base) base.indexStatus = 'stale'
      spaceStore.log('知识库', '删除文档', target.title)
    }
  }

  function search(keyword, baseIds = null) {
    const kw = String(keyword || '').trim()
    if (!kw) return []
    const pool = baseIds ? documents.value.filter((d) => baseIds.includes(d.kbId)) : documents.value
    const terms = kw.split(/\s+/).filter(Boolean)
    return pool
      .map((doc) => {
        const haystack = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`
        let score = 0
        terms.forEach((t) => {
          const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          score += (doc.title.match(re) || []).length * 3 + (haystack.match(re) || []).length
        })
        return { doc, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.doc)
  }

  return {
    bases,
    documents,
    list,
    totalDocs,
    baseById,
    docsOf,
    docCount,
    createBase,
    updateBase,
    removeBase,
    rebuildIndex,
    createDoc,
    updateDoc,
    removeDoc,
    search
  }
})
