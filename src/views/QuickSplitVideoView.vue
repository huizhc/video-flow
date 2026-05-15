<script setup>
import { computed, ref } from 'vue'
import {
  NButton,
  NInput,
  NInputNumber,
  NModal,
  NPagination,
  NScrollbar,
  NSelect,
  NStep,
  NSteps,
  useMessage,
  NTooltip,
} from 'naive-ui'
import { showUploadModal } from '@/utils/modal'

const message = useMessage()
const currentStep = ref(1)
const totalVideos = ref(5)
const scriptCount = ref(5)
const selectedVoice = ref('add-voice')
const voiceModalVisible = ref(false)
const selectedVoiceTone = ref('xiaoxiao')
const selectedVoiceStyle = ref('passion-fast')
const scripts = ref(['', '', '', '', '', '', ''])

const stepItems = [
  { index: 1, label: '口播文案' },
  { index: 2, label: '上传素材' },
  { index: 3, label: '选择样式' },
]

const voiceOptions = [{ label: '添加音色', value: 'add-voice' }]

const voiceToneOptions = [
  { label: '晓晓    女声，温柔自然', value: 'xiaoxiao' },
  { label: '云扬    男声，稳重磁性', value: 'yunyang' },
  { label: '晨曦    女声，轻快明亮', value: 'chenxi' },
]

const voiceStyleOptions = [
  { label: '激情推销，语速稍快', value: 'passion-fast' },
  { label: '温柔讲述，语速适中', value: 'gentle-medium' },
  { label: '情绪带动，感染力强', value: 'emotion-strong' },
]

const selectedVoiceLabel = computed(() => {
  if (selectedVoice.value === 'add-voice') return '添加音色'
  return selectedVoice.value
})

const totalPower = computed(() => 5150)

const materialSections = [
  {
    key: 'hook',
    title: '视频钩子（片段最少需要 1 秒）',
    description:
      '提示词严谨偏参考丰富的画面风格与主体。4~10 秒，开场即用爆发性冲击：产品大特写或悬念场景，进镜干脆。主体清晰，干净消光，画面稳定无抖动。',
    thumbnails: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
    ],
  },
  {
    key: 'package',
    title: '产品包装（片段最少需要 4 秒）',
    description:
      '提示词严谨偏参考丰富的包装外观，4~10 秒，镜头平移或稳定手持展示包装、LOGO 与文字清晰可读，转场或镜头清晰，色彩还原准确，商业感拍质感。',
    thumbnails: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
    ],
  },
]

const stylePage = ref(1)
const stylePageSize = 10
const selectedStyle = ref(null)

const styleCards = [
  {
    title: '实拍博主生活',
    subtitle: '账号更高流量模板',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '账号定位定型',
    subtitle: '多真拍曾立难变现',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    title: '送货家长被误认为不务正业',
    subtitle: '实拍布局手拿控评',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '越放松越有好事',
    subtitle: '沉住气专注自我',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    title: '停止无效内卷',
    subtitle: '专注力不用卷技能',
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '外贸真实案例',
    subtitle: '账号共鸣感更强',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    title: '女人过渡后',
    subtitle: '接总感有年轻感',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '高能话题飓风风',
    subtitle: '机机也打才带谁',
    image:
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    title: '给自己念书',
    subtitle: '记录自己的奋斗阶段',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '今天新到的家具',
    subtitle: '这沙发真心绝了',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.w3schools.com/html/movie.mp4',
  },
]

const pagedStyleCards = computed(() => {
  const start = (stylePage.value - 1) * stylePageSize
  return styleCards.slice(start, start + stylePageSize)
})

const selectedStyleInfo = computed(() => {
  if (selectedStyle.value === null) return null
  return styleCards[selectedStyle.value]
})

function addScript() {
  scripts.value = [...scripts.value, '']
}

function removeScript(index) {
  scripts.value = scripts.value.filter((_, itemIndex) => itemIndex !== index)
}

function updateScript(index, value) {
  scripts.value = scripts.value.map((item, itemIndex) =>
    itemIndex === index ? value : item
  )
}

function textCount(value) {
  return value.length
}

function openVoiceModal() {
  voiceModalVisible.value = true
}

function closeVoiceModal() {
  voiceModalVisible.value = false
}

function confirmVoiceModal() {
  const voiceToneLabel =
    voiceToneOptions.find((item) => item.value === selectedVoiceTone.value)
      ?.label ?? '晓晓'
  const voiceStyleLabel =
    voiceStyleOptions.find((item) => item.value === selectedVoiceStyle.value)
      ?.label ?? '激情推销，语速稍快'
  selectedVoice.value = `${voiceToneLabel} / ${voiceStyleLabel}`
  closeVoiceModal()
}

function goPrevStep() {
  currentStep.value = Math.max(1, currentStep.value - 1)
}

function goNextStep() {
  currentStep.value = Math.min(3, currentStep.value + 1)
}

function handleAddAvatar() {
  showUploadModal({
    title: '上传主角照片',
    accept: '.jpg,.png,.jpeg',
    max: 5,
    description: '支持 jpg/png，最多 5 张',
  })
}

function handleAddMaterial() {
  showUploadModal({
    title: '上传视频素材',
    accept: '.mp4,.avi,.mkv',
    max: 5,
    description: '支持 mp4/avi/mkv，最多 5 个',
  })
}

async function handleCopy(text) {
  try {
    await navigator.clipboard.writeText(text)
    message.success('复制成功')
  } catch (err) {
    message.error('复制失败')
  }
}

function selectStyle(index) {
  const actualIndex = (stylePage.value - 1) * stylePageSize + index
  selectedStyle.value = actualIndex
}

function cancelSelection() {
  selectedStyle.value = null
}
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#050607] p-[12px] text-white">
    <div class="mx-auto h-full flex flex-col">
      <n-steps
        contentPlacement="bottom"
        :current="currentStep"
        size="small"
        class="sm:ml-[120px] lg:ml-[200px] xl:ml-[230px] 2xl:ml-[300px] mb-[10px] px-[18px] pt-[4px]"
      >
        <n-step
          v-for="step in stepItems"
          :key="step.index"
          :title="step.label"
        />
      </n-steps>

      <div
        class="overflow-hidden flex-1 rounded-[6px] grid grid-rows-[1fr_56px] grid-cols-1 border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
      >
        <template v-if="currentStep === 1">
          <div class="h-full flex-1 overflow-hidden flex">
            <section
              class="border-b min-w-[400px] border-white/8 p-[14px] min-[920px]:border-b-0 min-[920px]:border-r [&>div>span]:w-[80px] [&>div>span]:min-w-[80px]"
            >
              <div class="mb-[14px] text-sm font-medium text-white/88">
                口播参数
              </div>

              <div class="mb-[14px] flex items-center gap-[12px] text-sm">
                <span>视频总量</span>
                <n-input-number
                  v-model:value="totalVideos"
                  :min="1"
                  size="small"
                  button-placement="both"
                  class="w-[104px] [&_input]:!text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#1a1b1d] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/86 [&_.n-input-number-button]:!w-[28px] [&_.n-input-number-button]:!text-white/48"
                />
                <span class="text-sm text-white/58">条</span>
              </div>

              <div
                class="mb-[14px] flex items-center flex-wrap gap-[12px] text-sm"
              >
                <span>口播数量</span>
                <n-input-number
                  v-model:value="scriptCount"
                  :min="1"
                  size="small"
                  button-placement="both"
                  class="w-[104px] [&_input]:!text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#1a1b1d] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/86 [&_.n-input-number-button]:!w-[28px] [&_.n-input-number-button]:!text-white/48"
                />
                <span class="text-sm text-white/58">条</span>
                <div
                  class="mb-[22px] self-end pl-[72px] text-xs leading-[1.6] text-white/32"
                >
                  提示：如口播数量小于视频总量，则循环选取口播。
                </div>
              </div>

              <div
                class="mb-[8px] flex items-center gap-[12px] text-sm text-white/82"
              >
                <span>音色选择</span>
                <div class="flex flex-wrap items-center gap-[8px]">
                  <button
                    v-for="option in voiceOptions"
                    :key="option.value"
                    type="button"
                    class="inline-flex items-center gap-[6px] border-0 bg-transparent p-0 text-sm text-white/82"
                    :class="
                      selectedVoiceLabel !== option.label
                        ? 'text-white/92'
                        : 'text-white/62'
                    "
                    @click="openVoiceModal"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 512 512"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M256 112V400M400 256H112"
                        stroke="currentColor"
                        stroke-width="32"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    {{ selectedVoiceLabel }}
                  </button>
                  <div class="self-end text-xs leading-[1.7] text-white/32">
                    提示：建议根据首音样类型选择音色，例如：悲生产感情的视频，则选择超情音色。音色数量不能超过口播数量。
                  </div>
                </div>
              </div>
            </section>

            <section class="grid flex-1 grid-rows-[34px_1fr] p-[10px]">
              <div class="mb-[8px] flex items-center justify-between">
                <div class="text-sm font-medium text-white/88">文案列表</div>
                <n-button
                  type="primary"
                  size="tiny"
                  class="!h-[26px] !rounded-[4px] !border-0 !bg-[#18d2e5] !px-[12px] !text-sm !font-medium"
                  @click="addScript"
                >
                  生成文案
                </n-button>
              </div>
              <n-scrollbar
                class="h-full [&>div>div]:grid [&>div>div]:grid-cols-1 [&>div>div]:gap-[15px] pr-[15px]"
              >
                <div
                  v-for="(item, index) in scripts"
                  :key="`script-${index}`"
                  class="rounded-[4px] border border-solid border-[1px] border-white/8 bg-[#1d1d1f] p-[8px] flex flex-col h-[160px]"
                >
                  <n-input
                    :value="item"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    class="border-solid border-[1px] border-white/8 text-sm flex-1 overflow-hidden [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#1b1b1d] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/24"
                    placeholder="请输入文案内容"
                    @update:value="updateScript(index, $event)"
                  />
                  <div
                    class="mt-[8px] flex items-center justify-between text-sm"
                  >
                    <span class="self-end text-xs text-white/36"
                      >字数：{{ textCount(item) }}</span
                    >
                    <button
                      type="button"
                      class="border-0 bg-transparent p-0 text-sm text-[#f86f6f]"
                      @click="removeScript(index)"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </n-scrollbar>
            </section>
          </div>
        </template>

        <template v-else-if="currentStep === 2">
          <div
            class="grid flex-1 min-h-[410px] grid-cols-1 overflow-hidden min-[920px]:grid-cols-[400px_minmax(0,1fr)]"
          >
            <section
              class="border-b min-w-[400px] border-white/8 p-[12px] min-[920px]:border-b-0 min-[920px]:border-r"
            >
              <div
                class="mb-[10px] flex items-center justify-between gap-[8px]"
              >
                <div class="text-sm font-medium text-white/88">主角照片</div>
                <div class="self-end text-xs text-white/36">
                  最多 5 张（与步骤1「口播数量」一致）
                </div>
              </div>

              <div
                class="flex h-[102px] w-[84px] cursor-pointer flex-col items-center justify-center rounded-[2px] border border-dashed border-white/18 bg-[#18191b] text-white/52"
                @click="handleAddAvatar"
              >
                <div class="text-[28px] leading-none">+</div>
                <div class="mt-[6px] text-sm">添加主角</div>
              </div>
            </section>

            <section class="min-w-0 p-[12px] flex flex-col">
              <div
                class="mb-[10px] flex items-center justify-between gap-[10px]"
              >
                <div class="text-sm font-medium text-white/88">
                  素材列表（每个素材时长最少要4秒）
                </div>
                <div class="self-end text-xs text-white/36">
                  每类最多 5 个（与步骤1「视频总量」一致）
                </div>
              </div>

              <n-scrollbar class="flex-1 overflow-hidden pr-[4px]">
                <div class="space-y-[12px]">
                  <div
                    v-for="section in materialSections"
                    :key="section.key"
                    class="rounded-[4px] border border-#ffffff10 border-solid border-[1px] bg-[#222325]"
                  >
                    <div class="px-[10px] pt-[10px] text-sm text-white/64">
                      {{ section.title }}
                    </div>

                    <div class="px-[10px] py-[8px]">
                      <div
                        class="relative rounded-[4px] border border-white/8 bg-[#111214] px-[10px] py-[10px]"
                      >
                        <button
                          type="button"
                          class="absolute right-[10px] top-[10px] cursor-pointer border-0 bg-transparent p-0 text-sm text-[#18d2e5]"
                          @click="handleCopy(section.description)"
                        >
                          复制
                        </button>
                        <div class="self-end pb-[5px] text-xs text-white/32">
                          优先使用 实拍 制作片段，若需使用工具15/工具18
                          制作片段，可参考使用以下提示词
                        </div>
                        <div
                          class="self-end pr-[48px] text-xs leading-[1.65] text-white/58"
                        >
                          {{ section.description }}
                        </div>
                      </div>

                      <div
                        class="mt-[8px] flex items-start gap-[8px] overflow-x-auto pb-[2px]"
                      >
                        <button
                          v-for="(image, index) in section.thumbnails"
                          :key="`${section.key}-${index}`"
                          type="button"
                          class="group relative h-[92px] w-[80px] shrink-0 overflow-hidden rounded-[2px] border border-white/8 bg-[#17181a]"
                        >
                          <img
                            :src="image"
                            alt=""
                            class="h-full w-full object-cover opacity-70"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        </button>

                        <button
                          type="button"
                          class="flex h-[92px] w-[80px] shrink-0 flex-col items-center justify-center rounded-[2px] border border-dashed border-white/18 bg-[#18191b] text-white/52"
                          @click="handleAddMaterial"
                        >
                          <div class="text-[26px] leading-none">+</div>
                          <div class="mt-[6px] text-sm">添加素材</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </n-scrollbar>
            </section>
          </div>
        </template>

        <template v-else-if="currentStep === 3">
          <div
            class="flex-1 overflow-hidden min-h-[410px] flex flex-col justify-between p-[10px]"
          >
            <div class="mb-[8px] flex gap-y-[15px] flex-col items-center">
              <div class="flex items-center gap-[12px]">
                <template v-if="selectedStyleInfo">
                  <span class="self-end text-xs text-white/45">已选：</span>
                  <span class="text-sm font-medium text-[#18d2e5]">{{
                    selectedStyleInfo.title
                  }}</span>
                  <button
                    type="button"
                    class="border-0 bg-transparent p-0 text-sm text-white/32 hover:text-white/64"
                    @click="cancelSelection"
                  >
                    <i class="i-carbon-close text-[#18d2e5] text-[16px]"></i>
                  </button>
                </template>
              </div>
              <n-pagination
                v-model:page="stylePage"
                :page-size="stylePageSize"
                :item-count="styleCards.length"
                simple
                size="small"
                class="[&_.n-pagination-item]:!bg-[#202123] [&_.n-pagination-item]:!border-white/10 [&_.n-pagination-item]:!text-white/72 [&_.n-pagination-item-link]:!text-white/72 [&_.n-pagination-prefix]:!text-white/42"
              />
            </div>

            <n-scrollbar class="flex-1 overflow-hidden pr-[4px]">
              <div
                class="grid grid-cols-2 gap-[6px] min-[760px]:grid-cols-4 min-[980px]:grid-cols-5"
              >
                <button
                  v-for="(item, index) in pagedStyleCards"
                  :key="item.title + index"
                  type="button"
                  class="relative aspect-[0.76] overflow-hidden grid grid-cols-1 grid-rows-[1fr_30px] rounded-[2px] border bg-[#151618] text-left"
                  :class="
                    selectedStyle === (stylePage - 1) * stylePageSize + index
                      ? 'border-[#18d2e5] shadow-[0_0_0_1px_rgba(24,210,229,0.35)]'
                      : 'border-white/8'
                  "
                  @click="selectStyle(index)"
                >
                  <video
                    :src="item.video"
                    class="h-full w-full object-cover transition-transform duration-400 group-hover:scale-103"
                    autoplay
                    muted
                    loop
                    playsinline
                    :poster="item.image"
                    controls
                  />
                  <!-- <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.55)_68%,rgba(0,0,0,0.9)_100%)]" /> -->

                  <div
                    v-if="
                      selectedStyle === (stylePage - 1) * stylePageSize + index
                    "
                    class="absolute right-[8px] top-[8px] z-10 text-[#18d2e5]"
                  >
                    <i class="i-carbon-checkmark-circle text-[20px]"></i>
                  </div>

                  <!-- <div
                    class="absolute left-[8px] top-[8px] rounded-[2px] bg-[#ff6a00] px-[4px] py-[1px] text-[9px] font-semibold text-white">
                    热门
                  </div> -->
                  <div class="h-full flex justify-center items-center">
                    <div
                      class="text-sm text-center font-extrabold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </button>
              </div>
            </n-scrollbar>
          </div>
        </template>

        <div
          class="flex items-center justify-between border-t border-white/8 bg-[#090a0c] px-[12px] py-[10px]"
        >
          <div
            class="flex items-center gap-[6px] self-end text-xs text-white/48"
          >
            <span>消耗算力：</span>
            <i class="i-carbon-currency text-[#ffd24c] text-[14px]"></i>
            <span class="font-medium text-[#ffd24c]">{{ totalPower }}</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <i
                  class="i-mingcute-question-line text-white/38 text-[12px] cursor-pointer"
                ></i>
              </template>
              口播内容字数（150算力/500字，如果有主角则，1800算力/50字）+视频总数*1000算力
            </n-tooltip>
          </div>

          <div class="flex items-center gap-[8px]">
            <n-button
              v-if="currentStep > 1"
              size="small"
              class="!h-[30px] !rounded-[4px] !border-white/12 !bg-transparent !px-[16px] !text-sm !font-medium !text-white/86"
              @click="goPrevStep"
            >
              上一步
            </n-button>

            <n-button
              :type="currentStep === 3 ? 'success' : 'primary'"
              size="small"
              class="!h-[30px] !rounded-[4px] !border-0 !px-[16px] !text-sm !font-medium"
              :class="currentStep === 3 ? '!bg-[#4dd865]' : '!bg-[#18d2e5]'"
              @click="currentStep === 3 ? null : goNextStep()"
            >
              {{ currentStep === 3 ? '提交任务' : '下一步' }}
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <n-modal
      v-model:show="voiceModalVisible"
      :mask-closable="true"
      :close-on-esc="true"
      transform-origin="center"
    >
      <div
        class="mx-auto mt-[80px] w-[min(620px,calc(100vw-40px))] rounded-[8px] bg-[#07080a] px-[20px] pb-[18px] pt-[18px] text-white shadow-[0_18px_60px_rgba(0,0,0,0.5)]"
      >
        <div class="mb-[18px] flex items-start justify-between">
          <div class="text-sm font-semibold tracking-[0.1px] text-white/96">
            选择音色
          </div>
          <button
            type="button"
            class="inline-flex h-[18px] w-[18px] items-center justify-center border-0 bg-transparent p-0 text-[18px] leading-none text-white/55"
            @click="closeVoiceModal"
          >
            ×
          </button>
        </div>

        <div class="space-y-[14px]">
          <div class="flex items-center gap-[12px]">
            <div class="w-[74px] text-sm font-medium text-white/72">
              口播音色：
            </div>
            <n-select
              v-model:value="selectedVoiceTone"
              :options="voiceToneOptions"
              size="medium"
              class="max-w-[430px] flex-1 [&_.n-base-selection]:!h-[40px] [&_.n-base-selection]:!rounded-[6px] [&_.n-base-selection]:!border-white/25 [&_.n-base-selection]:!bg-[#101113] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[40px] [&_.n-base-selection-label]:!text-sm [&_.n-base-selection__render-label]:!text-white/86"
            />
            <button
              type="button"
              class="ml-[2px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/65 bg-transparent text-white/78"
            >
              <i class="i-carbon-play-filled-alt text-[16px]"></i>
            </button>
          </div>

          <div class="flex items-center gap-[12px]">
            <div class="w-[74px] text-sm font-medium text-white/72">
              语调风格：
            </div>
            <n-select
              v-model:value="selectedVoiceStyle"
              :options="voiceStyleOptions"
              size="medium"
              class="max-w-[430px] flex-1 [&_.n-base-selection]:!h-[40px] [&_.n-base-selection]:!rounded-[6px] [&_.n-base-selection]:!border-white/25 [&_.n-base-selection]:!bg-[#101113] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[40px] [&_.n-base-selection-label]:!text-sm [&_.n-base-selection__render-label]:!text-white/86"
            />
          </div>
        </div>

        <div class="mt-[24px] flex justify-end gap-[12px]">
          <n-button
            ghost
            size="medium"
            class="!h-[38px] !w-[76px] !rounded-[6px] !border-white/30 !bg-transparent !text-sm !font-semibold !text-white/86"
            @click="closeVoiceModal"
          >
            取消
          </n-button>
          <n-button
            type="primary"
            size="medium"
            class="!h-[38px] !w-[76px] !rounded-[6px] !border-0 !bg-[#18d2e5] !text-sm !font-semibold"
            @click="confirmVoiceModal"
          >
            确定
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
:deep(
  .n-steps.n-steps--content-bottom:not(.n-steps--vertical)
    > .n-step
    > .n-step-content
    .n-step-content-header
) {
  margin-left: -18px !important;
}
</style>
