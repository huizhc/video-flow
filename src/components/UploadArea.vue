<script setup>
import { ref } from 'vue'
import { NRadio, NRadioGroup, NIcon } from 'naive-ui'
import { CloudUpload } from '@vicons/carbon'

const props = defineProps({
  hasFile: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'video/mp4,video/quicktime'
  },
  description: {
    type: String,
    default: 'mp4/mov 文件，建议1G以内'
  }
})

const emit = defineEmits(['file-change'])

const uploadSource = ref('local')
const fileInputRef = ref(null)

const triggerUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    emit('file-change', file)
  }
  // Reset input value to allow uploading the same file again if needed
  if (e.target) {
    e.target.value = ''
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 w-full ">
    <template v-if="!hasFile">
      <div class="flex-1 flex  justify-center">
        <div class="w-full max-w-[400px]">
          <n-radio-group v-model:value="uploadSource" size="small" class="mb-4">
            <div class="flex items-center gap-5 text-sm">
              <n-radio value="local">本地上传</n-radio>
              <n-radio value="cloud">云盘选择</n-radio>
            </div>
          </n-radio-group>

          <div class="mt-4 rounded-[2px] border border-white/6 bg-[#1f1f1f] p-2" @click="triggerUpload">
            <div
              class="flex min-h-[228px] flex-col items-center justify-center rounded-[2px] border border-white/6 border-dashed bg-[#202020] text-center cursor-pointer hover:border-[#16d4e4]/50 transition-colors">
              <n-icon :size="34" :component="CloudUpload" class="text-white/70" />
              <div class="mt-3 text-sm text-white/55">
                Drop file here or
                <span class="text-[#16d4e4]">click to upload</span>
              </div>
            </div>
            <div class="pt-3 text-xs text-white/38 ">{{ description }}</div>
          </div>
          <input type="file" ref="fileInputRef" class="hidden" :accept="accept" @change="onFileChange" />
        </div>
      </div>
    </template>
    <template v-else>
      <slot name="uploaded"></slot>
    </template>
  </div>
</template>
