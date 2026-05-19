<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NRadio, NRadioGroup } from 'naive-ui'
import { Currency } from '@vicons/carbon'
import UploadArea from '@/components/UploadArea.vue'

const imageSource = ref('local')
const audioSource = ref('local')
const resolution = ref('480p')
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#060709] p-[20px] text-white">
    <div class="flex h-full overflow-hidden border border-white/8 bg-[#0b0d10]">
      <div class="flex w-full grid-cols-1 gap-x-[15px]">
        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r min-w-[400px]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            照片数字人
          </div>
          <div class="px-3 py-3">
            <UploadArea accept="image/*" description="JPG、PNG、JPEG、WEBP文件，30Mb以内" />
          </div>
        </section>

        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r min-w-[400px]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            口播语音
          </div>
          <div class="px-3 py-3 text-sm text-white/48">
            <div class="mb-4 flex items-center gap-3">
              <span class="shrink-0">视频分辨率:</span>
              <div
                class="inline-flex overflow-hidden rounded-[2px] border border-white/10 bg-[#16181a]"
              >
                <button
                  type="button"
                  class="h-[24px] min-w-[48px] border-0 px-3 text-sm transition-colors"
                  :class="
                    resolution === '480p'
                      ? 'bg-[#18d2e5] text-white'
                      : 'bg-transparent text-white/56'
                  "
                  @click="resolution = '480p'"
                >
                  480P
                </button>
                <button
                  type="button"
                  class="h-[24px] min-w-[48px] border-0 px-3 text-sm transition-colors"
                  :class="
                    resolution === '720p'
                      ? 'bg-[#18d2e5] text-white'
                      : 'bg-transparent text-white/56'
                  "
                  @click="resolution = '720p'"
                >
                  720P
                </button>
              </div>
            </div>

            <UploadArea accept="audio/*" description="mp3/wav/flac 文件，30Mb以内" />

            <div class="mt-4 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">1680</span>
            </div>

            <div class="pt-4 flex justify-end">
              <n-button
                type="warning"
                size="small"
                class="!h-[28px] !px-3 !rounded-[4px] !text-sm"
              >
                后台执行
              </n-button>
            </div>
          </div>
        </section>

        <section class="relative flex min-h-[320px] flex-col min-w-[400px]">
          <div class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="relative h-[120px] w-[120px]">
                <div
                  class="absolute left-[16px] top-[18px] h-[72px] w-[72px] rounded-full border-[12px] border-[#0b2347] border-r-transparent border-t-[#12315f]"
                />
                <div
                  class="absolute left-[36px] top-[38px] h-[42px] w-[42px] rounded-full bg-[#1f6f5d]"
                />
                <div
                  class="absolute left-[82px] top-[26px] h-[22px] w-[22px] rounded-full bg-[#26735c]"
                />
              </div>
              <div class="-mt-1 text-sm text-white/34">AIKC</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
