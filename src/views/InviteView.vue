<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, NModal, useMessage } from 'naive-ui'
import { Close } from '@vicons/carbon'

const message = useMessage()

const inviteModalVisible = ref(false)
const inviteCode = ref('iqVcuzbq')

const inviteLink = computed(
  () =>
    // `https://www.baidu.com/register?inviteCode=${encodeURIComponent(inviteCode.value)}`
    `111`
)

function openInviteModal() {
  inviteModalVisible.value = true
}

function closeInviteModal() {
  inviteModalVisible.value = false
}

async function handleCopyInviteLink() {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteLink.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = inviteLink.value
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    message.success('邀请链接已复制')
  } catch {
    message.error('复制失败，请手动复制')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-[linear-gradient(180deg,#232428_0%,#202124_100%)] px-4 py-6 text-white"
  >
    <div class="mx-auto max-w-[980px] rounded-[24px] px-4 py-8 sm:px-8">
      <div class="mx-auto flex max-w-[420px] flex-col items-center text-center">
        <h1 class="m-0 text-[28px] leading-tight font-bold tracking-[0.01em]">
          邀请好友，可获得<span class="text-[#18d4e5]">10000算力</span>
        </h1>
        <p class="mt-4 mb-0 text-[14px] font-semibold text-white/80">
          多邀多得，奖励无上限！
        </p>

        <div
          class="mt-4 w-full overflow-hidden rounded-[18px] bg-[#1e2026] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
            alt="邀请有礼"
            class="h-[146px] w-full object-cover"
            referrerpolicy="no-referrer"
          />
        </div>

        <n-button
          type="primary"
          class="mt-6 !h-[40px] !rounded-[6px] !border-0 !bg-[#15d0e2] !px-8 !text-[14px] !font-semibold !text-white shadow-[0_8px_20px_rgba(21,208,226,0.22)] hover:!bg-[#2ad7e7]"
          @click="openInviteModal"
        >
          立即邀请
        </n-button>
      </div>

      <div
        class="mx-auto mt-8 max-w-[560px] rounded-[16px] bg-[linear-gradient(180deg,rgba(39,39,39,0.82)_0%,rgba(34,34,34,0.88)_100%)] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)] sm:p-6"
      >
        <section>
          <h2 class="m-0 text-[26px] leading-none font-bold text-[#18d4e5]">
            邀请人奖励
          </h2>
          <div class="mt-4 overflow-hidden rounded-[2px] border border-white/6">
            <table class="w-full border-collapse text-left text-[13px]">
              <thead class="bg-[#0f1012] text-white/60">
                <tr>
                  <th class="border-b border-white/6 px-3 py-3 font-medium">
                    邀请方式/可得奖励
                  </th>
                  <th
                    class="border-b border-l border-white/6 px-3 py-3 font-medium"
                  >
                    活动奖励
                  </th>
                </tr>
              </thead>
              <tbody class="bg-[#101113] text-white/86">
                <tr>
                  <td class="border-b border-white/6 px-3 py-3">注册</td>
                  <td class="border-b border-l border-white/6 px-3 py-3">
                    10000算力
                  </td>
                </tr>
                <tr>
                  <td class="px-3 py-3">充值</td>
                  <td class="border-l border-white/6 px-3 py-3">
                    额外赠送算力（详情查看充值页面）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mt-5">
          <h2 class="m-0 text-[26px] leading-none font-bold text-[#18d4e5]">
            被邀请人奖励
          </h2>
          <div class="mt-4 overflow-hidden rounded-[2px] border border-white/6">
            <table class="w-full border-collapse text-left text-[13px]">
              <thead class="bg-[#0f1012] text-white/60">
                <tr>
                  <th class="border-b border-white/6 px-3 py-3 font-medium">
                    邀请方式/可得奖励
                  </th>
                  <th
                    class="border-b border-l border-white/6 px-3 py-3 font-medium"
                  >
                    活动奖励
                  </th>
                </tr>
              </thead>
              <tbody class="bg-[#101113] text-white/86">
                <tr>
                  <td class="border-b border-white/6 px-3 py-3">注册</td>
                  <td class="border-b border-l border-white/6 px-3 py-3">
                    10000算力
                  </td>
                </tr>
                <tr>
                  <td class="px-3 py-3">
                    被邀请人充值（30W算力或以上），邀请人可获奖励
                  </td>
                  <td class="border-l border-white/6 px-3 py-3">5000算力</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mt-5">
          <h2 class="m-0 text-[26px] leading-none font-bold text-[#18d4e5]">
            活动规则说明
          </h2>
          <ol
            class="mt-4 mb-0 list-decimal pl-6 text-[13px] leading-7 text-white/76"
          >
            <li>邀请对象：仅限非当前会员的用户。</li>
            <li>奖励发放：奖励将在好友成功注册和充值后发放。</li>
            <li>奖励无上限，邀请越多奖励越多。</li>
            <li>如有作弊行为，将取消奖励资格。</li>
          </ol>
        </section>
      </div>
    </div>

    <n-modal
      v-model:show="inviteModalVisible"
      :mask-closable="true"
      :auto-focus="false"
      :trap-focus="false"
      class="mt-[200px]!"
    >
      <div
        class="relative w-[620px] max-w-[calc(100vw-24px)] rounded-[10px] bg-[#151515] px-4 pb-[18px] pt-[22px] shadow-[0_24px_56px_rgba(0,0,0,0.46)] sm:px-8 sm:pb-8 sm:pt-2"
      >
        <button
          type="button"
          class="absolute right-3 top-3 inline-flex cursor-pointer items-center justify-center border-0 bg-transparent text-white/46 transition-colors hover:text-white/72"
          aria-label="关闭"
          @click="closeInviteModal"
        >
          <n-icon :size="26">
            <Close />
          </n-icon>
        </button>

        <div
          class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-[18px]"
        >
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
            alt="邀请好友"
            class="h-[76px] w-[140px] flex-shrink-0 rounded-[14px] bg-white object-cover sm:h-[84px] sm:w-[160px]"
            referrerpolicy="no-referrer"
          />
          <div class="min-w-0 text-sm">
            <h3 class="m-0 text-sm leading-[1.8] font-bold text-white">
              复制链接给好友，好友注册后，双方即可获得奖励
            </h3>
            <p class="mt-2 mb-0 text-sm leading-[1.7] font-bold text-[#16cfe0]">
              您的邀请码：<span class="ml-1.5">{{ inviteCode }}</span>
            </p>
          </div>
        </div>

        <div
          class="mt-5 flex p-2 flex-col items-stretch gap-3 rounded-[8px] bg-[#242428] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:flex-row sm:items-center sm:gap-4 sm:px-4"
        >
          <n-input
            :value="inviteLink"
            readonlymt-5
            flex
            flex-col
            items-stretch
            gap-3
            rounded-[16px]
            bg-[#242428]
            p-3
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]
            sm:flex-row
            sm:items-center
            sm:gap-4
            sm:px-4
            sm:py-[14px]
            class="flex-1"
            :style="{
              '--n-height': '20px',
              '--n-color': 'transparent',
              '--n-color-focus': 'transparent',
              '--n-text-color': '#ffffff',
              '--n-font-size': '14px',
              '--n-border': '0px solid transparent',
              '--n-border-hover': '0px solid transparent',
              '--n-border-focus': '0px solid transparent',
              '--n-box-shadow-focus': 'none',
              '--n-padding-left': '0px',
              '--n-padding-right': '0px',
            }"
          />
          <n-button
            type="primary"
            class="w-full !rounded-[8px] !border-0 !bg-[#1ac7d9] !text-sm !font-semibold !text-white hover:!bg-[#28d5e6] sm:w-auto"
            @click="handleCopyInviteLink"
          >
            复制链接
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>
