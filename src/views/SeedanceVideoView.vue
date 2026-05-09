<script setup>
import { computed, ref } from 'vue'
import { CloudUpload, Currency, Information } from '@vicons/carbon'
import { NButton, NIcon, NInput, NInputNumber } from 'naive-ui'

const imageSource = ref('local')
const tailImageSource = ref('local')
const generationQuality = ref('seedance-15-pro-start-end')
const durationMode = ref('unspecified')
const durationSeconds = ref(5)
const resolution = ref('720p')
const aspectRatio = ref('16:9')
const soundEnabled = ref(false)
const storyboardEnabled = ref(false)
const motionMode = ref('random')
const prompt = ref(
  '描述你想生成的视频画面，例如：戴着围巾穿着蓝色T恤的男生和柯基小狗，坐在草坪上，3D卡通风格',
)

const qualityOptions = [
  { label: '1.5 Pro - 图生视频-首尾帧', value: 'seedance-15-pro-start-end' },
]

const durationModes = [
  { label: '不指定', value: 'unspecified' },
]

const resolutionOptions = [
  { label: '480p', value: '480p' },
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
]

const ratioOptions = [
  { label: '竖屏 9:16', value: '9:16' },
  { label: '横屏 16:9', value: '16:9' },
  { label: '方形 1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
  { label: '21:9', value: '21:9' },
]

const motionOptions = [
  { label: '随机', value: 'random' },
  { label: '稳定', value: 'steady' },
  { label: '微调', value: 'micro' },
  { label: '小变', value: 'small' },
  { label: '大变', value: 'large' },
  { label: '巨变', value: 'extreme' },
]

const promptLength = computed(() => prompt.value.length)
</script>

<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_right,rgba(20,86,118,0.18),transparent_28%),linear-gradient(180deg,#050607_0%,#090a0d_100%)] p-[20px] text-white"
  >
    <div
      class="min-h-[calc(100vh-40px)] overflow-hidden rounded-[18px] border border-white/8 bg-[#0a0b0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      <div
        class="grid min-h-[calc(100vh-40px)] grid-cols-1 gap-x-[15px] sm:grid-cols-[minmax(0,340px)_minmax(0,260px)_minmax(0,1fr)]"
      >
        <section
          class="border-b border-white/8 bg-[linear-gradient(180deg,#1f1f20_0%,#1a1a1b_100%)] min-[1200px]:border-b-0 min-[1200px]:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] pb-[13px] pt-[14px] text-[12px] text-white/82"
          >
            视频参数
          </div>

          <div class="p-[14px]">
            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">模型版本:</div>
              <div class="min-w-0 flex-1">
                <select
                  v-model="generationQuality"
                  class="h-[30px] w-full appearance-none rounded-[4px] border border-white/8 bg-[#161719] px-[10px] text-[11px] text-white/82 outline-none focus:border-[rgba(35,208,228,0.88)]"
                >
                  <option
                    v-for="option in qualityOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">视频时长:</div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-[6px]">
                  <label
                    v-for="option in durationModes"
                    :key="option.value"
                    class="inline-flex items-center gap-[6px] text-[11px] text-white/72"
                  >
                    <input
                      v-model="durationMode"
                      type="radio"
                      :value="option.value"
                      class="h-[12px] w-[12px] accent-[#18d2e5]"
                    />
                    <span>{{ option.label }}</span>
                  </label>

                  <n-input-number
                    v-model="durationSeconds"
                    min="1"
                    max="15"
                    class="w-[120px] [&_.n-input-wrapper]:!h-[30px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#161719] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[rgba(35,208,228,0.88)] [&_.n-input__input-el]:!text-center [&_.n-input__input-el]:!text-[11px] [&_.n-input__input-el]:!text-white/82"
                  />

                  <!-- <button
                    type="button"
                    class="inline-flex h-[16px] w-[14px] items-center justify-center border-0 bg-transparent text-white/26"
                  >
                    <span class="text-[10px] leading-none">x</span>
                  </button> -->

                  <span class="text-[10px] text-white/34">（4~12，Seedance 2.0 最长 15 秒）</span>
                </div>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">分辨率:</div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap gap-[6px]">
                  <button
                    v-for="option in resolutionOptions"
                    :key="option.value"
                    type="button"
                    class="h-[24px] min-w-[44px] rounded-[4px] border border-white/8 bg-[#151618] px-[10px] text-[10px] text-white/58 transition-colors"
                    :class="
                      resolution === option.value
                        ? '!border-[#14c7e1] !bg-[#14c7e1] !text-white'
                        : ''
                    "
                    @click="resolution = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-[12px] flex items-start gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">宽高比例:</div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap gap-[6px]">
                  <button
                    v-for="option in ratioOptions"
                    :key="option.value"
                    type="button"
                    class="h-[24px] min-w-[44px] rounded-[4px] border border-white/8 bg-[#151618] px-[10px] text-[10px] text-white/58 transition-colors"
                    :class="
                      aspectRatio === option.value
                        ? '!border-[#14c7e1] !bg-[#14c7e1] !text-white'
                        : ''
                    "
                    @click="aspectRatio = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">生成声音:</div>
              <div class="min-w-0 flex-1 flex items-center gap-[8px]">
                <button
                  type="button"
                  class="relative h-[18px] w-[34px] rounded-[999px] border border-white/10 bg-[#111214] p-0 transition-colors"
                  :class="
                    soundEnabled
                      ? '!border-[rgba(20,199,225,0.75)] !bg-[rgba(20,199,225,0.35)]'
                      : ''
                  "
                  @click="soundEnabled = !soundEnabled"
                >
                  <span
                    class="absolute left-[1px] top-[1px] h-[14px] w-[14px] rounded-[999px] bg-white transition-transform"
                    :class="soundEnabled ? 'translate-x-[16px]' : ''"
                  />
                </button>
                <span class="text-[11px] text-white/86">{{ soundEnabled ? '开启' : '关闭' }}</span>
                <span class="text-[11px] text-white/40">开启（与画面同步）</span>
                <button
                  type="button"
                  class="inline-flex h-[16px] w-[16px] items-center justify-center border-0 bg-transparent text-white/38"
                >
                  <n-icon :size="12" :component="Information" />
                </button>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">样片模式:</div>
              <div class="min-w-0 flex-1 flex items-center gap-[8px]">
                <button
                  type="button"
                  class="relative h-[18px] w-[34px] rounded-[999px] border border-white/10 bg-[#111214] p-0 transition-colors"
                  :class="
                    storyboardEnabled
                      ? '!border-[rgba(20,199,225,0.75)] !bg-[rgba(20,199,225,0.35)]'
                      : ''
                  "
                  @click="storyboardEnabled = !storyboardEnabled"
                >
                  <span
                    class="absolute left-[1px] top-[1px] h-[14px] w-[14px] rounded-[999px] bg-white transition-transform"
                    :class="storyboardEnabled ? 'translate-x-[16px]' : ''"
                  />
                </button>
                <span class="text-[11px] text-white/86">{{ storyboardEnabled ? '开启' : '关闭' }}</span>
                <button
                  type="button"
                  class="inline-flex h-[16px] w-[16px] items-center justify-center border-0 bg-transparent text-white/38"
                >
                  <n-icon :size="12" :component="Information" />
                </button>
              </div>
            </div>

            <div class="mb-[12px] flex items-start gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">随机种子:</div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap gap-[6px]">
                  <button
                    v-for="option in motionOptions"
                    :key="option.value"
                    type="button"
                    class="h-[24px] min-w-[44px] rounded-[4px] border border-white/8 bg-[#151618] px-[10px] text-[10px] text-white/58 transition-colors"
                    :class="
                      motionMode === option.value
                        ? '!border-[#14c7e1] !bg-[#14c7e1] !text-white'
                        : ''
                    "
                    @click="motionMode = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-[12px] flex items-start gap-[10px]">
              <div class="w-[52px] shrink-0 pt-[2px] text-[11px] text-white/52">画面提示词:</div>
              <div class="min-w-0 flex-1">
                <n-input
                  v-model="prompt"
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 8 }"
                  class="[&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#161719] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[rgba(35,208,228,0.88)] [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-white/28"
                  placeholder="描述你想生成的视频画面，例如：戴着围巾穿着蓝色T恤的男生和柯基小狗，坐在草坪上，3D卡通风格"
                />
              </div>
            </div>

            <div class="mt-[14px] flex items-center justify-between gap-[10px]">
              <div class="flex flex-wrap items-center gap-[5px] text-[11px] text-white/48">
                <span>消耗算力：</span>
                <n-icon :size="14" :component="Currency" />
                <span class="font-semibold text-[#ffd24c]">10000</span>
                <span class="ml-[4px] text-white/30">提示词 {{ promptLength }} 字</span>
              </div>

              <n-button
                type="warning"
                size="small"
                class="!h-[32px] !rounded-[4px] !px-4 !text-[12px] !font-medium"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>

        <section
          class="border-b border-white/8 bg-[linear-gradient(180deg,#1f1f20_0%,#1a1a1b_100%)] min-[1200px]:border-b-0 min-[1200px]:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] pb-[13px] pt-[14px] text-[12px] text-white/82"
          >
            首帧 / 尾帧图片
          </div>

          <div class="border-b border-white/8 p-[14px]">
            <div class="mb-[8px] text-[11px] text-[#f5b445]">首帧图片（开始画面）</div>

            <div class="mb-[10px] flex gap-[8px] rounded-[6px] bg-[#121315] p-[4px]">
              <label class="inline-flex cursor-pointer items-center gap-[6px] px-[8px] py-[5px] text-[11px] text-white/72">
                <input
                  v-model="imageSource"
                  type="radio"
                  value="local"
                  class="accent-[#18d2e5]"
                />
                本地上传
              </label>
              <label class="inline-flex cursor-pointer items-center gap-[6px] px-[8px] py-[5px] text-[11px] text-white/72">
                <input
                  v-model="imageSource"
                  type="radio"
                  value="cloud"
                  class="accent-[#18d2e5]"
                />
                云盘选择
              </label>
            </div>

            <div class="rounded-[4px] border border-white/5 bg-[#1b1c1e] p-[10px]">
              <div
                class="flex min-h-[126px] flex-col items-center justify-center rounded-[4px] border border-dashed border-white/9 bg-[linear-gradient(180deg,#1d1e20_0%,#1a1b1d_100%)] text-center"
              >
                <n-icon :size="38" :component="CloudUpload" class="text-white/62" />
                <div class="mt-[10px] text-[11px] text-white/58">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="mt-[10px] text-[10px] text-white/30">JPG、PNG、JPEG、WEBP，30MB以内</div>
            </div>
          </div>

          <div class="p-[14px]">
            <div class="mb-[8px] text-[11px] text-[#f5b445]">尾帧图片（结束画面）</div>

            <div class="mb-[10px] flex gap-[8px] rounded-[6px] bg-[#121315] p-[4px]">
              <label class="inline-flex cursor-pointer items-center gap-[6px] px-[8px] py-[5px] text-[11px] text-white/72">
                <input
                  v-model="tailImageSource"
                  type="radio"
                  value="local"
                  class="accent-[#18d2e5]"
                />
                本地上传
              </label>
              <label class="inline-flex cursor-pointer items-center gap-[6px] px-[8px] py-[5px] text-[11px] text-white/72">
                <input
                  v-model="tailImageSource"
                  type="radio"
                  value="cloud"
                  class="accent-[#18d2e5]"
                />
                云盘选择
              </label>
            </div>

            <div class="rounded-[4px] border border-white/5 bg-[#1b1c1e] p-[10px]">
              <div
                class="flex min-h-[126px] flex-col items-center justify-center rounded-[4px] border border-dashed border-white/9 bg-[linear-gradient(180deg,#1d1e20_0%,#1a1b1d_100%)] text-center"
              >
                <n-icon :size="38" :component="CloudUpload" class="text-white/62" />
                <div class="mt-[10px] text-[11px] text-white/58">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="mt-[10px] text-[10px] text-white/30">JPG、PNG、JPEG、WEBP，30MB以内</div>
            </div>
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
              <div class="absolute left-[91px] top-[27px] h-[26px] w-[26px] rounded-[999px] bg-[#0f8e67]" />
            </div>
            <div class="mt-[6px] text-[18px] tracking-[0.2px] text-white/42">AIKC</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
