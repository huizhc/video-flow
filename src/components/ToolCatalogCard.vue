<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  entranceEnabled: {
    type: Boolean,
    default: false,
  },
  entranceDelay: {
    type: Number,
    default: 0,
  },
  entranceKey: {
    type: [String, Number],
    default: 0,
  },
})

const emit = defineEmits(['click'])
const cardRef = ref(null)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const entranceKeyframes = [
  { progress: 0, x: 0.18, y: 0.24, intensity: 0.58 },
  { progress: 0.26, x: 0.34, y: 0.26, intensity: 1 },
  { progress: 0.72, x: 0.84, y: 0.7, intensity: 1 },
  { progress: 1, x: 0.5, y: 0.5, intensity: 0 },
]

let entranceTimerId = 0
let entranceFrameId = 0

function emitClick() {
  emit('click', props.tool)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function lerp(start, end, amount) {
  return start + (end - start) * amount
}

function easeInOutSine(value) {
  return -(Math.cos(Math.PI * value) - 1) / 2
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3
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

function setCardEntranceState(scene, progress) {
  const clampedProgress = clamp(progress, 0, 1)
  const translateY = (1 - clampedProgress) * 34
  const scale = 0.952 + clampedProgress * 0.048

  scene.style.setProperty('--card-enter-opacity', clampedProgress.toFixed(3))
  scene.style.setProperty('--card-enter-y', `${translateY.toFixed(2)}px`)
  scene.style.setProperty('--card-enter-scale', scale.toFixed(4))
}

function resetCardEntranceState(scene) {
  scene.style.setProperty('--card-enter-opacity', '1')
  scene.style.setProperty('--card-enter-y', '0px')
  scene.style.setProperty('--card-enter-scale', '1')
}

function shouldSkipPointerEffect(event) {
  return prefersReducedMotion || event.pointerType === 'touch'
}

function applyCardScene(scene, x, y, intensity = 1) {
  const clampedX = clamp(x, 0, 1)
  const clampedY = clamp(y, 0, 1)
  const clampedIntensity = clamp(intensity, 0, 1)
  const offsetX = clampedX - 0.5
  const offsetY = clampedY - 0.5
  const scaledOffsetX = offsetX * clampedIntensity
  const scaledOffsetY = offsetY * clampedIntensity
  const distance = Math.min(Math.hypot(offsetX, offsetY) / 0.7071, 1)
  const centerPull = 1 - distance

  const rotateX = -scaledOffsetY * 10
  const rotateY = scaledOffsetX * 10
  const rotateZ = scaledOffsetX * scaledOffsetY * -5
  const shiftX = scaledOffsetX * 8
  const shiftY = scaledOffsetY * 6
  const depth = lerp(0, -26 - centerPull * 10, clampedIntensity)
  const shadowX = lerp(0, -offsetX * 24, clampedIntensity)
  const shadowY = lerp(
    18,
    30 + Math.abs(offsetY) * 12 + centerPull * 8,
    clampedIntensity
  )
  const shadowBlur = lerp(38, 52 + centerPull * 12, clampedIntensity)
  const mediaShiftX = lerp(0, -offsetX * 14, clampedIntensity)
  const mediaShiftY = lerp(0, -offsetY * 10, clampedIntensity)

  if (clampedIntensity > 0.01) {
    scene.classList.add('is-hovered')
  } else {
    scene.classList.remove('is-hovered')
  }

  scene.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`)
  scene.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`)
  scene.style.setProperty('--card-rotate-z', `${rotateZ.toFixed(2)}deg`)
  scene.style.setProperty('--card-shift-x', `${shiftX.toFixed(2)}px`)
  scene.style.setProperty('--card-shift-y', `${shiftY.toFixed(2)}px`)
  scene.style.setProperty('--card-depth', `${depth.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-x', `${shadowX.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-y', `${shadowY.toFixed(2)}px`)
  scene.style.setProperty('--card-shadow-blur', `${shadowBlur.toFixed(2)}px`)
  scene.style.setProperty('--card-glow-x', `${(clampedX * 100).toFixed(2)}%`)
  scene.style.setProperty('--card-glow-y', `${(clampedY * 100).toFixed(2)}%`)
  scene.style.setProperty('--card-media-shift-x', `${mediaShiftX.toFixed(2)}px`)
  scene.style.setProperty('--card-media-shift-y', `${mediaShiftY.toFixed(2)}px`)
}

function applyCardPointerEffect(scene, clientX, clientY) {
  const rect = scene.getBoundingClientRect()
  const x =
    clientX === undefined
      ? 0.5
      : clamp((clientX - rect.left) / rect.width, 0, 1)
  const y =
    clientY === undefined
      ? 0.5
      : clamp((clientY - rect.top) / rect.height, 0, 1)

  applyCardScene(scene, x, y, 1.24)
}

function clearEntranceAnimation() {
  if (entranceTimerId) {
    window.clearTimeout(entranceTimerId)
    entranceTimerId = 0
  }

  if (entranceFrameId) {
    window.cancelAnimationFrame(entranceFrameId)
    entranceFrameId = 0
  }
}

function cancelEntranceAnimation(scene) {
  clearEntranceAnimation()
  scene.classList.remove('is-entering')
  resetCardEntranceState(scene)
}

function sampleEntranceFrame(progress) {
  const easedProgress = easeInOutSine(clamp(progress, 0, 1))

  for (let index = 1; index < entranceKeyframes.length; index += 1) {
    const previous = entranceKeyframes[index - 1]
    const current = entranceKeyframes[index]

    if (easedProgress <= current.progress) {
      const range = current.progress - previous.progress || 1
      const localProgress = (easedProgress - previous.progress) / range
      return {
        x: lerp(previous.x, current.x, localProgress),
        y: lerp(previous.y, current.y, localProgress),
        intensity: lerp(previous.intensity, current.intensity, localProgress),
      }
    }
  }

  return entranceKeyframes[entranceKeyframes.length - 1]
}

function startEntranceAnimation() {
  if (
    typeof window === 'undefined' ||
    prefersReducedMotion ||
    !props.entranceEnabled
  ) {
    return
  }

  const scene = cardRef.value
  if (!(scene instanceof HTMLElement)) return

  clearEntranceAnimation()
  scene.classList.remove('is-hovered')
  scene.classList.remove('is-pressed')
  scene.classList.add('is-entering')
  resetCardScene(scene)
  setCardEntranceState(scene, 0)

  const duration = 980
  const delay = Math.max(props.entranceDelay, 0)

  entranceTimerId = window.setTimeout(() => {
    let startTime = 0

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = clamp((timestamp - startTime) / duration, 0, 1)
      const revealProgress = progress < 0.58 ? easeOutCubic(progress / 0.58) : 1
      const frame = sampleEntranceFrame(progress)

      setCardEntranceState(scene, revealProgress)
      applyCardScene(scene, frame.x, frame.y, frame.intensity)

      if (progress < 1) {
        entranceFrameId = window.requestAnimationFrame(step)
        return
      }

      scene.classList.remove('is-entering')
      scene.classList.remove('is-hovered')
      scene.classList.remove('is-pressed')
      resetCardScene(scene)
      resetCardEntranceState(scene)
      entranceFrameId = 0
    }

    entranceFrameId = window.requestAnimationFrame(step)
    entranceTimerId = 0
  }, delay)
}

function handleCardPointerEnter(event) {
  if (shouldSkipPointerEffect(event)) return
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  cancelEntranceAnimation(scene)
  applyCardPointerEffect(scene, event.clientX, event.clientY)
}

function handleCardPointerMove(event) {
  if (shouldSkipPointerEffect(event)) return
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  cancelEntranceAnimation(scene)
  applyCardPointerEffect(scene, event.clientX, event.clientY)
}

function handleCardPointerLeave(event) {
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  cancelEntranceAnimation(scene)
  scene.classList.remove('is-hovered')
  scene.classList.remove('is-pressed')
  resetCardScene(scene)
}

function handleCardPointerPress(event) {
  if (shouldSkipPointerEffect(event)) return
  const scene = event.currentTarget
  if (!(scene instanceof HTMLElement)) return

  cancelEntranceAnimation(scene)
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

onMounted(() => {
  startEntranceAnimation()
})

watch(
  () => props.entranceKey,
  async () => {
    if (!props.entranceEnabled) return
    await nextTick()
    startEntranceAnimation()
  }
)

watch(
  () => props.entranceEnabled,
  async (enabled) => {
    const scene = cardRef.value
    if (!(scene instanceof HTMLElement)) return

    if (!enabled) {
      cancelEntranceAnimation(scene)
      scene.classList.remove('is-hovered')
      scene.classList.remove('is-pressed')
      resetCardScene(scene)
      return
    }

    await nextTick()
    startEntranceAnimation()
  }
)

onBeforeUnmount(() => {
  clearEntranceAnimation()
})
</script>

<template>
  <div
    ref="cardRef"
    class="tool-catalog-card group"
    :class="[
      clickable ? 'cursor-pointer' : 'cursor-default',
      entranceEnabled && !prefersReducedMotion
        ? 'tool-catalog-card--with-entrance'
        : '',
    ]"
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
            <span
              class="text-[12px] leading-snug font-medium text-white min-[1700px]:text-[16px]"
            >
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
          <p
            class="m-0 line-clamp-2 h-[calc(12*1.75*2px)] text-xs leading-relaxed text-gray-500"
          >
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
  opacity: var(--card-enter-opacity);
  transform: translate3d(0, var(--card-enter-y), 0)
    scale(var(--card-enter-scale));
  will-change: transform, opacity;
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
  --card-enter-opacity: 1;
  --card-enter-y: 0px;
  --card-enter-scale: 1;
}

.tool-catalog-card--with-entrance {
  --card-enter-opacity: 0;
  --card-enter-y: 34px;
  --card-enter-scale: 0.952;
}

.tool-catalog-card__tilt {
  transform-style: preserve-3d;
  transform: translate3d(
      var(--card-shift-x),
      var(--card-shift-y),
      calc(var(--card-depth) + var(--card-press-depth))
    )
    rotateX(var(--card-rotate-x)) rotateY(var(--card-rotate-y))
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
  background: radial-gradient(
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
  background: linear-gradient(
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
  background-color: #30323a !important;
}

.tool-catalog-card.is-hovered .tool-catalog-card__surface::before,
.tool-catalog-card.is-hovered .tool-catalog-card__surface::after {
  opacity: 1;
}

.tool-catalog-card.is-entering .tool-catalog-card__surface::before,
.tool-catalog-card.is-entering .tool-catalog-card__surface::after {
  opacity: 0;
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
  transform: translateZ(62px);
}

.tool-catalog-card.is-hovered .tool-catalog-card__body {
  transform: translateZ(92px);
  background-color: #30323a;
}

.tool-catalog-card__image {
  transform: translate3d(
      var(--card-media-shift-x),
      var(--card-media-shift-y),
      0
    )
    scale(1.02);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.tool-catalog-card.is-hovered .tool-catalog-card__image {
  transform: translate3d(
      var(--card-media-shift-x),
      var(--card-media-shift-y),
      0
    )
    scale(1.12);
}

.tool-catalog-card.is-entering .tool-catalog-card__image,
.tool-catalog-card.is-entering.is-hovered .tool-catalog-card__image {
  transform: translate3d(
      var(--card-media-shift-x),
      var(--card-media-shift-y),
      0
    )
    scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  .tool-catalog-card,
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
