<script setup>
import { ref } from 'vue'
import {
  NAvatar,
  NButton,
  NDataTable,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NPagination,
  NSelect,
  NTabPane,
  NTabs,
  NIcon,
} from 'naive-ui'
import { Currency, TrashCan } from '@vicons/carbon'

const activeTab = ref('flow')

const bizType = ref(null)
const dateRange = ref(null)
const page = ref(1)
const pageSize = ref(20)
const total = ref(1)

const bizTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '赠送', value: 'gift' },
  { label: '消费', value: 'consume' },
  { label: '充值', value: 'recharge' },
]

const tableData = ref([
  {
    appId: '000000008',
    serial: 'REGISTER_1778139448825',
    createdAt: '2026-05-07 15:37:29',
    bizType: '赠送',
    bizMethod: '新用户注册奖励',
    powerDelta: '5000',
  },
])

const columns = [
  { title: '应用编号', key: 'appId', ellipsis: { tooltip: true } },
  { title: '流水号', key: 'serial', ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdAt', width: 180 },
  { title: '业务类型', key: 'bizType', width: 100 },
  { title: '业务方式', key: 'bizMethod', ellipsis: { tooltip: true } },
  { title: '算力变动', key: 'powerDelta', width: 110 },
]

const pwdForm = ref({
  old: '',
  next: '',
  confirm: '',
})

function handleSearchFlow() {}
function clearCache() {}
</script>

<template>
  <div class="min-h-full bg-[#121212] p-4">
    <div
      class="flex flex-col xl:flex-row gap-6 mb-6 items-stretch"
    >
      <div
        class="flex flex-col sm:flex-row gap-5 items-start sm:items-center rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] p-5 xl:flex-1 min-w-0"
      >
        <n-avatar
          round
          :size="80"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face"
          class="shrink-0 ring-2 ring-white/10"
        />
        <div class="flex-1 min-w-0 space-y-3">
          <div class="text-2xl font-bold text-white tracking-tight">
            9527
          </div>
          <div class="flex items-center gap-1.5 text-white text-sm font-medium">
            <n-icon :size="18" :component="Currency" class="text-amber-400" />
            5000 算力
          </div>
          <n-button secondary size="small" class="!bg-[#2d2d2d] !text-gray-300" @click="clearCache">
            <template #icon>
              <n-icon :component="TrashCan" />
            </template>
            清除系统缓存
          </n-button>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:flex-[1.4] min-w-0 w-full">
        <div
          class="rounded-xl bg-[#242424] border border-[#333333] p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center"
        >
          <div class="text-amber-400 text-sm font-semibold">
            200w +20K
          </div>
          <div class="text-white text-lg font-semibold">
            ¥ 2000
          </div>
          <span
            class="text-[11px] px-2 py-0.5 rounded bg-[#3d2e18] text-orange-400 border border-orange-900/40"
          >
            额外赠送 1%
          </span>
        </div>

        <div
          class="rounded-xl bg-[#242424] p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center relative border-2 border-amber-400/70 shadow-[0_0_16px_rgba(234,179,8,0.25)]"
        >
          <span
            class="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap"
          >
            82%用户选择
          </span>
          <div class="text-amber-400 text-sm font-semibold mt-2">
            500w +100K
          </div>
          <div class="text-white text-lg font-semibold">
            ¥ 5000
          </div>
          <span
            class="text-[11px] px-2 py-0.5 rounded bg-[#3d2e18] text-orange-400 border border-orange-900/40"
          >
            额外赠送 2%
          </span>
        </div>

        <div
          class="rounded-xl bg-[#242424] border border-[#333333] p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center"
        >
          <div class="text-amber-400 text-sm font-semibold">
            980w +490K
          </div>
          <div class="text-white text-lg font-semibold">
            ¥ 9800
          </div>
          <span
            class="text-[11px] px-2 py-0.5 rounded bg-[#3d2e18] text-orange-400 border border-orange-900/40"
          >
            额外赠送 5%
          </span>
        </div>

        <button
          type="button"
          class="rounded-xl bg-[#242424] p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[132px] border-2 border-amber-400/70 shadow-[0_0_16px_rgba(234,179,8,0.25)] cursor-pointer hover:bg-[#2a2a2a] transition-colors w-full"
        >
          <span class="text-amber-400 text-base font-bold">更多充值</span>
          <span class="text-gray-400 text-xs">点击查看</span>
        </button>
      </div>
    </div>

    <n-tabs
      v-model:value="activeTab"
      type="line"
      animated
      class="profile-tabs"
    >
      <n-tab-pane name="flow" tab="账户流水">
        <div
          class="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-4 mt-2"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 class="text-base font-semibold text-white m-0">
              账户流水
            </h2>
            <div class="flex flex-wrap items-center gap-2 justify-end">
              <n-select
                v-model:value="bizType"
                :options="bizTypeOptions"
                placeholder="业务类型"
                clearable
                size="small"
                class="w-36"
                :consistent-menu-width="false"
              />
              <n-date-picker
                v-model:value="dateRange"
                type="daterange"
                size="small"
                clearable
                class="min-w-[240px]"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <n-button type="primary" size="small" @click="handleSearchFlow">
                搜索
              </n-button>
            </div>
          </div>

          <n-data-table
            :columns="columns"
            :data="tableData"
            :bordered="false"
            :single-line="false"
            size="small"
            class="rounded-lg overflow-hidden"
          />

          <div class="flex justify-end mt-4">
            <n-pagination
              v-model:page="page"
              v-model:page-size="pageSize"
              :item-count="total"
              :page-sizes="[10, 20, 50]"
              show-size-picker
              show-quick-jumper
              size="medium"
            >
              <template #prefix="{ itemCount }">
                <span class="text-gray-400 text-sm mr-4 tabular-nums">Total {{ itemCount }}</span>
              </template>
            </n-pagination>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="password" tab="修改密码">
        <div class="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 mt-2 max-w-md">
          <n-form label-placement="top" label-width="auto">
            <n-form-item label="当前密码">
              <n-input
                v-model:value="pwdForm.old"
                type="password"
                show-password-on="click"
                placeholder="请输入当前密码"
              />
            </n-form-item>
            <n-form-item label="新密码">
              <n-input
                v-model:value="pwdForm.next"
                type="password"
                show-password-on="click"
                placeholder="请输入新密码"
              />
            </n-form-item>
            <n-form-item label="确认新密码">
              <n-input
                v-model:value="pwdForm.confirm"
                type="password"
                show-password-on="click"
                placeholder="请再次输入新密码"
              />
            </n-form-item>
            <n-button type="primary">
              保存
            </n-button>
          </n-form>
        </div>
      </n-tab-pane>

      <n-tab-pane name="account" tab="账户信息">
        <div class="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 mt-2 max-w-lg space-y-4">
          <div class="flex justify-between py-2 border-b border-[#2a2a2a] text-sm">
            <span class="text-gray-500">手机号</span>
            <span class="text-white">138****0000</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#2a2a2a] text-sm">
            <span class="text-gray-500">邮箱</span>
            <span class="text-white">user@example.com</span>
          </div>
          <div class="flex justify-between py-2 text-sm">
            <span class="text-gray-500">注册时间</span>
            <span class="text-white">2026-05-07</span>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="recharge" tab="算力充值">
        <div
          class="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-8 mt-2 text-center text-gray-400 text-sm"
        >
          请在上方的充值卡片中选择套餐，或点击「更多充值」查看全部档位。
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.profile-tabs :deep(.n-tabs-nav) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.profile-tabs :deep(.n-tabs-tab--active) {
  color: #4fd1c5 !important;
  font-weight: 600;
}
.profile-tabs :deep(.n-tabs-bar) {
  background-color: #4fd1c5 !important;
}
.profile-tabs :deep(.n-tabs-tab:hover) {
  color: #e5e7eb;
}
.profile-tabs :deep(.n-data-table-th) {
  background: #141414 !important;
}
.profile-tabs :deep(.n-data-table-td) {
  background: #1a1a1a !important;
}
.profile-tabs :deep(.n-data-table-tr:not(.n-data-table-tr--summary):hover .n-data-table-td) {
  background: #222222 !important;
}
</style>
