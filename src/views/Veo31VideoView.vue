<script setup>
import { ref } from 'vue'
import { Currency } from '@vicons/carbon'
import {
  NButton,
  NIcon,
  NInput,
  NSelect,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'

const modelVersion = ref('veo-31-preview')
const generationMode = ref('text-video')
const duration = ref('8s')
const resolution = ref('720p')
const aspectRatio = ref('16:9')
const motionMode = ref('random')
const prompt = ref('')

const modelOptions = [{ label: 'Veo 3.1 Preview', value: 'veo-31-preview' }]

const generationModes = [
  { label: '文生视频', value: 'text-video' },
  { label: '图生视频', value: 'image-video' },
  { label: '首尾帧', value: 'start-end' },
  { label: '参考图生视频', value: 'reference-image-video' },
  { label: '视频扩展', value: 'video-extend' },
]

const durationOptions = [
  { label: '4 秒', value: '4s' },
  { label: '6 秒', value: '6s' },
  { label: '8 秒', value: '8s' },
]

const resolutionOptions = [
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
  { label: '4k', value: '4k' },
]

const ratioOptions = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
]

const motionOptions = [
  { label: '随机', value: 'random' },
  { label: '稳定', value: 'steady' },
  { label: '微调', value: 'micro' },
  { label: '小变', value: 'small' },
  { label: '大变', value: 'large' },
  { label: '巨变', value: 'extreme' },
]
</script>

<template>
  <div class="min-h-[500px] h-full bg-#000 p-[20px] text-white">
    <div
      class="h-full overflow-hidden border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      <div
        class="grid h-full grid-cols-1 sm:grid-cols-[minmax(400px,500px)_minmax(0,1fr)]"
      >
        <section
          class="min-w-[600px] border-b border-white/8 bg-[linear-gradient(180deg,#1f1f20_0%,#1a1a1b_100%)] min-[1200px]:border-b-0 min-[1200px]:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] pb-[13px] pt-[14px] text-sm text-white/82"
          >
            Veo 3.1 视频参数
          </div>

          <div class="p-[14px] flex flex-col">
            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                模型版本:
              </div>
              <div class="min-w-0 flex-1">
                <n-select
                  v-model:value="modelVersion"
                  :options="modelOptions"
                  size="small"
                  class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#161719] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-sm [&_.n-base-selection__input]:!text-sm [&_.n-base-selection__render-label]:!text-white/82"
                />
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                生成方式:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group
                  v-model:value="generationMode"
                  size="small"
                  name="generationMode"
                >
                  <n-radio-button
                    v-for="option in generationModes"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                视频时长:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group
                  v-model:value="duration"
                  name="duration"
                  size="small"
                >
                  <n-radio-button
                    v-for="option in durationOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                分辨率:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group
                  v-model:value="resolution"
                  name="resolution"
                  size="small"
                >
                  <n-radio-button
                    v-for="option in resolutionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                宽高比例:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group
                  v-model:value="aspectRatio"
                  name="aspectRatio"
                  size="small"
                >
                  <n-radio-button
                    v-for="option in ratioOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </n-radio-button>
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                随机种子:
              </div>
              <div class="min-w-0 flex-1 flex items-center gap-[6px]">
                <n-radio-group
                  v-model:value="motionMode"
                  name="motionMode"
                  size="small"
                >
                  <n-radio-button
                    v-for="option in motionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </n-radio-button>
                </n-radio-group>
                <!-- <button type="button"
                  class="inline-flex h-[16px] w-[16px] items-center justify-center border-0 bg-transparent text-white/38">
                  <n-icon :size="12" :component="Information" />
                </button> -->
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <i
                      class="i-mingcute-question-line text-white/48 cursor-pointer"
                    ></i>
                  </template>
                  随机：每次生成不同结果；稳定：尽量复现相同结果；微调/小变/大变/巨变：不同程度的变化
                </n-tooltip>
              </div>
            </div>

            <div class="mb-[12px] flex flex-col gap-[10px]">
              <div class="w-[80px] shrink-0 pt-[2px] text-sm text-white/52">
                提示词:
              </div>
              <div class="min-w-0 flex-1">
                <n-input
                  v-model:value="prompt"
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 8 }"
                  class="text-sm [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#161719] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[rgba(35,208,228,0.88)] [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/28"
                  placeholder="描述你想生成的视频画面（支持对白、音效与环境声描述）"
                />
              </div>
            </div>

            <div
              class="flex mt-[12px] flex-wrap items-center gap-[5px] text-sm text-white/48"
            >
              <span>消耗算力：</span>
              <n-icon :size="14" class="text-[#ffd24c]" :component="Currency" />
              <span class="font-semibold text-[#ffd24c]">44800</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-white/48 cursor-pointer"
                  ></i>
                </template>
                根据视频时长计算
              </n-tooltip>
            </div>

            <n-button
              type="warning"
              size="small"
              class="ml-auto !h-[32px] !rounded-[4px] !px-4 !text-sm !font-medium"
            >
              后台执行
            </n-button>
          </div>
        </section>

        <section
          class="relative flex min-h-[300px] min-w-0 items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(22,62,96,0.18),transparent_18%),#050608] min-[1200px]:min-h-0"
        >
          <div class="flex flex-col items-center">
            <div class="relative h-[134px] w-[134px]">
              <div
                class="absolute left-[16px] top-[18px] h-[82px] w-[82px] rounded-[999px] border-[15px] border-[#081c3a] border-r-transparent border-t-[#0e2c56]"
              />
              <div
                class="absolute left-[42px] top-[43px] h-[44px] w-[44px] rounded-[999px] bg-[#198063] shadow-[0_0_0_4px_rgba(9,27,23,0.4)]"
              />
              <div
                class="absolute left-[91px] top-[27px] h-[26px] w-[26px] rounded-[999px] bg-[#0f8e67]"
              />
            </div>
            <div class="mt-[6px] text-sm tracking-[0.2px] text-white/42">
              AIKC
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
