<template>
  <Teleport to="body">
    <div class="mask" @click.self="emit('close')">
      <div class="modal" :style="{ width: width + 'px' }">
        <div class="modal-head">
          <span class="modal-title">{{ title }}</span>
          <button class="btn btn-ghost btn-icon btn-sm" @click="emit('close')">✕</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-foot">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  width: { type: Number, default: 520 }
})
const emit = defineEmits(['close'])

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(3, 6, 11, 0.72);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8vh 16px 40px;
  z-index: 60;
  backdrop-filter: blur(2px);
}

.modal {
  background: var(--panel);
  border: 1px solid var(--line-2);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 94vw;
  display: flex;
  flex-direction: column;
  max-height: 82vh;
}

.modal-head {
  display: flex;
  align-items: center;
  padding: 13px 16px;
  border-bottom: 1px solid var(--line);
}

.modal-title {
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
}

.modal-body {
  padding: 16px;
  overflow: auto;
}

.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
}
</style>
