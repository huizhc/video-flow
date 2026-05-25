<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NEmpty, NIcon } from 'naive-ui'
import { Currency } from '@vicons/carbon'
import { categoryTitles, toolsCatalog } from '@/data/toolsCatalog'

const route = useRoute()
const router = useRouter()

const filter = computed(() => route.meta.toolFilter ?? 'all')

const pageTitle = computed(() => categoryTitles[filter.value] ?? '工具')

const clickableToolIds = new Set([
  '02',
  '03',
  '04',
  '06',
  '07',
  '08',
  '09',
  '11',
  '12',
  '15',
  '16',
  '17',
  '18',
  '19',
  '62',
  '81',
  '90',
])

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const list = computed(() => {
  const f = filter.value
  if (f === 'all') return toolsCatalog
  return toolsCatalog.filter((t) => t.categories.includes(f))
})

function resetCardScene(scene) {
  scene.style.setProperty('--card-rotate-x', '0deg')
  scene.style.setProperty('--card-rotate-y', '0deg')
  scene.style.setProperty('--card-rotate-z', '0deg')
  scene.style.setProperty('--card-shift-x', '0px')
  scene.style.setProperty('--card-shift-y', '0px')
  scene.style.setProperty('--card-depth', '0px')
  scene.style.setProperty('--card-press-depth', '0px')
  scene.style.setProperty('--card-shadow-x', '0px')
  scene.style.setProperty('--card-shadow-y', '18px')
  scene.style.setProperty('--card-shadow-blur', '38px')
  scene.style.setProperty('--card-glow-x', '50%')
  scene.style.setProperty('--card-glow-y', '50%')
  scene.style.setProperty('--card-media-shift-x', '0px')
  scene.style.setProperty('--card-media-shift-y', '0px')
}

function shouldSkipPointerEffect(event) {
  return prefersReducedMotion || event.pointerType === 'touch'
}

function applyCardPointerEffect(scene, clientX, clientY) {
  const rect = scene.getBoundingClientRect()
  const x =
    clientX === undefined
      ? 0.5
      : Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
  const y =
    clientY === undefined
      ? 0.5
      : Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1)
  const offsetX = x - 0.5
  const offsetY = y - 0.5
  const distance = Math.min(Math.hypot(offsetX, offsetY) / 0.7071, 1)
  const centerPull = 1 - distance

  const rotateX = -offsetY * 10
  const rotateY = offsetX * 10
  const rotateZ = offsetX * offsetY * -5
  const shiftX = offsetX * 8
  const shiftY = offsetY * 6
  const depth = -26 - centerPull * 10
  const shadowX = -offsetX * 24
  const shadowY = 30 + Math.abs(offsetY) * 12 + centerPull * 8
  const shadowBlur = 52 + centerPull * 12
  const mediaShiftX = -offsetX * 14
  const mediaShiftY = -offsetY * 10

  scene.classList.add('is-hovered')
  scene.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`)
  scene.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`)
  scene.style.setProperty('--card-rotate-z', `${rotateZ.toFixed(2)}deg`)
  scene.style.setProperty('--card-shift-x', `${shiftX.toFixed(2)}px`)
  scene.style.setProperty('--card-shift-y', `${shiftY.toFixed(2)}px`)
  scene.style.setProperty('--card-depth', `${depth.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-x', `${shadowX.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-y', `${shadowY.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-blur', `${shadowBlur.toFixed(2)}px`)
  scene.style.setProperty('--card-glow-x', `${(x * 100).toFixed(2)}%`)
  scene.style.setProperty('--card-glow-y', `${(y * 100).toFixed(2)}%`)
  scene.style.setProperty('--card-media-shift-x', `${mediaShiftX.toFixed(2)}px`)
  scene.style.setProperty('--card-media-shift-y', `${mediaShiftY.toFixed(2)}px`)
}

function handleCardPointerEnter(event) {
  if (shouldSkipPointerEffect(event)) return
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return
  applyCardPointerEffect(scene, event.clientX, event.clientY)
}

function handleCardPointerMove(event) {
  if (shouldSkipPointerEffect(event)) return

  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  applyCardPointerEffect(scene, event.clientX, event.clientY)
}

function handleCardPointerLeave(event) {
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  scene.classList.remove('is-hovered')
  scene.classList.remove('is-pressed')
  resetCardScene(scene)
}

function handleCardPointerPress(event) {
  if (shouldSkipPointerEffect(event)) return
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  scene.classList.add('is-pressed')
  scene.style.setProperty('--card-press-depth', '-12px')
}

function handleCardPointerRelease(event) {
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  scene.classList.remove('is-pressed')
  scene.style.setProperty('--card-press-depth', '0px')
}

function openToolDetail(tool) {
  const detailRouteNameById = {
    '02': 'tool-remove-watermark',
    '03': 'tool-video-translate-voice',
    '04': 'tool-speech-subtitle',
    '06': 'tool-general-translate',
    '07': 'tool-batch-video-mix',
    '08': 'tool-script-shot-analysis',
    '09': 'tool-text-to-speech',
    11: 'tool-audio-driven-avatar',
    12: 'tool-script-driven-avatar',
    15: 'tool-text-to-video-toolkit',
    16: 'tool-voice-clone-audio',
    17: 'tool-nurture-video',
    18: 'tool-seedance-video',
    19: 'tool-veo31-video',
    62: 'tool-quick-split-video',
    81: 'tool-video-script-writer',
    90: 'tool-title-and-script-copy',
  }
  const detailRouteName = detailRouteNameById[tool.id]
  if (!detailRouteName) return
  const href = router.resolve({ name: detailRouteName }).href
  window.open(href, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="h-full flex flex-col bg-[#1a1b20]">
    <!-- <div class="mb-5 px-4">
      <h1 class="text-xl font-semibold text-white m-0 tracking-tight">
        {{ pageTitle }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 m-0">共 {{ list.length }} 个工具</p>
    </div> -->
    <n-scrollbar class="flex-1">
      <n-empty
        v-if="list.length === 0"
        description="该分类下暂无工具"
        class="py-20"
      />

      <div
        v-else
        class="grid px-4 py-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      >
        <div
          v-for="tool in list"
          :key="tool.id + tool.title"
          class="catalog-card-scene group"
          :class="
            clickableToolIds.has(String(tool.id))
              ? 'cursor-pointer'
              : 'cursor-default'
          "
          @pointerenter="handleCardPointerEnter"
          @pointermove="handleCardPointerMove"
          @pointerleave="handleCardPointerLeave"
          @pointerdown="handleCardPointerPress"
          @pointerup="handleCardPointerRelease"
          @pointercancel="handleCardPointerLeave"
          @click="openToolDetail(tool)"
        >
          <div class="catalog-card-tilt">
            <n-card
              class="catalog-card overflow-hidden rounded-xl border border-[#35353b] !bg-[#2b2c32] transition-colors duration-300 group-hover:!bg-[#30323a]"
              :bordered="false"
              size="small"
              :content-style="{ padding: '0' }"
            >
              <div
                class="catalog-card-media relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#23242a]"
              >
                <img
                  :src="tool.previewImage"
                  :alt="tool.title"
                  class="catalog-card-image h-full w-full object-cover"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/6"
                />
              </div>
              <div
                class="catalog-card-body bg-[#2b2c32] p-3.5 transition-colors duration-300 group-hover:bg-[#30323a]"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span class="text-[15px] font-medium text-white leading-snug">
                    <span class="text-gray-400 font-normal tabular-nums">{{
                      tool.id
                    }}</span>
                    {{ ' ' }}
                    {{ tool.title }}
                  </span>
                  <span
                    class="flex items-center gap-1 text-amber-400/95 shrink-0 text-sm font-medium tabular-nums"
                  >
                    <n-icon :size="16" :component="Currency" />
                    {{ tool.cost }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 m-0 leading-relaxed line-clamp-2">
                  {{ tool.description }}
                </p>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.catalog-card-scene {
  perspective: 1400px;
  transform-style: preserve-3d;
  --card-rotate-x: 0deg;
  --card-rotate-y: 0deg;
  --card-rotate-z: 0deg;
  --card-shift-x: 0px;
  --card-shift-y: 0px;
  --card-depth: 0px;
  --card-press-depth: 0px;
  --card-shadow-x: 0px;
  --card-shadow-y: 18px;
  --card-shadow-blur: 38px;
  --card-glow-x: 50%;
  --card-glow-y: 50%;
  --card-media-shift-x: 0px;
  --card-media-shift-y: 0px;
}

.catalog-card-tilt {
  transform-style: preserve-3d;
  transform:
    translate3d(
      var(--card-shift-x),
      var(--card-shift-y),
      calc(var(--card-depth) + var(--card-press-depth))
    )
    rotateX(var(--card-rotate-x))
    rotateY(var(--card-rotate-y))
    rotateZ(var(--card-rotate-z));
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 320ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, filter;
}

.catalog-card-scene.is-hovered .catalog-card-tilt {
  filter: brightness(1.05) saturate(1.06);
}

.catalog-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  box-shadow:
    var(--card-shadow-x) var(--card-shadow-y) var(--card-shadow-blur)
      rgba(0, 0, 0, 0.44),
    0 0 0 1px rgba(255, 255, 255, 0.025),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition:
    box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 280ms ease,
    background-color 280ms ease;
}

.catalog-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(
      circle at var(--card-glow-x) var(--card-glow-y),
      rgba(255, 255, 255, 0.22) 0,
      rgba(255, 255, 255, 0.08) 22%,
      rgba(255, 255, 255, 0.02) 34%,
      transparent 60%
    );
  mix-blend-mode: screen;
  transition: opacity 220ms ease;
}

.catalog-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.04) 18%,
      transparent 42%,
      rgba(255, 255, 255, 0.05) 100%
    );
  transition: opacity 220ms ease;
}

.catalog-card-scene.is-hovered .catalog-card {
  border-color: #464751;
}

.catalog-card-scene.is-hovered .catalog-card::before,
.catalog-card-scene.is-hovered .catalog-card::after {
  opacity: 1;
}

.catalog-card-media,
.catalog-card-body,
.catalog-card :deep(.n-card__content) {
  transform-style: preserve-3d;
}

.catalog-card-media {
  transform: translateZ(34px);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.catalog-card-body {
  position: relative;
  z-index: 1;
  transform: translateZ(52px);
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 280ms ease;
}

.catalog-card-scene.is-hovered .catalog-card-media {
  transform: translateZ(48px);
}

.catalog-card-scene.is-hovered .catalog-card-body {
  transform: translateZ(70px);
}

.catalog-card-image {
  transform: translate3d(var(--card-media-shift-x), var(--card-media-shift-y), 0)
    scale(1.02);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.catalog-card-scene.is-hovered .catalog-card-image {
  transform: translate3d(var(--card-media-shift-x), var(--card-media-shift-y), 0)
    scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .catalog-card-tilt,
  .catalog-card,
  .catalog-card-media,
  .catalog-card-body,
  .catalog-card-image,
  .catalog-card::before,
  .catalog-card::after {
    transition: none;
  }
}
</style>
