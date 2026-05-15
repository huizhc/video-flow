<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, NRadio, NRadioGroup, NSelect } from 'naive-ui'
import { Currency, PlayFilledAlt } from '@vicons/carbon'

const script = ref('')
const mode = ref('single')
const voiceRole = ref('female')
const speechStyle = ref('marketing')
const scriptLength = computed(() => script.value.length)

const voiceRoleOptions = [
  { label: '妹子  女声，温柔自然', value: 'female' },
  { label: '青年  男声，沉稳清晰', value: 'male' },
]

const speechStyleOptions = [
  { label: '激情营销，语速偏快', value: 'marketing' },
  { label: '平稳叙述，语调自然', value: 'stable' },
]
</script>

<template>
  <div class="min-h-[500px] h-full p-[20px] text-white">
    <div class="flex h-full overflow-hidden border border-white/8">
      <div
        class="flex w-full gap-x-[15px] sm:grid-cols-[300px_300px_minmax(0,1fr)]"
      >
        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r min-w-[400px]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            文案转语音
          </div>
          <div class="px-3 py-3">
            <div class="mb-2 text-sm text-white/45">
              输入模式：直接输入文案即可
            </div>
            <n-input
              v-model:value="script"
              type="textarea"
              :autosize="{ minRows: 12, maxRows: 12 }"
              placeholder="例如：\n今天的天气真好啊，我们出去走走吧。"
              class="text-sm [&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-white/28"
            />
            <div class="pt-3 text-xs text-white/38">
              输入字数：{{ scriptLength }}
            </div>
            <div class="pt-2 text-xs text-white/32">
              单人模式：直接输入文案即可
            </div>
          </div>
        </section>

        <section
          class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r min-w-[400px]"
        >
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            参数设置
          </div>
          <div class="px-3 py-3 text-sm text-white/48">
            <div class="space-y-3 [&>div>span]:w-[70px]">
              <div class="flex items-center gap-3">
                <span class="shrink-0">模式选择:</span>
                <n-radio-group v-model:value="mode" size="small">
                  <div class="flex items-center gap-5 text-sm">
                    <n-radio value="single">单人</n-radio>
                    <n-radio value="multi">多人</n-radio>
                  </div>
                </n-radio-group>
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">口播音色:</span>
                <n-select
                  v-model:value="voiceRole"
                  size="small"
                  :options="voiceRoleOptions"
                  class="flex-1"
                />
                <button
                  type="button"
                  class="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/18 bg-transparent text-white/55 transition-colors hover:text-white/80"
                >
                  <n-icon :size="12" :component="PlayFilledAlt" />
                </button>
              </div>

              <div class="flex items-center gap-3">
                <span class="shrink-0">语音风格:</span>
                <n-select
                  v-model:value="speechStyle"
                  size="small"
                  :options="speechStyleOptions"
                  class="flex-1"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">150</span>
            </div>

            <div class="pt-6 flex justify-end">
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
