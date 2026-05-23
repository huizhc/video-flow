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
  <div class="h-full flex flex-col bg-[#232326] p-4">
    <div
      class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5"
    >
      <div
        v-for="s in stats"
        :key="s.key"
        class="flex min-h-[76px] items-center gap-3 rounded-[10px] border border-[#35353b] bg-[#2b2b30] px-4 shadow-[0_10px_24px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.02)]"
      >
        <div
          class="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px]"
          :class="s.iconBg"
        >
          <n-icon :size="18" :class="s.iconClass" :component="s.icon" />
        </div>
        <div class="min-w-0">
          <div class="text-[24px] leading-[1.1] font-semibold text-white/95">
            {{ s.count }}
          </div>
          <div
            class="mt-[2px] text-[14px] leading-[1.2] font-semibold text-white/45"
          >
            {{ s.label }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-[#34343a] bg-[#2a2a2f] shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
    >
      <div
        class="flex flex-col items-stretch justify-between gap-3 px-4 py-4 lg:flex-row lg:items-center"
      >
        <div
          class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-3"
        >
          <span class="whitespace-nowrap text-[14px] text-white/50"
            >状态筛选:</span
          >
          <n-select
            v-model:value="statusFilter"
            :options="statusOptions"
            size="medium"
            class="task-square-field w-full sm:w-[146px]"
            :consistent-menu-width="false"
          />
        </div>
        <div
          class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between lg:justify-start lg:gap-3"
        >
          <span class="whitespace-nowrap text-[14px] text-white/50"
            >排序方式:</span
          >
          <n-select
            v-model:value="sortBy"
            :options="sortOptions"
            size="medium"
            class="task-square-field w-full sm:w-[176px]"
            :consistent-menu-width="false"
          />
        </div>
      </div>
    </div>

    <div
      class="flex-1 mt-4 flex items-center justify-center rounded-[10px] border border-[#35353b] bg-[#2b2b30] shadow-[0_10px_24px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.02)]"
    >
      <n-empty
        description="暂无任务数据"
        class="[&_.n-empty__description]:text-[14px] [&_.n-empty__description]:font-semibold [&_.n-empty__description]:text-white/40"
      />
    </div>
  </div>
</template>

<style scoped>
.task-square-field :deep(.n-base-selection) {
  background-color: #202126;
}

.task-square-field :deep(.n-base-selection:hover) {
  background-color: #24252a;
}
</style>
