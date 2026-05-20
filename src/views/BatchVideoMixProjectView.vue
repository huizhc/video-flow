<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton,
  NColorPicker,
  NInput,
  NInputNumber,
  NSelect,
  NTabs,
  NTabPane,
  NModal,
  NTooltip,
  NUpload,
  NUploadDragger,
  NRadioGroup,
  NRadioButton,
  NSwitch,
} from 'naive-ui'
import UploadArea from '@/components/UploadArea.vue'
import UploadModal from '@/components/UploadModal.vue'
import PackagingStyleModal from '@/components/PackagingStyleModal.vue'

const router = useRouter()
const baseMaterialTab = ref('audio')
const packagingStyleId = ref('')
const showPackagingStyleModal = ref(false)
const subtitleEnabled = ref(false)
const subtitleStart = ref(75)
const subtitleEnd = ref(85)
const fontSize = ref('middle')
const textColor = ref('#a9a9a9')
const bgColor = ref('#6c6c6c')

// BGM states
const showBgmModal = ref(false)
const bgmUploadMode = ref('local')
const bgmFileName = ref('')
const bgmStatus = computed(() => bgmFileName.value || '未上传')
const bgmVolume = ref(40)
const videoDirection = ref('portrait')
const resolution = ref('720p')
const amountRange = ref(50)
const totalPower = computed(() => 120)

const shotUploadAccept = 'video/mp4,video/quicktime,.mov,.mkv'
const showTitleModal = ref(false)
const showPreview = ref(false)
const editingShotIndex = ref(-1)
const editingTitleIndex = ref(-1)
const titleName = ref('新标题')
const titleSize = ref(32)
const titlePosition = ref({ x: 23, y: 44 })
const titleStyle = ref('yellow-outline')
const draggingTitle = ref(false)
let titleDragOffset = { x: 0, y: 0 }
let titleDragTarget = null

// Shot upload modal states
const showShotUploadModal = ref(false)
const uploadingShotIndex = ref(-1)

function openShotUploadModal(shotIndex) {
  uploadingShotIndex.value = shotIndex
  showShotUploadModal.value = true
}

function handleShotUploadModalChange(data) {
  const shot = shots.value[uploadingShotIndex.value]
  if (!shot) return
  for (const uploadFile of data.fileList) {
    const file = uploadFile.file
    if (!file) continue
    const nextUrl = URL.createObjectURL(file)
    shot.clips.push({
      id: Date.now() + Math.random(),
      name: file.name,
      url: nextUrl,
      objectUrl: true,
    })
  }
  showShotUploadModal.value = false
}

const shots = ref([
  {
    id: 1,
    name: '11',
    start: 0,
    end: 0,
    duration: 9999,
    clips: [],
    speech: '你一颗我一颗别在了衣领',
    translation: '-',
    audioMode: '素材原音',
    durationMode: '参考口播',
    position: '正中（置底）',
    titles: [],
  },
])
const nextShotId = ref(2)

const titleStylePresets = [
  { key: 'default', label: '默认样式', className: 'preview-title--default' },
  { key: 'black', label: '常规黑字', className: 'preview-title--black' },
  {
    key: 'white-outline',
    label: '粉白描边',
    className: 'preview-title--white-outline',
  },
  {
    key: 'orange-outline',
    label: '橙红描边',
    className: 'preview-title--orange-outline',
  },
  { key: 'flame', label: '火焰字', className: 'preview-title--flame' },
  {
    key: 'red-bold',
    label: '鲁红黑边重',
    className: 'preview-title--red-bold',
  },
  {
    key: 'black-outline',
    label: '黑白描边',
    className: 'preview-title--black-outline',
  },
  { key: 'shadow', label: '黑底强冷阴影', className: 'preview-title--shadow' },
  {
    key: 'yellow-outline',
    label: '黄红描边',
    className: 'preview-title--yellow-outline',
  },
  {
    key: 'blue-outline',
    label: '蓝白描边',
    className: 'preview-title--blue-outline',
  },
  {
    key: 'green-outline',
    label: '黄绿描边',
    className: 'preview-title--green-outline',
  },
  { key: 'deep-red', label: '深红描边', className: 'preview-title--deep-red' },
]

const editingShot = computed(() => shots.value[editingShotIndex.value] || null)

const previewTitles = computed(() => {
  const titles = editingShot.value?.titles || []
  const existingTitles = titles.map((title, index) => {
    if (index !== editingTitleIndex.value) {
      return {
        ...title,
        name: title.name || '新标题',
        size: title.size || 32,
        position: title.position || { x: 23, y: 44 },
        style: title.style || 'yellow-outline',
        previewKey: title.id,
        source: 'existing',
        index,
      }
    }

    return {
      ...title,
      name: titleName.value || '新标题',
      size: titleSize.value,
      position: { ...titlePosition.value },
      style: titleStyle.value,
      previewKey: title.id,
      source: 'selected',
      index,
    }
  })

  if (editingTitleIndex.value >= 0) {
    return existingTitles
  }

  return [
    ...existingTitles,
    {
      id: 'draft-title',
      previewKey: 'draft-title',
      name: titleName.value || '新标题',
      size: titleSize.value,
      position: { ...titlePosition.value },
      style: titleStyle.value,
      source: 'draft',
      index: -1,
    },
  ]
})

function getTitleStyleClass(styleKey) {
  const preset = titleStylePresets.find((item) => item.key === styleKey)
  return preset?.className || 'preview-title--default'
}

const baseMaterialTabs = [
  { label: '口播音频', value: 'audio' },
  { label: '参考视频', value: 'video' },
]

const resolutionOptions = ['480p', '720p', '1080p']

const demoAudioUrl = 'https://www.w3schools.com/html/horse.mp3'
const demoVideoUrl = 'https://www.w3schools.com/html/movie.mp4'
const demoAvatarUrl =
  'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1080&q=80'

const audioMaterial = ref({
  name: '口播音频示例.mp3',
  url: demoAudioUrl,
  objectUrl: false,
})

const videoMaterial = ref({
  name: '参考视频示例.mp4',
  url: demoVideoUrl,
  objectUrl: false,
})

const avatarMaterial = ref({
  name: '人物照片示例.jpg',
  url: demoAvatarUrl,
  sizeLabel: '1080x1080',
  objectUrl: false,
})

const activeMaterial = computed(() =>
  baseMaterialTab.value === 'audio' ? audioMaterial.value : videoMaterial.value
)

const activeUploadAccept = computed(() =>
  baseMaterialTab.value === 'audio'
    ? '.mp3,.wav,.m4a,.flac'
    : 'video/mp4,video/quicktime,.mov,.mkv'
)

const activeUploadDescription = computed(() =>
  baseMaterialTab.value === 'audio'
    ? 'mp3/wav 文件，100MB以内'
    : 'mp4/mov 文件，建议1G以内'
)

const activeParseLabel = computed(() =>
  baseMaterialTab.value === 'audio' ? '获取口播内容' : '解析视频内容'
)

const activeParsePower = computed(() =>
  baseMaterialTab.value === 'audio' ? 600 : 1200
)

const activePowerText = computed(() =>
  baseMaterialTab.value === 'audio'
    ? '音频分析消耗算力：'
    : '视频解析消耗算力：'
)

function revokeIfNeeded(fileState) {
  if (fileState?.objectUrl && fileState.url) {
    URL.revokeObjectURL(fileState.url)
  }
}

function addShot() {
  shots.value.push({
    id: nextShotId.value,
    name: `${nextShotId.value}`,
    start: 0,
    end: 0,
    duration: 9999,
    clips: [],
    speech: '',
    translation: '-',
    audioMode: '素材原音',
    durationMode: '参考口播',
    position: '正中（置底）',
    titles: [],
  })
  nextShotId.value += 1
}

function removeShot(index) {
  const shot = shots.value[index]
  if (!shot) return
  shot.clips.forEach(revokeIfNeeded)
  shots.value.splice(index, 1)
}

function removeShotClip(shot, clipIndex) {
  const clip = shot.clips[clipIndex]
  if (!clip) return
  revokeIfNeeded(clip)
  shot.clips.splice(clipIndex, 1)
}

function previewShot(shotIndex) {
  if (
    showPreview.value &&
    editingShotIndex.value === shotIndex &&
    !showTitleModal.value
  ) {
    showPreview.value = false
    return
  }
  editingShotIndex.value = shotIndex
  editingTitleIndex.value = -1
  showPreview.value = true
}

function openTitleModal(shotIndex, titleIndex = -1) {
  const title = shots.value[shotIndex]?.titles?.[titleIndex]
  editingShotIndex.value = shotIndex
  editingTitleIndex.value = titleIndex
  titleName.value = title?.name || '新标题'
  titleSize.value = title?.size || 32
  titlePosition.value = title?.position
    ? { ...title.position }
    : { x: 23, y: 44 }
  titleStyle.value = title?.style || 'yellow-outline'
  showTitleModal.value = true
  showPreview.value = true
}

function closeTitleModal() {
  showTitleModal.value = false
  showPreview.value = false
  editingTitleIndex.value = -1
  draggingTitle.value = false
  titleDragTarget = null
  removeTitleDragListeners()
}

function confirmTitle() {
  const shot = shots.value[editingShotIndex.value]
  const nextTitle = titleName.value.trim() || '新标题'
  if (!shot) return
  if (!Array.isArray(shot.titles)) {
    shot.titles = []
  }
  const titleData = {
    id: Date.now() + Math.random(),
    name: nextTitle,
    size: titleSize.value,
    position: { ...titlePosition.value },
    style: titleStyle.value,
  }

  if (editingTitleIndex.value >= 0 && shot.titles[editingTitleIndex.value]) {
    shot.titles[editingTitleIndex.value] = {
      ...shot.titles[editingTitleIndex.value],
      ...titleData,
      id: shot.titles[editingTitleIndex.value].id,
    }
  } else {
    shot.titles.push(titleData)
  }
  closeTitleModal()
}

function deleteTitle() {
  const shot = shots.value[editingShotIndex.value]
  if (!shot?.titles?.[editingTitleIndex.value]) {
    titleName.value = '新标题'
    return
  }
  shot.titles.splice(editingTitleIndex.value, 1)
  closeTitleModal()
}

function startTitleDrag(event, title) {
  const previewRect = event.currentTarget.parentElement.getBoundingClientRect()
  const position = title.position || { x: 23, y: 44 }
  draggingTitle.value = true
  titleDragTarget = {
    source: title.source,
    index: title.index,
  }
  titleDragOffset = {
    x:
      event.clientX - previewRect.left - (position.x / 100) * previewRect.width,
    y:
      event.clientY - previewRect.top - (position.y / 100) * previewRect.height,
  }
  window.addEventListener('mousemove', moveTitle)
  window.addEventListener('mouseup', stopTitleDrag)
}

function moveTitle(event) {
  if (!draggingTitle.value) return
  const preview = document.querySelector('.title-preview-canvas')
  if (!preview) return
  const rect = preview.getBoundingClientRect()
  const nextX =
    ((event.clientX - rect.left - titleDragOffset.x) / rect.width) * 100
  const nextY =
    ((event.clientY - rect.top - titleDragOffset.y) / rect.height) * 100
  const nextPosition = {
    x: Math.min(88, Math.max(0, Math.round(nextX))),
    y: Math.min(88, Math.max(0, Math.round(nextY))),
  }

  if (
    !titleDragTarget ||
    titleDragTarget.source === 'draft' ||
    titleDragTarget.source === 'selected'
  ) {
    titlePosition.value = nextPosition
    return
  }

  const shot = editingShot.value
  const targetTitle = shot?.titles?.[titleDragTarget.index]
  if (targetTitle) {
    targetTitle.position = nextPosition
  }
}

function stopTitleDrag() {
  draggingTitle.value = false
  titleDragTarget = null
  removeTitleDragListeners()
}

function removeTitleDragListeners() {
  window.removeEventListener('mousemove', moveTitle)
  window.removeEventListener('mouseup', stopTitleDrag)
}

function updateImageSize(url) {
  const image = new Image()
  image.onload = () => {
    if (!avatarMaterial.value || avatarMaterial.value.url !== url) return
    avatarMaterial.value.sizeLabel = `${image.naturalWidth}x${image.naturalHeight}`
  }
  image.src = url
}

function handleBaseMaterialUpload(file) {
  const nextUrl = URL.createObjectURL(file)
  if (baseMaterialTab.value === 'audio') {
    revokeIfNeeded(audioMaterial.value)
    audioMaterial.value = {
      name: file.name,
      url: nextUrl,
      objectUrl: true,
    }
    return
  }

  revokeIfNeeded(videoMaterial.value)
  videoMaterial.value = {
    name: file.name,
    url: nextUrl,
    objectUrl: true,
  }
}

function resetBaseMaterial() {
  if (baseMaterialTab.value === 'audio') {
    revokeIfNeeded(audioMaterial.value)
    audioMaterial.value = null
    return
  }

  revokeIfNeeded(videoMaterial.value)
  videoMaterial.value = null
}

function handleAvatarUpload(file) {
  const nextUrl = URL.createObjectURL(file)
  revokeIfNeeded(avatarMaterial.value)
  avatarMaterial.value = {
    name: file.name,
    url: nextUrl,
    sizeLabel: '读取中',
    objectUrl: true,
  }
  updateImageSize(nextUrl)
}

function resetAvatarMaterial() {
  revokeIfNeeded(avatarMaterial.value)
  avatarMaterial.value = null
}

onUnmounted(() => {
  revokeIfNeeded(audioMaterial.value)
  revokeIfNeeded(videoMaterial.value)
  revokeIfNeeded(avatarMaterial.value)
  shots.value.forEach((shot) => shot.clips.forEach(revokeIfNeeded))
  removeTitleDragListeners()
})
</script>

<template>
  <div class="h-full w-full min-h-[500px] bg-[#060709] text-white">
    <div class="h-full overflow-x-scroll flex set-scrollbar">
      <div
        class="grid h-full p-3 grid-cols-[400px_400px_500px_400px_500px] gap-x-[15px]"
      >
        <section
          class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
        >
          <div
            class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2"
          >
            <div>
              <div class="text-sm text-white/84">基础素材</div>
              <div class="mt-0.5 text-xs text-white/30">
                用于人口播音频/参考视频驱动
              </div>
            </div>
            <n-button
              type="button"
              ghost
              class="flex border-[1px] border-solid border-#ffffff10 h-[30px] items-center justify-center rounded-[4px] bg-transparent text-sm text-white/45 transition-colors hover:text-white/70"
              @click.stop="router.push({ name: 'tool-batch-video-mix' })"
            >
              项目列表
            </n-button>
          </div>

          <div class="space-y-4 p-3">
            <n-tabs
              v-model:value="baseMaterialTab"
              type="line"
              size="small"
              class="[&_.n-tabs-tab]:!px-0 [&_.n-tabs-tab]:!text-sm [&_.n-tabs-tab]:!text-white/64 [&_.n-tabs-tab--active]:!text-[#18d2e5] [&_.n-tabs-bar]:!bg-[#18d2e5] [&_.n-tabs-nav]:!border-b [&_.n-tabs-nav]:!border-white/8"
            >
              <n-tab-pane
                v-for="tab in baseMaterialTabs"
                :key="tab.value"
                :name="tab.value"
                :tab="tab.label"
              />
            </n-tabs>

            <div>
              <UploadArea
                v-if="!activeMaterial"
                :has-file="false"
                :accept="activeUploadAccept"
                :description="activeUploadDescription"
                @file-change="handleBaseMaterialUpload"
              />
              <div
                v-else
                class="rounded-[6px] border-solid border-[1px] border-#ffffff10 bg-[#262729] p-3"
              >
                <div
                  class="overflow-hidden rounded-[4px] border border-white/8"
                >
                  <audio
                    style="color-scheme: dark"
                    v-if="baseMaterialTab === 'audio'"
                    :src="activeMaterial.url"
                    controls
                    class="w-full h-[40px]"
                  />
                  <video
                    v-else
                    :src="activeMaterial.url"
                    controls
                    class="aspect-video w-full bg-black object-cover"
                  />
                </div>

                <div class="mt-3 flex items-center justify-between gap-3">
                  <n-button
                    ghost
                    size="tiny"
                    class="!rounded-[4px] !border-white/10 !px-3 !text-xs !text-white/84"
                    @click="resetBaseMaterial"
                  >
                    重新上传
                  </n-button>
                  <n-button
                    type="primary"
                    size="tiny"
                    class="!rounded-[4px] !border-0 !bg-[#57d7ea] !px-3 !text-xs !font-medium text-#fff!"
                  >
                    {{ activeParseLabel }}
                  </n-button>
                </div>

                <div
                  class="mt-3 flex items-center gap-1.5 text-xs text-white/32"
                >
                  <span>{{ activePowerText }}</span>
                  <i class="i-carbon-currency text-[13px] text-[#ffd24c]"></i>
                  <span class="text-[#ffd24c]">{{ activeParsePower }}</span>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <i
                        class="i-mingcute-question-line text-white/48 cursor-pointer"
                      ></i>
                    </template>
                    根据上传视频时长计算，每30秒600算力
                  </n-tooltip>
                </div>
              </div>
            </div>

            <div class="border-t border-white/8 pt-4">
              <div class="mb-1 text-sm text-white/74">上传人物照片</div>
              <div class="mb-2 leading-[1.5] text-xs text-white/28">
                如果上传了人物照片，则会生成数字人口播形象
              </div>
              <UploadArea
                v-if="!avatarMaterial"
                :has-file="false"
                accept=".jpg,.png,.jpeg,.webp"
                description="JPG、PNG、JPEG，30MB以内"
                @file-change="handleAvatarUpload"
              />
              <div
                v-else
                class="rounded-[6px] border-[1px] border-solid border-#ffffff10 bg-[#262729] p-3"
              >
                <div class="overflow-hidden rounded-[4px] bg-[#141517]">
                  <img
                    :src="avatarMaterial.url"
                    :alt="avatarMaterial.name"
                    class="aspect-square w-full object-cover"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                  />
                </div>

                <div class="mt-3 flex items-center justify-between gap-3">
                  <n-button
                    ghost
                    size="tiny"
                    class="!rounded-[4px] !border-white/10 !px-3 !text-xs !text-white/84"
                    @click="resetAvatarMaterial"
                  >
                    重新上传
                  </n-button>
                  <div class="text-xs text-white/36">
                    图片尺寸：{{ avatarMaterial.sizeLabel }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2"
          >
            <div class="text-sm text-white/84">口播分段</div>
            <div class="mt-0.5 text-xs text-white/30">
              调整每一屏的文字，换行符分隔每一屏
            </div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col p-3">
            <textarea
              class="min-h-0 flex-1 resize-none rounded-[4px] border border-white/18 bg-[#1a1b1e] p-3 text-sm leading-[1.75] text-white/76 outline-none placeholder:text-white/26 focus:border-[#18d2e5]"
              placeholder="请输入字幕文案，使用换行符分段每一屏"
            />
            <div class="mt-2 text-right text-xs text-[#f4a524]">
              *过渡镜头后，尽量不要留空，否则可能会出现少帧
            </div>
          </div>
        </section>

        <section
          class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2"
          >
            <div class="text-sm text-white/84">镜头序列</div>
            <div class="mt-0.5 text-xs text-white/30">
              将按照以下顺序合并视频，每个镜头至少要有一个片段
            </div>
          </div>

          <div class="space-y-4 p-3">
            <div
              v-for="(shot, shotIndex) in shots"
              :key="shot.id"
              class="rounded-[8px] border-[1px] border-solid border-[#4a4a4a] bg-[#202020] p-4 cursor-pointer"
              @click="previewShot(shotIndex)"
            >
              <div
                class="mb-4 flex items-center justify-between border-b border-[#4a4a4a] pb-3"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <i class="i-carbon-move text-[20px] text-white/60"></i>
                  <div
                    class="flex items-center gap-3 text-sm font-bold leading-none"
                  >
                    <span class="text-white">镜头{{ shotIndex + 1 }}:</span>
                    <span class="text-white">{{ shot.name }}</span>
                  </div>
                  <span class="text-xs font-bold text-white/55">
                    S:{{ shot.start }}/E:{{ shot.end }}/D:{{ shot.duration }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <button
                    type="button"
                    class="btn-close flex h-6 w-6 items-center justify-center text-white/45 transition hover:text-white/70"
                    aria-label="复制镜头"
                  >
                    <i class="i-carbon-copy text-[16px]"></i>
                  </button>
                  <button
                    type="button"
                    class="btn-close flex h-6 w-6 items-center justify-center text-[#d46660] transition hover:text-[#ff8079]"
                    aria-label="删除镜头"
                    @click.stop="removeShot(shotIndex)"
                  >
                    <i class="i-carbon-trash-can text-[16px]"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3 flex gap-3 border-b border-[#4a4a4a] pb-3">
                <div
                  v-for="(clip, clipIndex) in shot.clips"
                  :key="clip.id"
                  class="group relative h-[72px] w-[72px] overflow-hidden rounded-[6px] bg-[#c3c7cd]"
                >
                  <video
                    v-if="clip.url"
                    :src="clip.url"
                    muted
                    class="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    class="absolute btn-close right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/55 text-xs text-white/80 opacity-0 transition group-hover:opacity-100"
                    aria-label="删除片段"
                    @click.stop="removeShotClip(shot, clipIndex)"
                  >
                    <i class="i-carbon-trash-can text-[18px] text-red"></i>
                  </button>
                  <div
                    class="absolute bottom-1 right-1 rounded-[3px] bg-[#3d3f45] px-1.5 py-[1px] text-xs font-bold leading-none text-white"
                  >
                    4s
                  </div>
                </div>

                <button
                  type="button"
                  class="flex h-[72px] w-[72px] items-center justify-center rounded-[6px] border-2 border-dashed border-[#4f4f4f] bg-[#1f1f1f] text-white/60 transition hover:border-[#18d2e5]/50 hover:text-white"
                  aria-label="上传片段"
                  @click.stop="openShotUploadModal(shotIndex)"
                >
                  <i class="i-carbon-add text-[30px]"></i>
                </button>
              </div>

              <div
                class="space-y-2 text-sm font-bold leading-[1.45] text-white/55"
              >
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">口播内容:</div>
                  <div class="min-w-0 text-white/62">{{ shot.speech }}</div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">口播翻译:</div>
                  <div class="text-white/62">{{ shot.translation }}</div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">片段音频:</div>
                  <n-radio-group
                    v-model:value="shot.audioMode"
                    size="small"
                    class="custom-radio-group"
                    @click.stop
                  >
                    <n-radio-button value="使用口播" label="使用口播" />
                    <n-radio-button value="素材原音" label="素材原音" />
                    <n-radio-button value="静音" label="静音" />
                  </n-radio-group>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">片段时长:</div>
                  <n-radio-group
                    v-model:value="shot.durationMode"
                    size="small"
                    class="custom-radio-group"
                    @click.stop
                  >
                    <n-radio-button value="参考口播" label="参考口播" />
                    <n-radio-button value="参考素材" label="参考素材" />
                    <n-radio-button value="自定义" label="自定义" />
                  </n-radio-group>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">人物位置:</div>
                  <n-radio-group
                    v-model:value="shot.position"
                    size="small"
                    class="custom-radio-group"
                    @click.stop
                  >
                    <n-radio-button value="正中（置底）" label="正中(置底)" />
                    <n-radio-button value="左上" label="左上" />
                    <n-radio-button value="右上" label="右上" />
                    <n-radio-button value="左下" label="左下" />
                    <n-radio-button value="右下" label="右下" />
                  </n-radio-group>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-[72px] shrink-0">片段标题:</div>
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      v-for="(title, titleIndex) in shot.titles"
                      :key="title.id"
                      type="button"
                      class="rounded-[3px] text-[#57d7ea] border-[1px] border-solid border-[#57d7ea10] bg-[rgba(87,_215,_234,_0.12)] px-2 py-1 text-xs transition"
                      @click.stop="openTitleModal(shotIndex, titleIndex)"
                    >
                      {{ title.name }}
                    </button>
                    <button
                      type="button"
                      class="flex btn-close py-[2px] w-10 items-center justify-center rounded-[4px] border-[1px]! border-solid! border-[#57595e] bg-[#242529] text-white/70 transition hover:border-[#18d2e5]/70 hover:text-white"
                      aria-label="添加片段标题"
                      @click.stop="openTitleModal(shotIndex)"
                    >
                      <i class="i-carbon-add text-[18px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="flex h-[180px] w-full flex-col items-center justify-center rounded-[8px] border-[3px] border-dashed border-[#4a4a4a] bg-[#151515] text-white/60 transition hover:border-[#18d2e5]/50 hover:text-white"
              @click="addShot"
            >
              <i class="i-carbon-add text-[42px]"></i>
              <span class="mt-3 text-sm font-bold">添加镜头</span>
            </button>
          </div>
        </section>

        <section
          class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2"
          >
            <div class="text-sm text-white/84">其他参数</div>
            <div class="mt-0.5 text-xs text-white/30">
              控制视频输出的各项指标
            </div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col justify-between p-3">
            <div class="space-y-[14px] flex flex-col">
              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  智能包装:
                </div>
                <div class="min-w-0 flex-1">
                  <PackagingStyleModal
                    v-model:show="showPackagingStyleModal"
                    v-model:selected-style-id="packagingStyleId"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  启用字幕:
                </div>
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="!subtitleEnabled ? 'text-theme' : 'text-white'"
                  @click="subtitleEnabled = false"
                >
                  关闭
                </button>
                <n-switch v-model:value="subtitleEnabled" size="small" />
                <button
                  type="button"
                  class="border-0 bg-transparent p-0"
                  :class="subtitleEnabled ? 'text-theme' : 'text-white'"
                  @click="subtitleEnabled = true"
                >
                  启用
                </button>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  字幕位置:
                </div>
                <div class="flex items-center gap-[6px] text-sm text-white/36">
                  <n-input-number
                    v-model:value="subtitleStart"
                    button-placement="both"
                    class="text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/78"
                  >
                    <template #suffix> % </template>
                  </n-input-number>
                  <span>～</span>
                  <n-input-number
                    v-model:value="subtitleEnd"
                    button-placement="both"
                    class="text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/78"
                  >
                    <template #suffix> % </template>
                  </n-input-number>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  字体大小:
                </div>
                <div class="min-w-0 flex-1">
                  <n-select
                    v-model:value="fontSize"
                    :options="[{ label: '中', value: 'middle' }]"
                    class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#151618] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!text-sm [&_.n-base-selection__render-label]:!text-white/82"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  字幕底色:
                </div>
                <div class="flex items-center gap-2">
                  <n-color-picker
                    v-model:value="textColor"
                    :show-alpha="false"
                    :actions="['confirm']"
                    class="[&_.n-color-picker-trigger]:!h-[20px] [&_.n-color-picker-trigger]:!w-[20px] [&_.n-color-picker-trigger]:!rounded-[3px] [&_.n-color-picker-trigger]:!border [&_.n-color-picker-trigger]:!border-white/8 [&_.n-color-picker-trigger__fill]:!rounded-[2px]"
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
                  <span class="text-sm text-white/34">文字颜色:</span>
                  <n-color-picker
                    v-model:value="bgColor"
                    :show-alpha="false"
                    :actions="['confirm']"
                    class="[&_.n-color-picker-trigger]:!h-[20px] [&_.n-color-picker-trigger]:!w-[20px] [&_.n-color-picker-trigger]:!rounded-[3px] [&_.n-color-picker-trigger]:!border [&_.n-color-picker-trigger]:!border-white/8 [&_.n-color-picker-trigger__fill]:!rounded-[2px]"
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

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  背景音乐:
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span
                    class="text-white/72"
                    :class="bgmFileName ? 'text-[#18d2e5]' : 'text-white/34'"
                  >
                    {{ bgmStatus }}
                  </span>
                  <n-button
                    ghost
                    size="tiny"
                    class="flex h-[30px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent text-sm text-white/45 transition-colors hover:text-white/70"
                    @click="showBgmModal = true"
                  >
                    <i class="i-carbon-cloud-upload text-[14px]"></i>
                    选择BGM
                  </n-button>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  音乐音量:
                </div>
                <div class="flex items-center gap-[6px] text-sm text-white/36">
                  <n-input-number
                    v-model:value="bgmVolume"
                    :show-button="true"
                    button-placement="both"
                    class="w-[120px] text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/78"
                  >
                    <template #suffix> % </template>
                  </n-input-number>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  视频方向:
                </div>
                <n-radio-group v-model:value="videoDirection">
                  <n-radio-button value="portrait" label="竖屏" />
                  <n-radio-button value="landscape" label="横屏" />
                </n-radio-group>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[66px] shrink-0 pt-[4px] text-sm text-white/48">
                  视频尺寸:
                </div>
                <n-radio-group v-model:value="resolution">
                  <n-radio-button
                    v-for="item in resolutionOptions"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </n-radio-group>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-sm text-white/48">
                  数量限制:
                </div>
                <div class="flex items-center gap-[6px] text-sm text-white/36">
                  <n-input-number
                    v-model:value="amountRange"
                    :show-button="true"
                    button-placement="both"
                    class="w-[120px] text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/78"
                  />
                </div>
              </div>
            </div>

            <div class="pt-2">
              <n-button ghost class="bg-[#4f8a2a]! w-full text-white!"
                >预览</n-button
              >
            </div>
          </div>
        </section>

        <section
          class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2"
          >
            <div class="text-sm text-white/84">预览</div>
            <div class="mt-0.5 text-xs text-white/30">
              建议保留空镜头的新镜头
            </div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col justify-between p-3">
            <div class="flex-1 rounded-[4px] bg-[#090a0c]" />

            <div
              class="mt-3 flex items-center justify-between border-t border-white/8"
            >
              <div class="flex items-center gap-2 text-sm">
                <n-button
                  ghost
                  class="rounded-[3px] border border-white/8 bg-[#161719] px-[10px] py-[3px] text-white/42"
                >
                  全选
                </n-button>
                <n-button
                  ghost
                  class="rounded-[3px] border border-white/8 bg-[#161719] px-[10px] py-[3px] text-white/42"
                >
                  反选
                </n-button>
              </div>

              <div class="flex items-center gap-4 text-sm text-white/40">
                <span>已选: 0/0</span>
                <div class="flex items-center gap-1">
                  <span>导出消耗算力:</span>
                  <i class="i-carbon-currency text-[13px] text-[#ffd24c]"></i>
                  <span class="text-[#ffd24c]">{{ totalPower }}</span>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <i
                        class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                      ></i>
                    </template>
                    根据导出的视频数量，每条120算力
                  </n-tooltip>
                </div>
                <n-button
                  type="warning"
                  size="small"
                  class="!h-[28px] !px-3 !rounded-[4px] !text-sm"
                >
                  后台执行
                </n-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <UploadModal
    v-model:show="showShotUploadModal"
    title="上传片段"
    :accept="shotUploadAccept"
    :max="99"
    description="支持 mp4/mov/mkv 格式"
    @change="handleShotUploadModalChange"
  />

  <n-modal
    v-model:show="showTitleModal"
    :mask-closable="true"
    @after-leave="removeTitleDragListeners"
  >
    <div
      class="w-[600px] rounded-[8px] border border-white/10 bg-[#151515] text-white shadow-2xl"
    >
      <div
        class="flex items-center justify-between border-b border-white/8 px-4 py-3"
      >
        <span class="text-sm font-medium">设置片段标题</span>
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/5"
          @click="closeTitleModal"
        >
          <i class="i-carbon-close text-[18px] text-white/45"></i>
        </button>
      </div>

      <div class="max-h-[420px] flex flex-col overflow-y-auto p-4">
        <n-input
          v-model:value="titleName"
          placeholder="请输入标题名称"
          class="[&_.n-input]:!h-8 [&_.n-input]:!rounded-[4px] [&_.n-input]:!bg-[#101010] [&_.n-input]:!px-3 [&_.n-input]:!text-sm [&_.n-input]:!text-white/86 [&_.n-input__placeholder]:!text-white/24"
        />

        <div class="mt-4 grid grid-cols-4 gap-2">
          <button
            v-for="preset in titleStylePresets"
            :key="preset.key"
            type="button"
            class="title-style-card"
            :class="{ 'is-active': titleStyle === preset.key }"
            @click="titleStyle = preset.key"
          >
            <span :class="preset.className">{{ preset.label }}</span>
          </button>
        </div>
      </div>

      <div class="border-t border-white/8 bg-[#111] px-4 py-3">
        <div class="flex items-center gap-3 text-sm text-white/70">
          <span>标题大小:</span>
          <n-input-number
            button-placement="both"
            v-model:value="titleSize"
            :min="12"
            :max="64"
            size="small"
            class="w-[118px] text-center [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#18191b] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-sm [&_.n-input-number-input]:!text-white/80"
          />
        </div>
        <div class="mt-2 text-xs text-white/62">
          标题位置：X:{{ titlePosition.x }}% Y:{{ titlePosition.y }}%
          （在预览窗口拖动调整）
        </div>

        <div class="mt-4 flex items-center justify-between">
          <n-button
            type="error"
            size="small"
            :disabled="editingTitleIndex < 0"
            @click="deleteTitle"
          >
            删除标题
          </n-button>
          <div class="flex items-center gap-3">
            <n-button ghost size="small" @click="closeTitleModal">
              关闭
            </n-button>
            <n-button type="primary" size="small" @click="confirmTitle">
              确定
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </n-modal>

  <Transition name="title-preview-slide">
    <aside
      v-if="showTitleModal || showPreview"
      class="fixed right-0 top-0 z-[3000] h-full w-[480px] border-l border-white/10 bg-[#171717] p-5 text-white shadow-2xl"
    >
      <div class="mb-5 flex items-center justify-between">
        <span class="text-sm font-bold">预览效果</span>
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-full text-white/55 transition hover:bg-white/6 hover:text-white"
          @click="closeTitleModal"
        >
          <i class="i-carbon-close text-[18px]"></i>
        </button>
      </div>

      <div
        class="title-preview-canvas relative mx-auto overflow-hidden bg-black"
      >
        <img
          v-if="avatarMaterial?.url"
          :src="avatarMaterial.url"
          :alt="avatarMaterial.name"
          class="h-full w-full object-cover"
          draggable="false"
        />
        <div
          v-else
          class="flex h-full items-center justify-center text-xs text-white/35"
        >
          未上传人物照片
        </div>

        <div class="absolute inset-x-0 top-0 h-[16%] bg-black" />
        <div class="absolute inset-x-0 bottom-0 h-[26%] bg-black/18" />

        <div
          v-for="previewTitle in previewTitles"
          :key="previewTitle.previewKey"
          class="preview-draggable-title"
          :class="[
            getTitleStyleClass(previewTitle.style),
            previewTitle.source === 'selected' ||
            previewTitle.source === 'draft'
              ? 'is-editing'
              : '',
          ]"
          :style="{
            left: `${previewTitle.position.x}%`,
            top: `${previewTitle.position.y}%`,
            fontSize: `${previewTitle.size}px`,
          }"
          @mousedown.prevent="(event) => startTitleDrag(event, previewTitle)"
        >
          {{ previewTitle.name || '新标题' }}
        </div>

        <div
          class="absolute bottom-[76px] left-5 text-xs leading-[1.55] text-white"
        >
          <div class="font-bold">@username</div>
          <div>description about the video</div>
          <div>#hashtag #trending #viral</div>
          <div class="mt-1 text-white/90">♫ Original sound - username</div>
        </div>

        <div
          class="absolute bottom-[70px] right-4 flex flex-col items-center gap-4 text-xs text-white"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full border border-white"
          >
            <span class="text-sm">人</span>
          </div>
          <div class="text-center">
            <div class="text-sm leading-none">★</div>
            <div>134.7k</div>
          </div>
          <div class="text-center">
            <div class="text-sm leading-none">◎</div>
            <div>962</div>
          </div>
          <div class="text-center">
            <div class="text-sm leading-none">↗</div>
            <div>1.6k</div>
          </div>
        </div>
      </div>
    </aside>
  </Transition>

  <n-modal v-model:show="showBgmModal" :mask-closable="true">
    <div
      class="w-[600px] rounded-[8px] border border-white/10 bg-[#161719] p-4 text-white shadow-2xl"
    >
      <div class="mb-4 flex items-center justify-between">
        <span class="text-sm font-medium">选择背景音乐</span>
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/5"
          @click="showBgmModal = false"
        >
          <i class="i-carbon-close text-[18px] text-white/45"></i>
        </button>
      </div>

      <div class="mb-4 rounded-[6px] bg-[#1a1c1e] p-4">
        <div class="mb-4 flex gap-6 text-sm">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="bgmUploadMode"
              type="radio"
              value="local"
              class="accent-[#18d2e5]"
            />
            <span
              :class="
                bgmUploadMode === 'local' ? 'text-[#18d2e5]' : 'text-white/65'
              "
              >本地上传</span
            >
          </label>
          <label class="flex cursor-pointer items-center gap-2 opacity-50">
            <input
              v-model="bgmUploadMode"
              type="radio"
              value="cloud"
              class="accent-[#18d2e5]"
              disabled
            />
            <span
              :class="
                bgmUploadMode === 'cloud' ? 'text-[#18d2e5]' : 'text-white/65'
              "
              >云盘选择</span
            >
          </label>
        </div>

        <n-upload
          multiple
          directory-dnd
          :max="1"
          accept=".mp3,.wav,.m4a,.aac"
          @change="
            (data) => {
              if (data.fileList.length > 0) {
                bgmFileName = data.fileList[0].name
              }
            }
          "
        >
          <n-upload-dragger
            class="!border-dashed !border-white/10 !bg-[#17181a] hover:!border-[#18d2e5]/40"
          >
            <div class="flex flex-col items-center py-6">
              <i
                class="i-carbon-cloud-upload text-[48px] mb-4 text-white/30"
              ></i>
              <div class="text-sm text-white/65">
                Drop file here or
                <span class="text-[#18d2e5]">click to upload</span>
              </div>
            </div>
          </n-upload-dragger>
        </n-upload>

        <div class="mt-4 text-xs text-white/30">
          支持 mp3/wav/m4a/aac 格式，单个文件50MB以内
        </div>
      </div>

      <div class="flex justify-end">
        <n-button
          class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-sm !text-white/80 hover:!bg-[#323437]"
          @click="showBgmModal = false"
        >
          关闭
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
<style lang="scss" scoped>
.set-scrollbar {
  scrollbar-color: #494949 #2a2a2a; /* 滑块颜色 轨道颜色 */
}

.title-style-card {
  display: flex;
  height: 78px;
  align-items: center;
  justify-content: center;
  border: 1px solid #3d3d3d;
  border-radius: 4px;
  background: #181818;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  font-weight: 700;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.title-style-card:hover,
.title-style-card.is-active {
  border-color: #65cfd5;
  background: #202020;
}

.title-preview-canvas {
  width: 440px;
  height: 582px;
}

.preview-draggable-title {
  position: absolute;
  z-index: 2;
  max-width: 82%;
  cursor: move;
  user-select: none;
  white-space: nowrap;
  font-weight: 800;
  line-height: 1;
}

.preview-draggable-title.is-editing::after {
  position: absolute;
  inset: -6px;
  border: 1px dashed rgba(101, 207, 213, 0.8);
  border-radius: 4px;
  content: '';
  pointer-events: none;
}

.preview-title--default {
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.65);
}

.preview-title--black {
  color: #050505;
}

.preview-title--white-outline {
  color: #fff;
  text-shadow:
    1px 0 #111,
    -1px 0 #111,
    0 1px #111,
    0 -1px #111;
}

.preview-title--orange-outline {
  color: #ff4a2d;
  text-shadow:
    1px 0 #ffd25a,
    -1px 0 #ffd25a,
    0 1px #ffd25a,
    0 -1px #ffd25a;
}

.preview-title--flame {
  color: #ffd255;
  text-shadow:
    1px 1px #ff3d24,
    2px 2px #8b130c;
}

.preview-title--red-bold {
  color: #ff3a2e;
  text-shadow:
    1px 0 #111,
    -1px 0 #111,
    0 1px #111,
    0 -1px #111;
}

.preview-title--black-outline {
  color: #111;
  text-shadow:
    1px 0 #fff,
    -1px 0 #fff,
    0 1px #fff,
    0 -1px #fff;
}

.preview-title--shadow {
  color: #050505;
  text-shadow:
    2px 2px rgba(255, 255, 255, 0.22),
    3px 3px rgba(0, 0, 0, 0.4);
}

.preview-title--yellow-outline {
  color: #ffe55c;
  text-shadow:
    1px 0 #5f3a00,
    -1px 0 #5f3a00,
    0 1px #5f3a00,
    0 -1px #5f3a00;
}

.preview-title--blue-outline {
  color: #fff;
  text-shadow:
    1px 0 #6ea9ff,
    -1px 0 #6ea9ff,
    0 1px #6ea9ff,
    0 -1px #6ea9ff;
}

.preview-title--green-outline {
  color: #d6ff3f;
  text-shadow:
    1px 0 #0f6e20,
    -1px 0 #0f6e20,
    0 1px #0f6e20,
    0 -1px #0f6e20;
}

.preview-title--deep-red {
  color: #e94439;
  text-shadow:
    1px 0 #72130d,
    -1px 0 #72130d,
    0 1px #72130d,
    0 -1px #72130d;
}

.title-preview-slide-enter-active,
.title-preview-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.title-preview-slide-enter-from,
.title-preview-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
