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

const list = computed(() => {
  const f = filter.value
  if (f === 'all') return toolsCatalog
  return toolsCatalog.filter((t) => t.categories.includes(f))
})

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
  <div class="p-4 min-h-full">
    <div class="mb-5">
      <h1 class="text-xl font-semibold text-white m-0 tracking-tight">
        {{ pageTitle }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 m-0">共 {{ list.length }} 个工具</p>
    </div>

    <n-empty
      v-if="list.length === 0"
      description="该分类下暂无工具"
      class="py-20"
    />

    <div
      v-else
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      <n-card
        v-for="tool in list"
        :key="tool.id + tool.title"
        class="group !bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        :class="
          [
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
          ].includes(tool.id)
            ? 'cursor-pointer'
            : 'cursor-default'
        "
        :bordered="false"
        size="small"
        :content-style="{ padding: '0' }"
        @click="openToolDetail(tool)"
      >
        <div
          class="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#151515]"
        >
          <img
            :src="tool.previewImage"
            :alt="tool.title"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/6"
          />
        </div>
        <div class="p-3.5">
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
</template>
