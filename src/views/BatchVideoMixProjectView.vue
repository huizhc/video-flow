<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NColorPicker, NIcon, NInputNumber, NSelect } from 'naive-ui'
import { CloudUpload, Currency, Information } from '@vicons/carbon'

const router = useRouter()
const uploadMode = ref('local')
const openingMode = ref('local')
const baseMaterialTab = ref('audio')
const subtitleMode = ref('style')
const subtitleEnabled = ref(false)
const subtitleStart = ref(75)
const subtitleEnd = ref(85)
const fontSize = ref('middle')
const textColor = ref('#a9a9a9')
const bgColor = ref('#6c6c6c')
const audioMode = ref('none')
const bgmEnabled = ref(false)
const bgmVolume = ref(40)
const videoDirection = ref('portrait')
const resolution = ref('720p')
const amountRange = ref(50)
const totalPower = computed(() => 120)

const materialModeOptions = [
  { label: '本地上传', value: 'local' },
  { label: '云盘选择', value: 'cloud' },
]

const baseMaterialTabs = [
  { label: '口播音频', value: 'audio' },
  { label: '参考视频', value: 'video' },
]

const resolutionOptions = ['480p', '720p', '1080p']
const subtitleModeOptions = [
  { label: '选择样式', value: 'style' },
]
</script>

<template>
  <div class="min-h-screen overflow-x-auto bg-[#060709] p-3 text-white">
    <div class="min-w-[1680px] rounded-[18px] border border-white/8 bg-[#0b0d10] p-2">
      <div class="grid min-h-[calc(100vh-24px)] grid-cols-[300px_360px_360px_300px_500px] gap-2">
        <section class="rounded-[8px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div>
              <div class="text-[12px] text-white/84">基础素材</div>
              <div class="mt-[2px] text-[10px] text-white/30">用于人口播音频/参考视频驱动</div>
            </div>
            <button
              type="button"
              class="flex h-[30px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent text-[12px] text-white/45 transition-colors hover:text-white/70"
              @click="router.push({ name: 'tool-batch-video-mix' })"
            >
              项目列表
            </button>
          </div>

          <div class="space-y-4 p-3">
            <div class="flex items-center gap-4 border-b border-white/8 pb-2 text-[11px]">
              <button
                v-for="tab in baseMaterialTabs"
                :key="tab.value"
                type="button"
                class="border-0 bg-transparent p-0"
                :class="baseMaterialTab === tab.value ? 'text-[#18d2e5]' : 'text-white/64'"
                @click="baseMaterialTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>

            <div>
              <div class="mb-1 text-[11px] text-white/74">口播音频</div>
              <div class="mb-2 flex gap-4 text-[11px]">
                <label
                  v-for="item in materialModeOptions"
                  :key="item.value"
                  class="flex items-center gap-2 text-white/76"
                >
                  <input v-model="uploadMode" :value="item.value" type="radio" class="accent-[#18d2e5]" />
                  {{ item.label }}
                </label>
              </div>
              <div class="flex h-[112px] flex-col items-center justify-center rounded-[4px] border border-dashed border-white/14 bg-[#17181a] text-white/42">
                <n-icon :component="CloudUpload" :size="28" />
                <div class="mt-3 text-[11px]">Drop file here or click to upload</div>
              </div>
              <div class="mt-2 text-[10px] text-white/24">mp3/wav 文件，100MB以内</div>
            </div>

            <div>
              <div class="mb-1 text-[11px] text-white/74">上传人物照片</div>
              <div class="mb-2 text-[10px] leading-[1.5] text-white/28">
                如果上传了人物照片，则会生成数字人口播形象
              </div>
              <div class="mb-2 flex gap-4 text-[11px]">
                <label
                  v-for="item in materialModeOptions"
                  :key="`opening-${item.value}`"
                  class="flex items-center gap-2 text-white/76"
                >
                  <input v-model="openingMode" :value="item.value" type="radio" class="accent-[#18d2e5]" />
                  {{ item.label }}
                </label>
              </div>
              <div class="flex h-[112px] flex-col items-center justify-center rounded-[4px] border border-dashed border-white/14 bg-[#17181a] text-white/42">
                <n-icon :component="CloudUpload" :size="28" />
                <div class="mt-3 text-[11px]">Drop file here or click to upload</div>
              </div>
              <div class="mt-2 text-[10px] text-white/24">JPG、PNG、JPEG，30MB以内</div>
            </div>
          </div>
        </section>

        <section class="rounded-[8px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div class="text-[12px] text-white/84">口播分段</div>
            <div class="mt-[2px] text-[10px] text-white/30">请撰写一屏的文案，强行换行分段，每</div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col p-3">
            <textarea
              class="min-h-0 flex-1 resize-none rounded-[4px] border border-white/18 bg-[#1a1b1e] p-3 text-[11px] leading-[1.75] text-white/76 outline-none placeholder:text-white/26 focus:border-[#18d2e5]"
              placeholder="请输入字幕文案，使用换行符分段每一屏"
            />
            <div class="mt-2 text-right text-[10px] text-[#f4a524]">
              *过渡镜头后，尽量不要留空，否则可能会出现少帧
            </div>
          </div>
        </section>

        <section class="rounded-[8px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div class="text-[12px] text-white/84">镜头序列</div>
            <div class="mt-[2px] text-[10px] text-white/30">弹镜选取以下镜头合并拼接，不勾镜头至少要有一个片段</div>
          </div>

          <div class="p-3">
            <div class="flex h-[110px] flex-col items-center justify-center rounded-[4px] border border-dashed border-white/14 bg-[#17181a] text-white/42">
              <div class="text-[30px] leading-none text-white/62">+</div>
              <div class="mt-2 text-[11px]">添加镜头</div>
            </div>
          </div>
        </section>


        <section class="rounded-[8px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div class="text-[12px] text-white/84">其他参数</div>
            <div class="mt-1 text-[10px] text-white/30">对成片字幕效果、音色和初始方向</div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col justify-between p-3">
            <div class="space-y-[14px]">
              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">音性包装:</div>
                <div class="min-w-0 flex-1">
                  <n-select
                    v-model:value="subtitleMode"
                    :options="subtitleModeOptions"
                    size="small"
                    class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#151618] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-[11px] [&_.n-base-selection__render-label]:!text-white/82"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">启用字幕:</div>
                <div class="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    class="border-0 bg-transparent p-0"
                    :class="!subtitleEnabled ? 'text-[#18d2e5]' : 'text-white/36'"
                    @click="subtitleEnabled = false"
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    class="relative h-[18px] w-[34px] rounded-full border border-white/10 bg-[#111214] p-0 transition"
                    :class="subtitleEnabled ? '!bg-[#18d2e5]/28 !border-[#18d2e5]/40' : ''"
                    @click="subtitleEnabled = !subtitleEnabled"
                  >
                    <span
                      class="absolute top-[1px] h-[14px] w-[14px] rounded-full bg-white transition"
                      :class="subtitleEnabled ? 'left-[17px]' : 'left-[1px]'"
                    />
                  </button>
                  <button
                    type="button"
                    class="border-0 bg-transparent p-0"
                    :class="subtitleEnabled ? 'text-white/76' : 'text-white/36'"
                    @click="subtitleEnabled = true"
                  >
                    启用
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">字幕位置:</div>
                <div class="flex items-center gap-[6px] text-[11px] text-white/36">
                  <n-input-number
                    v-model:value="subtitleStart"
                    :show-button="false"
                    size="small"
                    class="w-[52px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-[11px] [&_.n-input-number-input]:!text-white/78"
                  />
                  <span>%</span>
                  <span>-</span>
                  <n-input-number
                    v-model:value="subtitleEnd"
                    :show-button="false"
                    size="small"
                    class="w-[52px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-[11px] [&_.n-input-number-input]:!text-white/78"
                  />
                  <span>%</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">字体大小:</div>
                <div class="min-w-0 flex-1">
                  <n-select
                    v-model:value="fontSize"
                    :options="[{ label: '中', value: 'middle' }]"
                    size="small"
                    class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#151618] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-[11px] [&_.n-base-selection__render-label]:!text-white/82"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">字幕色彩:</div>
                <div class="flex items-center gap-2">
                  <n-color-picker
                    v-model:value="textColor"
                    :show-alpha="false"
                    :actions="['confirm']"
                    size="small"
                    class="[&_.n-color-picker-trigger]:!h-[20px] [&_.n-color-picker-trigger]:!w-[20px] [&_.n-color-picker-trigger]:!rounded-[3px] [&_.n-color-picker-trigger]:!border [&_.n-color-picker-trigger]:!border-white/8 [&_.n-color-picker-trigger__fill]:!rounded-[2px]"
                  >
                 <template #trigger="{ value, onClick, ref: triggerRef }">
        <div
          :ref="triggerRef"
          :style="{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: value || '#000',
            cursor: 'pointer',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }"
          @click="onClick"
        />
      </template>
                  </n-color-picker>
                  <span class="text-[11px] text-white/34">文字颜色:</span>
                  <n-color-picker
                    v-model:value="bgColor"
                    :show-alpha="false"
                    :actions="['confirm']"
                    size="small"
                    class="[&_.n-color-picker-trigger]:!h-[20px] [&_.n-color-picker-trigger]:!w-[20px] [&_.n-color-picker-trigger]:!rounded-[3px] [&_.n-color-picker-trigger]:!border [&_.n-color-picker-trigger]:!border-white/8 [&_.n-color-picker-trigger__fill]:!rounded-[2px]"
                  >
                 <template #trigger="{ value, onClick, ref: triggerRef }">
        <div
          :ref="triggerRef"
          :style="{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: value || '#000',
            cursor: 'pointer',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }"
          @click="onClick"
        />
      </template>
                  </n-color-picker>
                </div>
              </div>


              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">音源音乐:</div>
                <div class="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    class="border-0 bg-transparent p-0"
                    :class="audioMode === 'none' ? 'text-white/72' : 'text-white/34'"
                    @click="audioMode = 'none'"
                  >
                    未上传
                  </button>
                  <label class="flex items-center gap-1 text-white/34">
                    <input v-model="bgmEnabled" type="checkbox" class="accent-[#18d2e5]" />
                    勾选BGM
                  </label>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">音乐音量:</div>
                <div class="flex items-center gap-[6px] text-[11px] text-white/36">
                  <span>-</span>
                  <n-input-number
                    v-model:value="bgmVolume"
                    :show-button="false"
                    size="small"
                    class="w-[52px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-[11px] [&_.n-input-number-input]:!text-white/78"
                  />
                  <span>%</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">初始方向:</div>
                <div class="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    class="rounded-[4px] border px-3 py-[5px]"
                    :class="videoDirection === 'portrait' ? 'border-[#18d2e5] bg-[#18d2e5]/12 text-[#42e7f4]' : 'border-white/8 bg-[#151618] text-white/58'"
                    @click="videoDirection = 'portrait'"
                  >
                    竖屏
                  </button>
                  <button
                    type="button"
                    class="rounded-[4px] border px-3 py-[5px]"
                    :class="videoDirection === 'landscape' ? 'border-[#18d2e5] bg-[#18d2e5]/12 text-[#42e7f4]' : 'border-white/8 bg-[#151618] text-white/58'"
                    @click="videoDirection = 'landscape'"
                  >
                    横屏
                  </button>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[66px] shrink-0 pt-[4px] text-[11px] text-white/48">初始尺寸:</div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="item in resolutionOptions"
                    :key="item"
                    type="button"
                    class="rounded-[4px] border px-3 py-1 text-[11px]"
                    :class="resolution === item ? 'border-[#18d2e5] bg-[#18d2e5]/12 text-[#42e7f4]' : 'border-white/8 bg-[#151618] text-white/58'"
                    @click="resolution = item"
                  >
                    {{ item }}
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">数量范围:</div>
                <div class="flex items-center gap-[6px] text-[11px] text-white/36">
                  <span>-</span>
                  <n-input-number
                    v-model:value="amountRange"
                    :show-button="false"
                    size="small"
                    class="w-[52px] [&_.n-input-wrapper]:!rounded-[4px] [&_.n-input-wrapper]:!border-white/8 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!shadow-none [&_.n-input-number-input]:!text-center [&_.n-input-number-input]:!text-[11px] [&_.n-input-number-input]:!text-white/78"
                  />
                  <span>-</span>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <n-button ghost class="bg-[#4f8a2a]! w-full text-white!">预览</n-button>
            </div>
          </div>
        </section>

        <section class="rounded-[8px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div class="text-[12px] text-white/84">预览</div>
            <div class="mt-1 text-[10px] text-white/30">建议保留空镜头的新镜头</div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col justify-between p-3">
            <div class="flex-1 rounded-[4px] bg-[#090a0c]" />

            <div class="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
              <div class="flex items-center gap-2 text-[11px]">
                <button type="button" class="rounded-[3px] border border-white/8 bg-[#161719] px-[10px] py-[3px] text-white/42">
                  全选
                </button>
                <button type="button" class="rounded-[3px] border border-white/8 bg-[#161719] px-[10px] py-[3px] text-white/42">
                  反选
                </button>
              </div>

              <div class="flex items-center gap-4 text-[11px] text-white/40">
                <span>已选: 0/0</span>
                <div class="flex items-center gap-1">
                  <span>单次消耗算力:</span>
                  <n-icon :component="Currency" :size="13" class="text-[#ffd24c]" />
                  <span class="text-[#ffd24c]">{{ totalPower }}</span>
                  <n-icon :component="Information" :size="12" class="text-white/28" />
                </div>
                <n-button
                  type="primary"
                  size="small"
                  class="!h-[28px] !rounded-[4px] !border-0 !bg-[#6d4a1a] !px-[12px] !text-[11px] !font-medium !text-[#c8892a]"
                >
                  后台执行
                </n-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
