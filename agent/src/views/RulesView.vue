<template>
  <div class="page stack">
    <section class="panel">
      <div class="toolbar">
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="keyword" class="input" placeholder="搜索规则名称与说明" />
        </div>
        <select v-model="groupFilter" class="select" style="width: 128px">
          <option value="">全部分组</option>
          <option v-for="g in RULE_GROUPS" :key="g" :value="g">{{ g }}</option>
        </select>
        <select v-model="statusFilter" class="select" style="width: 112px">
          <option value="">全部状态</option>
          <option value="enabled">已启用</option>
          <option value="disabled">已停用</option>
        </select>
        <span class="section-desc">启用中 {{ ruleStore.enabledCount }} / {{ ruleStore.rules.length }} 条 · 累计命中 {{ totalHits }} 次</span>
        <span class="spacer"></span>
        <button class="btn btn-sm" @click="openTest">规则测试</button>
        <button class="btn btn-primary btn-sm" @click="openCreate">+ 新建规则</button>
      </div>

      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th style="width: 92px">优先级</th>
              <th>规则名称</th>
              <th>分组</th>
              <th>触发条件</th>
              <th>执行动作</th>
              <th>状态</th>
              <th>命中次数</th>
              <th>最近命中</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rule, index) in filtered" :key="rule.id">
              <td>
                <div class="prio">
                  <span class="prio-num mono">{{ rule.priority }}</span>
                  <button class="mv" :disabled="index === 0" title="上移" @click="move(rule, 'up')">▲</button>
                  <button class="mv" :disabled="index === filtered.length - 1" title="下移" @click="move(rule, 'down')">▼</button>
                </div>
              </td>
              <td>
                <div class="cell-main">{{ rule.name }}</div>
                <div class="cell-sub">{{ rule.description }}</div>
              </td>
              <td>{{ rule.group }}</td>
              <td class="cell-sub">
                <div v-for="(c, i) in rule.conditions" :key="i" class="cond-line">
                  <span v-if="i" class="join">{{ c.join === 'or' ? '或' : '且' }}</span>
                  {{ fieldLabel(c.field) }} {{ opLabel(c.op) }} {{ c.value }}
                </div>
                <span v-if="!rule.conditions.length">未配置</span>
              </td>
              <td class="cell-sub">
                <div v-for="(a, i) in rule.actions" :key="i">{{ actionText(a) }}</div>
                <span v-if="!rule.actions.length">未配置</span>
              </td>
              <td>
                <span class="badge" :class="rule.enabled ? 'badge-green' : 'badge-gray'">
                  <i class="dot"></i>{{ rule.enabled ? '已启用' : '已停用' }}
                </span>
              </td>
              <td>{{ rule.hits }}</td>
              <td class="cell-sub">{{ rule.lastHitAt ? formatDateTime(rule.lastHitAt) : '暂无命中' }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button class="link-btn" @click="openEdit(rule)">编辑</button>
                  <button class="link-btn" @click="switchStatus(rule)">{{ rule.enabled ? '停用' : '启用' }}</button>
                  <button class="link-btn danger" @click="removeRule(rule)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="9">
                <div class="empty"><div class="empty-icon">📋</div>没有符合条件的规则</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <SideDrawer v-if="form" :title="form.id ? '编辑规则' : '新建规则'" :subtitle="form.id ? `优先级 ${form.priority}` : '配置条件与命中后的处置动作'" :width="620" @close="form = null">
      <div class="grid-2">
        <div class="field">
          <label class="field-label">规则名称<span class="req">*</span></label>
          <input v-model="form.name" class="input" placeholder="例如 废水指标超限预警" />
        </div>
        <div class="field">
          <label class="field-label">业务分组</label>
          <select v-model="form.group" class="select">
            <option v-for="g in RULE_GROUPS" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="field-label">规则说明</label>
        <textarea v-model="form.description" class="textarea" rows="2" placeholder="说明该规则的判定逻辑与处置预期"></textarea>
      </div>

      <div class="field">
        <label class="field-label">触发条件<span class="req">*</span></label>
        <div v-for="(c, i) in form.conditions" :key="i" class="cond-row">
          <select v-if="i" v-model="c.join" class="select join-sel">
            <option value="and">且</option>
            <option value="or">或</option>
          </select>
          <span v-else class="join-sel first">当</span>
          <select v-model="c.field" class="select">
            <option v-for="f in RULE_FIELDS" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
          <select v-model="c.op" class="select">
            <option v-for="o in RULE_OPS" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <input v-model="c.value" class="input" :placeholder="placeholderOf(c.field)" />
          <button class="link-btn danger" @click="form.conditions.splice(i, 1)">移除</button>
        </div>
        <button class="btn btn-sm" style="margin-top: 8px" @click="addCondition">+ 添加条件</button>
        <p class="field-hint">同一规则内出现「或」时，任一条件满足即命中；全部为「且」时需同时满足。</p>
      </div>

      <div class="field">
        <label class="field-label">执行动作<span class="req">*</span></label>
        <div v-for="(a, i) in form.actions" :key="i" class="act-row">
          <select v-model="a.type" class="select" @change="a.target = defaultTarget(a.type)">
            <option v-for="t in RULE_ACTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
          <select v-if="a.type === 'assign'" v-model="a.target" class="select">
            <option v-for="agent in agentStore.agents" :key="agent.id" :value="agent.id">{{ agent.name }}</option>
          </select>
          <select v-else-if="a.type === 'notify'" v-model="a.target" class="select">
            <option v-for="tag in BUSINESS_TAGS" :key="tag" :value="tag">{{ tag }}责任人</option>
          </select>
          <input v-else v-model="a.target" class="input" :placeholder="a.type === 'webhook' ? '接口地址' : a.type === 'tag' ? '写入的标签' : '升级说明'" />
          <button class="link-btn danger" @click="form.actions.splice(i, 1)">移除</button>
        </div>
        <button class="btn btn-sm" style="margin-top: 8px" @click="addAction">+ 添加动作</button>
      </div>

      <div class="switch-row">
        <div class="switch" :class="{ on: form.enabled }" @click="form.enabled = !form.enabled"></div>
        <div>
          <div class="sr-title">启用规则</div>
          <div class="section-desc">停用后该规则不参与请求匹配</div>
        </div>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="form = null">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </template>
    </SideDrawer>

    <BaseModal v-if="test" title="规则测试" :width="640" @close="test = null">
      <p class="section-desc">填写样例数据，按优先级顺序校验启用中的规则命中情况。</p>
      <div class="grid-2" style="margin-top: 12px">
        <div v-for="f in RULE_FIELDS" :key="f.value" class="field">
          <label class="field-label">{{ f.label }}</label>
          <input v-model="sample[f.value]" class="input" :placeholder="placeholderOf(f.value)" />
        </div>
      </div>
      <div v-if="testRuns" class="test-result">
        <div class="tr-head">
          <span class="badge" :class="firstHit ? 'badge-green' : 'badge-gray'">
            {{ firstHit ? `命中：${firstHit.rule.name}` : '无规则命中' }}
          </span>
          <span class="section-desc">校验 {{ testRuns.length }} 条启用规则 · 命中 {{ hitCount }} 条</span>
        </div>
        <div v-for="run in testRuns" :key="run.rule.id" class="tr-row" :class="{ hit: run.matched }">
          <span class="mono prio-num">{{ run.rule.priority }}</span>
          <div class="tr-main">
            <div class="cell-main">{{ run.rule.name }}</div>
            <div class="cell-sub">
              <span v-for="(r, i) in run.results" :key="i" class="cond-chip" :class="{ ok: r.matched }">
                {{ fieldLabel(r.condition.field) }} {{ opLabel(r.condition.op) }} {{ r.condition.value }}
              </span>
            </div>
            <div v-if="run.matched" class="cell-sub">处置：{{ run.rule.actions.map(actionText).join('；') }}</div>
          </div>
          <span class="badge" :class="run.matched ? 'badge-green' : 'badge-gray'">{{ run.matched ? '命中' : '未命中' }}</span>
        </div>
      </div>
      <template #footer>
        <button class="btn" @click="test = null">关闭</button>
        <button class="btn btn-primary" @click="runTest">执行校验</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import { useRuleStore } from '@/stores/rules'
import { useAgentStore } from '@/stores/agents'
import { useUiStore } from '@/stores/ui'
import { RULE_GROUPS, RULE_FIELDS, RULE_OPS, RULE_ACTIONS, BUSINESS_TAGS } from '@/services/catalog'
import { formatDateTime } from '@/utils/format'

const PLACEHOLDERS = {
  'message.tag': '环境合规',
  'message.text': '排污许可',
  'emission.cod': '50',
  'emission.nh3': '5',
  'monitor.source': '废水总排口',
  'ledger.missingDays': '3',
  'file.ext': 'pdf',
  'task.type': '合规审查'
}

const ruleStore = useRuleStore()
const agentStore = useAgentStore()
const ui = useUiStore()

const keyword = ref('')
const groupFilter = ref('')
const statusFilter = ref('')
const form = ref(null)
const test = ref(null)
const sample = ref({})
const testRuns = ref(null)
const error = ref('')

const totalHits = computed(() => ruleStore.rules.reduce((sum, r) => sum + (r.hits || 0), 0))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return ruleStore.sorted.filter(
    (r) =>
      (!kw || `${r.name} ${r.description}`.toLowerCase().includes(kw)) &&
      (!groupFilter.value || r.group === groupFilter.value) &&
      (!statusFilter.value || (statusFilter.value === 'enabled') === !!r.enabled)
  )
})

const hitCount = computed(() => (testRuns.value || []).filter((r) => r.matched).length)
const firstHit = computed(() => (testRuns.value || []).find((r) => r.matched) || null)

const fieldLabel = (value) => RULE_FIELDS.find((f) => f.value === value)?.label || value
const opLabel = (value) => RULE_OPS.find((o) => o.value === value)?.label || value
const placeholderOf = (field) => PLACEHOLDERS[field] || '输入比较值'

function actionText(action) {
  const label = RULE_ACTIONS.find((a) => a.value === action.type)?.label || action.type
  if (action.type === 'assign') return `${label} → ${agentStore.byId(action.target)?.name || action.target}`
  if (action.type === 'notify') return `${label} → ${action.target}`
  return `${label}：${action.target}`
}

function defaultTarget(type) {
  if (type === 'assign') return agentStore.agents[0]?.id || ''
  if (type === 'notify') return BUSINESS_TAGS[0]
  return ''
}

function openCreate() {
  error.value = ''
  form.value = {
    id: '',
    name: '',
    group: RULE_GROUPS[0],
    priority: ruleStore.rules.length + 1,
    enabled: true,
    description: '',
    conditions: [{ field: RULE_FIELDS[0].value, op: 'eq', value: '', join: 'and' }],
    actions: [{ type: 'assign', target: defaultTarget('assign') }]
  }
}

function openEdit(rule) {
  error.value = ''
  form.value = {
    ...rule,
    conditions: rule.conditions.map((c) => ({ ...c })),
    actions: rule.actions.map((a) => ({ ...a }))
  }
}

function addCondition() {
  form.value.conditions.push({ field: RULE_FIELDS[0].value, op: 'eq', value: '', join: 'and' })
}

function addAction() {
  form.value.actions.push({ type: 'notify', target: defaultTarget('notify') })
}

function save() {
  const data = form.value
  if (!data.name.trim()) {
    error.value = '请填写规则名称'
    return
  }
  if (!data.conditions.length) {
    error.value = '请至少配置一个触发条件'
    return
  }
  if (data.conditions.some((c) => !String(c.value).trim())) {
    error.value = '存在未填写比较值的条件'
    return
  }
  if (!data.actions.length) {
    error.value = '请至少配置一个执行动作'
    return
  }
  if (data.actions.some((a) => !String(a.target).trim())) {
    error.value = '存在未填写目标的动作'
    return
  }
  if (data.id) {
    ruleStore.update(data.id, data)
    ui.notify('规则已保存')
  } else {
    ruleStore.create(data)
    ui.notify('规则已创建')
  }
  form.value = null
}

function switchStatus(rule) {
  ruleStore.toggle(rule.id)
  ui.notify(`${rule.name} 已${rule.enabled ? '启用' : '停用'}`)
}

function move(rule, direction) {
  ruleStore.movePriority(rule.id, direction)
  ui.notify('匹配顺序已调整')
}

async function removeRule(rule) {
  const ok = await ui.confirm({ title: '删除规则', message: `确认删除「${rule.name}」？删除后该规则不再参与匹配。`, danger: true, confirmText: '删除' })
  if (!ok) return
  ruleStore.remove(rule.id)
  ui.notify('规则已删除')
}

function openTest() {
  testRuns.value = null
  sample.value = Object.fromEntries(RULE_FIELDS.map((f) => [f.value, '']))
  test.value = true
}

function runTest() {
  const payload = Object.fromEntries(
    Object.entries(sample.value).filter(([, v]) => String(v).trim() !== '')
  )
  testRuns.value = ruleStore.evaluate(payload)
  const hit = testRuns.value.find((r) => r.matched)
  if (hit) ruleStore.recordHit(hit.rule.id)
  ui.notify(hit ? `样例命中「${hit.rule.name}」` : '样例未命中任何规则', hit ? 'success' : 'info')
}
</script>

<style scoped>
.prio {
  display: flex;
  align-items: center;
  gap: 4px;
}

.prio-num {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 20px;
  border-radius: 4px;
  background: var(--panel-3);
  color: var(--cyan);
  font-size: 11.5px;
}

.mv {
  width: 18px;
  height: 18px;
  border: 1px solid var(--line-2);
  background: var(--panel-2);
  color: var(--text-3);
  border-radius: 4px;
  font-size: 8px;
  cursor: pointer;
  line-height: 1;
}

.mv:hover:not(:disabled) {
  color: var(--cyan);
  border-color: rgba(34, 211, 238, 0.45);
}

.mv:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cond-line {
  line-height: 1.75;
}

.join {
  color: var(--cyan);
  margin-right: 4px;
}

.cond-row {
  display: grid;
  grid-template-columns: 44px 1.4fr 1fr 1.2fr 44px;
  gap: 8px;
  align-items: center;
  margin-bottom: 7px;
}

.join-sel.first {
  color: var(--text-3);
  font-size: 12px;
  text-align: center;
}

.act-row {
  display: grid;
  grid-template-columns: 1.1fr 1.6fr 44px;
  gap: 8px;
  align-items: center;
  margin-bottom: 7px;
}

.test-result {
  margin-top: 18px;
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

.tr-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.tr-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: var(--radius-sm);
  margin-bottom: 7px;
}

.tr-row.hit {
  border-color: rgba(52, 211, 153, 0.4);
  background: rgba(52, 211, 153, 0.06);
}

.tr-main {
  flex: 1;
  min-width: 0;
}

.cond-chip {
  display: inline-block;
  margin: 5px 6px 0 0;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--panel-3);
  border: 1px solid var(--line-2);
  font-size: 11px;
}

.cond-chip.ok {
  border-color: rgba(52, 211, 153, 0.42);
  color: #b8f2dc;
}
</style>
