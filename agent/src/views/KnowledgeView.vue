<template>
  <div class="page kb-layout">
    <section class="panel side">
      <div class="panel-head">
        <span>📚</span>
        <span class="panel-title">知识库</span>
        <span class="spacer"></span>
        <button class="btn btn-primary btn-sm" @click="openBaseCreate">+ 新建</button>
      </div>
      <div class="base-list">
        <div
          v-for="base in knowledge.list"
          :key="base.id"
          class="base-item"
          :class="{ active: base.id === activeBaseId }"
          @click="activeBaseId = base.id"
        >
          <div class="bi-top">
            <span class="bi-name">{{ base.name }}</span>
            <span class="badge" :class="base.indexStatus === 'ready' ? 'badge-cyan' : base.indexStatus === 'building' ? 'badge-amber' : 'badge-gray'">
              {{ indexLabel(base.indexStatus) }}
            </span>
          </div>
          <div class="bi-sub">{{ base.domain }} · {{ base.docCount }} 篇 · {{ base.model }}</div>
          <div class="bi-sub">{{ base.visibility === 'space' ? '空间可见' : `标签可见：${base.visibleTags.join('、') || '未指定'}` }}</div>
        </div>
      </div>
    </section>

    <section class="panel main">
      <template v-if="activeBase">
        <div class="panel-head">
          <span>📁</span>
          <span class="panel-title">{{ activeBase.name }}</span>
          <span class="section-desc">索引更新 {{ activeBase.indexedAt ? fromNow(activeBase.indexedAt) : '未建立' }}</span>
          <span class="spacer"></span>
          <button class="btn btn-sm" @click="rebuild">重建索引</button>
          <button class="btn btn-sm" @click="openBaseEdit">编辑</button>
          <button class="btn btn-sm btn-danger" @click="removeBase">删除</button>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input v-model="docKeyword" class="input" placeholder="检索标题与正文" />
          </div>
          <select v-model="categoryFilter" class="select" style="width: 130px">
            <option value="">全部分类</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <span class="section-desc">引用该知识库的 Agent：{{ relatedAgents || '暂无' }}</span>
          <span class="spacer"></span>
          <button class="btn btn-primary btn-sm" @click="openDocCreate">+ 新增文档</button>
        </div>

        <div class="doc-list">
          <article v-for="doc in pagedDocs" :key="doc.id" class="doc" :class="{ open: openedDocId === doc.id }">
            <header class="doc-head" @click="openedDocId = openedDocId === doc.id ? '' : doc.id">
              <div class="doc-title" v-html="highlight(doc.title, docKeyword)"></div>
              <span class="badge badge-gray">{{ doc.category }}</span>
              <span v-for="tag in doc.tags" :key="tag" class="tag-chip">{{ tag }}</span>
              <span class="spacer"></span>
              <span class="cell-sub">{{ doc.updatedBy }} · {{ formatDateTime(doc.updatedAt) }}</span>
              <span class="chev">{{ openedDocId === doc.id ? '▴' : '▾' }}</span>
            </header>
            <div v-if="openedDocId === doc.id" class="doc-body">
              <p v-for="(para, i) in doc.content.split('\n')" :key="i" class="para" v-html="highlight(para, docKeyword)"></p>
              <div class="doc-actions">
                <button class="link-btn" @click="openDocEdit(doc)">编辑文档</button>
                <button class="link-btn" @click="copyDoc(doc)">复制正文</button>
                <button class="link-btn danger" @click="removeDoc(doc)">删除文档</button>
              </div>
            </div>
          </article>
          <div v-if="!filteredDocs.length" class="empty">
            <div class="empty-icon">📄</div>
            {{ docKeyword ? '未检索到匹配文档' : '该知识库暂无文档，点击右上角新增' }}
          </div>
        </div>

        <DataPager v-model:page="page" v-model:page-size="pageSize" :total="filteredDocs.length" />
      </template>
      <div v-else class="empty"><div class="empty-icon">📚</div>请选择或新建一个知识库</div>
    </section>

    <SideDrawer v-if="baseForm" :title="baseForm.id ? '编辑知识库' : '新建知识库'" :width="500" @close="baseForm = null">
      <div class="field">
        <label class="field-label">名称<span class="req">*</span></label>
        <input v-model="baseForm.name" class="input" placeholder="例如 排污许可与环评法规库" />
      </div>
      <div class="grid-2">
        <div class="field">
          <label class="field-label">领域</label>
          <select v-model="baseForm.domain" class="select">
            <option v-for="d in DOMAINS" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">向量模型</label>
          <select v-model="baseForm.model" class="select">
            <option v-for="m in MODELS" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="field-label">描述</label>
        <textarea v-model="baseForm.description" class="textarea" rows="3" placeholder="说明收录范围与用途"></textarea>
      </div>
      <div class="field">
        <label class="field-label">可见范围</label>
        <select v-model="baseForm.visibility" class="select">
          <option value="space">空间全部成员可见</option>
          <option value="tag">仅指定业务标签可见</option>
        </select>
      </div>
      <div v-if="baseForm.visibility === 'tag'" class="field">
        <label class="field-label">可见标签</label>
        <CheckGroup v-model="baseForm.visibleTags" :options="tagOptions" />
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="baseForm = null">取消</button>
        <button class="btn btn-primary" @click="saveBase">保存</button>
      </template>
    </SideDrawer>

    <SideDrawer v-if="docForm" :title="docForm.id ? '编辑文档' : '新增文档'" :subtitle="activeBase?.name" :width="640" @close="docForm = null">
      <div class="field">
        <label class="field-label">标题<span class="req">*</span></label>
        <input v-model="docForm.title" class="input" placeholder="文档标题" />
      </div>
      <div class="grid-2">
        <div class="field">
          <label class="field-label">分类</label>
          <input v-model="docForm.category" class="input" placeholder="例如 标准条款" />
        </div>
        <div class="field">
          <label class="field-label">标签</label>
          <input v-model="docForm.tagText" class="input" placeholder="多个标签用空格分隔" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">正文<span class="req">*</span></label>
        <textarea v-model="docForm.content" class="textarea" rows="14" placeholder="粘贴条款原文或整理后的内容，换行分段"></textarea>
        <p class="field-hint">正文将参与检索与 Agent 回答引用，建议保留条款编号与关键指标。</p>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="docForm = null">取消</button>
        <button class="btn btn-primary" @click="saveDoc">保存</button>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideDrawer from '@/components/SideDrawer.vue'
import CheckGroup from '@/components/CheckGroup.vue'
import DataPager from '@/components/DataPager.vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useAgentStore } from '@/stores/agents'
import { useUiStore } from '@/stores/ui'
import { BUSINESS_TAGS } from '@/services/catalog'
import { formatDateTime, fromNow, highlight, copyText } from '@/utils/format'

const DOMAINS = ['体系标准', '法律法规', '运行记录', '技术方案', '培训材料', '其他']
const MODELS = ['bge-large-zh', 'bge-base-zh', 'text-embedding-3-large']

const knowledge = useKnowledgeStore()
const agentStore = useAgentStore()
const ui = useUiStore()
const route = useRoute()

const activeBaseId = ref(knowledge.bases[0]?.id || '')
const docKeyword = ref('')
const categoryFilter = ref('')
const openedDocId = ref('')
const page = ref(1)
const pageSize = ref(10)
const baseForm = ref(null)
const docForm = ref(null)
const error = ref('')

const tagOptions = BUSINESS_TAGS.map((t) => ({ value: t, label: t }))
const indexLabel = (status) => ({ ready: '索引就绪', building: '索引中', stale: '待重建', pending: '未建索引' }[status] || status)
const activeBase = computed(() => knowledge.list.find((b) => b.id === activeBaseId.value) || null)
const baseDocs = computed(() => knowledge.docsOf(activeBaseId.value))
const categories = computed(() => [...new Set(baseDocs.value.map((d) => d.category))])

const filteredDocs = computed(() => {
  const kw = docKeyword.value.trim().toLowerCase()
  return baseDocs.value.filter(
    (doc) =>
      (!categoryFilter.value || doc.category === categoryFilter.value) &&
      (!kw || `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase().includes(kw))
  )
})

const pagedDocs = computed(() => filteredDocs.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

const relatedAgents = computed(() =>
  agentStore.agents
    .filter((a) => a.kbIds.includes(activeBaseId.value))
    .map((a) => a.name)
    .join('、')
)

watch([docKeyword, categoryFilter, activeBaseId], () => {
  page.value = 1
})

onMounted(() => {
  if (route.query.kb && knowledge.baseById(String(route.query.kb))) activeBaseId.value = String(route.query.kb)
  if (route.query.doc) openedDocId.value = String(route.query.doc)
})

function openBaseCreate() {
  error.value = ''
  baseForm.value = { id: '', name: '', domain: DOMAINS[0], model: MODELS[0], description: '', visibility: 'space', visibleTags: [] }
}

function openBaseEdit() {
  error.value = ''
  baseForm.value = { ...activeBase.value, visibleTags: [...activeBase.value.visibleTags] }
}

function saveBase() {
  const data = baseForm.value
  if (!data.name.trim()) {
    error.value = '请填写知识库名称'
    return
  }
  if (data.id) {
    knowledge.updateBase(data.id, data)
    ui.notify('知识库已更新')
  } else {
    const created = knowledge.createBase(data)
    activeBaseId.value = created.id
    ui.notify('知识库已创建')
  }
  baseForm.value = null
}

async function removeBase() {
  const base = activeBase.value
  const ok = await ui.confirm({
    title: '删除知识库',
    message: `将同时删除「${base.name}」下的 ${base.docCount} 篇文档，操作不可撤销。`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  knowledge.removeBase(base.id)
  activeBaseId.value = knowledge.bases[0]?.id || ''
  ui.notify('知识库已删除')
}

function rebuild() {
  knowledge.rebuildIndex(activeBaseId.value)
  ui.notify('索引重建已开始')
}

function openDocCreate() {
  error.value = ''
  docForm.value = { id: '', kbId: activeBaseId.value, title: '', category: '', tagText: '', content: '' }
}

function openDocEdit(doc) {
  error.value = ''
  docForm.value = { ...doc, tagText: doc.tags.join(' ') }
}

function saveDoc() {
  const data = docForm.value
  if (!data.title.trim()) {
    error.value = '请填写文档标题'
    return
  }
  if (!data.content.trim()) {
    error.value = '请填写文档正文'
    return
  }
  const payload = {
    kbId: data.kbId || activeBaseId.value,
    title: data.title.trim(),
    category: data.category.trim() || '未分类',
    tags: data.tagText.split(/\s+/).filter(Boolean),
    content: data.content
  }
  if (data.id) {
    knowledge.updateDoc(data.id, payload)
    ui.notify('文档已保存')
  } else {
    const created = knowledge.createDoc(payload)
    openedDocId.value = created.id
    ui.notify('文档已新增，知识库索引待重建')
  }
  docForm.value = null
}

async function removeDoc(doc) {
  const ok = await ui.confirm({ title: '删除文档', message: `确认删除「${doc.title}」？`, danger: true, confirmText: '删除' })
  if (!ok) return
  knowledge.removeDoc(doc.id)
  ui.notify('文档已删除')
}

async function copyDoc(doc) {
  await copyText(doc.content)
  ui.notify('正文已复制')
}
</script>

<style scoped>
.kb-layout {
  display: grid;
  grid-template-columns: 292px 1fr;
  gap: 16px;
  align-items: start;
  height: 100%;
}

.side,
.main {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
}

.base-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.base-item {
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: 0.15s;
}

.base-item:hover {
  border-color: var(--line-2);
  background: #16202c;
}

.base-item.active {
  border-color: rgba(34, 211, 238, 0.45);
  background: rgba(34, 211, 238, 0.08);
}

.bi-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bi-name {
  flex: 1;
  min-width: 0;
  font-size: 12.8px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bi-sub {
  margin-top: 5px;
  color: var(--text-3);
  font-size: 11.5px;
  line-height: 1.6;
}

.doc-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px;
}

.doc {
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  overflow: hidden;
}

.doc.open {
  border-color: rgba(34, 211, 238, 0.32);
}

.doc-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
}

.doc-head:hover {
  background: #16202c;
}

.doc-title {
  font-size: 12.8px;
  font-weight: 600;
  max-width: 42%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chev {
  color: var(--text-3);
  font-size: 11px;
}

.doc-body {
  padding: 4px 14px 14px;
  border-top: 1px solid var(--line);
}

.para {
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.85;
  margin-top: 8px;
}

.doc-actions {
  display: flex;
  gap: 14px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

@media (max-width: 1100px) {
  .kb-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
