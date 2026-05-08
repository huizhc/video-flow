<script setup>
import { ref } from 'vue'
import { NEmpty, NIcon, NSelect } from 'naive-ui'
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
  <div class="min-h-full bg-[#171717] px-[10px] pt-[10px] pb-4 sm:pb-0">
    <div class="grid grid-cols-1 gap-[10px] sm:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
      <div
        v-for="s in stats"
        :key="s.key"
        class="flex min-h-[76px] items-center gap-3 rounded-[8px] border border-white/6 bg-[linear-gradient(180deg,rgba(30,30,30,0.96)_0%,rgba(24,24,24,0.98)_100%)] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
      >
        <div
          class="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px]"
          :class="s.iconBg"
        >
          <n-icon :size="18" :class="s.iconClass" :component="s.icon" />
        </div>
        <div class="min-w-0">
          <div class="text-[24px] leading-[1.1] font-semibold text-white/95">{{ s.count }}</div>
          <div class="mt-[2px] text-[14px] leading-[1.2] font-semibold text-white/45">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="mt-[18px] flex flex-col items-stretch justify-between gap-3 rounded-t-[8px] border border-b-0 border-white/5 bg-[linear-gradient(180deg,rgba(21,21,21,0.98)_0%,rgba(18,18,18,0.98)_100%)] px-4 py-[10px] lg:flex-row lg:items-center">
      <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-3">
        <span class="whitespace-nowrap text-[14px] text-white/50">状态筛选:</span>
        <n-select
          v-model:value="statusFilter"
          :options="statusOptions"
          size="medium"
          class="w-full sm:w-[146px] [&_.n-base-selection]:min-h-[34px] [&_.n-base-selection]:rounded-[4px] [&_.n-base-selection]:border-[1px] [&_.n-base-selection]:border-white/10 [&_.n-base-selection]:bg-[#151515]! [&_.n-base-selection]:text-white/82 [&_.n-base-selection]:shadow-none! [&_.n-base-selection-label]:text-[13px] [&_.n-base-selection-placeholder]:text-white/48"
          :consistent-menu-width="false"
        />
      </div>
      <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-3">
        <span class="whitespace-nowrap text-[14px] text-white/50">排序方式:</span>
        <n-select
          v-model:value="sortBy"
          :options="sortOptions"
          size="medium"
          class="w-full sm:w-[176px] [&_.n-base-selection]:min-h-[34px] [&_.n-base-selection]:rounded-[4px] [&_.n-base-selection]:border-[1px] [&_.n-base-selection]:border-white/10 [&_.n-base-selection]:bg-[#151515]! [&_.n-base-selection]:text-white/82 [&_.n-base-selection]:shadow-none! [&_.n-base-selection-label]:text-[13px] [&_.n-base-selection-placeholder]:text-white/48"
          :consistent-menu-width="false"
        />
      </div>
    </div>

    <div class="flex min-h-[calc(100vh-210px)] items-center justify-center rounded-b-[8px] border border-t-0 border-white/5 bg-[linear-gradient(90deg,rgba(25,25,25,0.98)_0%,rgba(29,29,29,0.96)_52%,rgba(24,24,24,0.98)_100%)]">
      <n-empty
        description="暂无任务数据"
        class="[&_.n-empty__description]:text-[14px] [&_.n-empty__description]:font-semibold [&_.n-empty__description]:text-white/40"
      />
    </div>
  </div>
</template>
