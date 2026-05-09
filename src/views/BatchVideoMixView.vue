<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon, NInput, NSelect } from 'naive-ui'
import { Add, Search } from '@vicons/carbon'

const router = useRouter()
const sortValue = ref('created-desc')
const keyword = ref('')

const sortOptions = [
  { label: '创建时间(新到旧)', value: 'created-desc' },
  { label: '创建时间(旧到新)', value: 'created-asc' },
]

function createProject() {
  router.push({ name: 'tool-batch-video-mix-project' })
}
</script>

<template>
  <div class="min-h-screen bg-[#060709] p-3 text-white">
    <div class="overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
      <div class="min-h-[calc(100vh-24px)] bg-[#232323]">
        <div class="flex items-center px-3 py-3   justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="text-[13px] font-medium text-white/82">
              项目列表
              <span class="ml-1 text-white/36">(0/0)</span>
            </div>
            <span class="text-[11px] text-white/28">按创建时间(新一旧)</span>
          </div>

          <div class="flex items-center gap-2">
            <n-select
              v-model:value="sortValue"
              size="small"
              :options="sortOptions"
              class="w-[148px]"
            />
            <button
              type="button"
              class="border-0 whitespace-nowrap bg-transparent px-1 py-0 text-[11px] text-white/40 transition-colors hover:text-white/68"
            >
              清除排序
            </button>
            <n-input
              v-model:value="keyword"
              size="small"
              placeholder="搜索项目"
              class="w-[138px]"
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>
        </div>

        <div class="p-4">
          <div class="h-[184px] w-[132px] rounded-[4px] bg-[#17181b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <button
              type="button"
              class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[4px] border-0 bg-transparent text-white/28 transition-colors hover:text-white/50"
              @click="createProject"
            >
              <n-icon :size="34" :component="Add" />
              <span class="text-[11px]">创建项目</span>
            </button>
          </div>
        </div>

        <div class="h-[calc(100vh-262px)]" />
      </div>
    </div>
  </div>
</template>
