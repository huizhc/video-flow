<template>
  <div class="page stack">
    <div class="stats">
      <StatCard icon="🧩" :value="skillStore.skills.length" label="技能总数" sub="已定义能力" tone="var(--cyan)" />
      <StatCard icon="✅" :value="skillStore.enabledSkills.length" label="启用中" sub="可被调度" tone="var(--green)" />
      <StatCard icon="🔓" :value="skillStore.sharedCount" label="跨成员共享" sub="全空间可用" tone="var(--purple)" />
      <StatCard icon="📈" :value="skillStore.totalCalls" label="累计调用" sub="全部技能" tone="var(--amber)" />
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="keyword" class="input" placeholder="搜索名称 / 编码 / 描述" />
        </div>
        <select v-model="categoryFilter" class="select" style="width: 128px">
          <option value="">全部分类</option>
          <option v-for="c in SKILL_CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="statusFilter" class="select" style="width: 112px">
          <option value="">全部状态</option>
          <option value="enabled">已启用</option>
          <option value="disabled">已停用</option>
        </select>
        <span class="spacer"></span>
        <button class="btn btn-primary btn-sm" @click="openCreate">+ 新建技能</button>
      </div>

      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>名称</th>
              <th>编码</th>
              <th>分类</th>
              <th>版本</th>
              <th>状态</th>
              <th>共享</th>
              <th>授权 Agent</th>
              <th>调用次数</th>
              <th>更新时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in paged" :key="skill.id">
              <td>
                <div class="cell-main">{{ skill.name }}</div>
                <div class="cell-sub">{{ skill.description }}</div>
              </td>
              <td><span class="mono">{{ skill.code }}</span></td>
              <td>{{ skill.category }}</td>
              <td><span class="mono">{{ skill.version }}</span></td>
              <td>
                <span class="badge" :class="skill.status === 'enabled' ? 'badge-green' : 'badge-gray'">
                  <i class="dot"></i>{{ skill.status === 'enabled' ? '已启用' : '已停用' }}
                </span>
              </td>
              <td>
                <div class="switch" :class="{ on: skill.shared }" @click="switchShared(skill)"></div>
              </td>
              <td class="cell-sub">{{ boundAgentNames(skill.id) }}</td>
              <td>{{ skill.calls }}</td>
              <td class="cell-sub">{{ formatDateTime(skill.updatedAt) }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button class="link-btn" @click="detail = skill">详情</button>
                  <button class="link-btn" @click="openEdit(skill)">编辑</button>
                  <button class="link-btn" @click="openTest(skill)">测试</button>
                  <button class="link-btn" @click="openAssign(skill)">分配</button>
                  <button class="link-btn" @click="switchStatus(skill)">{{ skill.status === 'enabled' ? '停用' : '启用' }}</button>
                  <button class="link-btn danger" @click="removeSkill(skill)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="10">
                <div class="empty"><div class="empty-icon">🧩</div>没有符合条件的技能</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DataPager v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" />
    </section>

    <SideDrawer v-if="form" :title="form.id ? '编辑技能' : '新建技能'" :subtitle="form.id ? form.code : '定义可被 Agent 调用的能力'" :width="600" @close="form = null">
      <div class="grid-2">
        <div class="field">
          <label class="field-label">名称<span class="req">*</span></label>
          <input v-model="form.name" class="input" placeholder="例如 法规条款检索" />
        </div>
        <div class="field">
          <label class="field-label">编码<span class="req">*</span></label>
          <input v-model="form.code" class="input" placeholder="例如 law.retrieval" :disabled="!!form.id" />
        </div>
        <div class="field">
          <label class="field-label">分类</label>
          <select v-model="form.category" class="select">
            <option v-for="c in SKILL_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">版本</label>
          <input v-model="form.version" class="input" placeholder="v1.0.0" />
        </div>
        <div class="field">
          <label class="field-label">超时（秒）</label>
          <input v-model.number="form.timeout" type="number" min="1" max="600" class="input" />
        </div>
        <div class="field">
          <label class="field-label">失败重试次数</label>
          <input v-model.number="form.retry" type="number" min="0" max="5" class="input" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">描述</label>
        <textarea v-model="form.description" class="textarea" rows="2" placeholder="说明该技能的输入输出与适用场景"></textarea>
      </div>
      <div v-if="form.id" class="field">
        <label class="field-label">版本变更说明</label>
        <input v-model="form.versionNote" class="input" placeholder="修改版本号时记录本次变更内容" />
      </div>

      <div class="field">
        <label class="field-label">入参配置</label>
        <div class="param-head">
          <span>参数名</span><span>类型</span><span>必填</span><span>默认值</span><span>说明</span><span></span>
        </div>
        <div v-for="(p, i) in form.params" :key="i" class="param-row">
          <input v-model="p.name" class="input" placeholder="keyword" />
          <select v-model="p.type" class="select">
            <option v-for="t in PARAM_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
          <div class="switch" :class="{ on: p.required }" @click="p.required = !p.required"></div>
          <input v-model="p.default" class="input" placeholder="默认值" />
          <input v-model="p.desc" class="input" placeholder="参数说明" />
          <button class="link-btn danger" @click="form.params.splice(i, 1)">移除</button>
        </div>
        <button class="btn btn-sm" style="margin-top: 8px" @click="addParam">+ 添加参数</button>
      </div>

      <div class="switch-row">
        <div class="switch" :class="{ on: form.shared }" @click="form.shared = !form.shared"></div>
        <div>
          <div class="sr-title">跨成员共享</div>
          <div class="section-desc">开启后空间内全部成员的 Agent 均可调用该技能</div>
        </div>
      </div>
      <div class="switch-row">
        <div class="switch" :class="{ on: form.status === 'enabled' }" @click="form.status = form.status === 'enabled' ? 'disabled' : 'enabled'"></div>
        <div>
          <div class="sr-title">启用技能</div>
          <div class="section-desc">停用后已绑定的 Agent 将跳过该技能</div>
        </div>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="form = null">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </template>
    </SideDrawer>
    <BaseModal v-if="assign" :title="`分配 Agent · ${assign.name}`" :width="480" @close="assign = null">
      <p class="section-desc">选择可调用该技能的 Agent，保存后立即生效。</p>
      <div class="field" style="margin-top: 12px">
        <CheckGroup v-model="assignIds" :options="agentOptions" />
      </div>
      <template #footer>
        <button class="btn" @click="assign = null">取消</button>
        <button class="btn btn-primary" @click="saveAssign">保存分配</button>
      </template>
    </BaseModal>

    <BaseModal v-if="test" :title="`调用测试 · ${test.name}`" :width="580" @close="closeTest">
      <div v-if="!test.params.length" class="section-desc">该技能无需入参，可直接执行。</div>
      <div v-for="p in test.params" :key="p.name" class="field">
        <label class="field-label">
          {{ p.name }}<span v-if="p.required" class="req">*</span>
          <span class="section-desc" style="margin-left: 6px">{{ p.type }} · {{ p.desc }}</span>
        </label>
        <input v-model="testInput[p.name]" class="input" :placeholder="p.default || '请输入'" />
      </div>
      <div v-if="testResult" class="result">
        <div class="result-head">
          <span class="badge" :class="testResult.ok ? 'badge-green' : 'badge-amber'">{{ testResult.ok ? '执行成功' : '未获取结果' }}</span>
          <span class="section-desc">耗时 {{ testResult.elapsed }} ms · 返回 {{ testResult.rows }} 项</span>
        </div>
        <pre class="result-body">{{ testResult.output }}</pre>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="closeTest">关闭</button>
        <button class="btn btn-primary" :disabled="running" @click="runTest">{{ running ? '执行中…' : '执行调用' }}</button>
      </template>
    </BaseModal>

    <BaseModal v-if="detail" :title="detail.name" :width="620" @close="detail = null">
      <div class="kv">
        <div class="kv-item"><div class="k">编码</div><div class="v mono">{{ detail.code }}</div></div>
        <div class="kv-item"><div class="k">分类</div><div class="v">{{ detail.category }}</div></div>
        <div class="kv-item"><div class="k">当前版本</div><div class="v mono">{{ detail.version }}</div></div>
        <div class="kv-item"><div class="k">状态</div><div class="v">{{ detail.status === 'enabled' ? '已启用' : '已停用' }}</div></div>
        <div class="kv-item"><div class="k">超时 / 重试</div><div class="v">{{ detail.timeout }}s · {{ detail.retry }} 次</div></div>
        <div class="kv-item"><div class="k">累计调用</div><div class="v">{{ detail.calls }} 次</div></div>
        <div class="kv-item"><div class="k">共享范围</div><div class="v">{{ detail.shared ? '空间全部成员' : '仅本人 Agent' }}</div></div>
        <div class="kv-item"><div class="k">更新时间</div><div class="v">{{ formatDateTime(detail.updatedAt) }}</div></div>
      </div>
      <div class="block">
        <div class="k">描述</div>
        <p class="block-text">{{ detail.description || '未填写' }}</p>
      </div>
      <div class="block">
        <div class="k">入参定义</div>
        <table class="data mini">
          <thead>
            <tr><th>参数名</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in detail.params" :key="p.name">
              <td><span class="mono">{{ p.name }}</span></td>
              <td>{{ p.type }}</td>
              <td>{{ p.required ? '是' : '否' }}</td>
              <td class="cell-sub">{{ p.default || '—' }}</td>
              <td class="cell-sub">{{ p.desc }}</td>
            </tr>
            <tr v-if="!detail.params.length"><td colspan="5" class="cell-sub">无入参</td></tr>
          </tbody>
        </table>
      </div>
      <div class="block">
        <div class="k">版本记录</div>
        <div v-for="v in detail.versions" :key="v.version + v.at" class="ver">
          <span class="badge badge-cyan mono">{{ v.version }}</span>
          <span class="ver-note">{{ v.note }}</span>
          <span class="spacer"></span>
          <span class="cell-sub">{{ formatDateTime(v.at) }}</span>
        </div>
      </div>
      <div class="block">
        <div class="k">授权 Agent</div>
        <div class="row" style="flex-wrap: wrap; margin-top: 6px">
          <span v-for="name in boundAgentList(detail.id)" :key="name" class="badge badge-purple">{{ name }}</span>
          <span v-if="!boundAgentList(detail.id).length" class="section-desc">尚未分配</span>
        </div>
      </div>
      <template #footer>
        <button class="btn" @click="detail = null">关闭</button>
        <button class="btn btn-primary" @click="openEdit(detail)">编辑技能</button>
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
import StatCard from '@/components/StatCard.vue'
import { useSkillStore } from '@/stores/skills'
import { useAgentStore } from '@/stores/agents'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useFileStore } from '@/stores/files'
import { useUiStore } from '@/stores/ui'
import { SKILL_CATEGORIES } from '@/services/catalog'
import { formatDateTime, formatBytes } from '@/utils/format'

const PARAM_TYPES = ['string', 'number', 'boolean', 'date', 'json']

const skillStore = useSkillStore()
const agentStore = useAgentStore()
const knowledge = useKnowledgeStore()
const files = useFileStore()
const ui = useUiStore()

const keyword = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const form = ref(null)
const detail = ref(null)
const assign = ref(null)
const assignIds = ref([])
const test = ref(null)
const testInput = ref({})
const testResult = ref(null)
const running = ref(false)
const error = ref('')

const agentOptions = computed(() => agentStore.agents.map((a) => ({ value: a.id, label: `${a.name} · ${a.version}` })))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return skillStore.skills.filter(
    (s) =>
      (!kw || `${s.name} ${s.code} ${s.description}`.toLowerCase().includes(kw)) &&
      (!categoryFilter.value || s.category === categoryFilter.value) &&
      (!statusFilter.value || s.status === statusFilter.value)
  )
})

const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))

watch([keyword, categoryFilter, statusFilter], () => {
  page.value = 1
})

const boundAgentList = (skillId) => agentStore.agents.filter((a) => a.skillIds.includes(skillId)).map((a) => a.name)
const boundAgentNames = (skillId) => {
  const list = boundAgentList(skillId)
  return list.length ? list.join('、') : '未分配'
}

function openCreate() {
  error.value = ''
  form.value = {
    id: '',
    name: '',
    code: '',
    category: SKILL_CATEGORIES[0],
    version: 'v1.0.0',
    status: 'enabled',
    shared: true,
    description: '',
    timeout: 15,
    retry: 1,
    params: [],
    versionNote: ''
  }
}

function openEdit(skill) {
  error.value = ''
  detail.value = null
  form.value = { ...skill, params: skill.params.map((p) => ({ ...p })), versionNote: '' }
}

function addParam() {
  form.value.params.push({ name: '', type: 'string', required: false, default: '', desc: '' })
}

function save() {
  const data = form.value
  if (!data.name.trim()) {
    error.value = '请填写技能名称'
    return
  }
  if (!/^[a-z][a-z0-9._-]{1,39}$/.test(data.code)) {
    error.value = '编码需以小写字母开头，可包含小写字母、数字、点、下划线与连字符'
    return
  }
  if (skillStore.skills.some((s) => s.code === data.code && s.id !== data.id)) {
    error.value = '该编码已存在'
    return
  }
  const named = data.params.filter((p) => p.name.trim())
  if (named.length !== data.params.length) {
    error.value = '存在未命名的入参，请补全或移除'
    return
  }
  const payload = { ...data, params: named.map((p) => ({ ...p, name: p.name.trim() })) }
  if (data.id) {
    skillStore.update(data.id, payload)
    ui.notify('技能已保存')
  } else {
    skillStore.create(payload)
    ui.notify('技能已创建')
  }
  form.value = null
}

function switchStatus(skill) {
  skillStore.toggleStatus(skill.id)
  ui.notify(`${skill.name} 已${skill.status === 'enabled' ? '启用' : '停用'}`)
}

function switchShared(skill) {
  skillStore.toggleShared(skill.id)
  ui.notify(`${skill.name} ${skill.shared ? '已开启' : '已关闭'}跨成员共享`)
}

async function removeSkill(skill) {
  const bound = boundAgentList(skill.id)
  const ok = await ui.confirm({
    title: '删除技能',
    message: bound.length
      ? `「${skill.name}」当前被 ${bound.join('、')} 调用，删除后这些 Agent 将失去该能力。`
      : `确认删除技能「${skill.name}」？`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  agentStore.agents.forEach((a) => {
    if (a.skillIds.includes(skill.id)) agentStore.update(a.id, { skillIds: a.skillIds.filter((id) => id !== skill.id) })
  })
  skillStore.remove(skill.id)
  ui.notify('技能已删除')
}

function openAssign(skill) {
  assign.value = skill
  assignIds.value = boundAgentIds(skill.id)
}

const boundAgentIds = (skillId) => agentStore.agents.filter((a) => a.skillIds.includes(skillId)).map((a) => a.id)

function saveAssign() {
  const skillId = assign.value.id
  agentStore.agents.forEach((a) => {
    const should = assignIds.value.includes(a.id)
    const has = a.skillIds.includes(skillId)
    if (should === has) return
    agentStore.update(a.id, {
      skillIds: should ? [...a.skillIds, skillId] : a.skillIds.filter((id) => id !== skillId)
    })
  })
  ui.notify(`已授权 ${assignIds.value.length} 个 Agent 调用「${assign.value.name}」`)
  assign.value = null
}

function openTest(skill) {
  error.value = ''
  testResult.value = null
  test.value = skill
  testInput.value = Object.fromEntries(skill.params.map((p) => [p.name, p.default || '']))
}

function closeTest() {
  test.value = null
  testResult.value = null
  error.value = ''
}

function runTest() {
  const skill = test.value
  const missing = skill.params.filter((p) => p.required && !String(testInput.value[p.name] || '').trim())
  if (missing.length) {
    error.value = `请填写必填参数：${missing.map((p) => p.name).join('、')}`
    return
  }
  error.value = ''
  running.value = true
  const startedAt = performance.now()
  const outcome = execute(skill, { ...testInput.value })
  window.setTimeout(() => {
    running.value = false
    testResult.value = { ...outcome, elapsed: Math.round(performance.now() - startedAt) }
    skillStore.recordCall(skill.id)
  }, 320)
}

function execute(skill, input) {
  const header = [`skill   : ${skill.code}@${skill.version}`, `params  : ${JSON.stringify(input)}`]
  const query = Object.values(input).filter((v) => String(v).trim()).join(' ')

  if (skill.category === '知识检索') {
    const limit = Number(input.topK) || 5
    const hits = knowledge.search(input.keyword || query).slice(0, limit)
    header.push(`matched : ${hits.length}`)
    hits.forEach((doc, i) => {
      header.push(`${i + 1}. [${knowledge.baseById(doc.kbId)?.name || doc.kbId}] ${doc.title} · ${doc.category}`)
      header.push(`   ${doc.content.split('\n')[0].slice(0, 72)}`)
    })
    if (!hits.length) header.push('未在授权范围的知识库中检索到匹配条款，可调整关键词或补充文档。')
    return { ok: hits.length > 0, rows: hits.length, output: header.join('\n') }
  }

  if (skill.category === '文档处理') {
    const key = String(input.fileId || query).trim()
    const file = files.files.find((f) => f.id === key || f.name.includes(key))
    if (!file) {
      header.push('matched : 0', `文件中心未找到与「${key}」匹配的文件。`)
      return { ok: false, rows: 0, output: header.join('\n') }
    }
    const lines = String(file.content || '').split('\n').filter(Boolean)
    header.push(
      `matched : 1`,
      `file    : ${file.name} · ${file.ext.toUpperCase()} · ${formatBytes(file.size)}`,
      `segments: ${lines.length} 段 / ${String(file.content || '').length} 字符`,
      '--- 抽取要素 ---',
      ...lines.slice(0, 6).map((l) => `· ${l.slice(0, 76)}`)
    )
    return { ok: true, rows: lines.length, output: header.join('\n') }
  }

  if (skill.category === '数据计算') {
    const related = knowledge.search(query)
    const numeric = related
      .flatMap((doc) => doc.content.match(/-?\d+(\.\d+)?/g) || [])
      .map(Number)
      .slice(0, 40)
    const total = numeric.reduce((sum, n) => sum + n, 0)
    header.push(
      `matched : ${related.length} 条台账记录`,
      `samples : ${numeric.length} 个计量值`,
      `sum     : ${total.toFixed(2)} ${input.unit || ''}`.trim(),
      `avg     : ${numeric.length ? (total / numeric.length).toFixed(2) : '0.00'} ${input.unit || ''}`.trim()
    )
    related.slice(0, 3).forEach((doc) => header.push(`· ${doc.title}`))
    if (!related.length) header.push('未匹配到该周期的记录，请确认统计周期与因子集参数。')
    return { ok: related.length > 0, rows: related.length, output: header.join('\n') }
  }

  const targets = boundAgentList(skill.id)
  header.push(
    `matched : ${targets.length}`,
    `channel : ${skill.category}`,
    `timeout : ${skill.timeout}s · retry ${skill.retry}`,
    targets.length ? `已投递至：${targets.join('、')}` : '该技能尚未授权给任何 Agent，执行结果不会被消费。'
  )
  return { ok: targets.length > 0, rows: targets.length, output: header.join('\n') }
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.param-head,
.param-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 46px 1fr 1.3fr 44px;
  gap: 8px;
  align-items: center;
}

.param-head {
  color: var(--text-3);
  font-size: 11px;
  margin-bottom: 6px;
}

.param-row {
  margin-bottom: 7px;
}

.result {
  margin-top: 6px;
  border: 1px solid var(--line-2);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.result-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--panel-2);
  border-bottom: 1px solid var(--line);
}

.result-body {
  margin: 0;
  padding: 12px;
  background: #0b1219;
  color: var(--text-2);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 11.5px;
  line-height: 1.8;
  white-space: pre-wrap;
  max-height: 280px;
  overflow-y: auto;
}

.block {
  margin-top: 16px;
}

.block .k {
  color: var(--text-3);
  font-size: 11.5px;
  margin-bottom: 6px;
}

.block-text {
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.7;
}

table.data.mini th,
table.data.mini td {
  padding: 7px 10px;
  font-size: 11.8px;
}

.ver {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.ver:last-child {
  border-bottom: none;
}

.ver-note {
  color: var(--text-2);
  font-size: 12px;
}

.ver .spacer {
  flex: 1;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
