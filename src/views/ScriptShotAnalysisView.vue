<script setup>
import { ref } from 'vue'
import { NIcon, NRadio, NRadioGroup } from 'naive-ui'
import { CloudUpload } from '@vicons/carbon'

const uploadSource = ref('local')
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#060709] p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8 bg-[#0b0d10]">
      <div
        class="grid h-full grid-cols-1 gap-x-[15px] lg:grid-cols-[275px_minmax(0,1fr)]"
      >
        <section class="bg-[#232323]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            提取视频文案分析镜头
          </div>
          <div class="px-3 py-3">
            <n-radio-group v-model:value="uploadSource" size="small">
              <div class="flex items-center gap-5 text-[12px]">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div
              class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2"
            >
              <div
                class="flex min-h-[228px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center"
              >
                <n-icon
                  :size="34"
                  :component="CloudUpload"
                  class="text-white/70"
                />
                <div class="mt-3 text-[11px] text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-3 text-[11px] text-white/38">
                mp4/wav 文件，5G以内
              </div>
            </div>
          </div>
        </section>

        <section class="bg-[#232323] flex flex-col">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
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
