<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  NButton,
  NCheckbox,
  NColorPicker,
  NDropdown,
  NIcon,
  NInputNumber,
  NModal,
  NRadio,
  NRadioButton,
  NRadioGroup,
  NSelect,
} from 'naive-ui'
import {
  ArrowLeft,
  ChevronDown,
  Close,
  CloudUpload,
  Currency,
  Document,
  DocumentTasks,
  Headset,
  Language,
  PlayFilledAlt,
} from '@vicons/carbon'
import { useRouter } from 'vue-router'
import UploadArea from '@/components/UploadArea.vue'

const router = useRouter()

const videoUrl = ref('')
const fileName = ref('')
const videoRef = ref(null)
const containerRef = ref(null)

const videoWidth = ref(0)
const videoHeight = ref(0)
const displayWidth = ref(0)
const displayHeight = ref(0)
const containerHeight = ref(0)

const areas = ref([])

const interactionState = ref({
  index: -1,
  type: null,
  startX: 0,
  startY: 0,
  startArea: null,
})
const fontSize = ref('middle')
/** 智能包装选中样式 id，供提交任务使用 */
const subtitleMode = ref('')

const showPackagingStyleModal = ref(false)
const packagingCategory = ref('live')
const packagingPage = ref(1)
const packagingPageSize = 10
const selectedPackagingStyle = ref(null)

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

function openPackagingModal() {
  showPackagingStyleModal.value = true
}

function closePackagingModal() {
  showPackagingStyleModal.value = false
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
  selectedPackagingStyle.value = {
    ...item,
    category: packagingCategory.value,
  }
  subtitleMode.value = item.id
}

function confirmPackagingStyle() {
  closePackagingModal()
}

function cancelPackagingStyle() {
  selectedPackagingStyle.value = null
  subtitleMode.value = ''
  closePackagingModal()
}

const xPercent = ref(60)
const yPercent = ref(75)
const textStroke = ref(true)
const textColor = ref('#1a1a1a')
const strokeColor = ref('#f5d439')

const fontSizeOptions = [
  { label: '小', value: 'small' },
  { label: '中', value: 'middle' },
  { label: '大', value: 'large' },
]

const langOptions = [
  { label: '简体中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]

function initDefaultArea() {
  if (!videoWidth.value || !videoHeight.value) return
  const areaH = Math.round(videoHeight.value * 0.15)
  const areaW = Math.round(videoWidth.value * 0.6)
  const areaX = Math.round((videoWidth.value - areaW) / 2)
  const areaY = Math.round(videoHeight.value * 0.8)
  areas.value = [
    {
      x: areaX,
      y: areaY,
      w: areaW,
      h: areaH,
    },
  ]
  syncAreaToPercent()
}

function syncAreaToPercent() {
  if (areas.value.length === 0 || !videoWidth.value || !videoHeight.value)
    return
  const area = areas.value[0]
  xPercent.value = Math.round(((area.x + area.w / 2) / videoWidth.value) * 100)
  yPercent.value = Math.round(((area.y + area.h / 2) / videoHeight.value) * 100)
}

const startInteract = (e, index, type) => {
  e.stopPropagation()
  interactionState.value = {
    index,
    type,
    startX: e.clientX,
    startY: e.clientY,
    startArea: { ...areas.value[index] },
  }
  document.addEventListener('mousemove', onInteract)
  document.addEventListener('mouseup', endInteract)
}

const onInteract = (e) => {
  const state = interactionState.value
  if (state.index === -1) return

  const scaleX = videoWidth.value / displayWidth.value
  const scaleY = videoHeight.value / displayHeight.value

  const dx = (e.clientX - state.startX) * scaleX
  const dy = (e.clientY - state.startY) * scaleY

  let { x, y, w, h } = state.startArea

  if (state.type === 'move') {
    x += dx
    y += dy
  } else {
    if (state.type.includes('l')) {
      x += dx
      w -= dx
    }
    if (state.type.includes('r')) {
      w += dx
    }
    if (state.type.includes('t')) {
      y += dy
      h -= dy
    }
    if (state.type.includes('b')) {
      h += dy
    }
  }

  if (w < 20) w = 20
  if (h < 20) h = 20
  if (x < 0) x = 0
  if (y < 0) y = 0
  if (x + w > videoWidth.value) {
    if (state.type === 'move') x = videoWidth.value - w
    else w = videoWidth.value - x
  }
  if (y + h > videoHeight.value) {
    if (state.type === 'move') y = videoHeight.value - h
    else h = videoHeight.value - y
  }

  areas.value[state.index] = {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  }

  syncAreaToPercent()
}

const endInteract = () => {
  interactionState.value.index = -1
  document.removeEventListener('mousemove', onInteract)
  document.removeEventListener('mouseup', endInteract)
}

const onFileChange = (file) => {
  if (!file) return
  fileName.value = file.name
  videoUrl.value = URL.createObjectURL(file)

  areas.value = []
  videoWidth.value = 0
  videoHeight.value = 0
  displayWidth.value = 0
  displayHeight.value = 0
}

const removeVideo = () => {
  if (videoUrl.value && videoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoUrl.value)
  }
  videoUrl.value = ''
  fileName.value = ''
  areas.value = []
}

const onLoadedMetadata = (e) => {
  videoWidth.value = e.target.videoWidth
  videoHeight.value = e.target.videoHeight
  updateDisplaySize()
  nextTick(() => {
    initDefaultArea()
  })
}

const updateDisplaySize = () => {
  if (!videoRef.value || !containerRef.value || !videoWidth.value) return
  const containerW = containerRef.value.clientWidth
  const containerH = containerRef.value.clientHeight
  containerHeight.value = containerH

  const videoRatio = videoWidth.value / videoHeight.value
  const containerRatio = containerW / containerH

  if (videoRatio > containerRatio) {
    displayWidth.value = containerW
    displayHeight.value = containerW / videoRatio
  } else {
    displayHeight.value = containerH
    displayWidth.value = containerH * videoRatio
  }
}

onMounted(() => {
  window.addEventListener('resize', updateDisplaySize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDisplaySize)
  if (videoUrl.value && videoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoUrl.value)
  }
})

const getAreaStyle = (area) => {
  if (!displayWidth.value || !videoWidth.value) return {}
  const scaleX = displayWidth.value / videoWidth.value
  const scaleY = displayHeight.value / videoHeight.value
  return {
    left: area.x * scaleX + 'px',
    top: area.y * scaleY + 'px',
    width: area.w * scaleX + 'px',
    height: area.h * scaleY + 'px',
  }
}

function goHome() {
  router.push({ name: 'tools-all' })
}
</script>

<template>
  <div class="h-full bg-[#060709] p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8 bg-[#0b0d10]">
      <div
        class="grid min-h-[calc(100vh-64px)] grid-cols-1 gap-x-[15px] sm:grid-cols-[480px_minmax(0,1fr)_480px]"
      >
        <section class="bg-[#232323] flex flex-col min-h-0 overflow-hidden">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            识别语音加字幕
          </div>
          <div class="flex-1 p-4 flex flex-col relative min-h-0">
            <UploadArea :has-file="!!videoUrl" @file-change="onFileChange">
              <template #uploaded>
                <div
                  class="border-[1px] border-solid border-#ffffff10 p-[10px] flex flex-col min-h-0 w-full"
                >
                  <div
                    class="flex-1 bg-black/50 relative overflow-hidden rounded-[4px] flex items-center justify-center"
                    ref="containerRef"
                  >
                    <div
                      :style="{
                        width: displayWidth ? displayWidth + 'px' : '100%',
                        height: displayHeight ? displayHeight + 'px' : '100%',
                        visibility: displayWidth ? 'visible' : 'hidden',
                      }"
                      class="relative"
                    >
                      <video
                        ref="videoRef"
                        crossorigin="anonymous"
                        :src="videoUrl"
                        class="w-full h-full object-contain"
                        @loadedmetadata="onLoadedMetadata"
                        controls
                        controlsList="nodownload"
                      ></video>

                      <div
                        class="absolute inset-0 z-10 pointer-events-none"
                        style="bottom: 50px"
                      >
                        <div
                          v-for="(area, index) in areas"
                          :key="index"
                          class="absolute border-2 border-yellow-400 bg-yellow-400/20 pointer-events-auto cursor-move flex items-center justify-center"
                          :style="getAreaStyle(area)"
                          @mousedown="startInteract($event, index, 'move')"
                        >
                          <span
                            class="text-yellow-400 text-sm font-bold whitespace-nowrap cursor-default pointer-events-none"
                            style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8)"
                            >字幕区域</span
                          >

                          <div
                            class="absolute w-3 h-3 bg-transparent -left-1.5 -top-1.5 cursor-nwse-resize"
                            @mousedown="startInteract($event, index, 'tl')"
                          ></div>
                          <div
                            class="absolute w-full h-3 bg-transparent left-0 -top-1.5 cursor-ns-resize"
                            @mousedown="startInteract($event, index, 't')"
                          ></div>
                          <div
                            class="absolute w-3 h-3 bg-transparent -right-1.5 -top-1.5 cursor-nesw-resize"
                            @mousedown="startInteract($event, index, 'tr')"
                          ></div>
                          <div
                            class="absolute w-3 h-full bg-transparent -right-1.5 top-0 cursor-ew-resize"
                            @mousedown="startInteract($event, index, 'r')"
                          ></div>
                          <div
                            class="absolute w-3 h-3 bg-transparent -right-1.5 -bottom-1.5 cursor-nwse-resize"
                            @mousedown="startInteract($event, index, 'br')"
                          ></div>
                          <div
                            class="absolute w-full h-3 bg-transparent left-0 -bottom-1.5 cursor-ns-resize"
                            @mousedown="startInteract($event, index, 'b')"
                          ></div>
                          <div
                            class="absolute w-3 h-3 bg-transparent -left-1.5 -bottom-1.5 cursor-nesw-resize"
                            @mousedown="startInteract($event, index, 'bl')"
                          ></div>
                          <div
                            class="absolute w-3 h-full bg-transparent -left-1.5 top-0 cursor-ew-resize"
                            @mousedown="startInteract($event, index, 'l')"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-4 flex items-center justify-between text-xs text-white/60 shrink-0"
                  >
                    <span v-if="videoWidth > 0"
                      >视频尺寸：{{ videoWidth }} x {{ videoHeight }}</span
                    >
                    <span v-else>正在加载视频信息...</span>
                    <n-button
                      type="error"
                      size="small"
                      class="!h-[28px] !px-3 !rounded-[4px] text-#fff! !text-sm"
                      @click="removeVideo"
                    >
                      移除视频
                    </n-button>
                  </div>
                </div>
              </template>
            </UploadArea>
          </div>
        </section>

        <section class="flex min-h-0 flex-col bg-[#232323]">
          <div
            class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            <span>字幕校正</span>
            <n-button
              type="primary"
              size="tiny"
              class="!px-3 !rounded-[4px] !text-sm"
            >
              解析音频
            </n-button>
          </div>

          <div
            class="flex min-h-0 flex-1 items-center justify-center text-center text-sm text-white/34"
          >
            <div>
              <div>暂无字幕内容</div>
              <div class="mt-2">上传视频后点「解析音频」按钮获取</div>
            </div>
          </div>
        </section>

        <section class="bg-[#232323]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            参数设置（需符合视频尺寸，二选一）
          </div>
          <div class="px-3 py-3 text-sm text-white/48">
            <div class="space-y-3 [&>div>span]:w-[60px]">
              <div class="flex items-center gap-3">
                <span class="shrink-0">智能包装:</span>
                <button
                  type="button"
                  class="flex min-w-[100px] h-[30px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent px-3 text-sm text-white/45 transition-colors hover:text-white/70"
                  @click="openPackagingModal"
                >
                  {{ selectedPackagingStyle?.name ?? '选择样式' }}
                </button>
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">字幕位置:</span>
                <div class="flex items-center gap-2">
                  <n-input-number
                    v-model:value="xPercent"
                    size="small"
                    :min="0"
                    :max="100"
                    class="!w-[120px] text-center"
                    button-placement="both"
                    placeholder="X"
                  >
                    <template #suffix>%</template>
                  </n-input-number>
                  ~
                  <n-input-number
                    v-model:value="yPercent"
                    size="small"
                    :min="0"
                    :max="100"
                    class="!w-[120px] text-center"
                    button-placement="both"
                    placeholder="Y"
                  >
                    <template #suffix>%</template>
                  </n-input-number>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">字体大小:</span>
                <n-select
                  v-model:value="fontSize"
                  size="small"
                  :options="fontSizeOptions"
                  class="w-[150px]"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">字幕颜色:</span>
                <n-color-picker
                  v-model:value="textColor"
                  size="small"
                  :show-alpha="false"
                  class="!w-[28px] !h-[28px] [&_.n-color-picker-trigger]:!p-0 [&_.n-color-picker-trigger]:!border-white/14"
                >
                  <template #trigger="{ value, onClick, ref: triggerRef }">
                    <div
                      :ref="triggerRef"
                      :style="{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: value || '#000',
                        cursor: 'pointer',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }"
                      @click="onClick"
                    />
                  </template>
                </n-color-picker>
                <span class="text-white/58">文字颜色:</span>
                <n-color-picker
                  v-model:value="strokeColor"
                  size="small"
                  :show-alpha="false"
                  :disabled="!textStroke"
                  class="ml-[15px] !w-[28px] !h-[28px] [&_.n-color-picker-trigger]:!p-0 [&_.n-color-picker-trigger]:!border-white/14"
                >
                  <template #trigger="{ value, onClick, ref: triggerRef }">
                    <div
                      :ref="triggerRef"
                      :style="{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: value || '#000',
                        cursor: 'pointer',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }"
                      @click="onClick"
                    />
                  </template>
                </n-color-picker>
              </div>
            </div>

            <div
              class="mt-4 flex items-center gap-1.5 text-sm text-amber-400/95"
            >
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">500</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-white/48 cursor-pointer"
                  ></i>
                </template>
                根据上传视频时长计算，每30秒500算力
              </n-tooltip>
            </div>

            <div class="pt-8 flex justify-end">
              <n-button
                type="warning"
                size="small"
                class="!px-3 text-#fff! !rounded-[4px] !text-sm"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <n-modal
      v-model:show="showPackagingStyleModal"
      :mask-closable="true"
      :close-on-esc="true"
      transform-origin="center"
    >
      <div
        class="mx-auto w-1/2 overflow-hidden rounded-[12px] border border-white/10 bg-[#1b1c1e] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div
          class="flex items-center justify-between border-b border-white/8 px-5 py-4"
        >
          <span class="text-sm font-medium text-white/95">选择包装样式</span>
          <button
            type="button"
            class="btn-close"
            aria-label="关闭"
            @click="closePackagingModal"
          >
            <n-icon :component="Close" :size="18" />
          </button>
        </div>

        <div class="px-5 pb-5 flex flex-col pt-4">
          <n-radio-group
            v-model:value="packagingCategory"
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
            <button
              type="button"
              class="rounded-[4px] border border-white/22 bg-[#252628] px-4 py-1.5 text-white/85 transition-colors hover:border-white/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
              :disabled="packagingPage <= 1"
              @click="packagingPrevPage"
            >
              上一页
            </button>
            <span class="text-white/80">第 {{ packagingPage }} 页</span>
            <button
              type="button"
              class="rounded-[4px] border border-white/22 bg-[#252628] px-4 py-1.5 text-white/85 transition-colors hover:border-white/35 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
              :disabled="packagingPage >= packagingTotalPages"
              @click="packagingNextPage"
            >
              下一页
            </button>
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
                  selectedPackagingStyle?.id === item.id
                    ? 'ring-2 ring-[#18d2e5]'
                    : ''
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
                    v-if="selectedPackagingStyle?.id === item.id"
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
                    selectedPackagingStyle?.id === item.id
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
              :disabled="!selectedPackagingStyle"
              @click="confirmPackagingStyle"
            >
              确认
            </n-button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.set-scrollbar {
  scrollbar-color: #494949 #2a2a2a;
}
</style>
