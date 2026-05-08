<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { Currency, TrashCan, User } from '@vicons/carbon'
import { useAuthStore } from '@/stores/auth'
import { useSupportStore } from '@/stores/support'

const activeTab = ref('flow')
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const supportStore = useSupportStore()

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

const accountForm = reactive({
  nickname: '9527',
  email: '',
  phone: '13232428227',
})

const rechargePlans = [
  {
    key: '200w',
    power: '200w',
    bonus: '+20K',
    price: '2000',
    extra: '额外赠送 1%',
  },
  {
    key: '500w',
    power: '500w',
    bonus: '+100K',
    price: '5000',
    extra: '额外赠送 2%',
    popular: '82%用户选择',
  },
  {
    key: '980w',
    power: '980w',
    bonus: '+490K',
    price: '9800',
    extra: '额外赠送 5%',
  },
]

const selectedRecharge = ref('500w')
const customRechargeEnabled = ref(false)
const customRechargeAmount = ref('20')
const paymentMethod = ref('alipay')

const customRechargePrice = computed(() => {
  const amount = Number(customRechargeAmount.value || 0)
  if (!Number.isFinite(amount) || amount <= 0) return '0.00'
  return (amount * 9.9).toFixed(2)
})

const validTabs = new Set(['flow', 'password', 'account', 'recharge'])

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = typeof tab === 'string' && validTabs.has(tab) ? tab : 'flow'
  },
  { immediate: true },
)

function handleSearchFlow() {}
function clearCache() {}

function handleLogout() {
  auth.logout()
  router.replace({ name: 'login' })
}

function switchToRechargeTab(planKey) {
  if (planKey) selectedRecharge.value = planKey
  activeTab.value = 'recharge'
  router.replace({
    query: {
      ...route.query,
      tab: 'recharge',
    },
  })
}

function switchToRechargeTabOnly() {
  switchToRechargeTab()
}

function openSupportQr() {
  supportStore.openQr()
}
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
        <button
          type="button"
          class="rounded-xl p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center cursor-pointer transition-colors w-full"
          :class="
            selectedRecharge === '200w'
              ? 'bg-[#242424] border-2 border-amber-400/70 shadow-[0_0_16px_rgba(234,179,8,0.25)]'
              : 'bg-[#242424] border border-[#333333] hover:bg-[#2a2a2a]'
          "
          @click="switchToRechargeTab('200w')"
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
        </button>

        <button
          type="button"
          class="rounded-xl bg-[#242424] p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center relative cursor-pointer transition-colors w-full"
          :class="
            selectedRecharge === '500w'
              ? 'border-2 border-amber-400/70 shadow-[0_0_16px_rgba(234,179,8,0.25)]'
              : 'border border-[#333333] hover:bg-[#2a2a2a]'
          "
          @click="switchToRechargeTab('500w')"
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
        </button>

        <button
          type="button"
          class="rounded-xl p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center cursor-pointer transition-colors w-full"
          :class="
            selectedRecharge === '980w'
              ? 'bg-[#242424] border-2 border-amber-400/70 shadow-[0_0_16px_rgba(234,179,8,0.25)]'
              : 'bg-[#242424] border border-[#333333] hover:bg-[#2a2a2a]'
          "
          @click="switchToRechargeTab('980w')"
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
        </button>

        <button
          type="button"
          class="rounded-xl bg-[#242424] border border-[#333333] p-4 flex flex-col items-center text-center gap-2 min-h-[132px] justify-center cursor-pointer hover:bg-[#2a2a2a] transition-colors w-full"
          @click="switchToRechargeTabOnly"
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
            <div class="flex items-center gap-3">
              <n-button type="primary" class="text-white">保存</n-button>
            </div>
          </n-form>
        </div>
      </n-tab-pane>

      <n-tab-pane name="account" tab="账户信息">
        <div class="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 mt-2">
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <div class="w-[120px] shrink-0 flex flex-col items-center pt-2">
              <div
                class="w-[54px] h-[54px] rounded-full border border-[#4a4a4a] text-[#8f8f8f] flex items-center justify-center"
              >
                <n-icon :size="28" :component="User" />
              </div>
              <button
                type="button"
                class="mt-3 text-xs text-[#8a8a8a] bg-transparent border-0 p-0 cursor-pointer hover:text-[#b5b5b5] transition-colors"
              >
                点击头像修改
              </button>
            </div>

            <div class="flex-1 min-w-0 max-w-[620px]">
              <n-form
                :model="accountForm"
                label-placement="left"
                label-width="64"
                class="account-form"
              >
                <n-form-item label="昵称">
                  <n-input v-model:value="accountForm.nickname" />
                </n-form-item>
                <n-form-item label="邮箱">
                  <n-input v-model:value="accountForm.email" />
                </n-form-item>
                <n-form-item label="电话">
                  <n-input v-model:value="accountForm.phone" />
                </n-form-item>
                <div class="flex items-center gap-28 pt-1 pl-[64px]">
                  <n-button color="#ef6b6b" class="text-white" @click="handleLogout">
                    退出登录
                  </n-button>
                  <n-button type="primary" class="text-white">
                    保存修改
                  </n-button>
                </div>
              </n-form>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="recharge" tab="算力充值">
        <div class="rounded-xl bg-[#1f1f1f] border border-[#2a2a2a] p-3 sm:p-4 mt-2">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <button
              v-for="plan in rechargePlans"
              :key="plan.key"
              type="button"
              class="relative cursor-pointer min-h-[84px] rounded-xl bg-[linear-gradient(180deg,#363636_0%,#2a2a2a_100%)] px-5 py-4 text-left border transition-all"
              :class="
                selectedRecharge === plan.key
                  ? 'border-amber-400/90 shadow-[0_0_18px_rgba(234,179,8,0.22)]'
                  : 'border-[#3b3b3b] hover:border-amber-400/55'
              "
              @click="selectedRecharge = plan.key"
            >
              <div class="flex items-center gap-1.5 text-[18px] font-bold text-amber-300">
                <span>{{ plan.power }}</span>
                <span
                  class="rounded-full border border-amber-500/25 bg-[#4b3918] px-1.5 py-[1px] text-[10px] leading-none text-amber-300"
                >
                  {{ plan.bonus }}
                </span>
              </div>
              <div class="mt-2 text-[15px] leading-none font-bold text-amber-300">¥ {{ plan.price }}</div>
              <div class="mt-3 flex items-center gap-2">
                <span
                  v-if="plan.popular"
                  class="rounded-full bg-[#f1d54b] px-2 py-[2px] text-[10px] font-semibold text-[#2d2a17]"
                >
                  {{ plan.popular }}
                </span>
                <span
                  class="rounded-full border border-amber-500/20 bg-[#4b3918] px-2 py-[2px] text-[10px] font-semibold text-amber-300"
                >
                  {{ plan.extra }}
                </span>
              </div>
            </button>

            <button
              type="button"
              class="cursor-pointer min-h-[84px] rounded-xl border border-[#3b3b3b] bg-[linear-gradient(180deg,#363636_0%,#2a2a2a_100%)] px-5 py-4 text-left hover:border-amber-400/55 transition-colors"
              @click="openSupportQr"
            >
              <div class="text-[18px] font-bold leading-[1.3] text-amber-300">规模用户</div>
              <div class="mt-1 text-[18px] font-bold leading-[1.3] text-amber-300">获得额外折扣</div>
              <div class="mt-3">
                <span class="rounded-full bg-[#f1d54b] px-2 py-[2px] text-[10px] font-semibold text-[#2d2a17]">
                  联系客服
                </span>
              </div>
            </button>
          </div>

          <div class="mt-7 flex flex-wrap items-center gap-3 text-sm">
            <label class="flex items-center">
              <input
                v-model="customRechargeEnabled"
                type="checkbox"
                class="h-3.5 w-3.5 rounded border border-white/20 bg-transparent accent-[#14d2e2]"
              />
            </label>

            <div class="flex items-center rounded-[4px] border border-[#383838] bg-[#262626] h-8 overflow-hidden">
              <input
                v-model="customRechargeAmount"
                type="text"
                class="w-16 h-full bg-transparent px-3 text-center text-sm text-white outline-none"
              />
              <span class="flex h-full w-8 items-center justify-center border-l border-[#383838] text-[#7d7d7d] text-xs">
                W
              </span>
            </div>

            <div class="text-[20px] font-bold text-amber-300">¥{{ customRechargePrice }}</div>
            <div class="text-[12px] font-semibold text-amber-300">自定义充值：输入算力数量自动计算金额</div>
          </div>

          <div class="mt-6 flex items-center gap-5 text-sm text-[#bdbdbd]">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                name="paymentMethod"
                value="alipay"
                class="h-3.5 w-3.5 accent-[#14d2e2]"
              />
              <span class="text-[#14d2e2] font-medium">支付宝</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                name="paymentMethod"
                value="wechat"
                class="h-3.5 w-3.5 accent-[#9ca3af]"
              />
              <span>微信</span>
            </label>
          </div>

          <div class="mt-5">
            <n-button
              type="button"
              class="h-9 rounded-[4px] bg-[#14d2e2] px-4 text-[13px] font-semibold text-white hover:bg-[#28d9e7] transition-colors"
            >
              确认支付
            </n-button>
          </div>
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
.account-form :deep(.n-form-item) {
  margin-bottom: 14px;
}
.account-form :deep(.n-form-item-label__text) {
  color: #b0b0b0;
  font-size: 14px;
}
.account-form :deep(.n-input) {
  --n-color: #232323;
  --n-color-focus: #232323;
  --n-color-disabled: #232323;
  --n-border: 1px solid rgba(255, 255, 255, 0.1);
  --n-border-hover: 1px solid rgba(255, 255, 255, 0.18);
  --n-border-focus: 1px solid rgba(79, 209, 197, 0.55);
  --n-box-shadow-focus: none;
  --n-text-color: #f3f4f6;
  --n-placeholder-color: rgba(255, 255, 255, 0.28);
}
</style>
