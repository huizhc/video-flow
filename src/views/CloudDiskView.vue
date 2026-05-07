<script setup>
import { ref } from 'vue'
import { NButton, NCheckbox, NEmpty, NProgress } from 'naive-ui'

const usedGb = 0
const totalGb = 0.1
const usagePercent = Math.min(100, Math.round((usedGb / totalGb) * 100))

const fileTab = ref('all')
const selectAll = ref(false)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '图片', value: 'image' },
  { label: '其他', value: 'other' },
]
</script>

<template>
  <div class="min-h-full bg-[#1a1a1a] p-4">
    <div
      class="rounded-lg px-4 py-3 mb-4 text-sm text-white/95 leading-relaxed border border-[#6b4f1a]/40 bg-[#3e2f18]"
    >
      <p class="m-0 mb-2">
        所有任务产生的结果，都会存放在云盘空间，请及时下载，文件将在7天后自动删除！
      </p>
      <p class="m-0">
        每个用户有100MB的免费空间，如空间不足，而导致任务执行失败，可以申请扩容。
      </p>
    </div>

    <div
      class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-4 flex-wrap"
    >
      <div class="w-full xl:w-auto xl:max-w-md xl:flex-1 min-w-0 space-y-2">
        <n-progress
          type="line"
          :percentage="usagePercent"
          :height="6"
          :border-radius="3"
          :show-indicator="false"
          color="#00b5ad"
          rail-color="rgba(255,255,255,0.08)"
        />
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span class="text-gray-400">
            可用空间:
            <strong class="text-white font-medium tabular-nums">{{ usedGb.toFixed(2) }}GB</strong>
            /
            <strong class="text-white font-medium tabular-nums">{{ totalGb.toFixed(2) }}GB</strong>
          </span>
          <button
            type="button"
            class="text-[#00b5ad] hover:text-[#5eead4] text-sm bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            扩容
          </button>
          <button
            type="button"
            class="text-[#00b5ad] hover:text-[#5eead4] text-sm bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            续签
          </button>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-2 justify-start xl:justify-center xl:flex-1 xl:px-4"
      >
        <div
          class="inline-flex flex-wrap rounded-lg p-0.5 gap-0.5 bg-[#252525] border border-[#333333]"
        >
          <button
            v-for="t in tabs"
            :key="t.value"
            type="button"
            class="px-3.5 py-1.5 rounded-md text-sm transition-colors border-0 cursor-pointer"
            :class="
              fileTab === t.value
                ? 'bg-[#00b5ad] text-white font-medium'
                : 'bg-transparent text-gray-400 hover:text-gray-200'
            "
            @click="fileTab = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 justify-start xl:justify-end shrink-0">
        <n-checkbox v-model:checked="selectAll">
          <span class="text-gray-300 text-sm">全选</span>
        </n-checkbox>
        <n-button
          size="small"
          class="!text-white !border-[#5c2b2b] !bg-[#5c2b2b] hover:!bg-[#6d3333]"
        >
          批量删除
        </n-button>
        <n-button size="small" secondary class="!bg-[#2d2d2d] !text-white border-[#3a3a3a]">
          批量下载
        </n-button>
        <n-button size="small" secondary class="!bg-[#2d2d2d] !text-white border-[#3a3a3a]">
          批量修改文件夹
        </n-button>
      </div>
    </div>

    <div
      class="flex min-h-[calc(100vh-18rem)] rounded-xl border border-[#2a2a2a] overflow-hidden bg-[#151515]"
    >
      <aside
        class="w-52 sm:w-56 shrink-0 border-r border-[#2a2a2a] p-4 bg-[#141414]"
      >
        <div
          class="text-sm text-white font-medium cursor-pointer rounded-lg px-2 py-2 hover:bg-white/5"
        >
          默认文件夹 0B
        </div>
      </aside>
      <div class="flex-1 flex items-center justify-center bg-[#1a1a1a] min-h-[320px]">
        <n-empty description="暂无文件" />
      </div>
    </div>
  </div>
</template>
