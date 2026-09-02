<template>
  <div class="page stack">
    <div class="stats">
      <StatCard icon="📁" :value="files.folders.length" label="目录数" sub="含子目录" tone="var(--amber)" />
      <StatCard icon="📄" :value="files.files.length" label="文件总数" sub="全部入库文件" tone="var(--cyan)" />
      <StatCard icon="💾" :value="formatBytes(files.totalSize)" label="占用容量" sub="空间存储" tone="var(--purple)" />
      <StatCard icon="🕒" :value="latestLabel" label="最近入库" sub="最新文件时间" tone="var(--green)" />
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="crumbs">
          <button class="crumb" :class="{ active: !currentId }" @click="enter('')">根目录</button>
          <template v-for="node in crumbs" :key="node.id">
            <span class="sep">/</span>
            <button class="crumb" :class="{ active: node.id === currentId }" @click="enter(node.id)">{{ node.name }}</button>
          </template>
        </div>
        <span class="spacer"></span>
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="keyword" class="input" placeholder="按名称检索当前目录" />
        </div>
        <select v-model="extFilter" class="select" style="width: 110px">
          <option value="">全部类型</option>
          <option v-for="e in extOptions" :key="e" :value="e">{{ e.toUpperCase() }}</option>
        </select>
        <div class="tabs">
          <button :class="{ active: view === 'list' }" @click="view = 'list'">☰ 列表</button>
          <button :class="{ active: view === 'grid' }" @click="view = 'grid'">▦ 网格</button>
        </div>
        <button class="btn btn-sm" @click="openFolderCreate">+ 新建文件夹</button>
        <button class="btn btn-primary btn-sm" @click="pickUpload">⤴ 上传文件</button>
        <input ref="uploadInput" type="file" multiple class="hidden-file" @change="onUpload" />
      </div>

      <div v-if="selected.length" class="batch-bar">
        <span>已选择 {{ selected.length }} 项</span>
        <span class="spacer"></span>
        <button class="link-btn" @click="openMove(selected)">移动到…</button>
        <button class="link-btn danger" @click="removeNodes(selected)">批量删除</button>
        <button class="link-btn" @click="selected = []">取消选择</button>
      </div>

      <div v-if="view === 'list'" class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th style="width: 36px"><input type="checkbox" :checked="allChecked" @change="toggleAll" /></th>
              <th>名称</th>
              <th>类型</th>
              <th>大小</th>
              <th>归属人</th>
              <th>更新时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in visible" :key="node.id">
              <td><input type="checkbox" :checked="selected.includes(node.id)" @change="toggleOne(node.id)" /></td>
              <td>
                <button class="name-btn" @click="activate(node)">
                  <span class="ico">{{ iconOf(node) }}</span>
                  <span class="cell-main" v-html="highlight(node.name, keyword)"></span>
                </button>
                <div v-if="node.type === 'folder'" class="cell-sub">{{ files.childrenOf(node.id).length }} 项</div>
              </td>
              <td>{{ node.type === 'folder' ? '文件夹' : node.ext.toUpperCase() }}</td>
              <td>{{ node.type === 'folder' ? folderSize(node.id) : formatBytes(node.size) }}</td>
              <td class="cell-sub">{{ node.owner }}</td>
              <td class="cell-sub">{{ formatDateTime(node.updatedAt) }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button v-if="node.type === 'file'" class="link-btn" @click="preview = node">预览</button>
                  <button v-if="node.type === 'file'" class="link-btn" @click="download(node)">下载</button>
                  <button class="link-btn" @click="openRename(node)">重命名</button>
                  <button class="link-btn" @click="openMove([node.id])">移动</button>
                  <button class="link-btn danger" @click="removeNodes([node.id])">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!visible.length">
              <td colspan="7">
                <div class="empty"><div class="empty-icon">📂</div>{{ emptyText }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="grid-wrap">
        <div v-for="node in visible" :key="node.id" class="card" :class="{ picked: selected.includes(node.id) }">
          <div class="card-top">
            <input type="checkbox" :checked="selected.includes(node.id)" @change="toggleOne(node.id)" />
            <span class="spacer"></span>
            <span class="cell-sub">{{ node.type === 'folder' ? '文件夹' : node.ext.toUpperCase() }}</span>
          </div>
          <button class="card-body" @click="activate(node)">
            <span class="card-ico">{{ iconOf(node) }}</span>
            <span class="card-name" v-html="highlight(node.name, keyword)"></span>
          </button>
          <div class="card-foot">
            <span class="cell-sub">{{ node.type === 'folder' ? `${files.childrenOf(node.id).length} 项` : formatBytes(node.size) }}</span>
            <span class="spacer"></span>
            <button class="link-btn" @click="openRename(node)">重命名</button>
            <button class="link-btn danger" @click="removeNodes([node.id])">删除</button>
          </div>
        </div>
        <div v-if="!visible.length" class="empty" style="grid-column: 1 / -1">
          <div class="empty-icon">📂</div>{{ emptyText }}
        </div>
      </div>
    </section>
    <BaseModal v-if="folderForm" title="新建文件夹" :width="420" @close="folderForm = null">
      <div class="field">
        <label class="field-label">文件夹名称<span class="req">*</span></label>
        <input v-model="folderForm.name" class="input" placeholder="例如 监测报告" />
        <p class="field-hint">将创建在：{{ currentPath }}</p>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="folderForm = null">取消</button>
        <button class="btn btn-primary" @click="saveFolder">创建</button>
      </template>
    </BaseModal>

    <BaseModal v-if="renameForm" title="重命名" :width="420" @close="renameForm = null">
      <div class="field">
        <label class="field-label">名称<span class="req">*</span></label>
        <input v-model="renameForm.name" class="input" />
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="renameForm = null">取消</button>
        <button class="btn btn-primary" @click="saveRename">保存</button>
      </template>
    </BaseModal>

    <BaseModal v-if="moveForm" title="移动到" :width="440" @close="moveForm = null">
      <p class="section-desc">共 {{ moveForm.ids.length }} 项，选择目标目录。</p>
      <div class="move-list">
        <button class="move-item" :class="{ active: moveForm.target === '' }" @click="moveForm.target = ''">📁 根目录</button>
        <button
          v-for="folder in movableFolders"
          :key="folder.id"
          class="move-item"
          :class="{ active: moveForm.target === folder.id }"
          @click="moveForm.target = folder.id"
        >
          📁 {{ pathOf(folder.id) }}
        </button>
      </div>
      <template #footer>
        <button class="btn" @click="moveForm = null">取消</button>
        <button class="btn btn-primary" @click="saveMove">移动</button>
      </template>
    </BaseModal>

    <BaseModal v-if="preview" :title="preview.name" :width="720" @close="preview = null">
      <div class="kv">
        <div class="kv-item"><div class="k">类型</div><div class="v">{{ preview.ext.toUpperCase() }}</div></div>
        <div class="kv-item"><div class="k">大小</div><div class="v">{{ formatBytes(preview.size) }}</div></div>
        <div class="kv-item"><div class="k">归属人</div><div class="v">{{ preview.owner }}</div></div>
        <div class="kv-item"><div class="k">更新时间</div><div class="v">{{ formatDateTime(preview.updatedAt) }}</div></div>
      </div>
      <pre v-if="preview.content" class="preview-body">{{ preview.content }}</pre>
      <p v-else class="section-desc" style="margin-top: 14px">
        该文件为二进制格式，可下载后使用本地应用打开。
      </p>
      <template #footer>
        <button class="btn" @click="preview = null">关闭</button>
        <button class="btn btn-primary" @click="download(preview)">下载文件</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import StatCard from '@/components/StatCard.vue'
import { useFileStore } from '@/stores/files'
import { useUiStore } from '@/stores/ui'
import { formatBytes, formatDateTime, fromNow, downloadFile, highlight } from '@/utils/format'

const EXT_ICONS = {
  pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗', csv: '📗',
  ppt: '📙', pptx: '📙', txt: '📄', md: '📝', json: '🧾', log: '🧾',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', zip: '🗜️', rar: '🗜️'
}

const files = useFileStore()
const ui = useUiStore()

const currentId = ref('')
const keyword = ref('')
const extFilter = ref('')
const view = ref('list')
const selected = ref([])
const uploadInput = ref(null)
const folderForm = ref(null)
const renameForm = ref(null)
const moveForm = ref(null)
const preview = ref(null)
const error = ref('')

const crumbs = computed(() => (currentId.value ? files.breadcrumb(currentId.value) : []))
const currentPath = computed(() => ['根目录', ...crumbs.value.map((n) => n.name)].join(' / '))
const children = computed(() => files.childrenOf(currentId.value))
const extOptions = computed(() => [...new Set(files.files.map((f) => f.ext))].sort())

const visible = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return children.value.filter(
    (node) =>
      (!kw || node.name.toLowerCase().includes(kw)) &&
      (!extFilter.value || (node.type === 'file' && node.ext === extFilter.value))
  )
})

const emptyText = computed(() =>
  keyword.value || extFilter.value ? '当前目录下没有符合条件的内容' : '该目录为空，可新建文件夹或上传文件'
)

const latestLabel = computed(() => {
  const latest = files.files.map((f) => f.updatedAt).sort().pop()
  return latest ? fromNow(latest) : '暂无'
})

const allChecked = computed(() => visible.value.length > 0 && visible.value.every((n) => selected.value.includes(n.id)))

const movableFolders = computed(() =>
  files.folders.filter((f) => !moveForm.value.ids.some((id) => id === f.id || files.isDescendant(id, f.id)))
)

watch([currentId, keyword, extFilter], () => {
  selected.value = []
})

const iconOf = (node) => (node.type === 'folder' ? '📁' : EXT_ICONS[node.ext] || '📄')
const pathOf = (id) => files.breadcrumb(id).map((n) => n.name).join(' / ')
const folderSize = (id) => {
  let total = 0
  const walk = (parentId) => {
    files.childrenOf(parentId).forEach((node) => {
      if (node.type === 'folder') walk(node.id)
      else total += node.size || 0
    })
  }
  walk(id)
  return formatBytes(total)
}

function enter(id) {
  currentId.value = id
}

function activate(node) {
  if (node.type === 'folder') enter(node.id)
  else preview.value = node
}

function toggleOne(id) {
  const index = selected.value.indexOf(id)
  if (index >= 0) selected.value.splice(index, 1)
  else selected.value.push(id)
}

function toggleAll() {
  selected.value = allChecked.value ? [] : visible.value.map((n) => n.id)
}

function openFolderCreate() {
  error.value = ''
  folderForm.value = { name: '' }
}

function saveFolder() {
  const name = folderForm.value.name.trim()
  if (!name) {
    error.value = '请填写文件夹名称'
    return
  }
  if (files.nameExists(currentId.value, name)) {
    error.value = '当前目录下已存在同名内容'
    return
  }
  files.createFolder(currentId.value, name)
  folderForm.value = null
  ui.notify('文件夹已创建')
}

function pickUpload() {
  uploadInput.value?.click()
}

async function onUpload(event) {
  const list = Array.from(event.target.files || [])
  event.target.value = ''
  if (!list.length) return
  const oversize = list.filter((f) => f.size > 2 * 1024 * 1024)
  const created = await files.upload(currentId.value, list)
  ui.notify(
    oversize.length
      ? `已入库 ${created.length} 个文件，其中 ${oversize.length} 个超过 2MB 仅登记元数据`
      : `已上传 ${created.length} 个文件`
  )
}

function openRename(node) {
  error.value = ''
  renameForm.value = { id: node.id, name: node.name, parentId: node.parentId || '' }
}

function saveRename() {
  const name = renameForm.value.name.trim()
  if (!name) {
    error.value = '名称不能为空'
    return
  }
  if (files.nameExists(renameForm.value.parentId, name, renameForm.value.id)) {
    error.value = '同级目录下已存在同名内容'
    return
  }
  files.rename(renameForm.value.id, name)
  renameForm.value = null
  ui.notify('已重命名')
}

function openMove(ids) {
  moveForm.value = { ids: [...ids], target: '' }
}

function saveMove() {
  const count = files.move(moveForm.value.ids, moveForm.value.target)
  moveForm.value = null
  selected.value = []
  ui.notify(count ? `已移动 ${count} 项` : '所选内容无法移动到该目录', count ? 'success' : 'error')
}

async function removeNodes(ids) {
  const names = ids.map((id) => files.byId(id)?.name).filter(Boolean)
  const ok = await ui.confirm({
    title: '删除内容',
    message: `将删除 ${names.join('、')}${ids.some((id) => files.byId(id)?.type === 'folder') ? ' 及其全部子级内容' : ''}，操作不可撤销。`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  const count = files.remove(ids)
  selected.value = []
  if (preview.value && ids.includes(preview.value.id)) preview.value = null
  ui.notify(`已删除 ${count} 项`)
}

function download(node) {
  if (node.dataUrl) {
    const a = document.createElement('a')
    a.href = node.dataUrl
    a.download = node.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {
    downloadFile(node.name, node.content || '', 'text/plain;charset=utf-8')
  }
  ui.notify(`${node.name} 已开始下载`)
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.hidden-file {
  display: none;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.crumb {
  border: none;
  background: transparent;
  color: var(--text-2);
  font-size: 12.5px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}

.crumb:hover {
  color: var(--text);
  background: #1B3861;
}

.crumb.active {
  color: var(--cyan);
}

.sep {
  color: var(--text-3);
  font-size: 11px;
}

.batch-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 16px;
  background: rgba(52, 161, 225, 0.07);
  border-bottom: 1px solid var(--line);
  color: var(--text-2);
  font-size: 12px;
}

.batch-bar .spacer {
  flex: 1;
}

.name-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 12.5px;
  text-align: left;
}

.name-btn:hover .cell-main {
  color: var(--cyan);
}

.ico {
  font-size: 13px;
}

.grid-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  gap: 12px;
  padding: 16px;
}

.card {
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: var(--radius-sm);
  padding: 10px;
}

.card.picked {
  border-color: rgba(52, 161, 225, 0.5);
  background: rgba(52, 161, 225, 0.07);
}

.card-top,
.card-foot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-top .spacer,
.card-foot .spacer {
  flex: 1;
}

.card-body {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  padding: 14px 4px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
}

.card-ico {
  font-size: 26px;
}

.card-name {
  font-size: 12.2px;
  text-align: center;
  word-break: break-all;
  line-height: 1.5;
}

.card-body:hover .card-name {
  color: var(--cyan);
}

.card-foot {
  border-top: 1px solid var(--line);
  padding-top: 9px;
}

.move-list {
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.move-item {
  display: block;
  width: 100%;
  text-align: left;
  border: 1px solid var(--line);
  background: var(--panel-2);
  color: var(--text-2);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  margin-bottom: 7px;
  font-size: 12.5px;
  cursor: pointer;
}

.move-item:hover {
  border-color: var(--line-2);
  color: var(--text);
}

.move-item.active {
  border-color: rgba(52, 161, 225, 0.5);
  background: rgba(52, 161, 225, 0.08);
  color: #e6f9ff;
}

.preview-body {
  margin: 16px 0 0;
  padding: 14px;
  background: #0D2139;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: var(--text-2);
  font-size: 12.2px;
  line-height: 1.9;
  white-space: pre-wrap;
  max-height: 380px;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
