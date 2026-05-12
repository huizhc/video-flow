<script setup>
import { computed, ref } from 'vue'
import { NButton, NIcon, NInput, NScrollbar } from 'naive-ui'
import { Add, Currency, Download, Information, SendAltFilled, TrashCan } from '@vicons/carbon'

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
  () => conversations.value.find((item) => item.id === activeConversationId.value) ?? conversations.value[0],
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

function deleteConversation() {
  if (!activeConversation.value) return

  const remaining = conversations.value.filter((item) => item.id !== activeConversation.value.id)
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
  } else {
    activeConversationId.value = conversations.value[0].id
  }
}

function exportConversation() {
  if (!activeConversation.value || !activeConversation.value.messages.length) return

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
    activeConversation.value.title = content.slice(0, 10) || activeConversation.value.title
  }

  activeConversation.value.messages.push(
    {
      role: 'user',
      content,
    },
    {
      role: 'assistant',
      content: `已收到你的创作方向：${content}。我会从选题角度、冲突设置、分镜节奏和结尾转化这几个维度继续帮你扩写视频剧本。`,
    },
  )

  draft.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#000] p-[14px] text-white">
    <div
      class="mx-auto grid min-h-[calc(100vh-28px)] max-w-[1280px] grid-cols-1 gap-[6px] rounded-[10px] border border-white/8 bg-[#0a0b0d] p-[6px] min-[980px]:grid-cols-[182px_minmax(0,1fr)]">
      <aside
        class="overflow-hidden rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#242425_0%,#1d1e20_100%)]">
        <div
          class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[10px] py-[8px]">
          <span class="text-[12px] text-white/88">会话列表</span>
          <n-button type="primary" size="tiny"
            class="!h-[22px] !rounded-[4px] !border-0 !bg-[#18d2e5] !px-[10px] !text-[11px] !font-medium"
            @click="createConversation">
            <template #icon>
              <n-icon :component="Add" :size="12" />
            </template>
            新增会话
          </n-button>
        </div>

        <n-scrollbar class="h-[calc(100vh-80px)] min-h-[540px]">
          <div class="p-[8px]">
            <button v-for="item in conversations" :key="item.id" type="button"
              class="mb-[6px] w-full rounded-[4px] border border-transparent px-[10px] py-[10px] text-left text-[12px] text-white/74 transition"
              :class="item.id === activeConversationId ? 'bg-white/8 text-white border-white/10' : 'bg-transparent hover:bg-white/4'"
              @click="selectConversation(item.id)">
              <div class="truncate">{{ item.title }}</div>
            </button>
          </div>
        </n-scrollbar>
      </aside>

      <section
        class="overflow-hidden rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,#252526_0%,#1e1f21_100%)]">
        <div
          class="flex items-center justify-between border-b border-white/8 bg-[linear-gradient(180deg,#383838_0%,#2f2f2f_100%)] px-[12px] py-[8px]">
          <div class="text-[12px] text-white/88">{{ activeConversation?.title || '新会话' }}</div>
          <div class="flex items-center gap-[8px]">
            <button type="button"
              class="inline-flex items-center gap-[4px] border-0 bg-transparent p-0 text-[11px] text-white/46 transition hover:text-white/72"
              @click="deleteConversation">
              <n-icon :component="TrashCan" :size="12" />
              清理会话
            </button>
            <button type="button"
              class="inline-flex items-center gap-[4px] border-0 bg-transparent p-0 text-[11px] text-white/46 transition hover:text-white/72"
              @click="exportConversation">
              <n-icon :component="Download" :size="12" />
              导出会话
            </button>
          </div>
        </div>

        <div class="flex min-h-[calc(100vh-42px)] flex-col">
          <n-scrollbar class="min-h-[360px] flex-1 px-[12px] py-[12px]">
            <div v-if="activeConversation && activeConversation.messages.length" class="space-y-[12px] pb-[6px]">
              <div v-for="(message, index) in activeConversation.messages" :key="`${message.role}-${index}`"
                class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                <div class="max-w-[78%] rounded-[8px] px-[12px] py-[10px] text-[12px] leading-[1.75]" :class="message.role === 'user'
                  ? 'bg-[#1b5d88] text-white'
                  : 'border border-white/8 bg-[#17181a] text-white/84'
                  ">
                  {{ message.content }}
                </div>
              </div>
            </div>

            <div v-else class="flex h-full min-h-[360px] items-center justify-center text-[12px] text-white/30">
              暂无消息内容
            </div>
          </n-scrollbar>

          <div class="border-t border-white/8 px-[12px] py-[10px]">
            <n-input v-model:value="draft" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }"
              placeholder="请输入您的问题..."
              class="[&_.n-input-wrapper]:!rounded-[2px] [&_.n-input-wrapper]:!border-white/10 [&_.n-input-wrapper]:!bg-[#1c1d20] [&_.n-input-wrapper]:!px-[8px] [&_.n-input-wrapper]:!py-[6px] [&_.n-input-wrapper]:!shadow-none [&_.n-input-wrapper]:focus-within:!border-[#18d2e5] [&_.n-input__textarea-el]:!text-[11px] [&_.n-input__textarea-el]:!text-white/84 [&_.n-input__textarea-el]:!leading-[1.7] [&_.n-input__textarea-el]:!resize-none [&_.n-input__placeholder]:!text-white/24" />

            <div class="mt-[6px] flex items-center justify-between gap-[10px]">
              <div class="text-[10px] text-white/34">输入字数: {{ draftCount }}</div>

              <div class="flex items-center gap-[12px]">
                <div class="flex items-center gap-[4px] text-[11px] text-white/46">
                  <span>消耗算力：</span>
                  <n-icon :component="Currency" :size="13" class="text-[#ffd24c]" />
                  <span class="text-[#ffd24c]">{{ totalPower }}</span>
                  <button type="button" class="border-0 bg-transparent p-0 text-white/30">
                    <n-icon :component="Information" :size="12" />
                  </button>
                </div>

                <n-button type="primary" size="small"
                  class="!h-[28px] !rounded-[4px] !border-0 !bg-[#3a73aa] !px-[12px] !text-[11px] !font-medium"
                  @click="sendMessage">
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
