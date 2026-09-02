<template>
  <div class="page stack">
    <div class="stats">
      <StatCard icon="👥" :value="`${space.memberCount}/${space.space.memberLimit}`" label="团队规模" sub="成员上限" tone="var(--cyan)" />
      <StatCard icon="✅" :value="space.activeMembers.length" label="正常账号" sub="可访问空间" tone="var(--green)" />
      <StatCard icon="🛡️" :value="adminCount" label="管理角色" sub="超级 / 空间管理员" tone="var(--purple)" />
      <StatCard icon="🏷️" :value="taggedCount" label="已分配标签" sub="参与标签路由" tone="var(--amber)" />
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="search-box">
          <span class="icon">🔍</span>
          <input v-model="keyword" class="input" placeholder="搜索姓名 / 账号" />
        </div>
        <select v-model="roleFilter" class="select" style="width: 132px">
          <option value="">全部角色</option>
          <option v-for="r in ROLES" :key="r.value" :value="r.value">{{ r.label }}</option>
        </select>
        <select v-model="statusFilter" class="select" style="width: 112px">
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="disabled">已停用</option>
        </select>
        <select v-model="tagFilter" class="select" style="width: 124px">
          <option value="">全部标签</option>
          <option v-for="t in BUSINESS_TAGS" :key="t" :value="t">{{ t }}</option>
        </select>
        <span class="spacer"></span>
        <span class="section-desc">剩余席位 {{ remaining }} 个</span>
        <button class="btn btn-primary btn-sm" @click="openInvite">+ 邀请成员</button>
      </div>

      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>姓名</th>
              <th>账号</th>
              <th>角色</th>
              <th>业务标签</th>
              <th>状态</th>
              <th>加入时间</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in filtered" :key="member.id">
              <td>
                <div class="who">
                  <span class="ava">{{ member.name.slice(0, 1) }}</span>
                  <div>
                    <div class="cell-main">
                      {{ member.name }}
                      <span v-if="member.id === space.user.id" class="badge badge-cyan" style="margin-left: 6px">当前登录</span>
                    </div>
                    <div class="cell-sub">{{ roleDuty(member.role) }}</div>
                  </div>
                </div>
              </td>
              <td><span class="mono">{{ member.account }}</span></td>
              <td>{{ space.roleLabel(member.role) }}</td>
              <td>
                <span v-for="tag in member.tags" :key="tag" class="tag-chip" style="margin-right: 4px">{{ tag }}</span>
                <span v-if="!member.tags.length" class="cell-sub">未分配</span>
              </td>
              <td>
                <span class="badge" :class="member.status === 'active' ? 'badge-green' : 'badge-gray'">
                  <i class="dot"></i>{{ member.status === 'active' ? '正常' : '已停用' }}
                </span>
              </td>
              <td class="cell-sub">{{ formatDate(member.joinedAt) }}</td>
              <td class="col-actions">
                <div class="row-actions">
                  <button class="link-btn" @click="openEdit(member)">编辑</button>
                  <button class="link-btn" @click="switchStatus(member)">{{ member.status === 'active' ? '停用' : '恢复' }}</button>
                  <button class="link-btn danger" @click="removeMember(member)">移除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="7">
                <div class="empty"><div class="empty-icon">👥</div>没有符合条件的成员</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span>🔐</span>
        <span class="panel-title">角色权限矩阵</span>
        <span class="spacer"></span>
        <span class="section-desc">角色决定成员在各模块的可用操作</span>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>功能模块</th>
              <th v-for="r in ROLES" :key="r.value">{{ r.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in ROLE_MATRIX" :key="row.feature">
              <td class="cell-main">{{ row.feature }}</td>
              <td v-for="r in ROLES" :key="r.value" :class="row[r.value] === '—' ? 'cell-sub' : ''">{{ row[r.value] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <SideDrawer v-if="form" :title="form.id ? '编辑成员' : '邀请成员'" :subtitle="form.id ? form.account : `当前 ${space.memberCount} / ${space.space.memberLimit} 人`" :width="500" @close="form = null">
      <div class="field">
        <label class="field-label">姓名<span class="req">*</span></label>
        <input v-model="form.name" class="input" placeholder="成员姓名" />
      </div>
      <div class="field">
        <label class="field-label">账号<span class="req">*</span></label>
        <input v-model="form.account" class="input" placeholder="登录账号，例如 zhangwei" :disabled="!!form.id" />
      </div>
      <div class="field">
        <label class="field-label">角色</label>
        <select v-model="form.role" class="select">
          <option v-for="r in ROLES" :key="r.value" :value="r.value">{{ r.label }}</option>
        </select>
        <p class="field-hint">{{ roleDuty(form.role) }}</p>
      </div>
      <div class="field">
        <label class="field-label">业务标签</label>
        <CheckGroup v-model="form.tags" :options="tagOptions" />
        <p class="field-hint">标签决定该成员的请求可被哪些 Agent 接收，未分配标签时由 Main Agent 统一调度。</p>
      </div>
      <p v-if="error" class="field-error">{{ error }}</p>
      <template #footer>
        <button class="btn" @click="form = null">取消</button>
        <button class="btn btn-primary" @click="save">{{ form.id ? '保存' : '发送邀请' }}</button>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SideDrawer from '@/components/SideDrawer.vue'
import CheckGroup from '@/components/CheckGroup.vue'
import StatCard from '@/components/StatCard.vue'
import { useSpaceStore } from '@/stores/space'
import { useUiStore } from '@/stores/ui'
import { ROLES, ROLE_MATRIX, BUSINESS_TAGS } from '@/services/catalog'
import { formatDate } from '@/utils/format'

const DUTIES = {
  super: '拥有空间全部管理与配置权限',
  admin: '可管理成员、Agent 与知识资产',
  member: '可调用 Agent 并维护业务数据',
  viewer: '仅可查看与下载已授权内容'
}

const space = useSpaceStore()
const ui = useUiStore()

const keyword = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const tagFilter = ref('')
const form = ref(null)
const error = ref('')

const tagOptions = BUSINESS_TAGS.map((t) => ({ value: t, label: t }))
const roleDuty = (role) => DUTIES[role] || ''

const adminCount = computed(() => space.members.filter((m) => m.role === 'super' || m.role === 'admin').length)
const taggedCount = computed(() => space.members.filter((m) => m.tags.length).length)
const remaining = computed(() => Math.max(space.space.memberLimit - space.memberCount, 0))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return space.members.filter(
    (m) =>
      (!kw || `${m.name} ${m.account}`.toLowerCase().includes(kw)) &&
      (!roleFilter.value || m.role === roleFilter.value) &&
      (!statusFilter.value || m.status === statusFilter.value) &&
      (!tagFilter.value || m.tags.includes(tagFilter.value))
  )
})

function openInvite() {
  if (remaining.value <= 0) {
    ui.notify(`团队规模已达上限 ${space.space.memberLimit} 人，请先在业务空间管理中调整上限`, 'error')
    return
  }
  error.value = ''
  form.value = { id: '', name: '', account: '', role: 'member', tags: [] }
}

function openEdit(member) {
  error.value = ''
  form.value = { ...member, tags: [...member.tags] }
}

function save() {
  const data = form.value
  if (!data.name.trim()) {
    error.value = '请填写成员姓名'
    return
  }
  if (!/^[a-zA-Z][a-zA-Z0-9._-]{2,23}$/.test(data.account)) {
    error.value = '账号需为 3-24 位，以字母开头，可包含字母、数字、点、下划线与连字符'
    return
  }
  if (space.members.some((m) => m.account === data.account && m.id !== data.id)) {
    error.value = '该账号已存在'
    return
  }
  if (data.id) {
    const target = space.members.find((m) => m.id === data.id)
    if (target.role === 'super' && data.role !== 'super' && adminCount.value <= 1) {
      error.value = '空间需保留至少一名管理角色'
      return
    }
    space.updateMember(data.id, { name: data.name.trim(), role: data.role, tags: data.tags })
    ui.notify('成员信息已更新')
  } else {
    if (remaining.value <= 0) {
      error.value = `团队规模已达上限 ${space.space.memberLimit} 人`
      return
    }
    space.addMember({ name: data.name.trim(), account: data.account.trim(), role: data.role, tags: data.tags })
    ui.notify('邀请已发出，成员可使用该账号登录空间')
  }
  form.value = null
}

function switchStatus(member) {
  if (member.id === space.user.id && member.status === 'active') {
    ui.notify('当前登录账号不可停用', 'error')
    return
  }
  space.toggleMemberStatus(member.id)
  ui.notify(`${member.name} 已${member.status === 'active' ? '恢复访问' : '停用'}`)
}

async function removeMember(member) {
  if (member.id === space.user.id) {
    ui.notify('当前登录账号不可移出空间', 'error')
    return
  }
  const ok = await ui.confirm({
    title: '移除成员',
    message: `将「${member.name}」移出团队空间，其历史操作记录保留。`,
    danger: true,
    confirmText: '移除'
  })
  if (!ok) return
  space.removeMember(member.id)
  ui.notify('成员已移出空间')
}
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.who {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ava {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11.5px;
  color: #fff;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
