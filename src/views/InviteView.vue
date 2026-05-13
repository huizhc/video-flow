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

        <button
          type="button"
          class="mt-6 h-[40px] rounded-[6px] border-0 bg-[#15d0e2] px-8 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(21,208,226,0.22)] transition-colors hover:bg-[#2ad7e7]"
        >
          立即邀请
        </button>
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
  </div>
</template>
