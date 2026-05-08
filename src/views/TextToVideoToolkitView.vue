<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NInput, NRadio, NRadioGroup, NSelect } from 'naive-ui'
import { CloudUpload, Currency } from '@vicons/carbon'

const imageSource = ref('local')
const model = ref('runninghub-normal')
const duration = ref('10s')
const direction = ref('vertical-720')
const selectedCharacter = ref(null)
const prompt = ref(`请输入画面提示词，例如
镜头1（00:00-00:05）
[主角动作]：模特微笑侧身与 SIMC（全保镜头）...
[主体] 两道白发散在额前站立
[场景] 实验台背景，中性灯光
[动作]
- 左侧：旧式 ABF 刀割痕落在白发上一圈色晕变成一片亮斑
- 右侧：SIMC 修护球环绕游走一圈色均匀，自然，颗粒感降低
（如用 Sora，描述为：旧用户生理焕发淡灰反应，新附着特清爽流动）
[镜头语言]
- 跟随（Macro）展示细节
- 分屏比对，效果清晰
`)

const modelOptions = [
  { label: 'runninghub-normal', value: 'runninghub-normal' },
  { label: 'runninghub-pro', value: 'runninghub-pro' },
]

const characters = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=120&q=80',
]
</script>

<template>
  <div class="min-h-screen bg-[#060709] p-[20px] text-white">
    <div class="flex min-h-[calc(100vh-40px)] overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
      <div class="grid w-full grid-cols-1 gap-x-[15px] sm:grid-cols-[300px_300px_minmax(0,1fr)]">
        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            参考图片
          </div>
          <div class="px-3 py-3">
            <div class="mb-2 text-[10px] text-[#f4b13d]">特别注意：不允许上传包含人物的照片，否则有可能被封号！！！</div>
            <n-radio-group v-model:value="imageSource" size="small">
              <div class="flex items-center gap-5 text-[12px]">
                <n-radio value="local">本地上传</n-radio>
                <n-radio value="cloud">云盘选择</n-radio>
              </div>
            </n-radio-group>

            <div class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2">
              <div class="flex min-h-[128px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center">
                <n-icon :size="34" :component="CloudUpload" class="text-white/70" />
                <div class="mt-3 text-[11px] text-white/55">
                  Drop file here or
                  <span class="text-[#16d4e4]">click to upload</span>
                </div>
              </div>
              <div class="pt-3 text-[11px] text-white/38">JPG、PNG、JPEG、WEBP文件，30Mb以内</div>
            </div>
          </div>
        </section>

        <section class="border-b border-white/8 bg-[#232323] xl:border-b-0 xl:border-r">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            视频设置
          </div>
          <div class="px-3 py-3 text-[11px] text-white/48">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">选择模型:</span>
                <n-select
                  v-model:value="model"
                  size="small"
                  :options="modelOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">视频时长:</span>
                <div class="inline-flex overflow-hidden rounded-[2px] border border-white/10 bg-[#16181a]">
                  <button
                    type="button"
                    class="h-[24px] min-w-[40px] border-0 px-3 text-[11px] transition-colors"
                    :class="duration === '10s' ? 'bg-[#18d2e5] text-white' : 'bg-transparent text-white/56'"
                    @click="duration = '10s'"
                  >
                    10秒
                  </button>
                  <button
                    type="button"
                    class="h-[24px] min-w-[40px] border-0 px-3 text-[11px] transition-colors"
                    :class="duration === '15s' ? 'bg-[#18d2e5] text-white' : 'bg-transparent text-white/56'"
                    @click="duration = '15s'"
                  >
                    15秒
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[52px] shrink-0">方向尺寸:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="item in [
                      { label: '竖屏720P', value: 'vertical-720' },
                      { label: '竖屏1080P', value: 'vertical-1080' },
                      { label: '横屏720P', value: 'horizontal-720' },
                      { label: '横屏1080P', value: 'horizontal-1080' },
                    ]"
                    :key="item.value"
                    type="button"
                    class="h-[24px] rounded-[2px] border border-white/10 px-2.5 text-[10px] transition-colors"
                    :class="direction === item.value ? 'bg-[#18d2e5] text-white' : 'bg-[#16181a] text-white/56'"
                    @click="direction = item.value"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="w-[52px] shrink-0 pt-1">角色(可选):</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="(avatar, index) in characters"
                    :key="avatar"
                    type="button"
                    class="h-[34px] w-[34px] overflow-hidden rounded-full border transition-colors"
                    :class="selectedCharacter === index ? 'border-[#18d2e5]' : 'border-white/12'"
                    @click="selectedCharacter = index"
                  >
                    <img :src="avatar" alt="" class="h-full w-full object-cover" />
                  </button>
                  <div class="w-full text-[10px] text-white/34">未选中角色</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="w-[52px] shrink-0 pt-1">提示词:</span>
                <n-input
                  v-model:value="prompt"
                  type="textarea"
                  :autosize="{ minRows: 11, maxRows: 11 }"
                  class="flex-1 [&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.55] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-white/28"
                />
              </div>
            </div>

            <div class="mt-4 flex items-center gap-1.5 text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">3800</span>
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
