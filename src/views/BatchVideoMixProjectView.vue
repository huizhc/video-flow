<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NColorPicker, NIcon, NInputNumber, NSelect, NTabs, NTabPane, NModal, NUpload, NUploadDragger, NRadioGroup, NRadioButton } from 'naive-ui'
import { CloudUpload, Currency, Information, Close } from '@vicons/carbon'

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

// BGM states
const showBgmModal = ref(false)
const bgmUploadMode = ref('local')
const bgmFileName = ref('')
const bgmStatus = computed(() => bgmFileName.value || '未上传')
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
  <div class="h-full w-full min-h-[500px] bg-[#060709]  text-white">
    <div class="h-full overflow-x-scroll flex set-scrollbar">
      <div class="grid h-full p-3 grid-cols-[300px_360px_360px_300px_500px] gap-x-[15px]">
        <section class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
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
            <n-tabs
              v-model:value="baseMaterialTab"
              type="line"
              size="small"
              class="[&_.n-tabs-tab]:!px-0 [&_.n-tabs-tab]:!text-[11px] [&_.n-tabs-tab]:!text-white/64 [&_.n-tabs-tab--active]:!text-[#18d2e5] [&_.n-tabs-bar]:!bg-[#18d2e5] [&_.n-tabs-nav]:!border-b [&_.n-tabs-nav]:!border-white/8"
            >
              <n-tab-pane
                v-for="tab in baseMaterialTabs"
                :key="tab.value"
                :name="tab.value"
                :tab="tab.label"
              />
            </n-tabs>

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

        <section class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
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

        <section class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
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


        <section class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-3 py-2">
            <div class="text-[12px] text-white/84">其他参数</div>
            <div class="mt-1 text-[10px] text-white/30">对成片字幕效果、音色和初始方向</div>
          </div>

          <div class="flex h-[calc(100%-49px)] flex-col justify-between p-3">
            <div class="space-y-[14px]">
              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">智能包装:</div>
                <div class="min-w-0 flex-1">
                  <n-select
                    v-model:value="subtitleMode"
                    :options="subtitleModeOptions"
                    size="tiny"
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
                    size="tiny"
                    class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#151618] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-[11px] [&_.n-base-selection__render-label]:!text-white/82"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">字幕底色:</div>
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
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">背景音乐:</div>
                <div class="flex items-center gap-2 text-[12px]">
                  <span
                    class="text-white/72"
                    :class="bgmFileName ? 'text-[#18d2e5]' : 'text-white/34'"
                  >
                    {{ bgmStatus }}
                  </span>
                  <button
                    type="button"
                    class="flex h-[30px] items-center justify-center rounded-[4px] border border-white/8 bg-transparent text-[12px] text-white/45 transition-colors hover:text-white/70"
                    @click="showBgmModal = true"
                  >
                    <n-icon :component="CloudUpload" :size="14" />
                    选择BGM
                  </button>
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
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">视频方向:</div>
                <n-radio-group v-model:value="videoDirection" size="small" class="custom-radio-group">
                    <n-radio-button
                      value="portrait"
                      label="竖屏"
                      class="!bg-[#151618] !text-[11px] !text-white/58 [&.n-radio-button--checked]:!border-[#18d2e5] [&.n-radio-button--checked]:!bg-[#18d2e5]/12 [&.n-radio-button--checked]:!text-[#42e7f4] [&_.n-radio-button__state-border]:!hidden"
                    />
                    <n-radio-button
                      value="landscape"
                      label="横屏"
                      class="!bg-[#151618] !text-[11px] !text-white/58 [&.n-radio-button--checked]:!border-[#18d2e5] [&.n-radio-button--checked]:!bg-[#18d2e5]/12 [&.n-radio-button--checked]:!text-[#42e7f4] [&_.n-radio-button__state-border]:!hidden"
                    />
                </n-radio-group>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[66px] shrink-0 pt-[4px] text-[11px] text-white/48">视频尺寸:</div>
                <n-radio-group v-model:value="resolution" size="small" class="custom-radio-group">
                    <n-radio-button
                      v-for="item in resolutionOptions"
                      :key="item"
                      :value="item"
                      :label="item"
                      class="!bg-[#151618] !text-[11px] !text-white/58 [&.n-radio-button--checked]:!border-[#18d2e5] [&.n-radio-button--checked]:!bg-[#18d2e5]/12 [&.n-radio-button--checked]:!text-[#42e7f4] [&_.n-radio-button__state-border]:!hidden"
                    />
                </n-radio-group>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-[66px] shrink-0 text-[11px] text-white/48">数量限制:</div>
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

        <section class="rounded-[8px] border w-full border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
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
                  type="warning"
                  size="small"
                  class="!h-[28px] !px-3 !rounded-[4px] !text-[12px]"
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

  <n-modal v-model:show="showBgmModal" :mask-closable="true">
    <div class="w-[600px] rounded-[8px] border border-white/10 bg-[#161719] p-4 text-white shadow-2xl">
      <div class="mb-4 flex items-center justify-between">
        <span class="text-[14px] font-medium">选择背景音乐</span>
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/5"
          @click="showBgmModal = false"
        >
          <n-icon :component="Close" :size="18" class="text-white/45" />
        </button>
      </div>

      <div class="mb-4 rounded-[6px] bg-[#1a1c1e] p-4">
        <div class="mb-4 flex gap-6 text-[12px]">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="bgmUploadMode"
              type="radio"
              value="local"
              class="accent-[#18d2e5]"
            />
            <span :class="bgmUploadMode === 'local' ? 'text-[#18d2e5]' : 'text-white/65'">本地上传</span>
          </label>
          <label class="flex cursor-pointer items-center gap-2 opacity-50">
            <input
              v-model="bgmUploadMode"
              type="radio"
              value="cloud"
              class="accent-[#18d2e5]"
              disabled
            />
            <span :class="bgmUploadMode === 'cloud' ? 'text-[#18d2e5]' : 'text-white/65'">云盘选择</span>
          </label>
        </div>

        <n-upload
          multiple
          directory-dnd
          :max="1"
          accept=".mp3,.wav,.m4a,.aac"
          @change="(data) => {
            if (data.fileList.length > 0) {
              bgmFileName = data.fileList[0].name
            }
          }"
        >
          <n-upload-dragger
            class="!border-dashed !border-white/10 !bg-[#17181a] hover:!border-[#18d2e5]/40"
          >
            <div class="flex flex-col items-center py-6">
              <n-icon :component="CloudUpload" :size="48" class="mb-4 text-white/30" />
              <div class="text-[12px] text-white/65">
                Drop file here or <span class="text-[#18d2e5]">click to upload</span>
              </div>
            </div>
          </n-upload-dragger>
        </n-upload>

        <div class="mt-4 text-[11px] text-white/30">
          支持 mp3/wav/m4a/aac 格式，单个文件50MB以内
        </div>
      </div>

      <div class="flex justify-end">
        <n-button
          class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-[12px] !text-white/80 hover:!bg-[#323437]"
          @click="showBgmModal = false"
        >
          关闭
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
<style lang="scss" scoped>
.set-scrollbar {
  scrollbar-color: #494949 #2a2a2a; /* 滑块颜色 轨道颜色 */
}
</style>