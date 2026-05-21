<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, NScrollbar } from 'naive-ui'
import {
  Add,
  Currency,
  Download,
  SendAltFilled,
  TrashCan,
} from '@vicons/carbon'

const nextConversationId = ref(2)
const draft = ref('')
const activeConversationId = ref(1)

const conversations = ref([
  {
    id: 1,
    title: '新会话',
    messages: [],
  },
])

const activeConversation = computed(
  () =>
    conversations.value.find(
      (item) => item.id === activeConversationId.value
    ) ?? conversations.value[0]
)

const draftCount = computed(() => draft.value.trim().length)
const totalPower = 100

function createConversation() {
  const conversation = {
    id: nextConversationId.value,
    title: `新会话 ${nextConversationId.value}`,
    messages: [],
  }

  nextConversationId.value += 1
  conversations.value.unshift(conversation)
  activeConversationId.value = conversation.id
  draft.value = ''
}

function selectConversation(id) {
  activeConversationId.value = id
}

function deleteConversationById(id) {
  const remaining = conversations.value.filter((item) => item.id !== id)
  conversations.value = remaining.length
    ? remaining
    : [
        {
          id: nextConversationId.value,
          title: '新会话',
          messages: [],
        },
      ]

  if (!remaining.length) {
    activeConversationId.value = nextConversationId.value
    nextConversationId.value += 1
  } else if (activeConversationId.value === id) {
    activeConversationId.value = conversations.value[0].id
  }
}

function deleteConversation() {
  if (!activeConversation.value) return
  deleteConversationById(activeConversationId.value)
}

function exportConversation() {
  if (!activeConversation.value || !activeConversation.value.messages.length)
    return

  const content = activeConversation.value.messages
    .map((item) => `${item.role === 'user' ? '用户' : 'AI'}：${item.content}`)
    .join('\n\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${activeConversation.value.title}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function sendMessage() {
  const content = draft.value.trim()
  if (!content || !activeConversation.value) return

  if (!activeConversation.value.messages.length) {
    activeConversation.value.title =
      content.slice(0, 10) || activeConversation.value.title
  }

  activeConversation.value.messages.push(
    {
      role: 'user',
      content,
    },
    {
      role: 'assistant',
      content: `已收到你的创作方向：${content}。我会从选题角度、冲突设置、分镜节奏和结尾转化这几个维度继续帮你扩写视频剧本。`,
    }
  )

  draft.value = ''
}
</script>

<template>
  <div class="min-h-[500px] h-full bg-[#000] p-[14px] text-white">
    <div
      class="mx-auto grid h-full grid-cols-1 gap-[16px] rounded-[10px] border border-white/8 p-[6px] min-[980px]:grid-cols-[400px_minmax(0,1fr)]"
    >
      <aside
        class="min-w-[400px] overflow-hidden rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#242425_0%,#1d1e20_100%)]"
      >
        <div
          class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[12px] py-[10px]"
        >
          <span class="text-sm font-medium text-white/88">会话列表</span>
          <n-button
            type="primary"
            size="small"
            class="text-white !rounded-[6px] !border-0 !bg-[#18d2e5] !px-[12px] !text-sm !font-medium"
            @click="createConversation"
          >
            <template #icon>
              <n-icon :component="Add" :size="18" />
            </template>
            新建会话
          </n-button>
        </div>

        <n-scrollbar class="h-[calc(100vh-140px)]">
          <div class="p-[12px]">
            <button
              v-for="item in conversations"
              :key="item.id"
              type="button"
              class="group relative mb-[12px] w-full overflow-hidden rounded-[8px] border border-white/8 bg-[#1a1b1d] p-[14px] text-left transition-all duration-200"
              :class="
                item.id === activeConversationId
                  ? 'border-[#18d2e5] bg-[linear-gradient(180deg,rgba(24,210,229,0.16)_0%,rgba(34,36,40,0.96)_100%)] shadow-[0_0_0_1px_rgba(24,210,229,0.28),0_10px_24px_rgba(0,0,0,0.22)]'
                  : 'border-transparent hover:bg-white/4'
              "
              @click="selectConversation(item.id)"
            >
              <div class="flex items-start justify-between">
                <div
                  class="truncate text-sm font-bold"
                  :class="
                    item.id === activeConversationId
                      ? 'text-white'
                      : 'text-white/92'
                  "
                >
                  {{ item.title }}
                </div>
                <n-icon
                  :component="TrashCan"
                  :size="14"
                  class="transition-colors"
                  :class="
                    item.id === activeConversationId
                      ? 'text-red-400/80 hover:text-red-300'
                      : 'text-red-500/60 hover:text-red-500'
                  "
                  @click.stop="deleteConversationById(item.id)"
                />
              </div>

              <div
                class="mt-[6px] truncate text-sm"
                :class="
                  item.id === activeConversationId
                    ? 'text-white/72'
                    : 'text-white/45'
                "
              >
                {{
                  item.messages.length > 0
                    ? item.messages[item.messages.length - 1].content
                    : '暂无消息'
                }}
              </div>

              <div
                class="mt-[6px] text-xs"
                :class="
                  item.id === activeConversationId
                    ? 'text-[#7ceaf4]'
                    : 'text-white/25'
                "
              >
                刚刚
              </div>
            </button>
          </div>
        </n-scrollbar>
      </aside>

      <section
        class="overflow-hidden flex flex-col rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#252526_0%,#1e1f21_100%)]"
      >
        <div
          class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[12px] py-[8px]"
        >
          <div class="text-sm text-white/88">
            {{ activeConversation?.title || '新会话' }}
          </div>
          <div class="flex items-center gap-[8px]">
            <n-button
              ghost
              type="button"
              class="inline-flex h-[26px] items-center justify-center rounded-[4px] border-[1px] border-solid border-white/8 bg-transparent text-sm text-white/45 transition-colors hover:text-white/70"
              @click="deleteConversation"
            >
              <n-icon :component="TrashCan" :size="12" />
              <span class="ml-[2px]">清空会话</span>
            </n-button>
            <n-button
              ghost
              type="button"
              class="inline-flex h-[26px] items-center justify-center rounded-[4px] border-[1px] border-solid border-white/8 bg-transparent text-sm text-white/45 transition-colors hover:text-white/70"
              @click="exportConversation"
            >
              <n-icon :component="Download" :size="12" />
              <span class="ml-[2px]">导出会话</span>
            </n-button>
          </div>
        </div>

        <div class="flex flex-1 flex-col">
          <n-scrollbar class="min-h-[360px] flex-1 px-[12px] py-[12px]">
            <div
              v-if="activeConversation && activeConversation.messages.length"
              class="space-y-[12px] pb-[6px]"
            >
              <div
                v-for="(message, index) in activeConversation.messages"
                :key="`${message.role}-${index}`"
                class="flex"
                :class="
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                "
              >
                <div
                  class="max-w-[78%] rounded-[8px] px-[12px] py-[10px] text-sm leading-[1.75]"
                  :class="
                    message.role === 'user'
                      ? 'bg-[#1b5d88] text-white'
                      : 'border border-white/8 bg-[#17181a] text-white/84'
                  "
                >
                  {{ message.content }}
                </div>
              </div>
            </div>

            <div
              v-else
              class="flex h-full min-h-[360px] items-center justify-center text-sm text-white/30"
            >
              暂无消息内容
            </div>
          </n-scrollbar>

          <div class="border-t border-white/8 px-[12px] py-[10px]">
            <n-input
              v-model:value="draft"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 3 }"
              placeholder="请输入您的问题..."
              class="border border-[1px] border-solid border-#ffffff10 text-sm [&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#1c1d20] [&_.n-input-wrapper]:!px-[8px] [&_.n-input-wrapper]:!py-[6px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-sm [&_.n-input__textarea-el]:!text-white/84 [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-sm [&_.n-input__placeholder]:!text-white/24"
            />

            <div class="mt-[6px] flex flex-col gap-[10px]">
              <div class="text-xs text-white/34">
                输入字数: {{ draftCount }}
              </div>

              <div class="flex items-center gap-[12px]">
                <div
                  class="ml-auto flex items-center gap-[4px] text-sm text-white/46"
                >
                  <span>消耗算力：</span>
                  <n-icon
                    :component="Currency"
                    :size="13"
                    class="text-[#ffd24c]"
                  />
                  <span class="text-[#ffd24c]">{{ totalPower }}</span>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <i
                        class="i-mingcute-question-line text-white/48 cursor-pointer"
                      ></i>
                    </template>
                    根据输入文字数量计算，每500个字100算力
                  </n-tooltip>
                </div>

                <n-button
                  quaternary
                  type="primary"
                  size="small"
                  style="--n-border-hover: 0px solid transparent !important"
                  class="!h-[28px] text-#fff! shadow-none! rounded-[4px] !bg-[#3a73aa] !px-[12px] !text-sm !font-medium"
                  @click="sendMessage"
                >
                  <template #icon>
                    <n-icon :component="SendAltFilled" :size="12" />
                  </template>
                  发送
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
