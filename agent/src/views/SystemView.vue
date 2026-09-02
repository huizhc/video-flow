<template>
  <div class="page stack">
    <section class="panel">
      <div class="panel-head">
        <span>🗄️</span>
        <span class="panel-title">系统信息</span>
        <span class="spacer"></span>
        <span class="section-desc">采集于 {{ sampledAt }}</span>
        <button class="btn btn-sm" @click="sample">刷新</button>
      </div>
      <div class="panel-body">
        <div class="kv">
          <div class="kv-item"><div class="k">平台版本</div><div class="v mono">{{ mainAgent?.version || 'v3.0.0' }}</div></div>
          <div class="kv-item"><div class="k">调度协议</div><div class="v mono">{{ mainAgent?.protocol || 'v2.0.0' }}</div></div>
          <div class="kv-item"><div class="k">连续运行</div><div class="v">{{ formatDuration(space.uptimeMs) }}</div></div>
          <div class="kv-item"><div class="k">存储用量</div><div class="v">{{ formatBytes(storage) }}</div></div>
          <div class="kv-item"><div class="k">注册 Agent</div><div class="v">{{ space.registrySize }} 个</div></div>
          <div class="kv-item"><div class="k">团队 Agent</div><div class="v">{{ agentStore.total }} 个 · 运行 {{ agentStore.runningCount }}</div></div>
          <div class="kv-item"><div class="k">知识文档</div><div class="v">{{ knowledge.documents.length }} 篇</div></div>
          <div class="kv-item"><div class="k">入库文件</div><div class="v">{{ files.files.length }} 个 · {{ formatBytes(files.totalSize) }}</div></div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span>💚</span>
        <span class="panel-title">服务健康</span>
        <span class="spacer"></span>
        <span class="section-desc">全部节点可用</span>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>服务</th><th>节点</th><th>状态</th><th>响应耗时</th><th>可用率</th></tr>
          </thead>
          <tbody>
            <tr v-for="svc in space.services" :key="svc.node">
              <td class="cell-main">{{ svc.name }}</td>
              <td><span class="mono">{{ svc.node }}</span></td>
              <td><span class="badge badge-green"><i class="dot"></i>正常</span></td>
              <td>{{ svc.latency }} ms</td>
              <td class="cell-sub">{{ svc.uptime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="toolbar">
        <span class="panel-title">操作日志</span>
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="logKeyword" class="input" placeholder="搜索操作人 / 动作 / 对象" />
        </div>
        <select v-model="moduleFilter" class="select" style="width: 128px">
          <option value="">全部模块</option>
          <option v-for="m in logModules" :key="m" :value="m">{{ m }}</option>
        </select>
        <input v-model="fromDate" type="date" class="input" style="width: 142px" />
        <input v-model="toDate" type="date" class="input" style="width: 142px" />
        <span class="spacer"></span>
        <span class="section-desc">共 {{ filteredLogs.length }} 条</span>
        <button class="btn btn-sm" :disabled="!filteredLogs.length" @click="exportLogs">导出结果</button>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th style="width: 168px">时间</th><th>操作人</th><th>模块</th><th>动作</th><th>操作对象</th><th>结果</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedLogs" :key="row.id">
              <td class="cell-sub">{{ formatDateTime(row.at) }}</td>
              <td>{{ row.actor }}</td>
              <td>{{ row.module }}</td>
              <td>{{ row.action }}</td>
              <td class="cell-sub">{{ row.target }}</td>
              <td><span class="badge" :class="row.result === 'success' ? 'badge-green' : 'badge-amber'">{{ row.result === 'success' ? '成功' : '异常' }}</span></td>
            </tr>
            <tr v-if="!filteredLogs.length">
              <td colspan="6"><div class="empty"><div class="empty-icon">🧾</div>没有符合条件的操作日志</div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <DataPager v-model:page="logPage" v-model:page-size="logPageSize" :total="filteredLogs.length" />
    </section>

    <section class="panel">
      <div class="toolbar">
        <span class="panel-title">访问密钥</span>
        <span class="section-desc">用于外部系统调用 Agent 接口</span>
        <span class="spacer"></span>
        <button class="btn btn-primary btn-sm" @click="openKeyCreate">+ 创建密钥</button>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>名称</th><th>密钥</th><th>授权范围</th><th>状态</th><th>创建时间</th><th>最近使用</th><th class="col-actions">操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in space.apiKeys" :key="item.id">
              <td class="cell-main">{{ item.name }}</td>
              <td><span class="mono">{{ masked(item) }}</span></td>
              <td>{{ item.scope }}</td>
              <td>
                <span class="badge" :class="item.status === 'active' ? 'badge-green' : 'badge-gray'">
                  <i class="dot"></i>{{ item.status === 'active' ? '生效中' : '已吊销' }}
                </span>
              </td>
              <td class="cell-sub">{{ formatDateTime(item.createdAt) }}</td>
              <td class="cell-sub">{{ item.lastUsedAt ? fromNow(item.lastUsedAt) : '未使用' }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button class="link-btn" @click="toggleReveal(item.id)">{{ revealed.includes(item.id) ? '隐藏' : '显示' }}</button>
                  <button class="link-btn" @click="copyKey(item)">复制</button>
                  <button v-if="item.status === 'active'" class="link-btn" @click="revoke(item)">吊销</button>
                  <button class="link-btn danger" @click="removeKey(item)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!space.apiKeys.length">
              <td colspan="7"><div class="empty"><div class="empty-icon">🔑</div>尚未创建访问密钥</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div class="two-col">
      <section class="panel">
        <div class="panel-head">
          <span>📄</span>
          <span class="panel-title">许可信息</span>
        </div>
        <div class="panel-body">
          <div class="kv">
            <div class="kv-item"><div class="k">授权主体</div><div class="v">{{ space.license.holder }}</div></div>
            <div class="kv-item"><div class="k">授权版本</div><div class="v">{{ space.license.edition }}</div></div>
            <div class="kv-item"><div class="k">授权席位</div><div class="v">{{ space.license.seats }} 人</div></div>
            <div class="kv-item"><div class="k">生效日期</div><div class="v">{{ formatDate(space.license.issuedAt) }}</div></div>
            <div class="kv-item"><div class="k">到期日期</div><div class="v">{{ formatDate(space.license.expiresAt) }}</div></div>
            <div class="kv-item"><div class="k">剩余有效期</div><div class="v">{{ licenseRemain }}</div></div>
          </div>
          <div class="mods">
            <div class="k">授权模块</div>
            <div class="row" style="flex-wrap: wrap; margin-top: 7px">
              <span v-for="m in space.license.modules" :key="m" class="badge badge-cyan">{{ m }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span>🗃️</span>
          <span class="panel-title">数据维护</span>
        </div>
        <div class="panel-body">
          <div class="maint">
            <div>
              <div class="sr-title">数据备份</div>
              <div class="section-desc">导出空间全量数据快照，可用于迁移或留档</div>
            </div>
            <span class="spacer"></span>
            <button class="btn btn-sm" @click="backup">导出快照</button>
          </div>
          <div class="maint">
            <div>
              <div class="sr-title">数据恢复</div>
              <div class="section-desc">导入快照文件覆盖当前空间数据</div>
            </div>
            <span class="spacer"></span>
            <button class="btn btn-sm" @click="pickRestore">导入快照</button>
            <input ref="restoreInput" type="file" accept="application/json" class="hidden-file" @change="onRestoreFile" />
          </div>
          <div class="maint">
            <div>
              <div class="sr-title">缓存清理</div>
              <div class="section-desc">清理检索与调度运行缓存，不影响业务数据</div>
            </div>
            <span class="spacer"></span>
            <button class="btn btn-sm" @click="clearCache">清理缓存</button>
          </div>
        </div>
      </section>
    </div>

    <section class="panel danger-zone">
      <div class="panel-head">
        <span>⚠️</span>
        <span class="panel-title">危险操作</span>
      </div>
      <div class="panel-body">
        <div class="maint">
          <div>
            <div class="sr-title">数据初始化</div>
            <div class="section-desc">重置全部业务数据并恢复到初始状态，操作不可撤销，建议先导出快照。</div>
          </div>
          <span class="spacer"></span>
          <button class="btn btn-solid-danger" @click="resetAll">初始化数据</button>
        </div>
      </div>
    </section>

    <BaseModal v-if="keyForm" title="创建访问密钥" :width="440" @close="keyForm = null">
      <div class="field">
        <label class="field-label">密钥名称<span class="req">*</span></label>
        <input v-model="keyForm.name" class="input" placeholder="例如 环境台账系统对接" />
      </div>
      <div class="field">
        <label class="field-label">授权范围</label>
        <select v-model="keyForm.scope" class="select">
          <option v-for="s in KEY_SCOPES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="keyForm = null">取消</button>
        <button class="btn btn-primary" @click="saveKey">创建</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import DataPager from '@/components/DataPager.vue'
import { useSpaceStore } from '@/stores/space'
import { useAgentStore } from '@/stores/agents'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useFileStore } from '@/stores/files'
import { useUiStore } from '@/stores/ui'
import { formatBytes, formatDate, formatDateTime, formatDuration, formatTime, fromNow, downloadFile, copyText } from '@/utils/format'

const KEY_SCOPES = ['全部接口', '对话接口', '知识库读取', '文件读写', '规则评估']
const DAY = 86400000

const space = useSpaceStore()
const agentStore = useAgentStore()
const knowledge = useKnowledgeStore()
const files = useFileStore()
const ui = useUiStore()

const sampledAt = ref(formatTime(Date.now()))
const storage = ref(space.storageUsed)
const logKeyword = ref('')
const moduleFilter = ref('')
const fromDate = ref('')
const toDate = ref('')
const logPage = ref(1)
const logPageSize = ref(10)
const keyForm = ref(null)
const revealed = ref([])
const restoreInput = ref(null)
const error = ref('')

const mainAgent = computed(() => agentStore.mainAgent)
const logModules = computed(() => [...new Set(space.logs.map((l) => l.module))])

const licenseRemain = computed(() => {
  const days = Math.ceil((new Date(space.license.expiresAt).getTime() - Date.now()) / DAY)
  return days > 0 ? `${days} 天` : '已到期'
})

const filteredLogs = computed(() => {
  const kw = logKeyword.value.trim().toLowerCase()
  const from = fromDate.value ? new Date(`${fromDate.value}T00:00:00`).getTime() : null
  const to = toDate.value ? new Date(`${toDate.value}T23:59:59`).getTime() : null
  return space.logs.filter((row) => {
    const at = new Date(row.at).getTime()
    return (
      (!kw || `${row.actor} ${row.action} ${row.target} ${row.module}`.toLowerCase().includes(kw)) &&
      (!moduleFilter.value || row.module === moduleFilter.value) &&
      (from === null || at >= from) &&
      (to === null || at <= to)
    )
  })
})

const pagedLogs = computed(() =>
  filteredLogs.value.slice((logPage.value - 1) * logPageSize.value, logPage.value * logPageSize.value)
)

watch([logKeyword, moduleFilter, fromDate, toDate], () => {
  logPage.value = 1
})

const masked = (item) =>
  revealed.value.includes(item.id) ? item.key : `${item.key.slice(0, 8)}${'•'.repeat(10)}${item.key.slice(-4)}`

function sample() {
  storage.value = space.storageUsed
  sampledAt.value = formatTime(Date.now())
  ui.notify('系统指标已刷新')
}

function exportLogs() {
  const header = '时间,操作人,模块,动作,操作对象,结果'
  const rows = filteredLogs.value.map((row) =>
    [formatDateTime(row.at), row.actor, row.module, row.action, row.target, row.result === 'success' ? '成功' : '异常']
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  )
  downloadFile(`操作日志-${formatDate(Date.now())}.csv`, `﻿${[header, ...rows].join('\n')}`, 'text/csv;charset=utf-8')
  space.log('系统管理', '导出操作日志', `${filteredLogs.value.length} 条`)
  ui.notify('日志已导出')
}

function openKeyCreate() {
  error.value = ''
  keyForm.value = { name: '', scope: KEY_SCOPES[0] }
}

function saveKey() {
  if (!keyForm.value.name.trim()) {
    error.value = '请填写密钥名称'
    return
  }
  const created = space.createKey(keyForm.value.name.trim(), keyForm.value.scope)
  revealed.value.push(created.id)
  keyForm.value = null
  ui.notify('密钥已创建，请及时保存')
}

function toggleReveal(id) {
  const index = revealed.value.indexOf(id)
  if (index >= 0) revealed.value.splice(index, 1)
  else revealed.value.push(id)
}

async function copyKey(item) {
  await copyText(item.key)
  ui.notify('密钥已复制')
}

async function revoke(item) {
  const ok = await ui.confirm({
    title: '吊销密钥',
    message: `吊销后使用「${item.name}」的外部调用将立即失败。`,
    danger: true,
    confirmText: '吊销'
  })
  if (!ok) return
  space.revokeKey(item.id)
  ui.notify('密钥已吊销')
}

async function removeKey(item) {
  const ok = await ui.confirm({ title: '删除密钥', message: `确认删除「${item.name}」？`, danger: true, confirmText: '删除' })
  if (!ok) return
  space.removeKey(item.id)
  ui.notify('密钥已删除')
}

function backup() {
  downloadFile(`空间数据快照-${formatDate(Date.now())}.json`, space.exportSnapshot())
  space.log('系统管理', '导出数据快照', space.space.name)
  ui.notify('数据快照已导出')
}

function pickRestore() {
  restoreInput.value?.click()
}

async function onRestoreFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  const ok = await ui.confirm({
    title: '导入数据快照',
    message: `将使用「${file.name}」覆盖当前空间的全部数据，导入后页面会重新加载。`,
    danger: true,
    confirmText: '确认导入',
    requireText: '导入'
  })
  if (!ok) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      space.importSnapshot(String(reader.result))
    } catch (e) {
      ui.notify(e.message || '快照文件解析失败', 'error')
    }
  }
  reader.readAsText(file)
}

function clearCache() {
  const freed = space.clearCache()
  storage.value = space.storageUsed
  ui.notify(freed ? `运行缓存已清理，释放 ${formatBytes(freed)}` : '运行缓存已是最新状态')
}

async function resetAll() {
  const ok = await ui.confirm({
    title: '初始化数据',
    message: '全部 Agent、知识库、文件、规则、成员与日志将恢复到初始状态，操作不可撤销。',
    danger: true,
    confirmText: '执行初始化',
    requireText: '初始化'
  })
  if (!ok) return
  space.resetAll()
}
</script>

<style scoped>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.hidden-file {
  display: none;
}

.mods {
  margin-top: 16px;
}

.mods .k {
  color: var(--text-3);
  font-size: 11.5px;
}

.maint {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.maint:first-child {
  padding-top: 0;
}

.maint:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.maint .spacer {
  flex: 1;
}

@media (max-width: 1100px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
