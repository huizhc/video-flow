<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NModal, NRadioButton, NRadioGroup } from 'naive-ui'
import { Close } from '@vicons/carbon'

const props = defineProps({
  show: Boolean,
  selectedStyleId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:show', 'update:selectedStyleId'])

const packagingCategory = ref('live')
const packagingPage = ref(1)
const packagingPageSize = 10

const packagingTabs = [
  { key: 'live', label: '真人口播' },
  { key: 'material', label: '素材混剪' },
  { key: 'digital', label: '数字人' },
  { key: 'news', label: '新闻混剪' },
]

/** 设计稿示例：每类一页 10 条，占位图可后续换为真实封面 */
const packagingStyleCatalog = {
  live: [
    { id: 'l1', name: '可爱彩色', seed: 'pkg-live-1' },
    { id: 'l2', name: '翻转红白', seed: 'pkg-live-2' },
    { id: 'l3', name: '重点红黄', seed: 'pkg-live-3' },
    { id: 'l4', name: '高级白橙', seed: 'pkg-live-4' },
    { id: 'l5', name: '高级黄白', seed: 'pkg-live-5' },
    { id: 'l6', name: '重点红白', seed: 'pkg-live-6' },
    { id: 'l7', name: '情感黄白', seed: 'pkg-live-7' },
    { id: 'l8', name: '棕色三屏', seed: 'pkg-live-8' },
    { id: 'l9', name: '百搭蓝白', seed: 'pkg-live-9' },
    { id: 'l10', name: '百搭暖黄', seed: 'pkg-live-10' },
  ],
  material: [
    { id: 'm1', name: '动感分屏', seed: 'pkg-mat-1' },
    { id: 'm2', name: '快闪字幕', seed: 'pkg-mat-2' },
    { id: 'm3', name: '胶片边框', seed: 'pkg-mat-3' },
    { id: 'm4', name: '杂志排版', seed: 'pkg-mat-4' },
    { id: 'm5', name: '简约大字', seed: 'pkg-mat-5' },
    { id: 'm6', name: '霓虹描边', seed: 'pkg-mat-6' },
    { id: 'm7', name: '贴纸风', seed: 'pkg-mat-7' },
    { id: 'm8', name: '分屏对比', seed: 'pkg-mat-8' },
    { id: 'm9', name: '时间轴', seed: 'pkg-mat-9' },
    { id: 'm10', name: '弹幕样式', seed: 'pkg-mat-10' },
  ],
  digital: [
    { id: 'd1', name: '演播室', seed: 'pkg-dig-1' },
    { id: 'd2', name: '虚拟背景 A', seed: 'pkg-dig-2' },
    { id: 'd3', name: '虚拟背景 B', seed: 'pkg-dig-3' },
    { id: 'd4', name: '半身讲解', seed: 'pkg-dig-4' },
    { id: 'd5', name: '全身站姿', seed: 'pkg-dig-5' },
    { id: 'd6', name: '侧立主持', seed: 'pkg-dig-6' },
    { id: 'd7', name: '坐播访谈', seed: 'pkg-dig-7' },
    { id: 'd8', name: '新闻播报', seed: 'pkg-dig-8' },
    { id: 'd9', name: '产品口播', seed: 'pkg-dig-9' },
    { id: 'd10', name: '课程讲解', seed: 'pkg-dig-10' },
  ],
  news: [
    { id: 'n1', name: '快讯条', seed: 'pkg-news-1' },
    { id: 'n2', name: '标题压条', seed: 'pkg-news-2' },
    { id: 'n3', name: '双栏资讯', seed: 'pkg-news-3' },
    { id: 'n4', name: '底部滚动', seed: 'pkg-news-4' },
    { id: 'n5', name: '角标来源', seed: 'pkg-news-5' },
    { id: 'n6', name: '严肃蓝', seed: 'pkg-news-6' },
    { id: 'n7', name: '紧急红', seed: 'pkg-news-7' },
    { id: 'n8', name: '民生黄', seed: 'pkg-news-8' },
    { id: 'n9', name: '国际灰', seed: 'pkg-news-9' },
    { id: 'n10', name: '财经绿', seed: 'pkg-news-10' },
  ],
}

const packagingStylesCurrent = computed(() => {
  return packagingStyleCatalog[packagingCategory.value] ?? []
})

const packagingStylesAll = computed(() => {
  return Object.values(packagingStyleCatalog).flat()
})

const selectedPackagingStyle = computed(() => {
  return (
    packagingStylesAll.value.find(
      (item) => item.id === props.selectedStyleId
    ) ?? null
  )
})

const packagingTotalPages = computed(() => {
  const n = packagingStylesCurrent.value.length
  return Math.max(1, Math.ceil(n / packagingPageSize))
})

const packagingStylesPageSlice = computed(() => {
  const list = packagingStylesCurrent.value
  const start = (packagingPage.value - 1) * packagingPageSize
  return list.slice(start, start + packagingPageSize)
})

function thumbUrl(seed) {
  const sampleVideos = [
    'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
    'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
    'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
    'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
    'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
  ]
  const index = seed.split('-').pop() % sampleVideos.length
  return sampleVideos[index]
}

function handleClose() {
  emit('update:show', false)
}

function openPackagingModal() {
  emit('update:show', true)
}

function setPackagingCategory(key) {
  packagingCategory.value = key
  packagingPage.value = 1
}

function packagingPrevPage() {
  if (packagingPage.value > 1) packagingPage.value -= 1
}

function packagingNextPage() {
  if (packagingPage.value < packagingTotalPages.value) {
    packagingPage.value += 1
  }
}

function selectPackagingStyle(item) {
  emit('update:selectedStyleId', item.id)
}

function clearPackagingStyle() {
  emit('update:selectedStyleId', '')
}

function cancelPackagingStyle() {
  clearPackagingStyle()
  handleClose()
}

function confirmPackagingStyle() {
  handleClose()
}
</script>

<template>
  <div class="flex min-w-0 items-center gap-2">
    <div class="inline-flex" @click="openPackagingModal">
      <slot
        name="trigger"
        :open="openPackagingModal"
        :selected-style="selectedPackagingStyle"
        :selected-style-id="selectedStyleId"
      >
        <n-button
          size="small"
          class="!h-[30px] !min-w-[100px] !rounded-[4px] !border-white/8 !bg-transparent !px-3 !text-sm !text-white/45 hover:!text-white/70"
        >
          选择样式
        </n-button>
      </slot>
    </div>

    <div
      v-if="selectedPackagingStyle"
      class="flex min-w-0 items-center gap-1 text-sm"
    >
      <span class="max-w-[120px] truncate text-white/80">
        {{ selectedPackagingStyle.name }}
      </span>
      <n-button
        quaternary
        circle
        size="tiny"
        class="!h-5 !w-5 !text-white/45 hover:!text-white/80"
        aria-label="取消选择"
        @click.stop="clearPackagingStyle"
      >
        <template #icon>
          <n-icon :component="Close" :size="14" />
        </template>
      </n-button>
    </div>
  </div>

  <n-modal
    :show="show"
    :mask-closable="true"
    :close-on-esc="true"
    transform-origin="center"
    @update:show="(value) => emit('update:show', value)"
  >
    <div
      class="mx-auto w-1/2 overflow-hidden rounded-[12px] border border-white/10 bg-[#1b1c1e] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
    >
      <div
        class="flex items-center justify-between border-b border-white/8 px-5 py-4"
      >
        <span class="text-sm font-medium text-white/95">选择包装样式</span>
        <n-button
          quaternary
          circle
          size="small"
          class="!h-7 !w-7 !text-white/60 hover:!text-white"
          aria-label="关闭"
          @click="handleClose"
        >
          <template #icon>
            <n-icon :component="Close" :size="18" />
          </template>
        </n-button>
      </div>

      <div class="px-5 pb-5 flex flex-col pt-4">
        <n-radio-group
          :value="packagingCategory"
          size="small"
          class="mx-auto"
          @update:value="setPackagingCategory"
        >
          <n-radio-button
            v-for="tab in packagingTabs"
            :key="tab.key"
            :value="tab.key"
            :class="
              packagingCategory === tab.key
                ? '!border-transparent !bg-[#18d2e5] !text-white'
                : '!border-white/18 !bg-[#252628] !text-white/75 hover:!border-white/28 hover:!text-white/90'
            "
          >
            {{ tab.label }}
          </n-radio-button>
        </n-radio-group>

        <div
          class="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <n-button
            size="small"
            class="!h-[32px] !rounded-[4px] !border-white/22 !bg-[#252628] !px-4 !text-sm !text-white/85 hover:!border-white/35 hover:!bg-white/5 disabled:!cursor-not-allowed disabled:!opacity-35"
            :disabled="packagingPage <= 1"
            @click="packagingPrevPage"
          >
            上一页
          </n-button>
          <span class="text-white/80">第 {{ packagingPage }} 页</span>
          <n-button
            size="small"
            class="!h-[32px] !rounded-[4px] !border-white/22 !bg-[#252628] !px-4 !text-sm !text-white/85 hover:!border-white/35 hover:!bg-white/5 disabled:!cursor-not-allowed disabled:!opacity-35"
            :disabled="packagingPage >= packagingTotalPages"
            @click="packagingNextPage"
          >
            下一页
          </n-button>
        </div>

        <div class="mt-6 pr-1 set-scrollbar">
          <div
            class="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-5"
          >
            <div
              v-for="item in packagingStylesPageSlice"
              :key="item.id"
              role="button"
              tabindex="0"
              class="group border-solid border-[1px] rounded-[8px] overflow-hidden border-#ffffff10 flex cursor-pointer flex-col text-left outline-none transition-opacity hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-[#18d2e5]/60"
              :class="
                selectedStyleId === item.id ? 'ring-2 ring-[#18d2e5]' : ''
              "
              @click="selectPackagingStyle(item)"
              @keydown.enter.prevent="selectPackagingStyle(item)"
              @keydown.space.prevent="selectPackagingStyle(item)"
            >
              <div
                class="relative w-full overflow-hidden border border-white/10 bg-[#121314] shadow-inner"
                style="aspect-ratio: 3 / 4"
              >
                <video
                  :src="thumbUrl(item.seed)"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                  autoplay
                  muted
                  loop
                  playsinline
                  controls
                  controlsList="nodownload"
                />
                <div
                  v-if="selectedStyleId === item.id"
                  class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#18d2e5] shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div
                class="py-[10px] truncate text-center text-sm font-medium"
                :class="
                  selectedStyleId === item.id
                    ? 'text-[#18d2e5]'
                    : 'text-white/95'
                "
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t border-white/8 pt-4">
          <n-button
            size="small"
            class="!h-[32px] !px-6 !rounded-[4px] !text-sm"
            @click="cancelPackagingStyle"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            size="small"
            class="!h-[32px] !px-6 !rounded-[4px] !text-sm"
            :disabled="!selectedStyleId"
            @click="confirmPackagingStyle"
          >
            确认
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style scoped>
.set-scrollbar {
  scrollbar-color: #494949 #2a2a2a;
}
</style>
