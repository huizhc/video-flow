<template>
  <component :is="to ? 'router-link' : 'div'" :to="to" class="stat" :class="{ clickable: !!to }">
    <div class="icon" :style="{ color: tone }">{{ icon }}</div>
    <div class="value" :style="{ color: tone }">{{ value }}</div>
    <div class="label">{{ label }}</div>
    <div class="sub">{{ sub }}</div>
  </component>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  sub: { type: String, default: '' },
  tone: { type: String, default: 'var(--cyan)' },
  to: { type: String, default: '' }
})
</script>

<style scoped>
.stat {
  display: block;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 18px 16px 16px;
  text-align: center;
  transition: 0.16s;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  border-color: #2b3a4d;
  background: var(--panel-2);
  transform: translateY(-1px);
}

.icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 10px;
}

.value {
  font-size: 27px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.5px;
}

.label {
  margin-top: 7px;
  font-size: 12px;
  color: var(--text-2);
}

.sub {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-3);
}
</style>
