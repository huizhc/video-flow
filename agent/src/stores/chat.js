import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { persisted } from '@/services/persist'
import { uid } from '@/services/storage'
import { KEYS } from '@/services/seed'
import { composeReply } from '@/services/reply'
import { useSpaceStore } from './space'
import { useAgentStore } from './agents'
import { useSkillStore } from './skills'
import { useKnowledgeStore } from './knowledge'
import { useRuleStore } from './rules'
import { useSettingsStore } from './settings'

export const useChatStore = defineStore('chat', () => {
  const sessions = persisted(KEYS.sessions, [])
  const spaceStore = useSpaceStore()
  const agentStore = useAgentStore()
  const skillStore = useSkillStore()
  const knowledgeStore = useKnowledgeStore()
  const ruleStore = useRuleStore()
  const settingsStore = useSettingsStore()

  const activeId = ref(sessions.value[0]?.id || '')
  const generating = ref(false)
  let timer = null
  let aborted = false

  const ordered = computed(() => [...sessions.value].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
  const active = computed(() => sessions.value.find((s) => s.id === activeId.value) || null)
  const messages = computed(() => active.value?.messages || [])

  function context() {
    return {
      space: spaceStore.space,
      members: spaceStore.members,
      registrySize: spaceStore.registrySize,
      agents: agentStore.agents,
      mainAgent: agentStore.mainAgent,
      pendingTasks: agentStore.pendingTasks,
      runningTasks: agentStore.runningTasks,
      skills: skillStore.skills,
      bases: knowledgeStore.bases,
      documents: knowledgeStore.documents,
      rules: ruleStore.rules,
      retrieval: settingsStore.retrieval
    }
  }

  function createSession(title = '新对话') {
    const session = {
      id: uid('ses'),
      title,
      mode: 'chat',
      agentId: '',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sessions.value.unshift(session)
    activeId.value = session.id
    const limit = spaceStore.space.sessionMaxCount || 100
    if (sessions.value.length > limit) sessions.value.length = limit
    return session
  }

  function ensureSession() {
    if (!active.value) {
      if (sessions.value.length) activeId.value = ordered.value[0].id
      else createSession()
    }
    return active.value
  }

  function selectSession(id) {
    stop()
    activeId.value = id
  }

  function renameSession(id, title) {
    const session = sessions.value.find((s) => s.id === id)
    if (session) {
      session.title = title
      session.updatedAt = new Date().toISOString()
    }
  }

  function removeSession(id) {
    sessions.value = sessions.value.filter((s) => s.id !== id)
    if (activeId.value === id) {
      activeId.value = sessions.value.length ? ordered.value[0].id : ''
      if (!activeId.value) createSession()
    }
  }

  function clearMessages() {
    const session = ensureSession()
    if (!session) return
    stop()
    session.messages = []
    session.updatedAt = new Date().toISOString()
  }

  function setMode(mode) {
    const session = ensureSession()
    if (session) session.mode = mode
  }

  function setAgent(agentId) {
    const session = ensureSession()
    if (session) session.agentId = agentId
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    if (generating.value) {
      aborted = true
      const session = active.value
      const last = session?.messages[session.messages.length - 1]
      if (last && last.role === 'assistant') {
        last.pending = false
        last.stopped = true
        if (!last.text) last.text = '本次回答已停止。'
      }
    }
    generating.value = false
  }

  function send(text) {
    const content = String(text || '').trim()
    if (!content || generating.value) return
    const session = ensureSession()
    const now = new Date().toISOString()
    session.messages.push({ id: uid('msg'), role: 'user', text: content, at: now })
    if (session.title === '新对话') session.title = content.slice(0, 18)
    session.updatedAt = now

    const reply = composeReply(content, context(), session.mode === 'agent' ? session.agentId : '')
    const assistant = {
      id: uid('msg'),
      role: 'assistant',
      text: '',
      at: new Date().toISOString(),
      pending: true,
      agentName: reply.agentName,
      basis: reply.basis,
      citations: reply.citations,
      skills: reply.skills,
      elapsedMs: reply.elapsedMs
    }
    session.messages.push(assistant)

    generating.value = true
    aborted = false
    let cursor = 0
    const full = reply.text
    const step = Math.max(2, Math.round(full.length / 90))
    timer = setInterval(() => {
      if (aborted) return
      cursor += step
      assistant.text = full.slice(0, cursor)
      if (cursor >= full.length) {
        clearInterval(timer)
        timer = null
        assistant.text = full
        assistant.pending = false
        generating.value = false
        session.updatedAt = new Date().toISOString()
        if (reply.agentId) agentStore.recordCall(reply.agentId)
        reply.skills.forEach((s) => skillStore.recordCall(s.id))
        if (reply.ruleId) ruleStore.recordHit(reply.ruleId)
      }
    }, 26)
  }

  function exportSession(id) {
    const session = sessions.value.find((s) => s.id === id)
    if (!session) return ''
    const lines = [`${session.title}`, `创建时间：${session.createdAt}`, '']
    session.messages.forEach((m) => {
      lines.push(`【${m.role === 'user' ? spaceStore.user.name : m.agentName || 'MAIN Agent'}】`)
      lines.push(m.text)
      lines.push('')
    })
    return lines.join('\n')
  }

  return {
    sessions,
    ordered,
    activeId,
    active,
    messages,
    generating,
    createSession,
    ensureSession,
    selectSession,
    renameSession,
    removeSession,
    clearMessages,
    setMode,
    setAgent,
    send,
    stop,
    exportSession
  }
})
