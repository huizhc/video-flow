<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { NButton, NCheckbox, NIcon, NSelect } from 'naive-ui'
import { Currency, PlayFilledAlt } from '@vicons/carbon'
import UploadArea from '@/components/UploadArea.vue'

const videoUrl = ref('')
const fileName = ref('')
const videoRef = ref(null)
const containerRef = ref(null)

const videoWidth = ref(0)
const videoHeight = ref(0)
const displayWidth = ref(0)
const displayHeight = ref(0)

const targetLanguage = ref('en')
const voiceRole = ref('female')
const speechStyle = ref('gentle')
const enableVoiceMatch = ref(true)

const languageOptions = [
  { label: '英文', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '越南语', value: 'vi' },
]

const voiceRoleOptions = [
  { label: '妹纸  女声，温柔自然', value: 'female' },
  { label: '青年  男声，沉稳清晰', value: 'male' },
]

const speechStyleOptions = [
  { label: '激情营销，语速偏快', value: 'gentle' },
  { label: '平稳叙述，语气自然', value: 'stable' },
]

const onFileChange = (file) => {
  if (!file) return
  fileName.value = file.name
  videoUrl.value = URL.createObjectURL(file)

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
</script>

<template>
  <div class="h-full bg-[#060709] p-4 text-white">
    <div class="flex h-full overflow-hidden border border-white/8 bg-[#0b0d10]">
      <div
        class="grid w-full grid-cols-1 gap-x-3 sm:grid-cols-[400px_400px_minmax(0,1fr)]"
      >
        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r flex flex-col min-h-0 overflow-hidden"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-2.5 py-2.5 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            视频翻译换语音
          </div>
          <div class="flex-1 p-3 flex flex-col relative min-h-0">
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
                    </div>
                  </div>

                  <div
                    class="mt-3 flex items-center justify-between text-xs text-white/60 shrink-0"
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

        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-2.5 py-2.5 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            参数设置
          </div>
          <div class="px-2.5 py-[30px] text-sm text-white/48">
            <div class="space-y-[15px] [&>div>span]:w-[60px]">
              <div class="flex items-center gap-3">
                <span class="shrink-0">目标语种:</span>
                <n-select
                  v-model:value="targetLanguage"
                  size="small"
                  :options="languageOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">口播音色:</span>
                <n-select
                  v-model:value="voiceRole"
                  size="small"
                  :options="voiceRoleOptions"
                  class="flex-1"
                />
                <button
                  type="button"
                  class="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-white/18 bg-transparent text-white/55 transition-colors hover:text-white/80"
                >
                  <n-icon :size="10" :component="PlayFilledAlt" />
                </button>
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">语调风格:</span>
                <n-select
                  v-model:value="speechStyle"
                  size="small"
                  :options="speechStyleOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">匹配画面:</span>
                <n-checkbox v-model:checked="enableVoiceMatch" size="small">
                  <span class="text-sm text-white/52">语音匹配画面</span>
                </n-checkbox>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-1 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="12" :component="Currency" />
              <span class="font-medium">800</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-white/48 cursor-pointer"
                  ></i>
                </template>
                根据上传视频时长计算，每30秒800算力；如果需要匹配画面，每30秒2000算力
              </n-tooltip>
            </div>

            <div class="pt-4 flex justify-end">
              <n-button
                type="warning"
                class="!rounded-[4px] text-#fff! !text-sm"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>

        <section class="relative flex min-h-[300px] flex-col">
          <div class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="relative h-[100px] w-[100px]">
                <div
                  class="absolute left-[13px] top-[15px] h-[60px] w-[60px] rounded-full border-[10px] border-[#0b2347] border-r-transparent border-t-[#12315f]"
                />
                <div
                  class="absolute left-[30px] top-[32px] h-[35px] w-[35px] rounded-full bg-[#1f6f5d]"
                />
                <div
                  class="absolute left-[68px] top-[22px] h-[18px] w-[18px] rounded-full bg-[#26735c]"
                />
              </div>
              <div class="-mt-1 text-xs text-white/34">AIKC</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
