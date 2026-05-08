<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { CloudUpload, Currency, Information } from '@vicons/carbon'

const sampleSource = ref('local')
const script = ref('')
const speechTone = ref('')
const scriptLength = computed(() => script.value.length)
</script>

<template>
  <div class="min-h-screen bg-[#060709] p-[20px] text-white">
    <div class="flex min-h-[calc(100vh-40px)] overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
      <div class="grid w-full grid-cols-1 gap-x-[15px] sm:grid-cols-[275px_265px_minmax(0,1fr)]">
        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            声音样本
          </div>
          <div class="px-3 py-3">
            <n-radio-group v-model:value="sampleSource" size="small">
              <div class="flex items-center gap-5 text-[12px]">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2">
              <div class="flex min-h-[102px] flex-col items-center justify-center rounded-[2px] border border-dashed border-white/6 bg-[#202020] text-center">
                <n-icon :size="32" :component="CloudUpload" class="text-white/70" />
                <div class="mt-3 text-[11px] text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-3 text-[11px] text-white/38">mp3/wav/flac 文件，30Mb以内</div>
            </div>
          </div>
        </section>

        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            口播内容
          </div>
          <div class="px-3 py-3 text-[11px] text-white/48">
            <div class="pb-2 text-[10px] leading-[1.5] text-[#f4b13d]">
              注意：目前只支持中文和英文，输入其他语言会出现异常
            </div>

            <div>
              <div class="pb-1.5 text-[11px] text-white/48">请输入口播内容</div>
              <n-input
                v-model:value="script"
                type="textarea"
                :autosize="{ minRows: 7, maxRows: 7 }"
                placeholder="例如：大家好，我是小明，今天天气不错，陪单元见证大家。"
                class="[&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.6] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-white/24"
              />
              <div class="pt-1 text-right text-[10px] text-white/32">输入字数：{{ scriptLength }}</div>
            </div>

            <div class="pt-3">
              <div class="pb-1.5 text-[11px] text-white/48">(可选) 语气提示词</div>
              <n-input
                v-model:value="speechTone"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                placeholder="例如：请用温柔的语气说话。"
                class="[&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.6] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-white/24"
              />
            </div>

            <div class="mt-4 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">400</span>
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
  </div>
</template>
