<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NRadio, NRadioGroup } from 'naive-ui'
import { Add, CloudUpload, Currency } from '@vicons/carbon'

const algorithm = ref('normal')
const uploadSource = ref('local')
</script>

<template>
    <div class="text-white flex p-[20px]  min-h-screen bg-[#060709] overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
      <div class="grid w-full grid-cols-1 gap-x-[15px] sm:grid-cols-[300px_300px_minmax(0,1fr)]">
        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            视频消除字幕及水印
          </div>
          <div class="px-3 py-3">
            <n-radio-group v-model:value="uploadSource" size="small">
              <div class="flex items-center gap-5 text-[12px]">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2">
              <div class="flex min-h-[228px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center">
                <n-icon :size="34" :component="CloudUpload" class="text-white/70" />
                <div class="mt-3 text-[11px] text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-3 text-[11px] text-white/38">mp4/mov 文件，建议1G</div>
            </div>
          </div>
        </section>

        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            参数设置
          </div>
          <div class="flex h-[calc(100%-33px)] flex-col px-3 py-3">
            <button
              type="button"
              class="flex h-[30px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent text-[12px] text-white/45 transition-colors hover:text-white/70"
            >
              <n-icon :size="14" :component="Add" class="mr-1" />
              添加选区
            </button>

            <div class="mt-3 min-h-0 flex-1 rounded-[2px] bg-[#151719]" />

            <div class="pt-4 text-[11px] text-white/48">
              <div class="flex items-center gap-3">
                <span>算法选择：</span>
                <n-radio-group v-model:value="algorithm" size="small">
                  <n-radio value="normal">常规消除</n-radio>
                  <n-radio value="enhance">AI增强</n-radio>
                </n-radio-group>
              </div>
              <div class="mt-3 flex items-center gap-1.5 text-amber-400/95">
                <span class="text-white/48">消耗算力：</span>
                <n-icon :size="14" :component="Currency" />
                <span class="font-medium">400</span>
              </div>
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

        <section class="relative flex min-h-[320px] flex-col">
          <div class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="relative h-[120px] w-[120px]">
                <div class="absolute left-[16px] top-[18px] h-[72px] w-[72px] rounded-full border-[12px] border-[#0b2347] border-r-transparent border-t-[#12315f]" />
                <div class="absolute left-[36px] top-[38px] h-[42px] w-[42px] rounded-full bg-[#1f6f5d]" />
                <div class="absolute left-[82px] top-[26px] h-[22px] w-[22px] rounded-full bg-[#26735c]" />
              </div>
              <div class="-mt-1 text-[12px] text-white/34">AIKC</div>
            </div>
          </div>
        </section>
      </div>
    </div>
</template>
