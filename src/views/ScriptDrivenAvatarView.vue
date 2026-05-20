<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { Currency } from '@vicons/carbon'
import UploadArea from '@/components/UploadArea.vue'

const imageSource = ref('local')
const voiceSource = ref('local')
const videoRatio = ref('landscape')
const resolution = ref('720p')
const script = ref('')
const prompt = ref('')
</script>

<template>
  <div class="h-full min-h-[500px] bg-[#060709] p-[20px] text-white">
    <div class="flex h-full overflow-hidden border border-white/8">
      <div
        class="grid w-full grid-cols-1 gap-x-[15px] sm:grid-cols-[400px_400px_minmax(0,1fr)]"
      >
        <section
          class="min-w-[400px] border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            分身照片
          </div>
          <div class="px-3 py-3">
            <UploadArea
              accept="image/*"
              description="JPG、PNG、JPEG、WEBP文件，30Mb以内"
            />
          </div>

          <div
            class="border-b border-t border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            语音样本
          </div>
          <div class="px-3 py-3">
            <UploadArea
              accept="audio/*"
              description="mp3/wav/flac 文件，30Mb以内"
            />
          </div>
        </section>

        <section
          class="min-w-[400px] border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            口播内容
          </div>
          <div class="px-3 py-3 text-sm text-white/48">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-[80px] shrink-0">视频方向:</span>
                <n-radio-group
                  v-model:value="videoRatio"
                  size="small"
                  class="inline-flex overflow-hidden rounded-[2px] border border-white/10 bg-[#16181a]"
                >
                  <n-radio-button
                    value="vertical"
                    class="h-[24px] min-w-[46px] border-0 px-3 text-sm text-center"
                    >竖屏</n-radio-button
                  >
                  <n-radio-button
                    value="landscape"
                    class="h-[24px] min-w-[46px] border-0 px-3 text-sm text-center"
                    >横屏</n-radio-button
                  >
                </n-radio-group>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[80px] shrink-0">视频分辨率:</span>
                <n-radio-group
                  v-model:value="resolution"
                  size="small"
                  class="inline-flex overflow-hidden rounded-[2px] border border-white/10 bg-[#16181a]"
                >
                  <n-radio-button
                    value="480p"
                    class="h-[24px] min-w-[46px] border-0 px-3 text-sm text-center"
                    >480P</n-radio-button
                  >
                  <n-radio-button
                    value="720p"
                    class="h-[24px] min-w-[46px] border-0 px-3 text-sm text-center"
                    >720P</n-radio-button
                  >
                </n-radio-group>
              </div>

              <div class="pt-1 text-xs text-[#f4b13d]">
                注意：目前只支持中文和英文，输入其他语言会出现异常
              </div>

              <div class="flex flex-col">
                <n-input
                  v-model:value="script"
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 6 }"
                  :placeholder="`请输入口播内容\n例如：大家好，我是小明，今天天气不错，很高兴见到大家。`"
                  class="text-sm [&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/28"
                />
                <div class="pt-2 ml-auto text-left text-xs text-white/34">
                  输入字数：0
                </div>
              </div>

              <div>
                <n-input
                  v-model:value="prompt"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  :placeholder="`(可选) 语气提示词\n例如：请用温柔的语气说话。`"
                  class="text-sm [&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/28"
                />
              </div>
            </div>

            <div
              class="mt-4 flex items-center gap-1.5 text-sm text-amber-400/95"
            >
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">1800</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <i
                    class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                  ></i>
                </template>
                根据口播字数计算，每50字1800算力
              </n-tooltip>
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

        <section class="relative flex min-h-[320px] flex-col">
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
