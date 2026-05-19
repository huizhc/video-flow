<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  NButton,
  NCheckbox,
  NColorPicker,
  NDropdown,
  NIcon,
  NInputNumber,
  NRadio,
  NSelect,
} from 'naive-ui'
import {
  ArrowLeft,
  ChevronDown,
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
import PackagingStyleModal from '@/components/PackagingStyleModal.vue'

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
                      size="tiny"
                      class="!px-3 !rounded-[4px] text-#fff! !text-xs"
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
                <PackagingStyleModal
                  v-model:show="showPackagingStyleModal"
                  v-model:selected-style-id="subtitleMode"
                />
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
  </div>
</template>
