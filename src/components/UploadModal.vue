<script setup>
import { ref } from 'vue'
import { NModal, NUpload, NUploadDragger, NButton, NIcon } from 'naive-ui'
import { CloudUpload, Close } from '@vicons/carbon'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '上传文件'
  },
  accept: String,
  max: {
    type: Number,
    default: 1
  },
  description: String,
  uploadMode: {
    type: String,
    default: 'local'
  }
})

const emit = defineEmits(['update:show', 'close'])

const internalUploadMode = ref(props.uploadMode)

function handleClose() {
  emit('update:show', false)
  emit('close')
}
</script>

<template>
  <n-modal :show="show" :mask-closable="true" @update:show="val => emit('update:show', val)">
    <div class="w-[600px] rounded-[8px] border border-white/10 bg-[#161719] p-4 text-white shadow-2xl">
      <div class="mb-4 flex items-center justify-between">
        <span class="text-[14px] font-medium">{{ title }}</span>
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full btn-close"
          @click="handleClose"
        >
          <n-icon :size="18" :component="Close" class="text-white/45" />
        </button>
      </div>

      <div class="mb-4 rounded-[6px] bg-[#1a1c1e] p-4">
        <div class="mb-4 flex gap-6 text-[12px]">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              v-model="internalUploadMode"
              type="radio"
              value="local"
              class="accent-[#18d2e5]"
            />
            <span :class="internalUploadMode === 'local' ? 'text-[#18d2e5]' : 'text-white/65'">本地上传</span>
          </label>
          <label class="flex cursor-pointer items-center gap-2 opacity-50">
            <input
              v-model="internalUploadMode"
              type="radio"
              value="cloud"
              class="accent-[#18d2e5]"
              disabled
            />
            <span :class="internalUploadMode === 'cloud' ? 'text-[#18d2e5]' : 'text-white/65'">云盘选择</span>
          </label>
        </div>

        <n-upload multiple directory-dnd :max="max" :accept="accept">
          <n-upload-dragger
            class="!border-dashed !border-white/10 !bg-[#17181a] hover:!border-[#18d2e5]/40"
          >
            <div class="flex flex-col items-center py-8">
              <n-icon :size="48" :component="CloudUpload" class="mb-4 text-white/30" />
              <div class="text-[12px] text-white/65">
                Drop file here or <span class="text-[#18d2e5]">click to upload</span>
              </div>
            </div>
          </n-upload-dragger>
        </n-upload>

        <div class="mt-4 text-[11px] text-white/30">
          {{ description }}
        </div>
      </div>

      <div class="flex justify-end">
        <n-button
          class="!h-[32px] !rounded-[4px] !bg-[#2a2c2f] !px-6 !text-[12px] !text-white/80 hover:!bg-[#323437]"
          @click="handleClose"
        >
          关闭
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
