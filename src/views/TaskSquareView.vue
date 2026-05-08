<script setup>
import { ref } from 'vue'
import { NButton, NDatePicker, NInput, NSelect } from 'naive-ui'

const productName = ref('')
const salesRegion = ref(null)
const coreCategory = ref(null)
const filterMode = ref(null)
const filterModel = ref(null)
const publishRange = ref(null)

const emptyOptions = []

function handleQuery() {
  // 接入列表接口时在此触发请求
}

function handleReset() {
  productName.value = ''
  salesRegion.value = null
  coreCategory.value = null
  filterMode.value = null
  filterModel.value = null
  publishRange.value = null
}
</script>

<template>
  <div class="p-4 min-h-full flex flex-col">
    <div class="flex items-baseline justify-between gap-4 mb-4">
      <h1 class="text-xl font-semibold text-white m-0">
        任务广场
      </h1>
      <span class="text-sm text-gray-500 shrink-0">共 0 条任务</span>
    </div>

    <div class="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-5 xl:grid-cols-5 gap-3">
        <n-input
          v-model:value="productName"
          size="medium"
          placeholder="筛选产品名称"
          clearable
          class="w-full min-w-0"
        />
        <n-select
          v-model:value="salesRegion"
          :options="emptyOptions"
          size="medium"
          placeholder="请选择目标销售区域"
          clearable
          class="w-full min-w-0"
        />
        <n-select
          v-model:value="coreCategory"
          :options="emptyOptions"
          size="medium"
          placeholder="请选择或输入核心类别"
          clearable
          filterable
          tag
          class="w-full min-w-0"
        />
        <n-select
          v-model:value="filterMode"
          :options="emptyOptions"
          size="medium"
          placeholder="筛选模式"
          clearable
          class="w-full min-w-0"
        />
        <n-select
          v-model:value="filterModel"
          :options="emptyOptions"
          size="medium"
          placeholder="筛选模型"
          clearable
          class="w-full min-w-0"
        />
      </div>

      <div class="flex flex-col lg:flex-row lg:items-center gap-3 mt-3">
        <div class="flex-1 min-w-0 w-full">
          <n-date-picker
            v-model:value="publishRange"
            type="daterange"
            size="medium"
            clearable
            class="w-full"
            start-placeholder="发布时间开始"
            end-placeholder="发布时间结束"
          />
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <n-button type="primary" class="min-w-[88px]" @click="handleQuery">
            查询
          </n-button>
          <n-button secondary class="min-w-[88px]" @click="handleReset">
            重置
          </n-button>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-[320px] rounded-xl border border-[#2a2a2a] bg-[#161616]" />
  </div>
</template>
