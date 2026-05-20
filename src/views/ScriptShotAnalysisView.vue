<script setup>
import { ref } from 'vue'
import { NButton, NCheckbox, NInput, NSelect } from 'naive-ui'
import UploadArea from '@/components/UploadArea.vue'

const uploadSource = ref('local')

const hasFile = ref(false)
const fileUrl = ref('')
const fileName = ref('')
const videoSize = ref('')

const translate = ref(true)
const targetLang = ref('英文')
const adjust = ref(false)
const audienceDesc = ref('')
const cost = ref(300)

function onFileChange(file) {
  if (!file) return
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value)
  fileUrl.value = URL.createObjectURL(file)
  fileName.value = file.name
  hasFile.value = true
}

function removeFile() {
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value)
  fileUrl.value = ''
  fileName.value = ''
  videoSize.value = ''
  hasFile.value = false
}

function onVideoMetadata(e) {
  const v = e.target
  if (v && v.videoWidth && v.videoHeight) {
    videoSize.value = `${v.videoWidth} x ${v.videoHeight}`
  }
}
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#060709] p-3 text-white">
    <div class="overflow-hidden h-full border border-white/8 bg-[#0b0d10]">
      <div class="flex h-full gap-x-[15px]">
        <section class="bg-[#232323] w-[400px]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-sm font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]"
          >
            提取视频文案分析镜头
          </div>
          <div class="px-3 py-3">
            <UploadArea
              accept=".mp4,.wav"
              description="mp4/wav 文件，5G以内"
              :hasFile="hasFile"
              @file-change="onFileChange"
            >
              <template #uploaded>
                <div class="space-y-3">
                  <div>
                    <video
                      v-if="fileUrl"
                      :src="fileUrl"
                      controls
                      class="w-full rounded-[4px]"
                      @loadedmetadata="onVideoMetadata"
                    />
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-xs text-white/48">
                      视频尺寸: {{ videoSize || '—' }}
                    </div>
                    <n-button
                      class="text-#fff!"
                      size="small"
                      type="error"
                      @click="removeFile"
                      >移除视频</n-button
                    >
                  </div>

                  <div
                    class="flex flex-col space-y-3 [&>div>span]:text-white/48 [&>div>span]:w-[80px] [&>div>span]:min-w-[80px]"
                  >
                    <div class="flex items-center gap-2 text-sm">
                      <span>是否翻译：</span>
                      <n-checkbox v-model:value="translate"> 翻译 </n-checkbox>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <span>目标语种：</span>
                      <n-select
                        v-model:value="targetLang"
                        :options="[
                          { label: '英文', value: '英文' },
                          { label: '中文', value: '中文' },
                          { label: '日文', value: '日文' },
                        ]"
                        size="small"
                        class="min-w-[140px]"
                      />
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                      <span>调整人群：</span>
                      <n-checkbox v-model:value="adjust"> 调整 </n-checkbox>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-sm mb-2">人群描述：</span>
                      <n-input
                        v-model:value="audienceDesc"
                        type="textarea"
                        rows="3"
                        placeholder="请输入人群描述"
                        size="small"
                        class="w-full rounded border border-white/10 bg-[#141414] text-sm text-white"
                      />
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-sm"> 消耗算力： </span>
                      <div class="flex items-center">
                        <i
                          class="i-carbon-currency text-[13px] text-[#ffd24c]"
                        ></i>
                        &nbsp;
                        <p class="text-sm mr-[10px]">{{ cost }}</p>
                        <n-tooltip trigger="hover">
                          <template #trigger>
                            <i
                              class="i-mingcute-question-line text-sm text-white/48 cursor-pointer"
                            ></i>
                          </template>
                          根据上传视频时长计算，提取音频每30秒30算力，分析视频每30秒300算力
                        </n-tooltip>
                      </div>
                    </div>
                    <div class="inline-flex gap-3 ml-auto">
                      <n-button size="small" type="default">提取音频</n-button>
                      <n-button size="small" type="primary">分析视频</n-button>
                    </div>
                  </div>
                </div>
              </template>
            </UploadArea>
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
