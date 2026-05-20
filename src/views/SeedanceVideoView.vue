<script setup>
import { ref, onUnmounted } from 'vue'
import { CloudUpload, Currency } from '@vicons/carbon'
import UploadArea from '@/components/UploadArea.vue'
import {
  NButton,
  NCheckbox,
  NIcon,
  NInput,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSwitch,
} from 'naive-ui'

const generationQuality = ref('seedance-15-pro-start-end')
const isDurationUnspecified = ref(true)
const durationSeconds = ref(5)
const resolution = ref('720p')
const aspectRatio = ref('16:9')
const soundEnabled = ref(false)
const storyboardEnabled = ref(false)
const motionMode = ref('random')
const prompt = ref(
  '描述你想生成的视频画面，例如：戴着围巾穿着蓝色T恤的男生和柯基小狗，坐在草坪上，3D卡通风格'
)

const qualityOptions = [
  { label: '1.5 Pro - 图生视频-首尾帧', value: 'seedance-15-pro-start-end' },
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

const imageFile = ref(null)
const tailImageFile = ref(null)
const imagePreview = ref('')
const tailPreview = ref('')

const onImageChange = (file) => {
  if (!file) return
  if (imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const onTailImageChange = (file) => {
  if (!file) return
  if (tailPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(tailPreview.value)
  }
  tailImageFile.value = file
  tailPreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  if (imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imageFile.value = null
  imagePreview.value = ''
}

const removeTailImage = () => {
  if (tailPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(tailPreview.value)
  }
  tailImageFile.value = null
  tailPreview.value = ''
}

onUnmounted(() => {
  if (imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  if (tailPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(tailPreview.value)
  }
})
</script>

<template>
  <div class="min-h-[500px] h-full p-[20px] text-white">
    <div
      class="h-full overflow-hidden border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      <div
        class="grid h-full grid-cols-1 gap-x-[15px] sm:grid-cols-[550px_400px_minmax(0,1fr)]"
      >
        <section
          class="min-w-[400px] border-b border-white/8 bg-[linear-gradient(180deg,#1f1f20_0%,#1a1a1b_100%)] min-[1200px]:border-b-0 min-[1200px]:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] pb-[13px] pt-[14px] text-sm text-white/82"
          >
            视频参数
          </div>

          <div class="flex flex-col p-[14px] [&>div>div:first-child]:w-[80px]">
            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                模型版本:
              </div>
              <div class="min-w-0 flex-1">
                <n-select
                  v-model:value="generationQuality"
                  size="small"
                  :options="qualityOptions"
                  class="w-full"
                />
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                视频时长:
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-[10px]">
                  <div class="flex items-center gap-[6px]">
                    <n-checkbox
                      v-model:checked="isDurationUnspecified"
                      size="small"
                    >
                      <span class="text-sm text-white/72">不指定</span>
                    </n-checkbox>
                  </div>

                  <template v-if="!isDurationUnspecified">
                    <n-input-number
                      v-model:value="durationSeconds"
                      min="1"
                      max="15"
                      class="w-[120px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]: [&_.n-input-wrapper]:!bg-[#161719] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[rgba(35,208,228,0.88)] [&_.n-input__input-el]:!text-center [&_.n-input__input-el]:!text-sm [&_.n-input__input-el]:!text-white/82"
                    />
                    <span class="text-xs text-white/34"
                      >秒（4~12，Seedance 2.0 最长 15 秒）</span
                    >
                  </template>
                </div>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">分辨率:</div>
              <div class="min-w-0 flex-1">
                <n-radio-group v-model:value="resolution" size="small">
                  <n-radio-button
                    v-for="option in resolutionOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    class="!px-[10px] transition-colors"
                  />
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-start gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                宽高比例:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group v-model:value="aspectRatio" size="small">
                  <n-radio-button
                    v-for="option in ratioOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    class="!px-[10px] transition-colors"
                  />
                </n-radio-group>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                生成声音:
              </div>
              <div class="min-w-0 flex-1 flex items-center gap-[8px]">
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="!soundEnabled ? 'text-theme' : 'text-white'"
                  @click="soundEnabled = false"
                >
                  关闭
                </button>
                <n-switch v-model:value="soundEnabled" size="small" />
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="soundEnabled ? 'text-theme' : 'text-white'"
                  @click="soundEnabled = true"
                >
                  开启（与画面同步）
                </button>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <i
                      class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                    ></i>
                  </template>
                  开启后视频将包含与画面内容同步的声音
                </n-tooltip>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                样片模式:
              </div>
              <div class="min-w-0 flex-1 flex items-center gap-[8px]">
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="!storyboardEnabled ? 'text-theme' : 'text-white'"
                  @click="storyboardEnabled = false"
                >
                  关闭
                </button>
                <n-switch v-model:value="storyboardEnabled" size="small" />
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="storyboardEnabled ? 'text-theme' : 'text-white'"
                  @click="storyboardEnabled = true"
                >
                  开启
                </button>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <i
                      class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                    ></i>
                  </template>
                  开启样片模式后，需先生成样片预览，确认后再提交正式任务
                </n-tooltip>
              </div>
            </div>

            <div class="mb-[12px] flex items-center gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                随机种子:
              </div>
              <div class="min-w-0 flex-1">
                <n-radio-group v-model:value="motionMode" size="small">
                  <n-radio-button
                    v-for="option in motionOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                    class="!px-[10px] transition-colors"
                  />
                </n-radio-group>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <i
                      class="ml-[8px] i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                    ></i>
                  </template>
                  随机：每次生成不同结果；稳定：尽量复现相同结果；微调/小变/大变/巨变：不同程度的变化
                </n-tooltip>
              </div>
            </div>

            <div class="mb-[12px] flex flex-col gap-[10px]">
              <div class="shrink-0 pt-[2px] text-sm text-white/52">
                画面提示词:
              </div>
              <div class="min-w-0 flex-1">
                <n-input
                  v-model="prompt"
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 8 }"
                  class="text-sm [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]: [&_.n-input-wrapper]:!bg-[#161719] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[rgba(35,208,228,0.88)] [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/28"
                  placeholder="描述你想生成的视频画面，例如：戴着围巾穿着蓝色T恤的男生和柯基小狗，坐在草坪上，3D卡通风格"
                />
              </div>
            </div>

            <div
              class="mt-[14px] flex items-center gap-[5px] text-sm text-white/48"
            >
              <span>消耗算力：</span>
              <n-icon class="text-[#ffd24c]" :size="14" :component="Currency" />
              <span class="font-semibold text-[#ffd24c]">10000</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
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
          class="min-w-[400px] border-b border-white/8 bg-[linear-gradient(180deg,#1f1f20_0%,#1a1a1b_100%)] min-[1200px]:border-b-0 min-[1200px]:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] pb-[13px] pt-[14px] text-sm text-white/82"
          >
            首帧 / 尾帧图片
          </div>

          <div class="border-b border-white/8 p-[14px]">
            <div class="mb-[8px] text-xs text-[#f5b445]">
              首帧图片（开始画面）
            </div>

            <UploadArea
              :has-file="!!imagePreview"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              description="JPG、PNG、JPEG、WEBP，30MB以内"
              @file-change="onImageChange"
            >
              <template #uploaded>
                <div
                  class="rounded-[4px] border border-white/5 bg-[#1b1c1e] p-[10px]"
                >
                  <div class="mb-[10px] text-sm text-white/70">
                    已上传首帧图片
                  </div>
                  <img
                    :src="imagePreview"
                    alt="首帧图片预览"
                    class="h-[180px] w-full rounded-[4px] object-contain"
                  />
                  <div
                    class="mt-[10px] flex items-center justify-between text-xs text-white/60"
                  >
                    <span>{{ imageFile?.name || '已选择文件' }}</span>
                    <n-button
                      type="error"
                      size="tiny"
                      class="!px-3 !rounded-[4px] !text-xs"
                      @click="removeImage"
                    >
                      重置
                    </n-button>
                  </div>
                </div>
              </template>
            </UploadArea>
          </div>

          <div class="p-[14px]">
            <div class="mb-[8px] text-xs text-[#f5b445]">
              尾帧图片（结束画面）
            </div>

            <UploadArea
              :has-file="!!tailPreview"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              description="JPG、PNG、JPEG、WEBP，30MB以内"
              @file-change="onTailImageChange"
            >
              <template #uploaded>
                <div
                  class="rounded-[4px] border border-white/5 bg-[#1b1c1e] p-[10px]"
                >
                  <div class="mb-[10px] text-sm text-white/70">
                    已上传尾帧图片
                  </div>
                  <img
                    :src="tailPreview"
                    alt="尾帧图片预览"
                    class="h-[180px] w-full rounded-[4px] object-contain"
                  />
                  <div
                    class="mt-[10px] flex items-center justify-between text-xs text-white/60"
                  >
                    <span>{{ tailImageFile?.name || '已选择文件' }}</span>
                    <n-button
                      type="error"
                      size="tiny"
                      class="!px-3 !rounded-[4px] !text-xs"
                      @click="removeTailImage"
                    >
                      重置
                    </n-button>
                  </div>
                </div>
              </template>
            </UploadArea>
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
