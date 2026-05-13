<script setup>
import { ref } from 'vue'
import {
  NButton,
  NCheckbox,
  NColorPicker,
  NDropdown,
  NIcon,
  NInputNumber,
  NRadio,
  NRadioGroup,
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
} from '@vicons/carbon'
import { useRouter } from 'vue-router'

const router = useRouter()

const uploadSource = ref('local')
const fontSize = ref('middle')
const subtitleMode = ref('select')
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
        <section class="bg-[#232323]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            识别语音加字幕
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
                mp4/wav 文件，5G以内
              </div>
            </div>
          </div>
        </section>

        <section class="bg-[#232323]">
          <div
            class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-[12px] py-[6px] shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            <span class="text-[12px] font-medium text-white/75">字幕校正</span>
            <n-button
              type="primary"
              size="tiny"
              class="!h-[24px] !px-3 !rounded-[4px] !text-[11px]"
            >
              解析音频
            </n-button>
          </div>

          <div
            class="flex h-[calc(100%-33px)] items-center justify-center text-center text-[11px] text-white/34"
          >
            <div>
              <div>暂无字幕内容</div>
              <div class="mt-2">上传视频后点「解析音频」按钮获取</div>
            </div>
          </div>
        </section>

        <section class="bg-[#232323]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            参数设置（需符合视频尺寸，二选一）
          </div>
          <div class="px-3 py-3 text-[11px] text-white/48">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">智能包装:</span>
                <n-select
                  v-model:value="subtitleMode"
                  size="tiny"
                  :options="[{ label: '选择样式', value: 'select' }]"
                  class="w-[92px]"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">字幕位置:</span>
                <div class="flex items-center gap-2">
                  <n-input-number
                    v-model:value="xPercent"
                    size="tiny"
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
                    size="tiny"
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
                <span class="w-[52px] shrink-0">字体大小:</span>
                <n-select
                  v-model:value="fontSize"
                  size="tiny"
                  :options="fontSizeOptions"
                  class="w-[150px]"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">字幕颜色:</span>
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

            <div class="mt-4 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">500</span>
            </div>

            <div class="pt-8 flex justify-end">
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
      </div>
    </div>
  </div>
</template>
