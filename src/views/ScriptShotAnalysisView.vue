<script setup>
import { ref } from 'vue'
import { NIcon, NRadio, NRadioGroup } from 'naive-ui'
import UploadArea from '@/components/UploadArea.vue'

const uploadSource = ref('local')
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#060709] p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8 bg-[#0b0d10]">
      <div class="flex h-full gap-x-[15px]">
        <section class="bg-[#232323] min-w-[400px]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            提取视频文案分析镜头
          </div>
          <div class="px-3 py-3">
            <UploadArea />
          </div>
        </section>

        <section class="bg-[#232323] flex-1 flex flex-col min-w-[400px]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            结果
          </div>
          <div class="p-3 flex-1">
            <div
              class="h-full rounded-[2px] border border-white/6 bg-[#101214]"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
