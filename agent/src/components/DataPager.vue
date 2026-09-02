<template>
  <div class="pager">
    <span>共 {{ total }} 条</span>
    <select class="select size" :value="pageSize" @change="emit('update:pageSize', Number($event.target.value))">
      <option :value="10">10 条/页</option>
      <option :value="20">20 条/页</option>
      <option :value="50">50 条/页</option>
    </select>
    <span class="spacer"></span>
    <button class="btn btn-sm" :disabled="page <= 1" @click="emit('update:page', page - 1)">上一页</button>
    <span class="pos">{{ page }} / {{ pageCount }}</span>
    <button class="btn btn-sm" :disabled="page >= pageCount" @click="emit('update:page', page + 1)">下一页</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})
const emit = defineEmits(['update:page', 'update:pageSize'])
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<style scoped>
.size {
  width: 96px;
  height: 26px;
}

.pos {
  min-width: 52px;
  text-align: center;
}
</style>
