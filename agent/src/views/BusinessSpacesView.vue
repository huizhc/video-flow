<template>
  <div class="page stack">
    <div v-if="filterOpen" class="filter-bar">
      <span class="fl">空间名称</span>
      <input
        v-model="draft.keyword"
        class="input"
        style="width: 208px"
        placeholder="请输入空间名称"
        @keyup.enter="applyFilter"
      />
      <span class="fl">空间分类</span>
      <select v-model="draft.category" class="select" style="width: 168px">
        <option value="">空间分类</option>
        <option v-for="c in SPACE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
      <button class="btn btn-primary btn-sm" @click="applyFilter">🔍 搜索</button>
      <button class="btn btn-sm" @click="resetFilter">⟳ 重置</button>
    </div>

    <div class="act-bar">
      <button class="btn btn-sm btn-outline" @click="openCreate">＋ 新增</button>
      <span class="spacer"></span>
      <span class="section-desc">共 {{ filtered.length }} 个空间 · 活跃 {{ store.activeCount }} · 采集于 {{ sampledAt }}</span>
      <button class="icon-round" title="显示 / 隐藏筛选条件" @click="filterOpen = !filterOpen">🔍</button>
      <button class="icon-round" title="刷新列表" @click="refresh">⟳</button>
    </div>

    <div v-if="filtered.length" class="space-grid">
      <article v-for="item in filtered" :key="item.id" class="space-card" :class="{ current: item.id === store.activeId }">
        <div class="card-head">
          <div class="ava" :style="avatarStyle(item)">{{ initial(item.name) }}</div>
          <div class="head-text">
            <div class="card-name" :title="item.name">{{ item.name }}</div>
            <div class="head-sub">
              <span v-if="item.id === store.activeId" class="badge badge-cyan"><i class="dot"></i>当前空间</span>
              <span v-else-if="item.status === 'archived'" class="badge badge-gray"><i class="dot"></i>已归档</span>
              <span class="card-time">更新于 {{ fromNow(item.updatedAt) }}</span>
            </div>
          </div>
          <span class="cat">{{ item.category }}</span>
        </div>
        <div class="card-body">
          <div class="blk">
            <div class="blk-title"><span>📄</span>描述</div>
            <p class="desc">{{ item.description }}</p>
          </div>
          <div class="blk">
            <div class="blk-title"><span>🔖</span>标签</div>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag-chip">{{ tag }}</span>
              <span v-if="!item.tags.length" class="section-desc">未配置业务标签</span>
            </div>
          </div>
          <div class="blk">
            <div class="blk-title"><span>🏛️</span>组织</div>
            <div class="org">{{ item.org }}</div>
          </div>
        </div>
        <footer class="card-foot">
          <button class="link-btn" @click="openEdit(item)">✎ 修改</button>
          <button class="link-btn danger" @click="removeSpace(item)">🗑 删除</button>
          <button class="link-btn" @click="cloneSpace(item)">⧉ 克隆</button>
          <button class="link-btn" :class="{ muted: item.id === store.activeId }" @click="enterSpace(item)">
            ➤ {{ item.id === store.activeId ? '已进入' : '进入' }}
          </button>
        </footer>
      </article>
    </div>
    <section v-else class="panel">
      <div class="empty"><div class="empty-icon">🗂️</div>没有符合条件的业务空间</div>
    </section>
    <SideDrawer
      v-if="form"
      :title="form.id ? '修改业务空间' : '新增业务空间'"
      :subtitle="form.id ? `${form.category} · ${form.org || '未指定组织'}` : '配置空间归属、业务标签与运行参数'"
      :width="560"
      @close="form = null"
    >
      <div class="grid-2">
        <div class="field">
          <label class="field-label">空间名称<span class="req">*</span></label>
          <input v-model="form.name" class="input" placeholder="例如 环境合规管理空间" />
        </div>
        <div class="field">
          <label class="field-label">空间分类</label>
          <select v-model="form.category" class="select">
            <option v-for="c in SPACE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">所属组织<span class="req">*</span></label>
          <input v-model="form.org" class="input" list="space-org-options" placeholder="承接该空间的组织或部门" />
          <datalist id="space-org-options">
            <option v-for="o in SPACE_ORGS" :key="o" :value="o" />
          </datalist>
        </div>
        <div class="field">
          <label class="field-label">标识色</label>
          <div class="color-pick">
            <button
              v-for="c in SPACE_COLORS"
              :key="c.value"
              class="color-btn"
              :class="{ active: form.color === c.value }"
              :style="{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }"
              :title="c.value"
              @click="form.color = c.value"
            ></button>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="field-label">空间描述<span class="req">*</span></label>
        <textarea v-model="form.description" class="textarea" rows="4" placeholder="说明该空间对接的系统、覆盖的业务范围与产出"></textarea>
      </div>
      <div class="field">
        <label class="field-label">业务标签</label>
        <div v-if="form.tags.length" class="tag-editor">
          <span v-for="tag in form.tags" :key="tag" class="tag-chip">
            {{ tag }}
            <button class="tag-x" @click="dropTag(tag)">✕</button>
          </span>
        </div>
        <div class="row" style="margin-top: 8px">
          <input v-model="tagInput" class="input" placeholder="输入标签后回车添加" @keyup.enter="addTag" />
          <button class="btn btn-sm" @click="addTag">添加</button>
        </div>
        <p class="field-hint">标签决定该空间可承接的业务范围，并参与 Agent 标签路由匹配。</p>
      </div>
      <div class="sec-title">运行配置</div>
      <div class="grid-2">
        <div class="field">
          <label class="field-label">调度策略</label>
          <select v-model="form.scheduleStrategy" class="select">
            <option v-for="s in SPACE_STRATEGIES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <p class="field-hint">{{ strategyHint }}</p>
        </div>
        <div class="field">
          <label class="field-label">团队规模上限</label>
          <input v-model.number="form.memberLimit" type="number" min="1" max="200" class="input" />
        </div>
        <div class="field">
          <label class="field-label">Agent 并发任务上限</label>
          <input v-model.number="form.concurrency" type="number" min="1" max="64" class="input" />
        </div>
        <div class="field">
          <label class="field-label">JWT 令牌有效期（小时）</label>
          <input v-model.number="form.jwtTtl" type="number" min="1" max="168" class="input" :disabled="!form.jwtEnabled" />
        </div>
        <div class="field">
          <label class="field-label">会话保留天数</label>
          <input v-model.number="form.sessionRetainDays" type="number" min="1" max="365" class="input" />
        </div>
        <div class="field">
          <label class="field-label">会话条数上限</label>
          <input v-model.number="form.sessionMaxCount" type="number" min="10" max="1000" class="input" />
        </div>
      </div>

      <div class="switch-row">
        <div class="switch" :class="{ on: form.schedulerEnabled }" @click="form.schedulerEnabled = !form.schedulerEnabled"></div>
        <div>
          <div class="sr-title">启用调度中枢</div>
          <div class="section-desc">停用后请求不再自动分发，需在对话中手动指定 Agent</div>
        </div>
      </div>
      <div class="switch-row">
        <div class="switch" :class="{ on: form.tagRouting }" @click="form.tagRouting = !form.tagRouting"></div>
        <div>
          <div class="sr-title">标签路由</div>
          <div class="section-desc">按成员与 Agent 的业务标签匹配分发请求</div>
        </div>
      </div>
      <div class="switch-row">
        <div class="switch" :class="{ on: form.jwtEnabled }" @click="form.jwtEnabled = !form.jwtEnabled"></div>
        <div>
          <div class="sr-title">JWT 鉴权</div>
          <div class="section-desc">对外接口调用需携带有效令牌</div>
        </div>
      </div>
      <div class="switch-row">
        <div class="switch" :class="{ on: form.integrated }" @click="form.integrated = !form.integrated"></div>
        <div>
          <div class="sr-title">全局资源池集成</div>
          <div class="section-desc">与全局智能体资源池保持同步，可引入注册 Agent</div>
        </div>
      </div>
      <div class="switch-row">
        <div class="switch" :class="{ on: form.status === 'archived' }" @click="toggleFormStatus"></div>
        <div>
          <div class="sr-title">归档为只读</div>
          <div class="section-desc">归档后空间不可进入，成员无法发起对话与修改配置</div>
        </div>
      </div>

      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="form = null">取消</button>
        <button class="btn btn-primary" @click="save">{{ form.id ? '保存' : '新增' }}</button>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SideDrawer from '@/components/SideDrawer.vue'
import { useBusinessSpaceStore } from '@/stores/spaces'
import { useSpaceStore } from '@/stores/space'
import { useChatStore } from '@/stores/chat'
import { useUiStore } from '@/stores/ui'
import { SPACE_CATEGORIES, SPACE_COLORS, SPACE_ORGS, SPACE_STRATEGIES } from '@/services/catalog'
import { formatTime, fromNow } from '@/utils/format'

const RANGES = [
  ['memberLimit', 1, 200, '团队规模上限'],
  ['concurrency', 1, 64, 'Agent 并发任务上限'],
  ['jwtTtl', 1, 168, 'JWT 令牌有效期'],
  ['sessionRetainDays', 1, 365, '会话保留天数'],
  ['sessionMaxCount', 10, 1000, '会话条数上限']
]

const router = useRouter()
const store = useBusinessSpaceStore()
const space = useSpaceStore()
const chat = useChatStore()
const ui = useUiStore()

const draft = reactive({ keyword: '', category: '' })
const query = reactive({ keyword: '', category: '' })
const filterOpen = ref(true)
const sampledAt = ref(formatTime(Date.now()))
const form = ref(null)
const tagInput = ref('')
const error = ref('')

const filtered = computed(() => {
  const kw = query.keyword.trim().toLowerCase()
  return store.spaces.filter(
    (item) =>
      (!kw || `${item.name} ${item.org} ${item.tags.join(' ')}`.toLowerCase().includes(kw)) &&
      (!query.category || item.category === query.category)
  )
})

const strategyHint = computed(() => SPACE_STRATEGIES.find((s) => s.value === form.value?.scheduleStrategy)?.hint || '')

const initial = (name) => String(name).trim().slice(0, 1).toUpperCase()

function avatarStyle(item) {
  const color = store.colorOf(item.color)
  return { background: `linear-gradient(135deg, ${color.from}, ${color.to})` }
}

function applyFilter() {
  query.keyword = draft.keyword
  query.category = draft.category
}

function resetFilter() {
  draft.keyword = ''
  draft.category = ''
  applyFilter()
}

function refresh() {
  store.reload()
  sampledAt.value = formatTime(Date.now())
  ui.notify('业务空间列表已刷新')
}

function openCreate() {
  error.value = ''
  tagInput.value = ''
  form.value = {
    id: '',
    name: '',
    category: SPACE_CATEGORIES[0],
    color: SPACE_COLORS[0].value,
    org: '',
    description: '',
    tags: [],
    status: 'active',
    memberLimit: 15,
    scheduleStrategy: 'tag',
    tagRouting: true,
    jwtEnabled: true,
    jwtTtl: 8,
    schedulerEnabled: true,
    sessionRetainDays: 30,
    sessionMaxCount: 100,
    concurrency: 8,
    integrated: true
  }
}

function openEdit(item) {
  error.value = ''
  tagInput.value = ''
  form.value = { ...item, tags: [...item.tags] }
}

function addTag() {
  const value = tagInput.value.trim()
  if (!value) return
  if (!form.value.tags.includes(value)) form.value.tags.push(value)
  tagInput.value = ''
}

function dropTag(tag) {
  form.value.tags = form.value.tags.filter((t) => t !== tag)
}

function toggleFormStatus() {
  form.value.status = form.value.status === 'archived' ? 'active' : 'archived'
}

function save() {
  const data = form.value
  if (!String(data.name).trim()) {
    error.value = '请填写空间名称'
    return
  }
  if (store.nameExists(data.name, data.id)) {
    error.value = '该空间名称已存在'
    return
  }
  if (!String(data.org).trim()) {
    error.value = '请填写所属组织'
    return
  }
  if (!String(data.description).trim()) {
    error.value = '请填写空间描述'
    return
  }
  const bad = RANGES.find(([key, min, max]) => !Number.isFinite(data[key]) || data[key] < min || data[key] > max)
  if (bad) {
    error.value = `${bad[3]}需在 ${bad[1]} 至 ${bad[2]} 之间`
    return
  }
  if (data.id === store.activeId) {
    if (data.memberLimit < space.memberCount) {
      error.value = `团队规模上限不可低于当前成员数 ${space.memberCount}`
      return
    }
    if (data.sessionMaxCount < chat.sessions.length) {
      error.value = `会话条数上限不可低于当前会话数 ${chat.sessions.length}`
      return
    }
  }
  const payload = {
    ...data,
    name: String(data.name).trim(),
    org: String(data.org).trim(),
    description: String(data.description).trim()
  }
  if (data.id) {
    store.update(data.id, payload)
    ui.notify('业务空间已更新')
  } else {
    store.create(payload)
    ui.notify('业务空间已创建')
  }
  form.value = null
}

async function removeSpace(item) {
  if (item.id === store.activeId) {
    ui.notify('当前已进入的空间不可删除，请先进入其他空间', 'error')
    return
  }
  const ok = await ui.confirm({
    title: '删除业务空间',
    message: `删除后「${item.name}」的空间配置与标签将不再保留，请输入空间名称确认。`,
    danger: true,
    confirmText: '删除',
    requireText: item.name
  })
  if (!ok) return
  store.remove(item.id)
  ui.notify('业务空间已删除')
}

function cloneSpace(item) {
  const copy = store.clone(item.id)
  ui.notify(`已克隆为「${copy.name}」，可继续调整配置`)
}

function enterSpace(item) {
  if (item.id === store.activeId) {
    router.push('/overview')
    return
  }
  if (item.status === 'archived') {
    ui.notify('已归档空间为只读状态，请先恢复为活跃状态', 'error')
    return
  }
  store.enter(item.id)
  ui.notify(`已进入「${item.name}」`)
  router.push('/overview')
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.fl {
  color: var(--text-2);
  font-size: 12.5px;
}

.act-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -4px;
}

.act-bar .spacer {
  flex: 1;
}

.btn-outline {
  border-color: rgba(52, 161, 225, 0.45);
  color: var(--cyan);
  background: rgba(52, 161, 225, 0.07);
}

.icon-round {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 50%;
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--text-2);
  font-size: 12px;
  cursor: pointer;
}

.icon-round:hover {
  border-color: rgba(52, 161, 225, 0.45);
  color: var(--cyan);
}

.space-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(324px, 1fr));
  gap: 16px;
}
.space-card {
  display: flex;
  flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  transition: 0.16s;
}

.space-card:hover {
  border-color: var(--line-2);
  box-shadow: var(--shadow);
}

.space-card.current {
  border-color: rgba(52, 161, 225, 0.4);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
}

.ava {
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
}

.head-text {
  min-width: 0;
  flex: 1;
}

.card-name {
  font-size: 13.5px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.head-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.card-time {
  color: var(--text-3);
  font-size: 11px;
}
.cat {
  flex: none;
  color: var(--text-2);
  font-size: 12px;
}

.card-body {
  flex: 1;
  padding: 12px 16px 14px;
}

.blk + .blk {
  margin-top: 14px;
}

.blk-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-3);
  font-size: 11.5px;
}

.desc {
  color: var(--text-2);
  font-size: 12.3px;
  line-height: 1.85;
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}

.org {
  color: var(--text);
  font-size: 12.3px;
  margin-top: 6px;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding: 10px 16px;
  border-top: 1px solid var(--line);
}

.card-foot .link-btn.muted {
  color: var(--text-3);
}

.tag-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-x {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 9px;
  margin-left: 4px;
  padding: 0;
  opacity: 0.7;
}

.tag-x:hover {
  opacity: 1;
}

.color-pick {
  display: flex;
  gap: 8px;
}

.color-btn {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid transparent;
  cursor: pointer;
}

.color-btn.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(52, 161, 225, 0.35);
}

.sec-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  border-top: 1px solid var(--line);
  padding-top: 14px;
  margin-bottom: 10px;
}
</style>
