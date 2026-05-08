<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NInput, NSelect } from 'naive-ui'
import { Currency } from '@vicons/carbon'

const sourceLanguage = ref('zh')
const targetLanguage = ref('en')
const content = ref(`请输入要翻译的内容，例如：你有干枯受损的头发吗？别担心！深层滋养修护能从发根开始呵护你的头发，只需几次使用就能带来顺滑闪亮的秀发。产品中有促销和优惠信息，内容具有强烈促销卖点，因此需要保留语气，并确保多语言表达自然流畅、立意接近原文。`)

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
  { label: '越南语', value: 'vi' },
  { label: '泰文', value: 'th' },
]
</script>

<template>
  <div class="min-h-screen bg-[#060709] p-3 text-white">
    <div class="overflow-hidden rounded-[18px] border border-white/8 bg-[#0b0d10]">
      <div class="grid min-h-[calc(100vh-24px)] grid-cols-1 gap-x-[3px] lg:grid-cols-[275px_minmax(0,1fr)]">
        <section class="bg-[#232323]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            通用翻译
          </div>
          <div class="px-3 py-3">
            <n-input
              v-model:value="content"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 10 }"
              placeholder="请输入要翻译的内容"
              class="[&_.n-input-wrapper]:!bg-[#151719] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:!border-white/6 [&_.n-input__textarea-el]:!text-[12px] [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/74 [&_.n-input__placeholder]:!text-white/28"
            />

            <div class="mt-4 space-y-3 text-[11px] text-white/48">
              <div class="flex items-center gap-3">
                <span class="w-[44px] shrink-0">原文语种：</span>
                <n-select
                  v-model:value="sourceLanguage"
                  size="small"
                  :options="languageOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center gap-3">
                <span class="w-[44px] shrink-0">目标语种：</span>
                <n-select
                  v-model:value="targetLanguage"
                  size="small"
                  :options="languageOptions"
                  class="flex-1"
                />
              </div>
            </div>

            <div class="mt-4 flex items-center gap-1.5 text-[11px] text-amber-400/95">
              <span class="text-white/48">消耗算力：</span>
              <n-icon :size="14" :component="Currency" />
              <span class="font-medium">100</span>
            </div>

            <div class="pt-4 flex justify-end">
              <n-button
                type="primary"
                size="small"
                class="!h-[28px] !px-3 !rounded-[4px] !text-[12px]"
              >
                开始执行
              </n-button>
            </div>
          </div>
        </section>

        <section class="bg-[#232323]">
          <div class="border-b border-white/8 bg-[linear-gradient(180deg,#3a3a3a_0%,#343434_100%)] px-3 py-3 text-[12px] font-medium text-white/78 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
            结果
          </div>
          <div class="p-3">
            <div class="min-h-[calc(100vh-96px)] rounded-[2px] border border-white/6 bg-[#101214] p-3 text-[11px] leading-[1.7] text-white/38">
              <div class="mb-3 text-white/45">结果示例：</div>

              <div class="space-y-4">
                <div>
                  <div class="mb-1 text-white/6">英文</div>
                  <div>
                    Do you have dry, damaged hair? Don't worry! Deep nourishing repair for damaged hair will help nourish your hair from the roots, delivering smooth and shiny locks in just a few uses. The product features a deep moisturizing formula that repairs damage and restores hair's strength and natural shine. Try it now and feel the difference!
                  </div>
                </div>

                <div>
                  <div class="mb-1 text-white/6">越南文</div>
                  <div>
                    Tóc bạn khô xơ? Đừng lo! Dầu gội siêu DƯỠNG sẽ phục hồi hư tổn từ gốc, chỉ vài lần là có mái tóc mượt óng ánh ngay! Công thức ưu đãi đặc biệt giúp tóc chắc khỏe và bóng tự nhiên. MUA NGAY KẺO HẾT, trải nghiệm khác biệt liền!
                  </div>
                </div>

                <div>
                  <div class="mb-1 text-white/6">泰文</div>
                  <div>
                    คุณมีผมแห้งเสียใช่ไหม ไม่ต้องกังวล! การบำรุงล้ำลึกเพื่อซ่อมแซมผมเสียจะช่วยฟื้นฟูเส้นผมจากราก ทำให้ผมนุ่มลื่นและเงางามได้ในเวลาไม่นาน ผลิตภัณฑ์นี้มีสูตรให้ความชุ่มชื้นลึก ซ่อมแซมความเสียหาย และทำให้ผมแข็งแรงเป็นธรรมชาติ ลองแล้วจะรู้ถึงความแตกต่างทันที!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
