<script setup>
import { ref } from 'vue'
import { NCard, NEmpty, NGi, NGrid, NIcon, NSelect } from 'naive-ui'
import {
  Archive,
  Document,
  DocumentSubtract,
  InProgress,
  TaskComplete,
} from '@vicons/carbon'

const statusFilter = ref('all')
const sortBy = ref('created_desc')

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' },
]

const sortOptions = [
  { label: '创建日期 (降序)', value: 'created_desc' },
  { label: '创建日期 (升序)', value: 'created_asc' },
]

const stats = [
  {
    key: 'all',
    label: '全部任务',
    count: 0,
    icon: Archive,
    iconClass: 'text-[#2080f0]',
    iconBg: 'bg-[#2080f0]/15',
  },
  {
    key: 'pending',
    label: '待处理',
    count: 0,
    icon: Document,
    iconClass: 'text-[#9ca3af]',
    iconBg: 'bg-[#9ca3af]/15',
  },
  {
    key: 'processing',
    label: '处理中',
    count: 0,
    icon: InProgress,
    iconClass: 'text-[#f0a020]',
    iconBg: 'bg-[#f0a020]/15',
  },
  {
    key: 'completed',
    label: '已完成',
    count: 0,
    icon: TaskComplete,
    iconClass: 'text-[#36ad6a]',
    iconBg: 'bg-[#36ad6a]/15',
  },
  {
    key: 'failed',
    label: '失败',
    count: 0,
    icon: DocumentSubtract,
    iconClass: 'text-[#d03050]',
    iconBg: 'bg-[#d03050]/15',
  },
]
</script>

<template>
  <div class="p-4 min-h-full">
    <n-grid :cols="5" :x-gap="12" :y-gap="12">
      <n-gi v-for="s in stats" :key="s.key">
        <n-card size="small" class="rounded-lg border border-[#ffffff0f] bg-[#252525]/90">
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              :class="s.iconBg"
            >
              <n-icon :size="22" :class="s.iconClass" :component="s.icon" />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-2xl font-semibold text-white leading-tight">{{ s.count }}</span>
              <span class="text-sm text-gray-400 truncate">{{ s.label }}</span>
            </div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>

    <div class="flex justify-between items-center my-4 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-400 whitespace-nowrap">状态筛选:</span>
        <n-select
          v-model:value="statusFilter"
          :options="statusOptions"
          size="small"
          class="min-w-[140px]"
          :consistent-menu-width="false"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-400 whitespace-nowrap">排序方式:</span>
        <n-select
          v-model:value="sortBy"
          :options="sortOptions"
          size="small"
          class="min-w-[200px]"
          :consistent-menu-width="false"
        />
      </div>
    </div>

    <div class="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <n-empty description="暂无任务数据" />
    </div>
  </div>
</template>
