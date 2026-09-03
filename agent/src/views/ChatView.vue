<template>
  <div class="chat-page">
    <section class="panel chat-panel">
      <div class="panel-head">
        <span>💬</span>
        <span class="panel-title">Agent对话</span>
        <span class="spacer"></span>
        <button class="btn btn-sm btn-icon" title="历史对话" @click="showHistory = !showHistory">☰</button>
        <button class="btn btn-sm btn-icon" title="导出对话" :disabled="!messages.length" @click="exportCurrent">⤓</button>
        <div class="tabs">
          <button :class="{ active: mode === 'chat' }" @click="chat.setMode('chat')">💬 聊天</button>
          <button :class="{ active: mode === 'agent' }" @click="chat.setMode('agent')">🤖 智能体</button>
        </div>
        <select v-if="mode === 'agent'" v-model="agentId" class="select agent-pick" @change="chat.setAgent(agentId)">
          <option value="">Main Agent 自动调度</option>
          <option v-for="agent in runningAgents" :key="agent.id" :value="agent.id">{{ agent.name }}</option>
        </select>
        <button class="btn btn-primary btn-sm" @click="newSession">+ 新对话</button>
        <button class="btn btn-sm" :disabled="!messages.length" @click="clearCurrent">🗑 清空</button>
      </div>

      <div ref="scroller" class="chat-body">
        <div v-if="!messages.length" class="welcome">
          <div class="welcome-logo">
            <img v-if="iconIsImage" :src="welcome.icon" class="welcome-logo-img" alt="" />
            <template v-else>{{ welcome.icon }}</template>
          </div>
          <h3 class="welcome-title">{{ welcome.title }}</h3>
          <p class="welcome-desc">{{ welcome.desc }}</p>
          <div v-if="welcome.questions.length" class="suggests">
            <button v-for="item in welcome.questions" :key="item.id" class="suggest" @click="ask(item.text)">
              <span>{{ item.icon }}</span>
              <span>{{ item.text }}</span>
            </button>
          </div>
        </div>

        <div v-for="msg in messages" :key="msg.id" class="msg" :class="msg.role">
          <div class="avatar" :class="msg.role">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
          <div class="msg-main">
            <div class="bubble" :class="{ pending: msg.pending && !msg.text }">
              <span v-if="msg.pending && !msg.text" class="thinking">🤔 正在思考回答...</span>
              <template v-else>
                <p v-for="(line, i) in msg.text.split('\n')" :key="i" class="line" :class="{ bullet: line.startsWith('· ') }">
                  {{ line.startsWith('· ') ? line.slice(2) : line }}
                </p>
                <span v-if="msg.pending" class="caret"></span>
              </template>
            </div>

            <div v-if="msg.role === 'assistant' && !msg.pending" class="meta">
              <span v-if="msg.agentName" class="badge badge-cyan">{{ msg.agentName }}</span>
              <span v-if="msg.basis" class="meta-text">调度依据：{{ msg.basis }}</span>
              <span v-if="msg.skills?.length" class="meta-text">调用技能：{{ msg.skills.map((s) => s.name).join('、') }}</span>
              <span v-if="msg.elapsedMs" class="meta-text">耗时 {{ (msg.elapsedMs / 1000).toFixed(1) }}s</span>
              <span v-if="msg.stopped" class="badge badge-amber">已停止</span>
            </div>

            <div v-if="msg.citations?.length" class="cites">
              <span class="cite-label">引用来源</span>
              <router-link v-for="c in msg.citations" :key="c.id" class="cite" :to="`/knowledge?kb=${c.kbId}&doc=${c.id}`">
                📄 {{ c.title }}
              </router-link>
            </div>

            <div class="msg-foot">
              <span class="time">{{ formatTime(msg.at) }}</span>
              <button v-if="!msg.pending" class="link-btn" @click="copy(msg.text)">复制</button>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-foot">
        <div class="input-row">
          <textarea
            v-model="draft"
            class="textarea composer"
            rows="1"
            placeholder="输入消息... (Enter 发送 / Shift+Enter 换行)"
            @keydown.enter.exact.prevent="submit"
          ></textarea>
          <button v-if="chat.generating" class="send stop" title="停止生成" @click="chat.stop()">■</button>
          <button v-else class="send" :disabled="!draft.trim()" title="发送" @click="submit">▶</button>
        </div>
        <p class="hint">Enter 发送 · Shift+Enter 换行</p>
      </div>
    </section>

    <Teleport v-if="showHistory" to="#sidebar-extra">
      <div class="history">
        <div class="history-label">历史对话</div>
        <div
          v-for="session in chat.ordered"
          :key="session.id"
          class="history-item"
          :class="{ active: session.id === chat.activeId }"
          @click="chat.selectSession(session.id)"
        >
          <span class="hi-icon">💬</span>
          <span class="hi-title">{{ session.title }}</span>
          <span class="hi-actions">
            <button class="link-btn" title="重命名" @click.stop="startRename(session)">✎</button>
            <button class="link-btn danger" title="删除" @click.stop="dropSession(session)">✕</button>
          </span>
        </div>
      </div>
    </Teleport>

    <BaseModal v-if="renaming" title="重命名会话" :width="400" @close="renaming = null">
      <div class="field">
        <label class="field-label">会话标题</label>
        <input v-model="renameText" class="input" maxlength="40" />
      </div>
      <template #footer>
        <button class="btn" @click="renaming = null">取消</button>
        <button class="btn btn-primary" :disabled="!renameText.trim()" @click="commitRename">保存</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useChatStore } from '@/stores/chat'
import { useAgentStore } from '@/stores/agents'
import { useSettingsStore } from '@/stores/settings'
import { useUiStore } from '@/stores/ui'
import { formatTime, copyText, downloadFile } from '@/utils/format'

const chat = useChatStore()
const agentStore = useAgentStore()
const settings = useSettingsStore()
const ui = useUiStore()

const draft = ref('')
const showHistory = ref(true)
const scroller = ref(null)
const renaming = ref(null)
const renameText = ref('')

const messages = computed(() => chat.messages)
const welcome = computed(() => settings.welcome)
const iconIsImage = computed(() => /^data:image\//.test(welcome.value.icon))
const mode = computed(() => chat.active?.mode || 'chat')
const agentId = ref(chat.active?.agentId || '')
const runningAgents = computed(() => agentStore.agents.filter((a) => a.status === 'running'))

function scrollToEnd() {
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

function submit() {
  const text = draft.value.trim()
  if (!text || chat.generating) return
  chat.send(text)
  draft.value = ''
  scrollToEnd()
}

function ask(text) {
  if (chat.generating) return
  chat.send(text)
  scrollToEnd()
}

function newSession() {
  chat.stop()
  chat.createSession()
  draft.value = ''
  ui.notify('已创建新对话')
}

async function clearCurrent() {
  const ok = await ui.confirm({ title: '清空当前对话', message: '将清除当前会话的全部消息，操作不可撤销。', danger: true, confirmText: '清空' })
  if (!ok) return
  chat.clearMessages()
  ui.notify('当前对话已清空')
}

function exportCurrent() {
  const content = chat.exportSession(chat.activeId)
  if (!content) return
  downloadFile(`${chat.active.title}.txt`, content, 'text/plain;charset=utf-8')
  ui.notify('会话已导出')
}

async function copy(text) {
  await copyText(text)
  ui.notify('内容已复制')
}

function startRename(session) {
  renaming.value = session
  renameText.value = session.title
}

function commitRename() {
  chat.renameSession(renaming.value.id, renameText.value.trim())
  renaming.value = null
  ui.notify('会话已重命名')
}

async function dropSession(session) {
  const ok = await ui.confirm({ title: '删除会话', message: `确认删除「${session.title}」及其全部消息？`, danger: true, confirmText: '删除' })
  if (!ok) return
  chat.removeSession(session.id)
  ui.notify('会话已删除')
}

watch(
  () => messages.value.length,
  () => scrollToEnd()
)

watch(
  () => chat.messages[chat.messages.length - 1]?.text,
  () => scrollToEnd()
)

watch(
  () => chat.activeId,
  () => {
    agentId.value = chat.active?.agentId || ''
    scrollToEnd()
  }
)

onMounted(() => {
  chat.ensureSession()
  scrollToEnd()
})
</script>

<style scoped>
.chat-page {
  height: 100%;
  padding: 16px 20px;
  display: flex;
}

.chat-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.agent-pick {
  width: 178px;
  height: 26px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 22px;
}

.welcome {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0 40px;
}

.welcome-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 26px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  box-shadow: 0 10px 24px rgba(52, 161, 225, 0.35);
}

.welcome-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-title {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 700;
}

.welcome-desc {
  margin-top: 7px;
  color: var(--text-3);
  font-size: 12px;
}

.suggests {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 620px;
  width: 100%;
}

.suggest {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  background: var(--panel-2);
  border: 1px solid var(--line-2);
  border-radius: 8px;
  color: var(--text-2);
  font-size: 12.5px;
  cursor: pointer;
  text-align: left;
  transition: 0.15s;
}

.suggest:hover {
  border-color: rgba(52, 161, 225, 0.45);
  color: var(--text);
  background: #1B3861;
}

.msg {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.msg.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 7px;
  display: grid;
  place-items: center;
  font-size: 13px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
}

.avatar.user {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}

.msg-main {
  max-width: 74%;
  min-width: 0;
}

.msg.user .msg-main {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bubble {
  background: var(--panel-3);
  border: 1px solid var(--line-2);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12.8px;
  line-height: 1.75;
  word-break: break-word;
}

.msg.user .bubble {
  background: linear-gradient(135deg, #0d9488, #0e7490);
  border-color: transparent;
  color: #eafcff;
}

.bubble.pending {
  background: #18355A;
}

.thinking {
  color: var(--cyan);
  font-size: 12.5px;
}

.line {
  min-height: 6px;
}

.line.bullet {
  padding-left: 12px;
  position: relative;
}

.line.bullet::before {
  content: '·';
  position: absolute;
  left: 2px;
  color: var(--cyan);
}

.caret {
  display: inline-block;
  width: 6px;
  height: 13px;
  background: var(--cyan);
  vertical-align: -2px;
  animation: pulse-dot 1s infinite;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 7px;
}

.meta-text {
  color: var(--text-3);
  font-size: 11px;
}

.cites {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.cite-label {
  color: var(--text-3);
  font-size: 11px;
}

.cite {
  font-size: 11.5px;
  color: var(--cyan);
  background: rgba(52, 161, 225, 0.08);
  border: 1px solid rgba(52, 161, 225, 0.22);
  border-radius: 5px;
  padding: 2px 8px;
}

.cite:hover {
  background: rgba(52, 161, 225, 0.18);
}

.msg-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.time {
  color: var(--text-3);
  font-size: 11px;
}

.chat-foot {
  flex: none;
  padding: 12px 22px 14px;
  border-top: 1px solid var(--line);
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.composer {
  flex: 1;
  min-height: 40px;
  max-height: 140px;
  border-radius: 9px;
  padding: 10px 14px;
  font-size: 12.8px;
}

.send {
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 9px;
  border: none;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}

.send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send.stop {
  background: #dc2626;
  color: #fff;
}

.hint {
  margin-top: 8px;
  text-align: center;
  color: var(--text-3);
  font-size: 11px;
}

.history {
  padding: 4px 0;
}

.history-label {
  color: var(--text-3);
  font-size: 11px;
  padding: 6px 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--text-2);
  font-size: 12.5px;
  cursor: pointer;
}

.history-item:hover {
  background: #27508A;
  color: var(--text);
}

.history-item.active {
  background: rgba(52, 161, 225, 0.15);
  color: #e6f9ff;
}

.hi-icon {
  flex: none;
  font-size: 11.5px;
}

.hi-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hi-actions {
  display: none;
  gap: 6px;
}

.history-item:hover .hi-actions {
  display: flex;
}

@media (max-width: 900px) {
  .suggests {
    grid-template-columns: 1fr;
  }
}
</style>
