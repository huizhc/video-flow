<script setup>
import { ref } from 'vue'
import { NIcon, NRadio, NRadioGroup } from 'naive-ui'
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
              :accept="'video/*,audio/*'"
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
                    <div class="text-sm">视频尺寸: {{ videoSize || '—' }}</div>
                    <button type="button" class="text-sm text-white bg-[#f87171] px-3 py-1 rounded" @click="removeFile">移除视频</button>
                  </div>

                  <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" v-model="translate" />
                      <span>翻译</span>
                    </label>

                    <div class="flex items-center gap-3">
                      <div class="text-sm">目标语种：</div>
                      <select v-model="targetLang" class="text-sm bg-transparent border border-white/10 rounded px-2 py-1">
                        <option>英文</option>
                        <option>中文</option>
                        <option>日文</option>
                      </select>
                    </div>

                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" v-model="adjust" />
                      <span>调整</span>
                    </label>

                    <div>
                      <div class="text-sm">人群描述：</div>
                      <textarea v-model="audienceDesc" rows="3" class="w-full rounded border border-white/10 bg-transparent text-sm p-2"></textarea>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="text-sm">消耗算力： <span class="text-sm">💰 {{ cost }}</span></div>
                      <div class="flex items-center gap-3">
                        <button class="text-sm bg-[#6b7280] text-white px-3 py-1 rounded">提取音频</button>
                        <button class="text-sm bg-[#06b6d4] text-white px-3 py-1 rounded">分析视频</button>
                      </div>
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
