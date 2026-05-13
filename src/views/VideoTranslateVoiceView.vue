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
  <div class="h-full bg-[#060709] p-[20px] text-white">
    <div class="flex h-full overflow-hidden border border-white/8 bg-[#0b0d10]">
      <div
        class="grid w-full grid-cols-1 gap-x-[15px] sm:grid-cols-[300px_300px_minmax(0,1fr)]"
      >
        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            视频翻译换语音
          </div>
          <div class="px-3 py-3">
            <n-radio-group v-model:value="uploadSource" size="small">
              <div class="flex items-center gap-5 text-[12px]">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div
              class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2"
            >
              <div
                class="flex min-h-[228px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center"
              >
                <n-icon
                  :size="34"
                  :component="CloudUpload"
                  class="text-white/70"
                />
                <div class="mt-3 text-[11px] text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-3 text-[11px] text-white/38">
                mp4/wmv 文件，建议1G内
              </div>
            </div>
          </div>
        </section>

        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            参数设置
          </div>
          <div class="px-3 py-3 text-[11px] text-white/48">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-[48px] shrink-0">目标语种:</span>
                <n-select
                  v-model:value="targetLanguage"
                  size="tiny"
                  :options="languageOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[48px] shrink-0">口播音色:</span>
                <n-select
                  v-model:value="voiceRole"
                  size="tiny"
                  :options="voiceRoleOptions"
                  class="flex-1"
                />
                <button
                  type="button"
                  class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/18 bg-transparent text-white/55 transition-colors hover:text-white/80"
                >
                  <n-icon :size="12" :component="PlayFilledAlt" />
                </button>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[48px] shrink-0">语调风格:</span>
                <n-select
                  v-model:value="speechStyle"
                  size="tiny"
                  :options="speechStyleOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[48px] shrink-0">匹配画面:</span>
                <n-checkbox v-model:checked="enableVoiceMatch">
                  <span class="text-[11px] text-white/52"
                    >语音匹配配置画面</span
                  >
                </n-checkbox>
              </div>
            </div>

            <div class="mt-5 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">800</span>
            </div>

            <div class="pt-6 flex justify-end">
              <n-button
                type="warning"
                size="small"
                class="!h-[28px] !px-3 !rounded-[4px] !text-[12px]"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>

        <section class="relative flex min-h-[320px] flex-col">
          <div class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="relative h-[120px] w-[120px]">
                <div
                  class="absolute left-[16px] top-[18px] h-[72px] w-[72px] rounded-full border-[12px] border-[#0b2347] border-r-transparent border-t-[#12315f]"
                />
                <div
                  class="absolute left-[36px] top-[38px] h-[42px] w-[42px] rounded-full bg-[#1f6f5d]"
                />
                <div
                  class="absolute left-[82px] top-[26px] h-[22px] w-[22px] rounded-full bg-[#26735c]"
                />
              </div>
              <div class="-mt-1 text-[12px] text-white/34">AIKC</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
