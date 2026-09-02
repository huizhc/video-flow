<template>
  <BaseModal v-if="state" :title="state.title" :width="420" @close="ui.closeConfirm(false)">
    <p class="msg">{{ state.message }}</p>
    <div v-if="state.requireText" class="require">
      <label class="field-label">请输入 <b>{{ state.requireText }}</b> 以确认</label>
      <input v-model="state.input" class="input" :placeholder="state.requireText" />
    </div>
    <template #footer>
      <button class="btn" @click="ui.closeConfirm(false)">{{ state.cancelText }}</button>
      <button class="btn" :class="state.danger ? 'btn-solid-danger' : 'btn-primary'" :disabled="!ready" @click="ui.closeConfirm(true)">
        {{ state.confirmText }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const state = computed(() => ui.confirmState)
const ready = computed(() => {
  if (!state.value) return false
  if (!state.value.requireText) return true
  return state.value.input.trim() === state.value.requireText
})
</script>

<style scoped>
.msg {
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.7;
  white-space: pre-line;
}

.require {
  margin-top: 14px;
}

.require b {
  color: var(--text);
}
</style>
