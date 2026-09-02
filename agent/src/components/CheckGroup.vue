<template>
  <div class="check-grid">
    <label v-for="opt in options" :key="opt.value" class="checkbox-row">
      <input type="checkbox" :checked="model.includes(opt.value)" @change="toggle(opt.value)" />
      <span>{{ opt.label }}</span>
    </label>
    <p v-if="!options.length" class="none">暂无可选项</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
const model = computed(() => props.modelValue || [])

function toggle(value) {
  const list = [...model.value]
  const index = list.indexOf(value)
  if (index >= 0) list.splice(index, 1)
  else list.push(value)
  emit('update:modelValue', list)
}
</script>

<style scoped>
.none {
  color: var(--text-3);
  font-size: 11.5px;
  padding: 4px;
}
</style>
