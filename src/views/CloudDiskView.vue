<script setup>
import { ref } from 'vue'
import { NButton, NCheckbox, NEmpty, NProgress, NTree } from 'naive-ui'

const usedGb = 0
const totalGb = 0.1
const usagePercent = Math.min(100, Math.round((usedGb / totalGb) * 100))

const fileTab = ref('all')
const selectAll = ref(false)
const selectedFolderKeys = ref(['default-folder'])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '图片', value: 'image' },
  { label: '其他', value: 'other' },
]

const folderTreeData = [
  {
    key: 'default-folder',
    label: '默认文件夹 0B',
  },
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
      class="grid grid-cols-[300px_1fr] gap-x-[70px] min-h-[calc(100vh-18rem)] overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#151515] xl:flex-row"
    >
      <aside
        class="w-full shrink-0 border-b border-[#2a2a2a] bg-[#141414] p-4 xl:border-b-0 xl:border-r"
      >
        <div
          class="mb-4 rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-3"
        >
          <n-progress
            type="line"
            :percentage="usagePercent"
            :height="6"
            :border-radius="3"
            :show-indicator="false"
            color="#00b5ad"
            rail-color="rgba(255,255,255,0.08)"
          />
          <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span class="text-gray-400">
              可用空间:
              <strong class="text-white font-medium tabular-nums"
                >{{ usedGb.toFixed(2) }}GB</strong
              >
              /
              <strong class="text-white font-medium tabular-nums"
                >{{ totalGb.toFixed(2) }}GB</strong
              >
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
        <n-tree
          v-model:selected-keys="selectedFolderKeys"
          block-line
          selectable
          expand-on-click
          :data="folderTreeData"
          class="cloud-folder-tree"
        />
      </aside>

      <div class="w-full bg-[#1a1a1a]">
        <div class="border-b border-[#2a2a2a] bg-[#161616] p-4">
          <div
            class="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between"
          >
            <div>
              <div class="mb-3 text-sm font-medium text-white">
                当前文件夹内容
              </div>
              <div
                class="inline-flex w-full flex-wrap rounded-lg border border-[#333333] bg-[#252525] p-0.5 gap-0.5 sm:w-auto"
              >
                <button
                  v-for="t in tabs"
                  :key="t.value"
                  type="button"
                  class="min-w-[72px] flex-1 rounded-md border-0 px-3.5 py-1.5 text-sm transition-colors cursor-pointer sm:flex-none"
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

            <div class="min-w-0">
              <div class="mb-3 text-sm font-medium text-white">批量操作</div>
              <div class="flex flex-wrap items-center gap-2">
                <n-checkbox v-model:checked="selectAll">
                  <span class="text-gray-300 text-sm">全选</span>
                </n-checkbox>
                <n-button
                  size="small"
                  class="!text-white !border-[#5c2b2b] !bg-[#5c2b2b] hover:!bg-[#6d3333]"
                >
                  批量删除
                </n-button>
                <n-button
                  size="small"
                  secondary
                  class="!bg-[#2d2d2d] !text-white border-[#3a3a3a]"
                >
                  批量下载
                </n-button>
                <n-button
                  size="small"
                  secondary
                  class="!bg-[#2d2d2d] !text-white border-[#3a3a3a]"
                >
                  批量修改文件夹
                </n-button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex min-h-[320px] items-center justify-center">
          <n-empty description="暂无文件" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cloud-folder-tree :deep(.n-tree-node-content) {
  min-height: 36px;
  border-radius: 8px;
  padding: 0 8px;
}

.cloud-folder-tree :deep(.n-tree-node-content__text) {
  color: #f3f4f6;
  font-size: 14px;
  font-weight: 500;
}

.cloud-folder-tree :deep(.n-tree-node-content:hover) {
  background: rgba(255, 255, 255, 0.05);
}

.cloud-folder-tree :deep(.n-tree-node--selected > .n-tree-node-content) {
  background: rgba(255, 255, 255, 0.06);
}
</style>
