<script setup>
import { computed, ref } from 'vue'
import { NButton, NCheckbox, NIcon } from 'naive-ui'
import { CloudUpload, Currency, Information } from '@vicons/carbon'

const selectedVideo = ref(2)
const selectedAvatars = ref([0])

const videoItems = [
  { label: '上传', type: 'upload' },
  { label: '模版一', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' },
  { label: '模版二', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80' },
  { label: '模版三', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { label: '模版四', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80' },
  { label: '模版五', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
  { label: '模版六', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { label: '模版七', image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80' },
  { label: '模版八', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { label: '模版九', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十一', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十二', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十三', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十四', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' },
  { label: '模版十五', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80' },
]

const avatarItems = [
  { label: '人物一', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' },
  { label: '人物二', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' },
  { label: '人物三', image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=240&q=80' },
  { label: '人物四', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80' },
  { label: '人物五', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=80' },
  { label: '人物六', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=240&q=80' },
  { label: '人物七', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=240&q=80' },
  { label: '人物八', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=240&q=80' },
  { label: '人物九', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80' },
  { label: '人物十', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=240&q=80' },
]

const selectedAvatarCount = computed(() => selectedAvatars.value.length)

function toggleAvatar(index) {
  if (selectedAvatars.value.includes(index)) {
    selectedAvatars.value = selectedAvatars.value.filter((item) => item !== index)
    return
  }
  selectedAvatars.value = [...selectedAvatars.value, index]
}
</script>

<template>
  <div class="min-h-[500px] h-screen bg-[#060709] p-[20px] text-white">
    <div class=" w-full flex gap-x-[15px]  h-full overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
        <div class="flex-1 overflow-hidden border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            视频模板（已选：1个）
          </div>
          <n-scrollbar class="pb-[40px]">
            <div class="grid grid-cols-3 gap-2 p-3 md:grid-cols-4 sm:grid-cols-6">
              <button
                v-for="(item, index) in videoItems"
                :key="item.label + index"
                type="button"
                class="group relative aspect-[3/4.25] overflow-hidden rounded-[4px] border bg-[#131416] text-left transition-colors"
                :class="selectedVideo === index ? 'border-[#38cfe0] shadow-[0_0_0_1px_rgba(56,207,224,0.35)]' : 'border-white/6'"
                @click="selectedVideo = index"
              >
                <div class="absolute left-2 top-2 z-10">
                  <n-checkbox :checked="selectedVideo === index" />
                </div>
                <template v-if="item.type === 'upload'">
                  <div class="flex h-full flex-col items-center justify-center bg-black text-center">
                    <n-icon :size="28" :component="CloudUpload" class="text-white/55" />
                    <div class="mt-3 text-[11px] text-white/28">上传</div>
                  </div>
                </template>
                <template v-else>
                  <img
                    :src="item.image"
                    :alt="item.label"
                    class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-104"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                  />
                  <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.36)_100%)]" />
                  <div class="absolute bottom-2 left-2 text-[10px] text-white/76">{{ item.label }}</div>
                </template>
              </button>
            </div>
          </n-scrollbar>
        </div>

        <section class="grid  min-h-0 w-[500px] grid-rows-[auto_1fr_120px] grid-cols-1 bg-[#232323]">
          <div class="border-b h-full border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            人像及其他参数设置（已选：{{ selectedAvatarCount }}个）
          </div>
          <n-scrollbar class="h-full">
            <div class="grid grid-cols-4 gap-2 p-3">
              <button
                v-for="(item, index) in avatarItems"
                :key="item.label"
                type="button"
                class="group relative aspect-[1/1.15] overflow-hidden rounded-[4px] border bg-[#131416] text-left transition-colors"
                :class="selectedAvatars.includes(index) ? 'border-[#38cfe0] shadow-[0_0_0_1px_rgba(56,207,224,0.35)]' : 'border-white/6'"
                @click="toggleAvatar(index)"
              >
                <div class="absolute left-2 top-2 z-10">
                  <n-checkbox :checked="selectedAvatars.includes(index)" />
                </div>
                <img
                  :src="item.image"
                  :alt="item.label"
                  class="h-full w-full object-cover opacity-64 transition-transform duration-500 group-hover:scale-104"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
                <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.38)_100%)]" />
                <div class="absolute bottom-2 left-2 text-[10px] text-white/76">{{ item.label }}</div>
              </button>
            </div>
          </n-scrollbar>

          <div class="mt-auto h-full border-t border-white/8 px-3 py-4 text-[11px] text-white/48">
            <div class="text-[12px] font-medium text-[#f4b13d]">
              总数量：{{ selectedAvatarCount }}
              <span class="text-white/42">（模板数量 x 人像数量）</span>
            </div>

            <div class="mt-3 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">50</span>
              <button
                type="button"
                class="ml-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full text-white/34 transition-colors hover:text-white/58"
              >
                <n-icon :size="12" :component="Information" />
              </button>
            </div>

            <div class="pt-4 flex justify-end">
              <n-button
                type="warning"
                size="small"
                class="!h-[28px] !px-3 !rounded-[4px] !text-[12px]"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>
    </div>
  </div>
</template>
