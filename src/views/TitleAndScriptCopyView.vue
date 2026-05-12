<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NInput, NSelect } from 'naive-ui'
import { Currency, Information } from '@vicons/carbon'

const productName = ref('')
const productSellingPoint = ref('')
const sourceLanguage = ref('zh')
const targetCountry = ref('vn')
const targetAudience = ref('')

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' },
  { label: '越南语', value: 'vi' },
]

const countryOptions = [
  { label: '越南', value: 'vn' },
  { label: '泰国', value: 'th' },
  { label: '马来西亚', value: 'my' },
]

const resultSections = [
  {
    label: '主题题目',
    value: 'Dưỡng Sâu Phục Hồi Tóc Hư Tổn - Nuôi Dưỡng Tóc Mượt Mà Từ Gốc',
  },
  {
    label: '主题翻译',
    value: '深层滋养修复受损发质 - 从根源滋养柔顺秀发',
  },
  {
    label: '标签',
    value: '#duongtosauphuchoitochuton#muottoc#lamdepcungtiktok#chamsocsactoc',
  },
  {
    label: '标签翻译',
    value: '#深层护发修复#受损发质#柔顺秀发#TikTok美容#健康发丝护理',
  },
  {
    label: '口播文案',
    value:
      'Bạn có mái tóc khô xơ, hư tổn? Dùng lọ Dưỡng Sâu Phục Hồi Tóc Hư Tổn sẽ giúp bạn nuôi dưỡng tóc từ gốc, mang lại mái tóc mượt mà óng ả chỉ sau vài lần sử dụng. Sản phẩm với công thức dưỡng ẩm sâu, phục hồi hư tổn, giúp tóc chắc khỏe và bồng mượt tự nhiên. Hãy thử ngay để cảm nhận sự khác biệt!',
  },
  {
    label: '口播文案翻译',
    value:
      '你有干燥受损的头发吗？别担心！深层滋养修复受损发质将帮助你从根源滋养头发，只需几次使用就能带来柔顺光泽的秀发。产品具有深层保湿配方，修复损伤，使头发强健自然光滑。立即尝试感受不同！',
  },
]

function startGenerate() {
  if (!productName.value) productName.value = '护发素'
  if (!productSellingPoint.value) productSellingPoint.value = '深层滋养，修复受损发质'
  if (!targetAudience.value) targetAudience.value = '学生党，宝妈，健身爱好者，职场白领'
}
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#000] p-[18px] text-white">
    <div class="mx-auto h-full  overflow-hidden rounded-[16px] border border-white/8 ">
      <div class="flex h-full gap-[8px] p-[8px] ">
        <section
          class="overflow-hidden w-[400px] rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] py-[12px] text-[12px] text-white/84">
            生成标题及口播文案
          </div>

          <div class="p-[12px]">
            <div class="mb-[8px]">
              <n-input v-model:value="productName" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }"
                placeholder="请输入产品名称，例如：护发素"
                class="[&_.n-input-wrapper]:!rounded-[2px] text-[12px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-white/22" />
              <div class="mt-[6px] text-[10px] text-white/28">例如：护发素</div>
            </div>

            <div class="mb-[12px]">
              <n-input v-model:value="productSellingPoint" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }"
                placeholder="请输入产品卖点，例如：深层滋养，修复受损发质"
                class="text-[12px] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[8px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-white/22" />
              <div class="mt-[6px] text-[10px] text-white/28">例如：深层滋养，修复受损发质</div>
            </div>

            <div class="mb-[10px] flex items-center gap-[10px]">
              <div class="w-[58px] shrink-0 text-[11px] text-white/52">原文语种:</div>
              <div class="min-w-0 flex-1">
                <n-select v-model:value="sourceLanguage" :options="languageOptions" size="small"
                  class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#161719] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-[11px] [&_.n-base-selection__input]:!text-[11px] [&_.n-base-selection__render-label]:!text-white/82" />
              </div>
            </div>

            <div class="mb-[10px] flex items-center gap-[10px]">
              <div class="w-[58px] shrink-0 text-[11px] text-white/52">目标国家:</div>
              <div class="min-w-0 flex-1">
                <n-select v-model:value="targetCountry" :options="countryOptions" size="small"
                  class="[&_.n-base-selection]:!min-h-[30px] [&_.n-base-selection]:!rounded-[4px] [&_.n-base-selection]:!border-white/8 [&_.n-base-selection]:!bg-[#161719] [&_.n-base-selection]:!shadow-none [&_.n-base-selection-label]:!h-[30px] [&_.n-base-selection-label]:!text-[11px] [&_.n-base-selection__input]:!text-[11px] [&_.n-base-selection__render-label]:!text-white/82" />
              </div>
            </div>

            <div class="mb-[14px] flex items-start gap-[10px]">
              <div class="w-[58px] shrink-0 pt-[8px] text-[11px] text-white/52">目标人群:</div>
              <div class="min-w-0 flex-1">
                <n-input v-model:value="targetAudience" type="textarea" :autosize="{ minRows: 2, maxRows: 2 }"
                  placeholder="例如：学生党，宝妈，健身爱好者，职场白领"
                  class="text-[12px] [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#151618] [&_.n-input-wrapper]:!px-[10px] [&_.n-input-wrapper]:!py-[6px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!text-white/82 [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-white/22" />
              </div>
            </div>

            <div class="mt-[10px] flex items-center justify-between">
              <div class="flex items-center gap-[4px] text-[11px] text-white/44">
                <span>消耗算力：</span>
                <n-icon :component="Currency" :size="13" class="text-[#ffd24c]" />
                <span class="text-[#ffd24c]">150</span>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <i class="i-mingcute-question-line text-white/48 cursor-pointer"></i>
                  </template>
                  每次消耗150算力
                </n-tooltip>
              </div>

              <n-button type="primary" size="small"
                class="!h-[30px] !rounded-[4px] text-#fff! !border-0 !bg-[#18d2e5] !px-[16px] !text-[12px] !font-medium"
                @click="startGenerate">
                开始执行
              </n-button>
            </div>
          </div>
        </section>

        <section
          class="overflow-hidden flex-1 flex flex-col rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#232323_0%,#1f1f20_100%)]">
          <div
            class="border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[14px] py-[12px] text-[12px] text-white/84">
            结果
          </div>

          <div class="p-[8px] flex-1 flex">
            <div class=" rounded-[2px] border border-white/8 bg-[#101113] px-[12px] py-[10px]">
              <div class="mb-[10px] text-[11px] text-white/36">结果示例：</div>

              <div class="space-y-[8px] text-[11px] leading-[1.65]">
                <div v-for="item in resultSections" :key="item.label" class="text-white/68">
                  <span class="mr-[8px] text-white/48">{{ item.label }}:</span>
                  <span>{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
