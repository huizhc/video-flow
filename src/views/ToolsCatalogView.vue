<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NEmpty } from 'naive-ui'
import ToolCatalogCard from '@/components/ToolCatalogCard.vue'
import { toolsCatalog } from '@/data/toolsCatalog'

const route = useRoute()
const router = useRouter()

const filter = computed(() => route.meta.toolFilter ?? 'all')
const entranceSeed = ref(0)

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

const list = computed(() => {
  const f = filter.value
  if (f === 'all') return toolsCatalog
  return toolsCatalog.filter((t) => t.categories.includes(f))
})

watch(
  filter,
  () => {
    entranceSeed.value += 1
  },
  { immediate: true }
)

function getEntranceDelay(index) {
  const parityGroupDelay = index % 2 === 0 ? 0 : 140
  const batchIndex = Math.floor(index / 2)

  return parityGroupDelay + Math.min(batchIndex * 52, 208)
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
  router.push({ name: detailRouteName })
  // const href = router.resolve({ name: detailRouteName }).href
  // window.open(href, '_blank', 'noopener,noreferrer')
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
        class="grid px-4 py-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
      >
        <ToolCatalogCard
          v-for="(tool, index) in list"
          :key="`${entranceSeed}-${tool.id}-${tool.title}`"
          :tool="tool"
          :clickable="clickableToolIds.has(String(tool.id))"
          :entrance-enabled="true"
          :entrance-delay="getEntranceDelay(index)"
          :entrance-key="`${entranceSeed}-${tool.id}`"
          @click="openToolDetail"
        />
      </div>
    </n-scrollbar>
  </div>
</template>
