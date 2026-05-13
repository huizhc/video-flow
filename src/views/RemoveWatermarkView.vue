<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { NButton, NIcon, NRadio, NRadioGroup } from 'naive-ui'
import { Add, CloudUpload, Currency, Delete } from '@vicons/carbon'
import UploadArea from '@/components/UploadArea.vue'

const uploadSource = ref('local')
const algorithm = ref('normal')
const videoUrl = ref(
  'https://kesai-ai.s3.ap-northeast-1.amazonaws.com/20260511/2a36b34ae329461ebf3622364727be6c.mp4'
)
const fileName = ref('2a36b34ae329461ebf3622364727be6c.mp4')
const fileInputRef = ref(null)
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

const addArea = () => {
  if (!videoWidth.value || !videoHeight.value) return
  // Add a default 200x200 area in the center
  const w = Math.min(200, videoWidth.value)
  const h = Math.min(200, videoHeight.value)
  const x = (videoWidth.value - w) / 2
  const y = (videoHeight.value - h) / 2
  areas.value.push({
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  })
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

  // Constrain to video bounds
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
}

const endInteract = () => {
  interactionState.value.index = -1
  document.removeEventListener('mousemove', onInteract)
  document.removeEventListener('mouseup', endInteract)
}

const triggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const onFileChange = (file) => {
  if (!file) return
  // mock the specified file
  fileName.value = '2a36b34ae329461ebf3622364727be6c.mp4'
  // Mock the required URL directly, but we need a real blob URL to show the video.
  // Actually, we can just use URL.createObjectURL(file) for preview, and output the required URL on execution.
  videoUrl.value = URL.createObjectURL(file)

  // reset state
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

const removeArea = (index) => {
  areas.value.splice(index, 1)
}

const executeTask = () => {
  const payload = {
    parameters: {
      url: 'https://kesai-ai.s3.ap-northeast-1.amazonaws.com/20260511/2a36b34ae329461ebf3622364727be6c.mp4',
      code: '2',
      areaArray: areas.value.map((a) => ({ h: a.h, w: a.w, x: a.x, y: a.y })),
      power: 400,
      radio: algorithm.value,
    },
    power: 400,
    code: '2',
    fileName: '2a36b34ae329461ebf3622364727be6c.mp4',
  }

  console.log(JSON.stringify(payload, null, 2))
  alert('数据已生成，请在控制台查看：\n' + JSON.stringify(payload, null, 2))
}
</script>

<template>
  <div
    class="text-white flex p-[20px] min-h-[500px] h-full bg-[#060709] overflow-hidden rounded-[18px]"
  >
    <div class="flex w-full h-full gap-[15px] sm:flex-row">
      <!-- Left Section (Video Upload and Preview) -->
      <section
        class="w-[400px] flex flex-col border border-white/8 bg-[#232323] rounded-[4px] overflow-hidden"
      >
        <div
          class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
        >
          视频消除字幕及水印
        </div>

        <div class="flex-1 p-4 flex flex-col relative min-h-0">
          <UploadArea :has-file="!!videoUrl" @file-change="onFileChange">
            <template #uploaded>
              <div class="flex-1 flex flex-col min-h-0 h-full w-full">
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

                    <!-- Drawing Overlay -->
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
                          >区域 {{ index + 1 }}</span
                        >

                        <!-- Resize Handles -->
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

      <!-- Right Section (Parameters) -->
      <section
        class="w-full sm:w-[400px] flex flex-col border border-white/8 bg-[#232323] rounded-[4px] overflow-hidden flex-shrink-0"
      >
        <div
          class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
        >
          参数设置
        </div>

        <div class="flex-1 flex flex-col p-4 overflow-y-auto min-h-0">
          <div class="flex flex-col gap-3" v-if="areas.length > 0">
            <div
              v-for="(area, index) in areas"
              :key="index"
              class="border border-white/10 rounded-[4px] p-3 flex justify-between items-center bg-[#1c1c1c] transition-colors hover:border-white/20"
            >
              <div class="text-sm text-white/80">
                <div class="font-medium mb-1">区域 {{ index + 1 }}</div>
                <div class="text-white/50 text-xs">
                  x:{{ area.x }} y:{{ area.y }} 宽:{{ area.w }} 高:{{ area.h }}
                </div>
              </div>
              <button
                type="button"
                class="btn-close text-red-400/80 hover:text-red-400 flex items-center justify-center p-1 rounded transition-colors hover:bg-red-400/10"
                @click="removeArea(index)"
              >
                <n-icon :size="16" :component="Delete" />
              </button>
            </div>
          </div>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-sm text-white/30 text-center"
          >
            暂无选区
          </div>

          <button
            type="button"
            class="mt-3 w-full flex h-[36px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent text-sm text-white/45 transition-colors hover:text-white/70 hover:bg-white/5"
            v-if="videoUrl"
            @click="addArea"
          >
            <n-icon :size="14" :component="Add" class="mr-1" />
            添加选区
          </button>
        </div>

        <div class="p-4 border-t border-white/8">
          <div class="text-sm text-white/48">
            <div class="flex items-center gap-3">
              <span>算法选择：</span>
              <n-radio-group v-model:value="algorithm" size="small">
                <div class="flex items-center gap-4">
                  <n-radio value="normal">普通消除</n-radio>
                  <n-radio value="ai">AI消除</n-radio>
                </div>
              </n-radio-group>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium text-sm">400</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-white/48 cursor-pointer"
                  ></i>
                </template>
                根据上传视频时长计算，每30秒400算力
              </n-tooltip>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <n-button
              type="warning"
              size="small"
              class="!h-[32px] !px-6 !rounded-[4px] !text-sm !font-medium"
              @click="executeTask"
            >
              后台执行
            </n-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
