<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NInput, NModal, NSelect } from 'naive-ui'
import { Add, Search, Close, Edit, Copy, TrashCan } from '@vicons/carbon'

const STORAGE_KEY = 'batch-video-mix-projects'

const router = useRouter()
const sortValue = ref('created-desc')
const keyword = ref('')
const showCreateModal = ref(false)
const newProjectName = ref('')
const hoveredId = ref(null)
const showRenameModal = ref(false)
const renameTarget = ref(null)
const renameValue = ref('')

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

  const now = Date.now()
  projects.value.push({
    id: nextProjectId.value,
    name,
    createdAt: now,
    updatedAt: now,
    cover:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80', // 默认封面
  })
  nextProjectId.value += 1
  showCreateModal.value = false
  newProjectName.value = ''
}

function formatDate(ts) {
  if (!ts) return '--'
  const d = new Date(ts)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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

function startRename(project) {
  renameTarget.value = project
  renameValue.value = project.name
  showRenameModal.value = true
}

function confirmRename() {
  const name = renameValue.value.trim()
  if (!name || !renameTarget.value) return
  const idx = projects.value.findIndex((p) => p.id === renameTarget.value.id)
  if (idx !== -1) {
    projects.value[idx].name = name
    projects.value[idx].updatedAt = Date.now()
  }
  showRenameModal.value = false
  renameTarget.value = null
  renameValue.value = ''
}

function duplicateProject(project, event) {
  event.stopPropagation()
  const now = Date.now()
  projects.value.push({
    id: nextProjectId.value,
    name: `${project.name} - 副本`,
    createdAt: now,
    updatedAt: now,
    cover: project.cover,
  })
  nextProjectId.value += 1
}

function deleteProject(project, event) {
  event.stopPropagation()
  const idx = projects.value.findIndex((p) => p.id === project.id)
  if (idx !== -1) {
    projects.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="h-full p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8">
      <div class="bg-[#232323] h-full rd-[4px] flex flex-col">
        <div class="flex items-center px-4 py-3 justify-between gap-4 shrink-0">
          <div class="flex items-center gap-4">
            <div class="text-sm font-medium text-white/90">
              项目列表
              <span class="ml-0.5 text-white/30 text-[12px]"
                >({{ filteredProjects.length }}/{{ projects.length }})</span
              >
            </div>
            <span class="text-[12px] text-white/30">按创建时间(新→旧)</span>
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
              class="border-0 whitespace-nowrap bg-transparent px-1 py-0 text-[12px] text-white/40 transition-colors hover:text-white/70"
              @click="clearSort"
            >
              清除排序
            </button>
            <n-input
              v-model:value="keyword"
              size="small"
              placeholder="搜索项目"
              class="w-[140px] [&_.n-input-wrapper]:!bg-[#1a1a1a] [&_.n-input-wrapper]:!border-white/10"
            >
              <template #prefix>
                <n-icon :component="Search" class="text-white/30" />
              </template>
            </n-input>
          </div>
        </div>

        <div class="flex-1 overflow-auto p-4">
          <div class="flex flex-wrap gap-5">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="group relative w-[210px] rounded-[6px] bg-[#1a1a1b] border border-white/5 cursor-pointer transition-all hover:border-[#4fd1c5]/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] shrink-0"
              @mouseenter="hoveredId = project.id"
              @mouseleave="hoveredId = null"
              @click="openProject(project)"
            >
              <div class="p-2">
                <div
                  class="aspect-square w-full overflow-hidden rounded-[4px] bg-black/20"
                >
                  <img
                    v-if="project.cover"
                    :src="project.cover"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-white/5 text-white/10"
                  >
                    No Cover
                  </div>
                </div>

                <div class="mt-3 px-1 pb-2">
                  <div class="text-sm font-bold text-white/90 truncate mb-2">
                    {{ project.name }}
                  </div>
                  <div class="space-y-0.5">
                    <div class="text-[11px] text-white/30">
                      创建: {{ formatDate(project.createdAt) }}
                    </div>
                    <div class="text-[11px] text-white/30">
                      更新: {{ formatDate(project.updatedAt) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hover Actions -->
              <div
                v-if="hoveredId === project.id"
                class="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  type="button"
                  class="btn-close flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur-sm transition-colors hover:bg-[#4fd1c5] hover:text-white"
                  title="重命名"
                  @click.stop="startRename(project)"
                >
                  <n-icon :size="14" :component="Edit" />
                </button>
                <button
                  type="button"
                  class="btn-close flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur-sm transition-colors hover:bg-[#4fd1c5] hover:text-white"
                  title="复制"
                  @click.stop="duplicateProject(project, $event)"
                >
                  <n-icon :size="14" :component="Copy" />
                </button>
                <button
                  type="button"
                  class="btn-close flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                  title="删除"
                  @click.stop="deleteProject(project, $event)"
                >
                  <n-icon :size="14" :component="TrashCan" />
                </button>
              </div>
            </div>

            <div
              class="w-[210px] aspect-[210/280] rounded-[6px] bg-[#1a1a1b] border border-dashed border-white/10 shrink-0"
            >
              <button
                type="button"
                class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[6px] border-0 bg-transparent text-white/20 transition-colors hover:bg-white/[0.02] hover:text-white/40"
                @click="openCreateModal"
              >
                <div class="text-[40px] leading-none font-light">+</div>
                <span class="text-sm">创建项目</span>
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
          <span class="text-sm font-medium">新建项目</span>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full btn-close"
            @click="showCreateModal = false"
          >
            <n-icon :size="18" :component="Close" class="text-white/45" />
          </button>
        </div>

        <div class="mb-2 text-sm text-white/56">项目名称</div>
        <n-input
          v-model:value="newProjectName"
          placeholder="请输入项目名称"
          class="mb-5"
          @keyup.enter="confirmCreateProject"
        />

        <div class="flex justify-end gap-3">
          <n-button
            class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-sm !text-white/80 hover:!bg-[#323437]"
            @click="showCreateModal = false"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            class="!h-[32px] !rounded-[4px] !px-6 !text-sm"
            :disabled="!newProjectName.trim()"
            @click="confirmCreateProject"
          >
            确认
          </n-button>
        </div>
      </div>
    </n-modal>

    <n-modal
      :show="showRenameModal"
      :mask-closable="true"
      @update:show="
        (val) => {
          if (!val) showRenameModal = false
        }
      "
    >
      <div
        class="w-[420px] rounded-[8px] border border-white/10 bg-[#161719] p-5 text-white shadow-2xl"
      >
        <div class="mb-5 flex items-center justify-between">
          <span class="text-sm font-medium">重命名项目</span>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full btn-close"
            @click="showRenameModal = false"
          >
            <n-icon :size="18" :component="Close" class="text-white/45" />
          </button>
        </div>

        <div class="mb-2 text-sm text-white/56">项目名称</div>
        <n-input
          v-model:value="renameValue"
          placeholder="请输入项目名称"
          class="mb-5"
          @keyup.enter="confirmRename"
        />

        <div class="flex justify-end gap-3">
          <n-button
            class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-sm !text-white/80 hover:!bg-[#323437]"
            @click="showRenameModal = false"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            class="!h-[32px] !rounded-[4px] !px-6 !text-sm"
            :disabled="!renameValue.trim()"
            @click="confirmRename"
          >
            确认
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>
