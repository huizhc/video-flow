<script setup>
import { computed, ref } from 'vue'
import { NButton, NDatePicker, NInput, NModal, NSelect } from 'naive-ui'
import { Close } from '@vicons/carbon'

const productName = ref('')
const salesRegion = ref(null)
const coreCategory = ref(null)
const filterMode = ref(null)
const filterModel = ref(null)
const publishRange = ref(null)
const detailVisible = ref(false)
const selectedTaskId = ref(null)

const emptyOptions = []

const taskItems = [
  {
    id: 1,
    title: 'SIMC角蛋白发膜',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '精打细算大马妈妈',
    sellingPoint: '植萃养护「人参/何首乌...',
    note: '侧重于省钱攻略与成分党视觉',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785666',
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "女性手持绿色发膜产品，浴室环境，真实自然光"
    }
  ]
}`,
  },
  {
    id: 2,
    title: 'SIMC角蛋白发膜',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '精打细算大马妈妈',
    sellingPoint: '即时柔顺，告别频繁梳...',
    note: '千视党上的“潜在发丝危机”视角',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785666',
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "展示顺滑发丝细节，产品置于镜前台面"
    }
  ]
}`,
  },
  {
    id: 3,
    title: 'SIMC角蛋白发膜',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '精打细算大马妈妈',
    sellingPoint: '多肽与角蛋白双重修护...',
    note: '侧重于浴室真实焕新体验',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785666',
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "头发修护前后对比，暖色灯光，近景"
    }
  ]
}`,
  },
  {
    id: 4,
    title: 'SIMC 植物炫彩泡泡染发剂',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '精打细算主妇',
    sellingPoint: '发廊染发太贵 (Salun M...',
    note: '重点通过RM200账单与...',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785667',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "泡泡染发剂瓶身特写，浴室白色瓷砖背景"
    }
  ]
}`,
  },
  {
    id: 5,
    title: 'SIMC 植物炫彩泡泡染发剂',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '孝心子女/代购党',
    sellingPoint: '5重草本萃粹，不黑头...',
    note: '针对担心化学成分伤发...',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785667',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "草本成分插画与产品同框，清新绿色背景"
    }
  ]
}`,
  },
  {
    id: 6,
    title: 'SIMC 植物炫彩泡泡染发剂',
    region: '马来西亚',
    category: '美妆与个护',
    duration: '40秒',
    model: 'veo3.1',
    audience: '忙碌职场新人',
    sellingPoint: '15分钟泡泡染，遮白不...',
    note: '针对大马职场高压、通...',
    publishTime: '2026-05-09 13:13',
    productCode: '7967803053100785667',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
    videoScript: `json
{
  "image_generation_model": "NanoBananaPro",
  "grid_layout": "2x3",
  "grid_aspect_ratio": "9:16",
  "global_watermark": "SIMC Hair Care",
  "shots": [
    {
      "shot": 1,
      "duration": "4s",
      "prompt": "都市职场女性快速泡泡染，清晨洗漱场景"
    }
  ]
}`,
  },
]

const filteredTaskItems = computed(() => taskItems)
const selectedTask = computed(
  () => taskItems.find((item) => item.id === selectedTaskId.value) ?? null
)

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

function openTaskDetail(item) {
  selectedTaskId.value = item.id
  detailVisible.value = true
}

function closeTaskDetail() {
  detailVisible.value = false
}
</script>

<template>
  <div class="min-h-full bg-[#232326] p-4">
    <div
      class="mb-4 rounded-xl border border-[#34343a] bg-[#2a2a2f] shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
    >
      <div
        class="flex items-baseline justify-between gap-4 border-b border-white/6 px-4 py-4"
      >
        <h1 class="m-0 text-xl font-semibold text-white">任务广场</h1>
        <span class="shrink-0 text-sm text-white/42">共 0 条任务</span>
      </div>

      <div class="p-4">
        <div class="flex flex-wrap gap-3 [&>div]:w-[210px]!">
          <n-input
            v-model:value="productName"
            size="medium"
            placeholder="筛选产品名称"
            clearable
            class="task-square-field w-full min-w-0"
          />
          <n-select
            v-model:value="salesRegion"
            :options="emptyOptions"
            size="medium"
            placeholder="请选择目标销售区域"
            clearable
            class="task-square-field w-full min-w-0"
          />
          <n-select
            v-model:value="coreCategory"
            :options="emptyOptions"
            size="medium"
            placeholder="请选择或输入核心类别"
            clearable
            filterable
            tag
            class="task-square-field w-full min-w-0"
          />
          <n-select
            v-model:value="filterMode"
            :options="emptyOptions"
            size="medium"
            placeholder="筛选模式"
            clearable
            class="task-square-field w-full min-w-0"
          />
          <n-select
            v-model:value="filterModel"
            :options="emptyOptions"
            size="medium"
            placeholder="筛选模型"
            clearable
            class="task-square-field w-full min-w-0"
          />
          <n-date-picker
            v-model:value="publishRange"
            type="daterange"
            size="medium"
            clearable
            class="task-square-field min-w-[400px]!"
            start-placeholder="发布时间开始"
            end-placeholder="发布时间结束"
          />
          <div>
            <n-button type="primary" class="" @click="handleQuery">
              查询
            </n-button>
            <n-button secondary class="ml-[15px]" @click="handleReset">
              重置
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-[320px]">
      <div class="grid grid-cols-1 gap-3 xl:grid-cols-3 2xl:grid-cols-3">
        <article
          v-for="item in filteredTaskItems"
          :key="item.id"
          class="group cursor-pointer overflow-hidden rounded-[10px] border border-[#35353b] bg-[#2b2b30] shadow-[0_10px_24px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#18d2e5] hover:bg-[#303038] hover:shadow-[0_0_0_1px_rgba(24,210,229,0.6),0_18px_40px_rgba(0,0,0,0.34)]"
          @click="openTaskDetail(item)"
        >
          <div
            class="flex items-center justify-between border-b border-white/6 bg-[#313138] px-3 py-[12px] transition-colors duration-300 group-hover:border-[#18d2e5]/14 group-hover:bg-[#363640]"
          >
            <h3
              class="m-0 truncate pr-3 text-[15px] font-semibold text-white transition-colors duration-300"
            >
              {{ item.title }}
            </h3>
            <span
              class="shrink-0 rounded-[4px] bg-[#5f4314] px-2 py-[2px] text-[10px] leading-none text-[#ffb84d] transition-colors duration-300 group-hover:bg-[#6c521b] group-hover:text-[#ffc86b]"
            >
              {{ item.region }}
            </span>
          </div>

          <div
            class="flex gap-3 bg-[#2b2b30] px-3 py-3 transition-colors duration-300 group-hover:bg-[#303038]"
          >
            <div
              class="relative h-[106px] w-[74px] shrink-0 overflow-hidden rounded-[6px] border border-white/8"
            >
              <img
                :src="item.image"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                referrerpolicy="no-referrer"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(24,210,229,0)_35%,rgba(24,210,229,0.14)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div class="min-w-0 flex-1 space-y-[5px] text-[12px] leading-[1.4]">
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">品类:</span>
                <span class="truncate text-white/84">{{ item.category }}</span>
              </div>
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">时长:</span>
                <span class="truncate text-white/84">{{ item.duration }}</span>
              </div>
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">模型:</span>
                <span class="truncate text-white/84">{{ item.model }}</span>
              </div>
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">人群:</span>
                <span class="truncate text-white/84">{{ item.audience }}</span>
              </div>
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">卖点:</span>
                <span class="truncate text-white/84">{{
                  item.sellingPoint
                }}</span>
              </div>
              <div class="flex">
                <span class="w-[40px] shrink-0 text-white/38">备注:</span>
                <span class="truncate text-white/84">{{ item.note }}</span>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-white/6 bg-[#2b2b30] px-3 py-2 text-[11px] text-white/34 transition-colors duration-300 group-hover:border-[#18d2e5]/14 group-hover:bg-[#303038]"
          >
            <span>发布时间： {{ item.publishTime }}</span>
          </div>
        </article>
      </div>
    </div>

    <n-modal
      v-model:show="detailVisible"
      preset="card"
      :bordered="false"
      :mask-closable="true"
      class="w-[760px] max-w-[92vw] !rounded-[8px] !bg-[#202126] !shadow-[0_20px_80px_rgba(0,0,0,0.55)] [&_.n-card-header]:!hidden [&_.n-card__content]:!p-0"
    >
      <div
        v-if="selectedTask"
        class="rounded-[8px] border border-white/8 bg-[#26272c]"
      >
        <div
          class="flex items-center justify-between border-b border-white/8 px-[14px] py-[10px]"
        >
          <div class="text-[18px] font-semibold text-white">任务详情</div>
          <button
            type="button"
            class="inline-flex h-[24px] w-[24px] items-center justify-center rounded-[4px] border-0 bg-transparent p-0 text-white/36 transition hover:text-white/72"
            @click="closeTaskDetail"
          >
            <close class="h-[16px] w-[16px]" />
          </button>
        </div>

        <div
          class="px-[14px] py-[12px] text-[13px] leading-[1.75] text-white/72"
        >
          <div class="grid grid-cols-2 gap-x-[34px] gap-y-[2px]">
            <div>
              <span class="text-white/42">产品：</span>{{ selectedTask.title }}
            </div>
            <div>
              <span class="text-white/42">区域：</span>{{ selectedTask.region }}
            </div>
            <div>
              <span class="text-white/42">品类：</span
              >{{ selectedTask.category }}
            </div>
            <div>
              <span class="text-white/42">人群：</span
              >{{ selectedTask.audience }}
            </div>
            <div>
              <span class="text-white/42">时长：</span
              >{{ selectedTask.duration }}
            </div>
            <div>
              <span class="text-white/42">模型：</span>{{ selectedTask.model }}
            </div>
            <div>
              <span class="text-white/42">发布人：</span
              >{{ selectedTask.productCode }}
            </div>
            <div>
              <span class="text-white/42">发布时间：</span
              >{{ selectedTask.publishTime }}
            </div>
          </div>

          <div class="mt-[6px]">
            <span class="text-white/42">卖点：</span
            >{{ selectedTask.sellingPoint }}
          </div>
          <div class="mt-[2px]">
            <span class="text-white/42">备注：</span>{{ selectedTask.note }}
          </div>

          <div class="mt-[6px] flex items-start gap-[8px]">
            <span class="pt-[2px] text-white/42">图片:</span>
            <img
              :src="selectedTask.image"
              :alt="selectedTask.title"
              class="h-[52px] w-[52px] rounded-[6px] border border-white/8 object-cover"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </div>

          <div
            class="mt-[10px] overflow-hidden rounded-[6px] border border-white/8 bg-[#1f2024]"
          >
            <div
              class="flex items-center justify-between border-b border-white/6 px-[10px] py-[8px]"
            >
              <div class="text-[12px] text-white/42">视频脚本:</div>
              <button
                type="button"
                class="rounded-[4px] border-0 bg-[#18d2e5] px-[8px] py-[2px] text-[11px] text-white"
              >
                复制脚本
              </button>
            </div>
            <div class="max-h-[220px] overflow-auto px-[10px] py-[10px]">
              <pre
                class="m-0 whitespace-pre-wrap break-words text-[13px] leading-[1.8] text-white/76"
                >{{ selectedTask.videoScript }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.task-square-field :deep(.n-input-wrapper),
.task-square-field :deep(.n-base-selection),
.task-square-field :deep(.n-date-picker .n-input-wrapper) {
  background-color: #202126;
}

.task-square-field :deep(.n-input-wrapper:hover),
.task-square-field :deep(.n-base-selection:hover),
.task-square-field :deep(.n-date-picker .n-input-wrapper:hover) {
  background-color: #24252a;
}
</style>
