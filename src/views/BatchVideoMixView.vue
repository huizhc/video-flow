<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NInput, NModal, NSelect } from 'naive-ui'
import { Add, Search, Close } from '@vicons/carbon'

const STORAGE_KEY = 'batch-video-mix-projects'

const router = useRouter()
const sortValue = ref('created-desc')
const keyword = ref('')
const showCreateModal = ref(false)
const newProjectName = ref('')

const sortOptions = [
  { label: '创建时间(新到旧)', value: 'created-desc' },
  { label: '创建时间(旧到新)', value: 'created-asc' },
]

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // ignore
  }
  return []
}

const projects = ref(loadProjects())

const nextProjectId = ref(
  projects.value.length > 0
    ? Math.max(...projects.value.map((p) => p.id)) + 1
    : 1
)

watch(
  projects,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true }
)

const filteredProjects = computed(() => {
  let list = [...projects.value]

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(kw))
  }

  if (sortValue.value === 'created-asc') {
    list.sort((a, b) => a.createdAt - b.createdAt)
  } else {
    list.sort((a, b) => b.createdAt - a.createdAt)
  }

  return list
})

function openCreateModal() {
  newProjectName.value = ''
  showCreateModal.value = true
}

function confirmCreateProject() {
  const name = newProjectName.value.trim()
  if (!name) return

  projects.value.push({
    id: nextProjectId.value,
    name,
    createdAt: Date.now(),
  })
  nextProjectId.value += 1
  showCreateModal.value = false
  newProjectName.value = ''
}

function openProject(project) {
  router.push({
    name: 'tool-batch-video-mix-project',
    query: { projectId: project.id, projectName: project.name },
  })
}

function clearSort() {
  sortValue.value = 'created-desc'
}
</script>

<template>
  <div class="h-full p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8">
      <div class="bg-[#232323] h-full rd-[4px] flex flex-col">
        <div class="flex items-center px-3 py-3 justify-between gap-4 shrink-0">
          <div class="flex items-center gap-4">
            <div class="text-[13px] font-medium text-white/82">
              项目列表
              <span class="ml-1 text-white/36"
                >({{ filteredProjects.length }}/{{ projects.length }})</span
              >
            </div>
            <span class="text-[11px] text-white/28">按创建时间(新→旧)</span>
          </div>

          <div class="flex items-center gap-2">
            <n-select
              v-model:value="sortValue"
              size="tiny"
              :options="sortOptions"
              class="w-[148px]"
            />
            <button
              type="button"
              class="border-0 whitespace-nowrap bg-transparent px-1 py-0 text-[11px] text-white/40 transition-colors hover:text-white/68"
              @click="clearSort"
            >
              清除排序
            </button>
            <n-input
              v-model:value="keyword"
              size="tiny"
              placeholder="搜索项目"
              class="w-[138px]"
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>
        </div>

        <div class="flex-1 overflow-auto p-4">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="h-[184px] w-[132px] rounded-[4px] bg-[#17181b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] cursor-pointer transition-shadow hover:shadow-[inset_0_0_0_1px_rgba(79,209,197,0.35)] shrink-0"
              @click="openProject(project)"
            >
              <div
                class="flex h-full w-full flex-col items-center justify-center gap-2 p-3"
              >
                <span
                  class="text-[13px] font-medium text-white/72 text-center line-clamp-2"
                  >{{ project.name }}</span
                >
                <span class="text-[10px] text-white/28">{{
                  new Date(project.createdAt).toLocaleDateString()
                }}</span>
              </div>
            </div>
            <div
              class="h-[184px] w-[132px] rounded-[4px] bg-[#17181b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] shrink-0"
            >
              <button
                type="button"
                class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[4px] border-0 bg-transparent text-white/28 transition-colors hover:text-white/50"
                @click="openCreateModal"
              >
                <n-icon :size="34" :component="Add" />
                <span class="text-[11px]">创建项目</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <n-modal
      :show="showCreateModal"
      :mask-closable="true"
      @update:show="
        (val) => {
          if (!val) showCreateModal = false
        }
      "
    >
      <div
        class="w-[420px] rounded-[8px] border border-white/10 bg-[#161719] p-5 text-white shadow-2xl"
      >
        <div class="mb-5 flex items-center justify-between">
          <span class="text-[14px] font-medium">新建项目</span>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full btn-close"
            @click="showCreateModal = false"
          >
            <n-icon :size="18" :component="Close" class="text-white/45" />
          </button>
        </div>

        <div class="mb-2 text-[12px] text-white/56">项目名称</div>
        <n-input
          v-model:value="newProjectName"
          placeholder="请输入项目名称"
          class="mb-5"
          @keyup.enter="confirmCreateProject"
        />

        <div class="flex justify-end gap-3">
          <n-button
            class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-[12px] !text-white/80 hover:!bg-[#323437]"
            @click="showCreateModal = false"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            class="!h-[32px] !rounded-[4px] !px-6 !text-[12px]"
            :disabled="!newProjectName.trim()"
            @click="confirmCreateProject"
          >
            确认
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>
