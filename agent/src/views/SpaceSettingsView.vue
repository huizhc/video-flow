<template>
  <div class="page stack">
    <nav class="tabbar">
      <button
        v-for="item in TABS"
        :key="item.key"
        class="tabbar-item"
        :class="{ active: tab === item.key }"
        @click="tab = item.key"
      >
        <span>{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <template v-if="tab === 'basic'">
      <section class="panel">
        <div class="panel-head">
          <span>⚙️</span>
          <span class="panel-title">基本设置</span>
          <span class="spacer"></span>
          <span class="section-desc">团队信息与系统配置</span>
        </div>
        <div class="panel-body form-col">
          <div class="field">
            <label class="field-label"
              >团队名称<span class="req">*</span></label
            >
            <input v-model="basic.name" class="input" maxlength="30" />
            <p v-if="basicError" class="field-error">{{ basicError }}</p>
          </div>
          <div class="field">
            <label class="field-label">空间ID</label>
            <div class="readonly mono">{{ space.spaceId }}</div>
          </div>
          <div class="field">
            <label class="field-label">成员上限</label>
            <input
              v-model.number="basic.memberLimit"
              class="input"
              type="number"
              min="1"
              max="200"
            />
          </div>
          <div class="field">
            <label class="field-label">Main Agent</label>
            <input
              v-model.trim="basic.mainAgentEndpoint"
              class="input"
              placeholder="http://localhost:3003"
            />
          </div>
          <div class="btnWrap">
            <button class="btn btn-save" @click="submitBasic">
              💾 保存设置
            </button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">对话欢迎词</span>
          <span class="spacer"></span>
          <span class="section-desc">Agent 智能对话首页展示</span>
        </div>
        <div class="panel-body form-col">
          <div class="field">
            <label class="field-label">图标</label>
            <div class="icon-upload">
              <button
                class="icon-preview"
                title="点击上传图标"
                @click="pickIcon"
              >
                <img
                  v-if="iconIsImage"
                  :src="welcome.icon"
                  class="icon-img"
                  alt="对话图标"
                />
                <span v-else class="icon-glyph">{{ welcome.icon }}</span>
                <span class="icon-mask">上传</span>
              </button>
              <div class="icon-side">
                <div class="icon-ops">
                  <!-- <button class="btn btn-sm" @click="pickIcon">选择图片</button> -->
                  <button
                    v-if="iconIsImage"
                    class="btn btn-sm"
                    @click="resetIcon"
                  >
                    恢复默认
                  </button>
                </div>
              </div>
              <input
                ref="iconInput"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                class="hidden-file"
                @change="onIconFile"
              />
            </div>
          </div>
          <div class="field">
            <label class="field-label">标题<span class="req">*</span></label>
            <input v-model="welcome.title" class="input" maxlength="24" />
          </div>
          <div class="field" style="grid-column: span 2 / span 2">
            <label class="field-label">描述</label>
            <textarea
              v-model="welcome.desc"
              class="textarea"
              rows="2"
              maxlength="90"
            ></textarea>
          </div>
          <div class="field">
            <label class="field-label">默认问题</label>
            <div
              v-for="(item, index) in welcome.questions"
              :key="item.id"
              class="q-row"
            >
              <select v-model="item.icon" class="select q-icon">
                <option v-for="icon in WELCOME_ICONS" :key="icon" :value="icon">
                  {{ icon }}
                </option>
              </select>
              <input
                v-model="item.text"
                class="input"
                maxlength="40"
                placeholder="用户点击即可发起的问题"
              />
              <button
                class="btn btn-icon btn-sm"
                title="删除"
                @click="dropQuestion(index)"
              >
                ✕
              </button>
            </div>
            <button
              v-if="welcome.questions.length < 6"
              class="btn btn-sm add-q"
              @click="addQuestion"
            >
              + 添加问题
            </button>
            <p v-if="welcomeError" class="field-error">{{ welcomeError }}</p>
          </div>
          <div
            style="
              grid-column: span 2 / span 2;
              display: flex;
              justify-content: flex-end;
            "
          >
            <button class="btn btn-save" @click="submitWelcome">
              💾 保存设置
            </button>
          </div>
        </div>
      </section>
    </template>
    <section v-else-if="tab === 'resource'" class="panel">
      <div class="panel-head">
        <span>📦</span>
        <span class="panel-title">空间资源管理</span>
        <span class="spacer"></span>
        <span class="section-desc">从全局资源池中选择本空间使用的资源</span>
      </div>
      <div class="panel-body">
        <p class="tip">
          以下列表显示系统管理员已分配给本空间的<span class="hl"
            >可用资源池</span
          >。开启某项资源后，成员可访问对应功能。
        </p>

        <div
          v-for="group in RESOURCE_GROUPS"
          :key="group.key"
          class="res-group"
        >
          <div class="res-head">
            <span>{{ group.icon }}</span>
            <span class="res-title">{{ group.title }}</span>
            <span class="spacer"></span>
            <span class="res-count"
              >{{ picked[group.key].length }}/{{
                group.items.length
              }}
              已启用</span
            >
          </div>
          <div class="res-grid">
            <label
              v-for="item in group.items"
              :key="item.code"
              class="res-item"
              :class="{ on: picked[group.key].includes(item.code) }"
            >
              <input
                type="checkbox"
                :checked="picked[group.key].includes(item.code)"
                @change="toggleResource(group.key, item.code)"
              />
              <span class="res-text">
                <span class="res-name">{{ item.name }}</span>
                <span v-if="item.desc" class="res-desc">{{ item.desc }}</span>
              </span>
            </label>
          </div>
        </div>

        <div class="res-foot">
          <button class="btn btn-save" @click="submitResources">
            保存资源配置
          </button>
        </div>
      </div>
    </section>
    <template v-else>
      <section class="panel">
        <div class="panel-head">
          <span>🔍</span>
          <span class="panel-title">检索参数</span>
          <span class="spacer"></span>
          <span class="section-desc">Agent 应答时的知识召回策略</span>
        </div>
        <div class="panel-body">
          <div class="grid-2">
            <div class="field">
              <label class="field-label">向量模型</label>
              <select v-model="retrieval.model" class="select">
                <option
                  v-for="model in EMBED_MODELS"
                  :key="model"
                  :value="model"
                >
                  {{ model }}
                </option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">未命中处理</label>
              <select v-model="retrieval.fallback" class="select">
                <option
                  v-for="item in RETRIEVAL_FALLBACKS"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
              <p class="field-hint">{{ fallbackHint }}</p>
            </div>
            <div class="field">
              <label class="field-label">召回条数</label>
              <input
                v-model.number="retrieval.topK"
                class="input"
                type="number"
                min="1"
                max="8"
              />
              <p class="field-hint">单次应答最多引用的文档片段数</p>
            </div>
            <div class="field">
              <label class="field-label">相关度阈值</label>
              <input
                v-model.number="retrieval.minScore"
                class="input"
                type="number"
                min="1"
                max="30"
              />
              <p class="field-hint">低于该分值的文档不参与应答</p>
            </div>
            <div class="field">
              <label class="field-label">切片长度</label>
              <input
                v-model.number="retrieval.chunkSize"
                class="input"
                type="number"
                min="128"
                max="2048"
                step="64"
              />
            </div>
            <div class="field">
              <label class="field-label">切片重叠</label>
              <input
                v-model.number="retrieval.chunkOverlap"
                class="input"
                type="number"
                min="0"
                max="512"
                step="16"
              />
            </div>
          </div>
          <div class="switch-row">
            <div class="sr-text">
              <div class="sr-title">应答附带引用来源</div>
              <div class="sr-desc">
                在回答末尾列出命中的知识文档，可直接跳转原文
              </div>
            </div>
            <div
              class="switch"
              :class="{ on: retrieval.citation }"
              @click="retrieval.citation = !retrieval.citation"
            ></div>
          </div>
          <div class="switch-row">
            <div class="sr-text">
              <div class="sr-title">阈值兜底放宽</div>
              <div class="sr-desc">
                首轮无命中时按半数阈值重试一次，减少空答
              </div>
            </div>
            <div
              class="switch"
              :class="{ on: retrieval.loosen }"
              @click="retrieval.loosen = !retrieval.loosen"
            ></div>
          </div>
          <button class="btn btn-save" @click="submitRetrieval">
            💾 保存设置
          </button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span>📚</span>
          <span class="panel-title">知识库接入</span>
          <span class="spacer"></span>
          <span class="section-desc"
            >{{ activeBaseCount }}/{{
              knowledge.bases.length
            }}
            个知识库参与检索</span
          >
        </div>
        <div v-if="baseRows.length" class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th>知识库</th>
                <th>业务域</th>
                <th>文档</th>
                <th>索引状态</th>
                <th style="width: 108px">检索权重</th>
                <th style="width: 96px">参与检索</th>
                <th class="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="base in baseRows" :key="base.id">
                <td>
                  <div class="cell-main">{{ base.name }}</div>
                  <div class="cell-sub">{{ base.model }}</div>
                </td>
                <td>{{ base.domain }}</td>
                <td>{{ base.docCount }} 篇</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      base.indexStatus === 'ready'
                        ? 'badge-cyan'
                        : base.indexStatus === 'building'
                          ? 'badge-amber'
                          : 'badge-gray'
                    "
                  >
                    {{ indexLabel(base.indexStatus) }}
                  </span>
                </td>
                <td>
                  <input
                    v-model.number="baseDraft[base.id].weight"
                    class="input weight"
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    :disabled="!baseDraft[base.id].enabled"
                  />
                </td>
                <td>
                  <div
                    class="switch"
                    :class="{ on: baseDraft[base.id].enabled }"
                    @click="
                      baseDraft[base.id].enabled = !baseDraft[base.id].enabled
                    "
                  ></div>
                </td>
                <td class="col-actions">
                  <button class="link-btn" @click="rebuild(base)">
                    重建索引
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty">
          <div class="empty-icon">📚</div>
          <div>当前空间还没有知识库，可在知识库页面新建后回到此处配置检索</div>
        </div>
        <div v-if="baseRows.length" class="panel-body">
          <button class="btn btn-save" @click="submitBases">💾 保存设置</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span>🔤</span>
          <span class="panel-title">术语同义词</span>
          <span class="spacer"></span>
          <span class="section-desc">提问命中别名时按主术语扩展检索</span>
          <button class="btn btn-primary btn-sm" @click="openSynonym()">
            + 新增术语
          </button>
        </div>
        <div v-if="settings.synonyms.length" class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th style="width: 148px">主术语</th>
                <th>同义词 / 缩写</th>
                <th>说明</th>
                <th style="width: 132px">更新时间</th>
                <th class="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in settings.synonyms" :key="item.id">
                <td class="cell-main">{{ item.term }}</td>
                <td>
                  <span
                    v-for="alias in item.aliases"
                    :key="alias"
                    class="tag-chip alias"
                    >{{ alias }}</span
                  >
                </td>
                <td class="cell-sub">{{ item.note || '—' }}</td>
                <td class="cell-sub">{{ formatDateTime(item.updatedAt) }}</td>
                <td class="col-actions">
                  <div class="row-actions">
                    <button class="link-btn" @click="openSynonym(item)">
                      编辑
                    </button>
                    <button class="link-btn danger" @click="dropSynonym(item)">
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty">
          <div class="empty-icon">🔤</div>
          <div>暂无术语同义词，新增后可提升口语化提问的召回率</div>
        </div>
      </section>
    </template>

    <BaseModal
      v-if="synonymOpen"
      :title="editing ? '编辑术语同义词' : '新增术语同义词'"
      :width="460"
      @close="closeSynonym"
    >
      <div class="field">
        <label class="field-label">主术语<span class="req">*</span></label>
        <input
          v-model.trim="synonymForm.term"
          class="input"
          maxlength="20"
          placeholder="如：排污许可"
        />
      </div>
      <div class="field">
        <label class="field-label"
          >同义词 / 缩写<span class="req">*</span></label
        >
        <input
          v-model="synonymForm.aliases"
          class="input"
          placeholder="多个用逗号分隔，如：排污证，排污许可证"
        />
        <p class="field-hint">提问命中任一别名时，按主术语一并检索</p>
      </div>
      <div class="field">
        <label class="field-label">说明</label>
        <textarea
          v-model="synonymForm.note"
          class="textarea"
          rows="2"
          maxlength="60"
        ></textarea>
      </div>
      <p v-if="synonymError" class="field-error">{{ synonymError }}</p>
      <template #footer>
        <button class="btn" @click="closeSynonym">取消</button>
        <button class="btn btn-primary" @click="submitSynonym">保存</button>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useSpaceStore } from '@/stores/space'
import { useSettingsStore } from '@/stores/settings'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useUiStore } from '@/stores/ui'
import {
  RESOURCE_GROUPS,
  WELCOME_ICONS,
  EMBED_MODELS,
  RETRIEVAL_FALLBACKS,
} from '@/services/catalog'
import { formatDateTime } from '@/utils/format'

const TABS = [
  { key: 'basic', icon: '⚙️', label: '基本设置' },
  { key: 'resource', icon: '📦', label: '资源管理' },
  { key: 'knowledge', icon: '📚', label: '知识库配置' },
]

const DEFAULT_WELCOME_ICON = '🤖'
const ICON_MAX_SIZE = 500 * 1024

const RETRIEVAL_KEYS = [
  'model',
  'topK',
  'minScore',
  'chunkSize',
  'chunkOverlap',
  'fallback',
  'citation',
  'loosen',
]

const spaceStore = useSpaceStore()
const settings = useSettingsStore()
const knowledge = useKnowledgeStore()
const ui = useUiStore()

const tab = ref('basic')
const space = computed(() => spaceStore.space)

const basic = reactive({ name: '', memberLimit: 0, mainAgentEndpoint: '' })
const basicError = ref('')
const welcome = reactive({
  icon: DEFAULT_WELCOME_ICON,
  title: '',
  desc: '',
  questions: [],
})
const welcomeError = ref('')
const iconInput = ref(null)
const picked = reactive({})
const retrieval = reactive({})
const baseDraft = reactive({})

const synonymOpen = ref(false)
const editing = ref(null)
const synonymForm = reactive({ term: '', aliases: '', note: '' })
const synonymError = ref('')

const indexLabel = (status) =>
  ({
    ready: '索引就绪',
    building: '索引中',
    stale: '待重建',
    pending: '未建索引',
  })[status] || status
const iconIsImage = computed(() => /^data:image\//.test(welcome.icon))
const baseRows = computed(() =>
  knowledge.list.filter((base) => baseDraft[base.id])
)
const activeBaseCount = computed(
  () => Object.values(baseDraft).filter((cfg) => cfg.enabled).length
)
const fallbackHint = computed(
  () =>
    RETRIEVAL_FALLBACKS.find((f) => f.value === retrieval.fallback)?.hint || ''
)

function loadBasic() {
  basic.name = space.value.name
  basic.memberLimit = space.value.memberLimit
  basic.mainAgentEndpoint = space.value.mainAgentEndpoint
  basicError.value = ''
}

function loadWelcome() {
  const src = settings.welcome
  welcome.icon = src.icon
  welcome.title = src.title
  welcome.desc = src.desc
  welcome.questions = src.questions.map((q) => ({ ...q }))
  welcomeError.value = ''
}

function loadResources() {
  RESOURCE_GROUPS.forEach((group) => {
    picked[group.key] = [...(settings.resources[group.key] || [])]
  })
}

function loadRetrieval() {
  RETRIEVAL_KEYS.forEach((key) => {
    retrieval[key] = settings.knowledge[key]
  })
}

function loadBases() {
  Object.keys(baseDraft).forEach((id) => delete baseDraft[id])
  knowledge.bases.forEach((base) => {
    baseDraft[base.id] = { ...settings.baseConfig(base.id) }
  })
}

spaceStore.ensureIdentity()
loadBasic()
loadWelcome()
loadResources()
loadRetrieval()
loadBases()

watch(() => knowledge.bases.map((b) => b.id).join(','), loadBases)

function submitBasic() {
  const name = basic.name.trim()
  if (!name) {
    basicError.value = '请填写团队名称'
    return
  }
  const limit = Math.min(
    Math.max(Number(basic.memberLimit) || 1, spaceStore.memberCount),
    200
  )
  basicError.value = ''
  basic.memberLimit = limit
  spaceStore.saveBasics({
    name,
    memberLimit: limit,
    mainAgentEndpoint: basic.mainAgentEndpoint || 'http://localhost:3003',
  })
  loadBasic()
  ui.notify('基本设置已保存')
}

function pickIcon() {
  iconInput.value?.click()
}

function onIconFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    welcomeError.value = '请选择图片文件作为对话图标'
    return
  }
  if (file.size > ICON_MAX_SIZE) {
    welcomeError.value = '图标图片不能超过 500KB'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    welcome.icon = String(reader.result)
    welcomeError.value = ''
  }
  reader.readAsDataURL(file)
}

function resetIcon() {
  welcome.icon = DEFAULT_WELCOME_ICON
}

function addQuestion() {
  welcome.questions.push({
    id: `wq-${Date.now().toString(36)}`,
    icon: '💬',
    text: '',
  })
}

function dropQuestion(index) {
  welcome.questions.splice(index, 1)
}

function submitWelcome() {
  if (!welcome.title.trim()) {
    welcomeError.value = '请填写欢迎标题'
    return
  }
  const questions = welcome.questions
    .filter((q) => q.text.trim())
    .map((q) => ({ ...q, text: q.text.trim() }))
  welcomeError.value = ''
  settings.saveWelcome({
    icon: welcome.icon,
    title: welcome.title.trim(),
    desc: welcome.desc.trim(),
    questions,
  })
  loadWelcome()
  ui.notify('对话欢迎词已保存')
}

function toggleResource(groupKey, code) {
  const list = picked[groupKey]
  const index = list.indexOf(code)
  if (index < 0) list.push(code)
  else list.splice(index, 1)
}

function submitResources() {
  settings.saveResources({ ...picked })
  loadResources()
  ui.notify(
    `资源配置已保存 · 启用 ${settings.enabledResources}/${settings.totalResources}`
  )
}

function submitRetrieval() {
  retrieval.topK = Math.min(Math.max(Number(retrieval.topK) || 3, 1), 8)
  retrieval.minScore = Math.min(
    Math.max(Number(retrieval.minScore) || 8, 1),
    30
  )
  retrieval.chunkSize = Math.min(
    Math.max(Number(retrieval.chunkSize) || 512, 128),
    2048
  )
  retrieval.chunkOverlap = Math.min(
    Math.max(Number(retrieval.chunkOverlap) || 0, 0),
    512
  )
  settings.saveKnowledge({ ...retrieval })
  loadRetrieval()
  ui.notify('检索参数已保存')
}

function submitBases() {
  Object.values(baseDraft).forEach((cfg) => {
    cfg.weight = Math.min(Math.max(Number(cfg.weight) || 1, 0.1), 5)
  })
  settings.saveBases({ ...baseDraft })
  loadBases()
  ui.notify('知识库接入已保存')
}

function rebuild(base) {
  knowledge.rebuildIndex(base.id)
  ui.notify(`「${base.name}」索引重建中`)
}

function openSynonym(item = null) {
  editing.value = item
  synonymForm.term = item?.term || ''
  synonymForm.aliases = item?.aliases.join('，') || ''
  synonymForm.note = item?.note || ''
  synonymError.value = ''
  synonymOpen.value = true
}

function closeSynonym() {
  synonymOpen.value = false
  editing.value = null
}

function submitSynonym() {
  const term = synonymForm.term.trim()
  const aliases = [
    ...new Set(
      synonymForm.aliases
        .split(/[,，、\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ]
  if (!term) {
    synonymError.value = '请填写主术语'
    return
  }
  if (!aliases.length) {
    synonymError.value = '请填写至少一个同义词'
    return
  }
  if (settings.termExists(term, editing.value?.id || '')) {
    synonymError.value = '该主术语已存在'
    return
  }
  const payload = { term, aliases, note: synonymForm.note.trim() }
  const target = editing.value
  if (target) settings.updateSynonym(target.id, payload)
  else settings.addSynonym(payload)
  closeSynonym()
  ui.notify(target ? '术语已更新' : '术语已新增')
}

async function dropSynonym(item) {
  const ok = await ui.confirm({
    title: '删除术语同义词',
    message: `确认删除「${item.term}」及其 ${item.aliases.length} 个同义词？`,
    danger: true,
    confirmText: '删除',
  })
  if (!ok) return
  settings.removeSynonym(item.id)
  ui.notify('术语已删除')
}
</script>
<style scoped>
.btnWrap {
  grid-column: span 2 / span 2;
  display: flex;
  justify-content: flex-end;
}
.tabbar {
  display: flex;
  align-items: center;
  gap: 26px;
  border-bottom: 1px solid var(--line);
}

.tabbar-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 2px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;
}

.tabbar-item:hover {
  color: var(--text);
}

.tabbar-item.active {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
  font-weight: 600;
}

.form-col {
  display: grid;
  column-gap: 14px;
  row-gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.readonly {
  height: 32px;
  display: flex;
  align-items: center;
  color: var(--text-2);
  letter-spacing: 0.3px;
}

.hidden-file {
  display: none;
}

.icon-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-preview {
  position: relative;
  width: 56px;
  height: 56px;
  flex: none;
  display: grid;
  place-items: center;
  padding: 0;
  overflow: hidden;
  border: 1px dashed var(--line-2);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  cursor: pointer;
  transition: 0.15s;
}

.icon-preview:hover {
  border-color: var(--cyan);
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-glyph {
  font-size: 26px;
  line-height: 1;
}

.icon-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 18px;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  opacity: 0;
  transition: 0.15s;
}

.icon-preview:hover .icon-mask {
  opacity: 1;
}

.icon-side {
  min-width: 0;
}

.icon-ops {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.btn-save {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
  font-weight: 600;
}

.btn-save:hover {
  background: #15803d;
  border-color: #15803d;
}

.q-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.q-icon {
  width: 62px;
  flex: none;
  padding-right: 22px;
}

.add-q {
  margin-top: 2px;
}

.tip {
  color: var(--text-2);
  font-size: 12px;
  margin-bottom: 14px;
}

.res-group {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: 14px;
  overflow: hidden;
}

.res-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px 0px 14px;
  background: var(--panel-2);
  font-size: 20px;
  font-weight: 600;
  /* border-bottom: 1px solid var(--line); */
}

.res-head .spacer {
  flex: 1;
}

.res-title {
  font-size: 12.5px;
  font-weight: 600;
}

.res-count {
  color: var(--text-3);
  font-size: 11.5px;
}
.res-grid {
  background: var(--panel-2);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px;
}

.res-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 11px;
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  background: #0d2139;
  cursor: pointer;
  transition: 0.15s;
}

.res-item:hover {
  border-color: #316098;
}

.res-item.on {
  border-color: rgba(52, 161, 225, 0.55);
  background: rgba(52, 161, 225, 0.1);
}

.res-item input {
  accent-color: var(--cyan);
  width: 14px;
  height: 14px;
  margin-top: 2px;
  flex: none;
  cursor: pointer;
}

.res-text {
  min-width: 0;
}

.res-name {
  display: block;
  font-size: 12.5px;
  white-space: nowrap;
}

.res-desc {
  display: block;
  margin-top: 2px;
  color: var(--text-3);
  font-size: 11px;
  line-height: 1.5;
  white-space: nowrap;
}
.res-foot {
  display: flex;
  justify-content: flex-end;
}

.weight {
  height: 26px;
  padding: 0 8px;
}

.weight:disabled {
  opacity: 0.45;
}

.alias + .alias {
  margin-left: 6px;
}
</style>
