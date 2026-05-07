<script setup>
import { ref } from 'vue'
import {
  NButton,
  NCheckbox,
  NEmpty,
  NIcon,
  NInput,
  NPagination,
  NSelect,
} from 'naive-ui'
import { Renew, View } from '@vicons/carbon'

const toolName = ref('')
const status = ref(null)
const selectAll = ref(false)

const page = ref(1)
const pageSize = ref(50)
const total = ref(0)

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '排队中', value: 'queued' },
  { label: '运行中', value: 'running' },
  { label: '已完成', value: 'done' },
  { label: '失败', value: 'failed' },
]

function handleSearch() {}
function handleReset() {
  toolName.value = ''
  status.value = null
}
function handleRefresh() {}
</script>

<template>
  <div class="min-h-full bg-[#18181c] p-4 flex flex-col">
    <div
      class="rounded-lg px-4 py-3 mb-4 text-sm leading-relaxed border border-amber-900/35 bg-[#3a3018] text-amber-100/95"
    >
      <p class="m-0 mb-2">
        任务完成后，结果文件会存放在云盘空间，请及时下载，任务和文件将在7天后自动删除！
      </p>
      <p class="m-0 mb-2">
        查看后台任务状态和进度，停止任务算力也会正常消耗。删除任务不影响结果文件，可在云盘空间查看。
      </p>
      <p class="m-0 flex items-center gap-1.5 text-amber-200/90">
        <n-icon :size="16" :component="Renew" class="shrink-0 opacity-90" />
        <span>自动刷新已启用 - 无需要刷新的任务，已停止自动刷新</span>
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <n-input
        v-model:value="toolName"
        size="medium"
        placeholder="工具名称"
        clearable
        class="w-44 sm:w-52"
      />
      <n-select
        v-model:value="status"
        :options="statusOptions"
        size="medium"
        placeholder="状态"
        clearable
        class="w-36 sm:w-40"
        :consistent-menu-width="false"
      />
      <n-button type="primary" size="medium" @click="handleSearch">
        搜索
      </n-button>
      <n-button size="medium" secondary @click="handleReset">
        重置
      </n-button>
      <n-button size="medium" secondary @click="handleRefresh">
        <span class="flex items-center gap-1">
          <n-icon :size="16" :component="Renew" />
          刷新
        </span>
      </n-button>
      <div class="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-2 justify-end">
        <n-checkbox v-model:checked="selectAll">
          <span class="text-gray-300 text-sm">全选</span>
        </n-checkbox>
        <n-button type="error" size="medium">
          批量删除
        </n-button>
        <n-button type="primary" size="medium">
          批量下载
        </n-button>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-0 min-h-[420px]">
      <div class="flex-1 flex items-center justify-center rounded-xl border border-[#ffffff0f] bg-[#101014]/80">
        <n-empty description="暂无任务数据">
          <template #icon>
            <n-icon :size="72" :depth="3" :component="View" />
          </template>
        </n-empty>
      </div>

      <div class="flex justify-end mt-4 shrink-0">
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :item-count="total"
          :page-sizes="[10, 20, 50, 100]"
          show-size-picker
          show-quick-jumper
          size="medium"
        >
          <template #prefix="{ itemCount }">
            <span class="text-gray-400 text-sm mr-4 tabular-nums">Total {{ itemCount }}</span>
          </template>
        </n-pagination>
      </div>
    </div>
  </div>
</template>
