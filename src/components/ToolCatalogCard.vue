<script setup>
import { NCard, NIcon } from 'naive-ui'
import { Currency } from '@vicons/carbon'

const props = defineProps({
  tool: {
    type: Object,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function emitClick() {
  emit('click', props.tool)
}

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

function handleKeydown(event) {
  if (!props.clickable) return
  if (event.key !== 'Enter' && event.key !== ' ') return

  event.preventDefault()
  emitClick()
}
</script>

<template>
  <div
    class="tool-catalog-card group"
    :class="clickable ? 'cursor-pointer' : 'cursor-default'"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @pointerenter="handleCardPointerEnter"
    @pointermove="handleCardPointerMove"
    @pointerleave="handleCardPointerLeave"
    @pointerdown="handleCardPointerPress"
    @pointerup="handleCardPointerRelease"
    @pointercancel="handleCardPointerLeave"
    @click="emitClick"
    @keydown="handleKeydown"
  >
    <div class="tool-catalog-card__tilt">
      <n-card
        class="tool-catalog-card__surface overflow-hidden rounded-xl border border-[#35353b] !bg-[#2b2c32] transition-colors duration-300 group-hover:!bg-[#30323a]"
        :bordered="false"
        size="small"
        :content-style="{ padding: '0' }"
      >
        <div
          class="tool-catalog-card__media relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#23242a]"
        >
          <img
            :src="tool.previewImage"
            :alt="tool.title"
            class="tool-catalog-card__image h-full w-full object-cover"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/6"
          />
        </div>
        <div
          class="tool-catalog-card__body bg-[#2b2c32] p-3.5 transition-colors duration-300 group-hover:bg-[#30323a]"
        >
          <div class="mb-2 flex items-start justify-between gap-2">
            <span class="text-[15px] leading-snug font-medium text-white">
              <span class="tabular-nums font-normal text-gray-400">{{
                tool.id
              }}</span>
              {{ ' ' }}
              {{ tool.title }}
            </span>
            <span
              class="flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums text-amber-400/95"
            >
              <n-icon :size="16" :component="Currency" />
              {{ tool.cost }}
            </span>
          </div>
          <p class="m-0 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {{ tool.description }}
          </p>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.tool-catalog-card {
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

.tool-catalog-card__tilt {
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

.tool-catalog-card.is-hovered .tool-catalog-card__tilt {
  filter: brightness(1.05) saturate(1.06);
}

.tool-catalog-card__surface {
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

.tool-catalog-card__surface::before {
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

.tool-catalog-card__surface::after {
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

.tool-catalog-card.is-hovered .tool-catalog-card__surface {
  border-color: #464751;
}

.tool-catalog-card.is-hovered .tool-catalog-card__surface::before,
.tool-catalog-card.is-hovered .tool-catalog-card__surface::after {
  opacity: 1;
}

.tool-catalog-card__media,
.tool-catalog-card__body,
.tool-catalog-card__surface :deep(.n-card__content) {
  transform-style: preserve-3d;
}

.tool-catalog-card__media {
  transform: translateZ(34px);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tool-catalog-card__body {
  position: relative;
  z-index: 1;
  transform: translateZ(52px);
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 280ms ease;
}

.tool-catalog-card.is-hovered .tool-catalog-card__media {
  transform: translateZ(48px);
}

.tool-catalog-card.is-hovered .tool-catalog-card__body {
  transform: translateZ(70px);
}

.tool-catalog-card__image {
  transform: translate3d(var(--card-media-shift-x), var(--card-media-shift-y), 0)
    scale(1.02);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.tool-catalog-card.is-hovered .tool-catalog-card__image {
  transform: translate3d(var(--card-media-shift-x), var(--card-media-shift-y), 0)
    scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .tool-catalog-card__tilt,
  .tool-catalog-card__surface,
  .tool-catalog-card__media,
  .tool-catalog-card__body,
  .tool-catalog-card__image,
  .tool-catalog-card__surface::before,
  .tool-catalog-card__surface::after {
    transition: none;
  }
}
</style>
