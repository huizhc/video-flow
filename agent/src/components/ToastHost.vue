<template>
  <Teleport to="body">
    <div class="toast-host">
      <TransitionGroup name="fade">
        <div v-for="item in ui.toasts" :key="item.id" class="toast" :class="'toast-' + item.type" @click="ui.dismiss(item.id)">
          <span class="ti">{{ item.type === 'error' ? '✕' : item.type === 'info' ? 'i' : '✓' }}</span>
          <span>{{ item.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: 14px;
  right: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 90;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 190px;
  padding: 9px 13px;
  border-radius: 8px;
  background: #131c27;
  border: 1px solid var(--line-2);
  box-shadow: var(--shadow);
  font-size: 12.5px;
  cursor: pointer;
}

.ti {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  color: #04222a;
  background: var(--green);
  flex: none;
}

.toast-error .ti {
  background: var(--red);
  color: #2a0808;
}

.toast-info .ti {
  background: var(--cyan);
}
</style>
