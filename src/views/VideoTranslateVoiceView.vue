<script setup>
import { ref } from 'vue'
import {
  NButton,
  NCheckbox,
  NIcon,
  NRadio,
  NRadioGroup,
  NSelect,
} from 'naive-ui'
import { CloudUpload, Currency, PlayFilledAlt } from '@vicons/carbon'

const uploadSource = ref('local')
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
</script>

<template>
  <div class="h-full bg-[#060709] p-4 text-white">
    <div class="flex h-full overflow-hidden border border-white/8 bg-[#0b0d10]">
      <div
        class="grid w-full grid-cols-1 gap-x-3 sm:grid-cols-[400px_400px_minmax(0,1fr)]"
      >
        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-2.5 py-2.5 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            视频翻译换语音
          </div>
          <div class="px-2.5 py-2.5">
            <n-radio-group v-model:value="uploadSource" size="small">
              <div class="flex items-center gap-4 text-sm">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div
              class="mt-3 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2"
            >
              <div
                class="flex min-h-[200px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center"
              >
                <n-icon
                  :size="28"
                  :component="CloudUpload"
                  class="text-white/70"
                />
                <div class="mt-2 text-sm text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-2.5 text-xs text-white/38">
                mp4/wmv 文件，建议1G内
              </div>
            </div>
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
