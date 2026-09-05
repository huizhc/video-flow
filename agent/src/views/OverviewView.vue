<template>
  <div class="page stack">
    <div class="stats">
      <StatCard
        icon="🤖"
        :value="agentStore.total"
        label="可用AGENT"
        sub="含Main Agent"
        tone="var(--cyan)"
        to="/agents"
      />
      <StatCard
        icon="👥"
        :value="`${space.memberCount}/${space.space.memberLimit}`"
        label="团队规模"
        sub="成员上限"
        tone="var(--green)"
        to="/members"
      />
      <StatCard
        icon="🏷️"
        :value="space.user.tags.length"
        label="我的标签"
        sub="业务标签"
        tone="var(--amber)"
        to="/members"
      />
      <StatCard
        icon="💡"
        :value="skillStore.sharedCount"
        label="可用技能"
        sub="可跨成员技能"
        tone="var(--purple)"
        to="/skills"
      />
    </div>

    <div class="two-col">
      <section class="panel">
        <div class="panel-head">
          <span>🤖</span>
          <span class="panel-title">团队 Agent</span>
          <span class="spacer"></span>
          <router-link class="link-btn" to="/agents">全部</router-link>
        </div>
        <div class="list">
          <div
            v-for="agent in agentStore.agents"
            :key="agent.id"
            class="list-row"
          >
            <span
              class="badge"
              :class="agent.status === 'running' ? 'badge-green' : 'badge-gray'"
            >
              <i class="dot"></i
              >{{ agent.status === 'running' ? '运行中' : '已停用' }}
            </span>
            <div class="lr-main">
              <div class="cell-main">
                {{ agent.name
                }}<span
                  v-if="agent.isMain"
                  class="badge badge-cyan"
                  style="margin-left: 6px"
                  >调度中枢</span
                >
              </div>
              <div class="cell-sub">
                {{ agent.category }} · {{ agent.version }} · 累计调用
                {{ agent.calls }} 次
              </div>
            </div>
            <span class="mono">{{ fromNow(agent.updatedAt) }}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span>📚</span>
          <span class="panel-title">知识与资产</span>
          <span class="spacer"></span>
          <router-link class="link-btn" to="/knowledge">全部</router-link>
        </div>
        <div class="list">
          <div v-for="base in knowledge.list" :key="base.id" class="list-row">
            <span
              class="badge"
              :class="
                base.indexStatus === 'ready' ? 'badge-cyan' : 'badge-amber'
              "
            >
              {{ indexLabel(base.indexStatus) }}
            </span>
            <div class="lr-main">
              <div class="cell-main">{{ base.name }}</div>
              <div class="cell-sub">
                {{ base.domain }} · {{ base.docCount }} 篇文档 ·
                {{ base.model }}
              </div>
            </div>
            <span class="mono">{{ fromNow(base.updatedAt) }}</span>
          </div>
          <div class="list-row">
            <div style="min-width: 62px">
              <span class="badge badge-purple">文件</span>
            </div>
            <div class="lr-main">
              <div class="cell-main">文件中心</div>
              <div class="cell-sub">
                {{ files.files.length }} 个文件 ·
                {{ formatBytes(files.totalSize) }}
              </div>
            </div>
            <router-link class="link-btn" to="/files">查看</router-link>
          </div>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <span>🔴</span>
        <span class="panel-title">Main Agent 状态</span>
        <span class="spacer"></span>
        <span class="section-desc">更新于 {{ refreshedAt }}</span>
        <button class="btn btn-sm" @click="refresh">刷新</button>
      </div>
      <div class="panel-body">
        <div class="runline">
          <span class="badge badge-green"
            ><i class="dot"></i>{{ mainStatusText }}</span
          >
          <b>{{ mainAgent?.name || '未指定 Main Agent' }}</b>
          <span class="mono">{{ mainAgent?.version }}</span>
          <span class="mono">{{ mainAgent?.protocol }}</span>
          <span class="spacer"></span>
          <router-link class="link-btn" to="/agents">调度配置</router-link>
        </div>

        <div class="mini-stats">
          <div class="mini">
            <div class="mi">📋</div>
            <div class="mv" style="color: var(--cyan)">
              {{ space.registrySize }}
            </div>
            <div class="ml">已注册AGENT</div>
          </div>
          <div class="mini">
            <div class="mi">⏳</div>
            <div class="mv" style="color: var(--amber)">
              {{ agentStore.pendingTasks }}
            </div>
            <div class="ml">待处理任务</div>
          </div>
          <div class="mini">
            <div class="mi">🔄</div>
            <div class="mv" style="color: var(--blue)">
              {{ agentStore.runningTasks }}
            </div>
            <div class="ml">运行中任务</div>
          </div>
        </div>

        <div class="flags">
          <span class="flag"
            >🏷️ JWT: {{ space.space.jwtEnabled ? '已启用' : '未启用' }}</span
          >
          <span class="flag"
            >🔗 调度: {{ space.space.schedulerEnabled ? '启用' : '停用' }}</span
          >
          <span class="flag"
            >🔀 标签路由:
            {{ space.space.tagRouting ? '已启用' : '未启用' }}</span
          >
          <span class="flag"
            >🧩 团队空间:
            {{ space.space.integrated ? '已集成' : '未集成' }}</span
          >
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span>🏷️</span>
        <span class="panel-title">我的标签与权限</span>
        <span class="spacer"></span>
        <span class="section-desc">{{ space.user.tags.length }} 项</span>
      </div>
      <div class="panel-body">
        <div class="row" style="flex-wrap: wrap">
          <span v-for="tag in space.user.tags" :key="tag" class="tag-chip">{{
            tag
          }}</span>
          <span v-if="!space.user.tags.length" class="section-desc"
            >尚未分配业务标签，可在成员管理中配置</span
          >
        </div>
        <p class="role-line">
          角色:
          <span class="badge badge-purple"
            >🛡️ {{ space.roleLabel(space.user.role) }}</span
          >
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { useSpaceStore } from '@/stores/space'
import { useAgentStore } from '@/stores/agents'
import { useSkillStore } from '@/stores/skills'
import { useKnowledgeStore } from '@/stores/knowledge'
import { useFileStore } from '@/stores/files'
import { useUiStore } from '@/stores/ui'
import { formatTime, fromNow, formatBytes } from '@/utils/format'

const space = useSpaceStore()
const agentStore = useAgentStore()
const skillStore = useSkillStore()
const knowledge = useKnowledgeStore()
const files = useFileStore()
const ui = useUiStore()

const refreshedAt = ref(formatTime(Date.now()))
const mainAgent = computed(() => agentStore.mainAgent)
const mainStatusText = computed(() =>
  mainAgent.value?.status === 'running' ? '运行中' : '已停用'
)

const indexLabel = (status) =>
  ({
    ready: '索引就绪',
    building: '索引中',
    stale: '待重建',
    pending: '未建索引',
  })[status] || status

function refresh() {
  refreshedAt.value = formatTime(Date.now())
  ui.notify('指标已刷新')
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.runline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.runline .spacer {
  flex: 1;
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 16px 0;
}

.mini {
  background: var(--panel-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 16px;
  text-align: center;
}

.mi {
  font-size: 15px;
  margin-bottom: 8px;
}

.mv {
  font-size: 24px;
  font-weight: 700;
}

.ml {
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--text-3);
}

.flags {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.flag {
  color: var(--text-3);
  font-size: 11.5px;
}

.role-line {
  margin-top: 12px;
  color: var(--text-3);
  font-size: 12px;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.list {
  padding: 6px 0;
}
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #1e4170;
}

.list-row:last-child {
  border-bottom: none;
}

.lr-main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1100px) {
  .stats,
  .two-col,
  .mini-stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
