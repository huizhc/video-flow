<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NAvatar,
  NButton,
  NCard,
  NCheckbox,
  NDataTable,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NPagination,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NTabPane,
  NTabs,
  NTag,
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
const customRechargeAmount = ref(20)
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
    activeTab.value =
      typeof tab === 'string' && validTabs.has(tab) ? tab : 'flow'
  },
  { immediate: true }
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
  <div class="min-h-full bg-[#1a1b20] p-4">
    <div class="flex flex-col xl:flex-row gap-6 mb-6 items-stretch">
      <n-card
        :bordered="false"
        class="profile-surface xl:flex-1 min-w-0 !rounded-2xl"
        content-class="!p-5"
      >
        <div
          class="flex flex-col sm:flex-row gap-5 items-start sm:items-center"
        >
          <n-avatar
            round
            :size="80"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face"
            class="shrink-0 ring-2 ring-white/10"
          />
          <div class="flex-1 min-w-0 space-y-3">
            <div class="text-2xl font-bold text-white tracking-tight">AIKC</div>
            <div
              class="flex items-center gap-1.5 text-white text-sm font-medium"
            >
              <n-icon :size="18" :component="Currency" class="text-amber-400" />
              5000 算力
            </div>
            <n-button
              secondary
              size="small"
              class="!bg-[#2d2d2d] !text-gray-300"
              @click="clearCache"
            >
              <template #icon>
                <n-icon :component="TrashCan" />
              </template>
              清除系统缓存
            </n-button>
          </div>
        </div>
      </n-card>

      <div
        class="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:flex-[1.4] min-w-0 w-full"
      >
        <n-card
          v-for="plan in rechargePlans"
          :key="plan.key"
          :bordered="false"
          embedded
          class="quick-recharge-card !rounded-xl cursor-pointer"
          :class="{
            'quick-recharge-card--active': selectedRecharge === plan.key,
          }"
          content-class="!p-4 h-full"
          @click="switchToRechargeTab(plan.key)"
        >
          <div
            v-if="plan.popular"
            class="absolute -top-2 left-1/2 -translate-x-1/2"
          >
            <n-tag round size="small" type="warning" :bordered="false">
              {{ plan.popular }}
            </n-tag>
          </div>
          <div
            class="h-full flex flex-col items-center justify-center text-center gap-2 min-h-[100px]"
          >
            <div class="text-amber-400 text-sm font-semibold">
              {{ plan.power }} {{ plan.bonus }}
            </div>
            <div class="text-white text-lg font-semibold">
              ¥ {{ plan.price }}
            </div>
            <n-tag
              size="small"
              round
              :bordered="false"
              class="recharge-extra-tag"
            >
              {{ plan.extra }}
            </n-tag>
          </div>
        </n-card>

        <n-card
          :bordered="false"
          embedded
          class="quick-recharge-card !rounded-xl cursor-pointer"
          content-class="!p-4 h-full"
          @click="switchToRechargeTabOnly"
        >
          <div
            class="h-full flex flex-col items-center justify-center text-center gap-2 min-h-[100px]"
          >
            <span class="text-amber-400 text-base font-bold">更多充值</span>
            <span class="text-gray-400 text-xs">点击查看</span>
          </div>
        </n-card>
      </div>
    </div>

    <n-tabs v-model:value="activeTab" type="line" animated class="profile-tabs">
      <n-tab-pane name="flow" tab="账户流水">
        <n-card
          :bordered="false"
          class="profile-surface mt-2 !rounded-xl"
          content-class="!p-4"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
          >
            <h2 class="text-base font-semibold text-white m-0">账户流水</h2>
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
                <span class="text-gray-400 text-sm mr-4 tabular-nums"
                  >Total {{ itemCount }}</span
                >
              </template>
            </n-pagination>
          </div>
        </n-card>
      </n-tab-pane>

      <n-tab-pane name="password" tab="修改密码">
        <n-card
          :bordered="false"
          class="profile-surface mt-2 max-w-md !rounded-xl"
          content-class="!p-6"
        >
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
        </n-card>
      </n-tab-pane>

      <n-tab-pane name="account" tab="账户信息">
        <n-card
          :bordered="false"
          class="profile-surface mt-2 !rounded-xl"
          content-class="!p-6"
        >
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <n-button text size="small" class="">
              <div class="w-[120px] shrink-0 flex flex-col items-center pt-2">
                <div
                  class="w-[54px] h-[54px] rounded-full border border-[#4a4a4a] text-[#8f8f8f] flex items-center justify-center"
                >
                  <n-icon :size="28" :component="User" />
                </div>

                <span
                  class="mt-3 !text-xs !text-[#8a8a8a] hover:!text-[#b5b5b5]"
                >
                  点击头像修改
                </span>
              </div>
            </n-button>

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
                  <n-button
                    color="#ef6b6b"
                    class="text-white"
                    @click="handleLogout"
                  >
                    退出登录
                  </n-button>
                  <n-button type="primary" class="text-white">
                    保存修改
                  </n-button>
                </div>
              </n-form>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <n-tab-pane name="recharge" tab="算力充值">
        <n-card
          :bordered="false"
          class="profile-surface mt-2 !rounded-xl"
          content-class="!p-3 sm:!p-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <n-card
              v-for="plan in rechargePlans"
              :key="plan.key"
              :bordered="false"
              embedded
              class="recharge-plan-card !rounded-xl cursor-pointer"
              :class="{
                'recharge-plan-card--active': selectedRecharge === plan.key,
              }"
              content-class="!px-5 !py-4"
              @click="selectedRecharge = plan.key"
            >
              <div
                class="flex items-center gap-1.5 text-[18px] font-bold text-amber-300"
              >
                <span>{{ plan.power }}</span>
                <n-tag
                  size="small"
                  round
                  :bordered="false"
                  class="recharge-bonus-tag"
                >
                  {{ plan.bonus }}
                </n-tag>
              </div>
              <div
                class="mt-2 text-[15px] leading-none font-bold text-amber-300"
              >
                ¥ {{ plan.price }}
              </div>
              <div class="mt-3 flex items-center gap-2">
                <n-tag
                  v-if="plan.popular"
                  size="small"
                  round
                  type="warning"
                  :bordered="false"
                >
                  {{ plan.popular }}
                </n-tag>
                <n-tag
                  size="small"
                  round
                  :bordered="false"
                  class="recharge-extra-tag"
                >
                  {{ plan.extra }}
                </n-tag>
              </div>
            </n-card>

            <n-card
              :bordered="false"
              embedded
              class="recharge-plan-card !rounded-xl cursor-pointer"
              content-class="!px-5 !py-4"
              @click="openSupportQr"
            >
              <div class="text-[18px] font-bold leading-[1.3] text-amber-300">
                规模用户
              </div>
              <div
                class="mt-1 text-[18px] font-bold leading-[1.3] text-amber-300"
              >
                获得额外折扣
              </div>
              <div class="mt-3">
                <span
                  class="rounded-full bg-[#f1d54b] px-2 py-[2px] text-[10px] font-semibold text-[#2d2a17]"
                >
                  联系客服
                </span>
              </div>
            </n-card>
          </div>

          <div class="mt-7 flex flex-wrap items-center gap-3 text-sm">
            <n-checkbox v-model:checked="customRechargeEnabled" />

            <n-input-number
              v-model:value="customRechargeAmount"
              :show-button="true"
              button-placement="both"
              :disabled="!customRechargeEnabled"
              placeholder="20"
              class="custom-recharge-input text-center w-[130px]"
            >
              <template #suffix>
                <span class="text-white/40">W</span>
              </template>
            </n-input-number>

            <div class="text-[20px] font-bold text-amber-300">
              ¥{{ customRechargePrice }}
            </div>
            <div class="text-[12px] font-semibold text-amber-300">
              自定义充值：输入算力数量自动计算金额
            </div>
          </div>

          <div class="mt-6 flex items-center gap-5 text-sm text-[#bdbdbd]">
            <n-radio-group v-model:value="paymentMethod" name="paymentMethod">
              <n-radio value="alipay"
                ><span :class="paymentMethod === 'alipay' ? 'text-theme' : ''"
                  >支付宝</span
                ></n-radio
              >
              <n-radio value="wechat"
                ><span :class="paymentMethod === 'wechat' ? 'text-theme' : ''"
                  >微信</span
                ></n-radio
              >
            </n-radio-group>
          </div>

          <div class="mt-5">
            <n-button type="primary" class="text-white">确认支付</n-button>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.profile-surface {
  background: #2a2b31;
  border: 1px solid #35353b;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
}
.quick-recharge-card {
  position: relative;
  background: #2b2c32;
  border: 1px solid #3a3b42;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}
.quick-recharge-card:hover {
  background: #30323a;
}
.quick-recharge-card--active {
  border-color: rgba(251, 191, 36, 0.7);
  box-shadow: 0 0 16px rgba(234, 179, 8, 0.25);
}
.recharge-plan-card {
  background: linear-gradient(180deg, #33353c 0%, #2a2b31 100%);
  border: 1px solid #3d3f46;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.recharge-plan-card:hover {
  border-color: rgba(251, 191, 36, 0.55);
}
.recharge-plan-card--active {
  border-color: rgba(251, 191, 36, 0.9);
  box-shadow: 0 0 18px rgba(234, 179, 8, 0.22);
}
.recharge-extra-tag,
.recharge-bonus-tag,
.unit-tag {
  background: #4b3918;
  color: #fcd34d;
}
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
  background: #23242a !important;
}
.profile-tabs :deep(.n-data-table-td) {
  background: #2a2b31 !important;
}
.profile-tabs :deep(.n-card),
.profile-tabs :deep(.n-card > .n-card__content) {
  background: transparent;
}
.profile-tabs :deep(.n-checkbox .n-checkbox-box) {
  background: transparent;
}
.profile-tabs :deep(.n-radio-group .n-radio-button) {
  --n-button-color: #232323;
  --n-button-color-active: #4fd1c5;
  --n-button-text-color: #cbd5e1;
  --n-button-text-color-active: #ffffff;
  --n-button-border-color: rgba(255, 255, 255, 0.12);
  --n-button-border-color-active: #4fd1c5;
}
.custom-recharge-input :deep(.n-input__input-el) {
  text-align: center;
}
.profile-tabs
  :deep(
    .n-data-table-tr:not(.n-data-table-tr--summary):hover .n-data-table-td
  ) {
  background: #30323a !important;
}
.account-form :deep(.n-form-item) {
  margin-bottom: 14px;
}
.account-form :deep(.n-form-item-label__text) {
  color: #b0b0b0;
  font-size: 14px;
}
.account-form :deep(.n-input) {
  --n-color: #202126;
  --n-color-focus: #202126;
  --n-color-disabled: #202126;
  --n-border: 1px solid rgba(255, 255, 255, 0.1);
  --n-border-hover: 1px solid rgba(255, 255, 255, 0.18);
  --n-border-focus: 1px solid rgba(79, 209, 197, 0.55);
  --n-box-shadow-focus: none;
  --n-text-color: #f3f4f6;
  --n-placeholder-color: rgba(255, 255, 255, 0.28);
}
</style>
