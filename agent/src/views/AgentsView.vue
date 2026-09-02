<template>
  <div class="page stack">
    <section class="panel">
      <div class="toolbar">
        <div class="tabs">
          <button :class="{ active: tab === 'team' }" @click="tab = 'team'">团队 Agent · {{ agentStore.total }}</button>
          <button :class="{ active: tab === 'registry' }" @click="tab = 'registry'">全局资源池 · {{ space.registrySize }}</button>
        </div>
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="keyword" class="input" placeholder="搜索名称 / 编码 / 描述" />
        </div>
        <select v-model="categoryFilter" class="select" style="width: 132px">
          <option value="">全部类型</option>
          <option v-for="c in AGENT_CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-if="tab === 'team'" v-model="statusFilter" class="select" style="width: 112px">
          <option value="">全部状态</option>
          <option value="running">运行中</option>
          <option value="stopped">已停用</option>
        </select>
        <span class="spacer"></span>
        <template v-if="tab === 'team'">
          <button class="btn btn-sm" @click="exportConfig">导出配置</button>
          <button class="btn btn-sm" @click="pickImport">导入配置</button>
          <input ref="importInput" type="file" accept="application/json" class="hidden-file" @change="onImportFile" />
          <button class="btn btn-primary btn-sm" @click="openCreate">+ 新建 Agent</button>
        </template>
        <template v-else>
          <button class="btn btn-primary btn-sm" :disabled="!selected.length" @click="importSelected">
            引入所选 {{ selected.length ? `(${selected.length})` : '' }}
          </button>
        </template>
      </div>

      <div v-if="tab === 'team'" class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>名称</th>
              <th>编码</th>
              <th>类型</th>
              <th>版本</th>
              <th>状态</th>
              <th>绑定资源</th>
              <th>调用次数</th>
              <th>更新时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in pagedTeam" :key="agent.id">
              <td>
                <div class="cell-main">
                  {{ agent.name }}
                  <span v-if="agent.isMain" class="badge badge-cyan" style="margin-left: 6px">调度中枢</span>
                </div>
                <div class="cell-sub">{{ agent.description }}</div>
              </td>
              <td><span class="mono">{{ agent.code }}</span></td>
              <td>{{ agent.category }}</td>
              <td><span class="mono">{{ agent.version }}</span></td>
              <td>
                <span class="badge" :class="agent.status === 'running' ? 'badge-green' : 'badge-gray'">
                  <i class="dot"></i>{{ agent.status === 'running' ? '运行中' : '已停用' }}
                </span>
              </td>
              <td class="cell-sub">技能 {{ agent.skillIds.length }} · 知识库 {{ agent.kbIds.length }} · 标签 {{ agent.tags.length }}</td>
              <td>{{ agent.calls }}</td>
              <td class="cell-sub">{{ formatDateTime(agent.updatedAt) }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button class="link-btn" @click="detail = agent">详情</button>
                  <button class="link-btn" @click="openEdit(agent)">编辑</button>
                  <button class="link-btn" @click="toggle(agent)">{{ agent.status === 'running' ? '停用' : '启用' }}</button>
                  <button v-if="!agent.isMain" class="link-btn" @click="promote(agent)">设为Main</button>
                  <button class="link-btn danger" @click="removeAgent(agent)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredTeam.length">
              <td colspan="9">
                <div class="empty"><div class="empty-icon">🤖</div>没有符合条件的 Agent</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th style="width: 36px">
                <input type="checkbox" :checked="allChecked" @change="toggleAll" />
              </th>
              <th>名称</th>
              <th>编码</th>
              <th>分类</th>
              <th>版本</th>
              <th>能力</th>
              <th>注册时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagedRegistry" :key="item.id">
              <td>
                <input type="checkbox" :disabled="item.imported" :checked="selected.includes(item.code)" @change="toggleOne(item.code)" />
              </td>
              <td>
                <div class="cell-main">{{ item.name }}</div>
                <div class="cell-sub">{{ item.description }}</div>
              </td>
              <td><span class="mono">{{ item.code }}</span></td>
              <td>{{ item.category }}</td>
              <td><span class="mono">{{ item.version }}</span></td>
              <td>
                <span v-for="cap in item.capabilities" :key="cap" class="tag-chip" style="margin-right: 4px">{{ cap }}</span>
              </td>
              <td class="cell-sub">{{ formatDate(item.registeredAt) }}</td>
              <td class="col-actions">
                <span v-if="item.imported" class="badge badge-gray">已引入</span>
                <button v-else class="link-btn" @click="importOne(item)">引入空间</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DataPager
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="tab === 'team' ? filteredTeam.length : filteredRegistry.length"
      />
    </section>

    <SideDrawer v-if="form" :title="form.id ? '编辑 Agent' : '新建 Agent'" :subtitle="form.id ? form.name : '配置后即可在对话中被调度'" :width="560" @close="form = null">
      <div class="grid-2">
        <div class="field">
          <label class="field-label">名称<span class="req">*</span></label>
          <input v-model="form.name" class="input" placeholder="例如 环境合规审查Agent" />
        </div>
        <div class="field">
          <label class="field-label">编码<span class="req">*</span></label>
          <input v-model="form.code" class="input" placeholder="小写字母与连字符" :disabled="!!form.id" />
        </div>
        <div class="field">
          <label class="field-label">类型</label>
          <select v-model="form.category" class="select">
            <option v-for="c in AGENT_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">版本</label>
          <input v-model="form.version" class="input" placeholder="v1.0.0" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">描述</label>
        <textarea v-model="form.description" class="textarea" rows="2" placeholder="说明该 Agent 承担的业务职责"></textarea>
      </div>
      <div class="field">
        <label class="field-label">系统提示词</label>
        <textarea v-model="form.prompt" class="textarea" rows="4" placeholder="定义角色、输出要求与依据来源"></textarea>
      </div>
      <div class="field">
        <label class="field-label">运行状态</label>
        <div class="row">
          <div class="switch" :class="{ on: form.status === 'running' }" @click="form.status = form.status === 'running' ? 'stopped' : 'running'"></div>
          <span class="section-desc">{{ form.status === 'running' ? '创建后立即参与调度' : '保存为停用状态' }}</span>
        </div>
      </div>
      <div class="field">
        <label class="field-label">绑定技能</label>
        <CheckGroup v-model="form.skillIds" :options="skillOptions" />
      </div>
      <div class="field">
        <label class="field-label">绑定知识库</label>
        <CheckGroup v-model="form.kbIds" :options="kbOptions" />
      </div>
      <div class="field">
        <label class="field-label">业务标签</label>
        <CheckGroup v-model="form.tags" :options="tagOptions" />
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="form = null">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </template>
    </SideDrawer>

    <BaseModal v-if="detail" :title="detail.name" :width="620" @close="detail = null">
      <div class="kv">
        <div class="kv-item"><div class="k">编码</div><div class="v mono">{{ detail.code }}</div></div>
        <div class="kv-item"><div class="k">类型</div><div class="v">{{ detail.category }}</div></div>
        <div class="kv-item"><div class="k">版本 / 协议</div><div class="v mono">{{ detail.version }} · {{ detail.protocol }}</div></div>
        <div class="kv-item"><div class="k">状态</div><div class="v">{{ detail.status === 'running' ? '运行中' : '已停用' }}</div></div>
        <div class="kv-item"><div class="k">累计调用</div><div class="v">{{ detail.calls }} 次</div></div>
        <div class="kv-item"><div class="k">来源</div><div class="v">{{ sourceLabel(detail.source) }}</div></div>
        <div class="kv-item"><div class="k">创建时间</div><div class="v">{{ formatDateTime(detail.createdAt) }}</div></div>
        <div class="kv-item"><div class="k">更新时间</div><div class="v">{{ formatDateTime(detail.updatedAt) }}</div></div>
      </div>
      <div class="detail-block">
        <div class="k">描述</div>
        <p class="detail-text">{{ detail.description || '未填写' }}</p>
      </div>
      <div class="detail-block">
        <div class="k">系统提示词</div>
        <p class="detail-text prompt">{{ detail.prompt || '未配置' }}</p>
      </div>
      <div class="detail-block">
        <div class="k">绑定技能</div>
        <div class="row" style="flex-wrap: wrap; margin-top: 6px">
          <span v-for="id in detail.skillIds" :key="id" class="badge badge-cyan">{{ skillStore.byId(id)?.name || id }}</span>
          <span v-if="!detail.skillIds.length" class="section-desc">未绑定</span>
        </div>
      </div>
      <div class="detail-block">
        <div class="k">绑定知识库</div>
        <div class="row" style="flex-wrap: wrap; margin-top: 6px">
          <span v-for="id in detail.kbIds" :key="id" class="badge badge-purple">{{ knowledge.baseById(id)?.name || id }}</span>
          <span v-if="!detail.kbIds.length" class="section-desc">未绑定</span>
        </div>
      </div>
      <div class="detail-block">
        <div class="k">业务标签</div>
        <div class="row" style="flex-wrap: wrap; margin-top: 6px">
          <span v-for="tag in detail.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          <span v-if="!detail.tags.length" class="section-desc">未分配</span>
        </div>
      </div>
      <template #footer>
        <button class="btn" @click="detail = null">关闭</button>
        <button class="btn btn-primary" @click="openEdit(detail)">编辑配置</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import CheckGroup from '@/components/CheckGroup.vue'
import DataPager from '@/components/DataPager.vue'
import { useAgentStore } from '@/stores/agents'
import { useSkillStore } from '@/stores/skills'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { AGENT_CATEGORIES, BUSINESS_TAGS } from '@/services/catalog'
import { formatDate, formatDateTime, downloadFile } from '@/utils/format'

const agentStore = useAgentStore()
const skillStore = useSkillStore()
const knowledge = useKnowledgeStore()
const space = useSpaceStore()
const ui = useUiStore()

const tab = ref('team')
const keyword = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const form = ref(null)
const detail = ref(null)
const error = ref('')
const selected = ref([])
const importInput = ref(null)

const skillOptions = computed(() => skillStore.skills.map((s) => ({ value: s.id, label: `${s.name} · ${s.version}` })))
const kbOptions = computed(() => knowledge.bases.map((b) => ({ value: b.id, label: b.name })))
const tagOptions = BUSINESS_TAGS.map((t) => ({ value: t, label: t }))
const sourceLabel = (source) => ({ 'built-in': '空间内置', registry: '全局资源池', custom: '自定义创建' }[source] || source)

function match(text) {
  const kw = keyword.value.trim().toLowerCase()
  return !kw || String(text).toLowerCase().includes(kw)
}

const filteredTeam = computed(() =>
  agentStore.agents.filter(
    (a) =>
      (match(a.name) || match(a.code) || match(a.description)) &&
      (!categoryFilter.value || a.category === categoryFilter.value) &&
      (!statusFilter.value || a.status === statusFilter.value)
  )
)

const filteredRegistry = computed(() =>
  agentStore.registry.filter(
    (r) => (match(r.name) || match(r.code) || match(r.description)) && (!categoryFilter.value || r.category === categoryFilter.value)
  )
)

const pagedTeam = computed(() => filteredTeam.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const pagedRegistry = computed(() => filteredRegistry.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const allChecked = computed(() => {
  const available = pagedRegistry.value.filter((r) => !r.imported)
  return available.length > 0 && available.every((r) => selected.value.includes(r.code))
})

watch([keyword, categoryFilter, statusFilter, tab], () => {
  page.value = 1
  selected.value = []
})

function emptyForm() {
  return {
    id: '',
    name: '',
    code: '',
    category: AGENT_CATEGORIES[1],
    version: 'v1.0.0',
    status: 'running',
    description: '',
    prompt: '',
    skillIds: [],
    kbIds: [],
    tags: []
  }
}

function openCreate() {
  error.value = ''
  form.value = emptyForm()
}

function openEdit(agent) {
  error.value = ''
  detail.value = null
  form.value = { ...agent, skillIds: [...agent.skillIds], kbIds: [...agent.kbIds], tags: [...agent.tags] }
}

function save() {
  const data = form.value
  if (!data.name.trim()) {
    error.value = '请填写 Agent 名称'
    return
  }
  if (!/^[a-z0-9-]{2,32}$/.test(data.code)) {
    error.value = '编码需为 2-32 位小写字母、数字或连字符'
    return
  }
  const duplicated = agentStore.agents.some((a) => a.code === data.code && a.id !== data.id)
  if (duplicated) {
    error.value = '该编码已存在'
    return
  }
  if (data.id) {
    agentStore.update(data.id, data)
    ui.notify('Agent 配置已保存')
  } else {
    agentStore.create(data)
    ui.notify('Agent 已创建')
  }
  form.value = null
}

function toggle(agent) {
  agentStore.toggleStatus(agent.id)
  ui.notify(`${agent.name} 已${agent.status === 'running' ? '启用' : '停用'}`)
}

async function promote(agent) {
  const ok = await ui.confirm({
    title: '设为 Main Agent',
    message: `将「${agent.name}」设为调度中枢，原 Main Agent 转为业务 Agent。`,
    confirmText: '确认设置'
  })
  if (!ok) return
  agentStore.setMain(agent.id)
  ui.notify('调度中枢已更新')
}

async function removeAgent(agent) {
  if (agent.isMain) {
    ui.notify('Main Agent 需先指定新的调度中枢后才能移除', 'error')
    return
  }
  const ok = await ui.confirm({ title: '移除 Agent', message: `确认将「${agent.name}」移出团队空间？`, danger: true, confirmText: '移除' })
  if (!ok) return
  agentStore.remove(agent.id)
  ui.notify('Agent 已移除')
}

function toggleOne(code) {
  const index = selected.value.indexOf(code)
  if (index >= 0) selected.value.splice(index, 1)
  else selected.value.push(code)
}

function toggleAll() {
  const available = pagedRegistry.value.filter((r) => !r.imported).map((r) => r.code)
  selected.value = allChecked.value ? [] : available
}

function importOne(item) {
  agentStore.importFromRegistry([item.code])
  ui.notify(`${item.name} 已引入团队空间`)
}

function importSelected() {
  const created = agentStore.importFromRegistry(selected.value)
  selected.value = []
  ui.notify(`已引入 ${created.length} 个 Agent`)
  tab.value = 'team'
}

function exportConfig() {
  downloadFile('agents-config.json', JSON.stringify(agentStore.agents, null, 2))
  ui.notify('Agent 配置已导出')
}

function pickImport() {
  importInput.value?.click()
}

function onImportFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const list = JSON.parse(String(reader.result))
      const count = agentStore.importConfig(Array.isArray(list) ? list : [list])
      ui.notify(count ? `已导入 ${count} 个 Agent 配置` : '文件中没有可导入的新配置', count ? 'success' : 'info')
    } catch (e) {
      ui.notify('配置文件解析失败', 'error')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}
</script>

<style scoped>
.hidden-file {
  display: none;
}

.detail-block {
  margin-top: 16px;
}

.detail-block .k {
  color: var(--text-3);
  font-size: 11.5px;
}

.detail-text {
  margin-top: 5px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-2);
}

.prompt {
  background: #0D2139;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  white-space: pre-wrap;
}
</style>
