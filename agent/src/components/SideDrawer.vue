<template>
  <Teleport to="body">
    <div class="mask" @click.self="emit('close')">
      <aside class="drawer" :style="{ width: width + 'px' }">
        <header class="drawer-head">
          <div>
            <div class="drawer-title">{{ title }}</div>
            <div v-if="subtitle" class="drawer-sub">{{ subtitle }}</div>
          </div>
          <button class="btn btn-ghost btn-icon btn-sm" @click="emit('close')">✕</button>
        </header>
        <div class="drawer-body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="drawer-foot">
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
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
  background: rgba(3, 6, 11, 0.7);
  display: flex;
  justify-content: flex-end;
  z-index: 60;
}

.drawer {
  background: var(--panel);
  border-left: 1px solid var(--line-2);
  height: 100%;
  max-width: 96vw;
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
}

.drawer-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
}

.drawer-title {
  font-size: 14px;
  font-weight: 600;
}

.drawer-sub {
  color: var(--text-3);
  font-size: 11.5px;
  margin-top: 2px;
}

.drawer-body {
  flex: 1;
  overflow: auto;
  padding: 16px 18px;
}

.drawer-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--line);
}
</style>
