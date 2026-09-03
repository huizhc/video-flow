import { retrieve, pickSentences } from './retrieval'
import { formatDateTime, formatDate } from '@/utils/format'

function matchRule(question, ctx) {
  const candidates = ctx.rules
    .filter((r) => r.enabled && r.actions.some((a) => a.type === 'assign'))
    .sort((a, b) => a.priority - b.priority)
  for (const rule of candidates) {
    const hit = rule.conditions.some((c) => {
      if (c.field !== 'message.tag' && c.field !== 'message.text') return false
      return question.includes(c.value)
    })
    if (hit) {
      const action = rule.actions.find((a) => a.type === 'assign')
      const agent = ctx.agents.find((a) => a.id === action.target)
      if (agent && agent.status === 'running') return { agent, rule }
    }
  }
  return null
}

export function route(question, ctx, targetAgentId) {
  if (targetAgentId) {
    const agent = ctx.agents.find((a) => a.id === targetAgentId)
    if (agent) return { agent, basis: '手动指定 Agent' }
  }
  if (ctx.space.tagRouting) {
    const ruled = matchRule(question, ctx)
    if (ruled) return { agent: ruled.agent, basis: `业务规则「${ruled.rule.name}」`, rule: ruled.rule }
  }
  const business = ctx.agents.filter((a) => !a.isMain && a.status === 'running')
  const scored = business
    .map((agent) => {
      const keywords = [...(agent.tags || []), agent.category, ...agent.name.replace('Agent', '').split(/\s+/)]
      const score = keywords.reduce((sum, kw) => sum + (kw && question.includes(kw) ? kw.length : 0), 0)
      return { agent, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  if (scored.length) return { agent: scored[0].agent, basis: '标签路由匹配' }
  return { agent: ctx.mainAgent, basis: 'Main Agent 直接应答' }
}

function statusAnswer(ctx) {
  const main = ctx.mainAgent
  const business = ctx.agents.filter((a) => !a.isMain)
  const lines = [
    `当前团队空间共有 ${ctx.agents.length} 个 Agent，其中调度中枢 1 个、业务 Agent ${business.length} 个，运行中 ${
      ctx.agents.filter((a) => a.status === 'running').length
    } 个。`,
    ''
  ]
  if (main) {
    lines.push(`· ${main.name}（${main.category}）内核 ${main.version}，协议 ${main.protocol}，累计调度 ${main.calls} 次`)
  }
  business.forEach((agent) => {
    lines.push(
      `· ${agent.name}（${agent.category}）${agent.status === 'running' ? '运行中' : '已停用'}，版本 ${agent.version}，绑定技能 ${
        agent.skillIds.length
      } 项，知识库 ${agent.kbIds.length} 个，累计调用 ${agent.calls} 次`
    )
  })
  lines.push('')
  lines.push(
    `任务队列：待处理 ${ctx.pendingTasks} 个，运行中 ${ctx.runningTasks} 个。全局注册中心已注册 ${ctx.registrySize} 个 Agent，可按需引入团队空间。`
  )
  lines.push(
    `调度配置：策略为${
      { tag: '标签优先', round: '轮询分发', load: '负载最低' }[ctx.space.scheduleStrategy] || ctx.space.scheduleStrategy
    }，标签路由${ctx.space.tagRouting ? '已启用' : '未启用'}，并发上限 ${ctx.space.concurrency} 个任务。`
  )
  return lines.join('\n')
}

function skillAnswer(ctx) {
  const enabled = ctx.skills.filter((s) => s.status === 'enabled')
  const lines = [`你在本空间可调用 ${enabled.length} 项技能，其中 ${enabled.filter((s) => s.shared).length} 项支持跨成员共享。`, '']
  enabled.forEach((skill) => {
    lines.push(
      `· ${skill.name}（${skill.code} ${skill.version}）${skill.description}入参 ${skill.params.length} 项，超时 ${skill.timeout}s，累计调用 ${skill.calls} 次。`
    )
  })
  const disabled = ctx.skills.filter((s) => s.status !== 'enabled')
  if (disabled.length) {
    lines.push('')
    lines.push(`已停用：${disabled.map((s) => s.name).join('、')}，如需调用请在技能管理中启用。`)
  }
  lines.push('')
  lines.push('在对话中描述业务目标即可，我会按需组合上述技能并给出执行结果。')
  return lines.join('\n')
}

function reportAnswer(ctx) {
  const week = `${formatDate(Date.now() - 6 * 86400000)} 至 ${formatDate(Date.now())}`
  const docs = [...ctx.documents].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)
  const lines = [
    `环境管理周报（${week}）`,
    '',
    '一、Agent 运行情况',
    `本周期团队空间 ${ctx.agents.length} 个 Agent 全部在线，累计调度 ${ctx.agents.reduce(
      (sum, a) => sum + a.calls,
      0
    )} 次，技能调用 ${ctx.skills.reduce((sum, s) => sum + s.calls, 0)} 次，待处理任务 ${ctx.pendingTasks} 个。`,
    '',
    '二、知识资产更新',
    ...docs.map((doc) => `· ${doc.title}（${ctx.bases.find((b) => b.id === doc.kbId)?.name || '知识库'}，更新于 ${formatDate(doc.updatedAt)}）`),
    '',
    '三、规则命中情况',
    ...ctx.rules
      .filter((r) => r.enabled)
      .slice(0, 3)
      .map((rule) => `· ${rule.name}：累计命中 ${rule.hits} 次，最近命中 ${rule.lastHitAt ? formatDateTime(rule.lastHitAt) : '暂无'}`),
    '',
    '四、下一周期计划',
    '· 完成季度台账归集与合规性自查',
    '· 跟踪监测数据异常项的整改闭环',
    '· 按需从全局资源池引入所需业务 Agent',
    '',
    '如需调整章节结构或补充数据口径，告诉我具体要求即可重新生成。'
  ]
  return lines.join('\n')
}

function retrievalAnswer(question, ctx, hits) {
  const lines = []
  lines.push(`已在 ${new Set(hits.map((h) => h.doc.kbId)).size} 个知识库中命中 ${hits.length} 篇相关文档，要点如下：`)
  lines.push('')
  hits.forEach((hit) => {
    const base = ctx.bases.find((b) => b.id === hit.doc.kbId)
    lines.push(`【${hit.doc.title}】${base ? `· ${base.name}` : ''}`)
    pickSentences(hit.doc.content, hit.hits).forEach((sentence) => lines.push(`· ${sentence}`))
    lines.push('')
  })
  lines.push('以上内容摘自知识库原文，如需完整条款或导出摘要，可继续告诉我。')
  return lines.join('\n')
}

function emptyRetrievalAnswer(question, ctx, bases) {
  if (ctx.retrieval?.fallback === 'main') {
    return [
      `未在参与检索的知识库中命中与「${question.slice(0, 30)}」直接相关的文档，已由 ${
        ctx.mainAgent?.name || 'Main Agent'
      } 依据空间配置直接应答：`,
      '',
      spaceAnswer(ctx)
    ].join('\n')
  }
  const lines = bases.length
    ? [
        `未在参与检索的知识库中检索到与「${question.slice(0, 30)}」直接相关的内容。`,
        '',
        `参与检索的知识库 ${bases.length} 个：`,
        ...bases.map((b) => `· ${b.name}（${b.domain}，${ctx.documents.filter((d) => d.kbId === b.id).length} 篇文档）`),
        '',
        '你可以在知识库中新增对应文档后重新提问，或换用更具体的业务表述，例如排污许可申报材料、自行监测方案、碳排放核算口径。'
      ]
    : [
        `当前没有知识库参与检索，无法为「${question.slice(0, 30)}」提供知识库依据。`,
        '',
        '请在空间设置的知识库配置中开启需要参与检索的知识库，或先在知识库页面新建知识库并导入文档。'
      ]
  return lines.join('\n')
}

function spaceAnswer(ctx) {
  const lines = [
    `${ctx.space.name} · ${ctx.space.subtitle}`,
    '',
    ctx.space.description,
    '',
    `成员 ${ctx.members.length}/${ctx.space.memberLimit}，Agent ${ctx.agents.length} 个，知识库 ${ctx.bases.length} 个（${ctx.documents.length} 篇文档），技能 ${ctx.skills.length} 项，业务规则 ${
      ctx.rules.filter((r) => r.enabled).length
    } 条启用中。`,
    `鉴权方式：${ctx.space.jwtEnabled ? `JWT，令牌有效期 ${ctx.space.jwtTtl} 小时` : '未启用 JWT'}；会话保留 ${ctx.space.sessionRetainDays} 天。`
  ]
  return lines.join('\n')
}

export function composeReply(question, ctx, targetAgentId) {
  const started = Date.now()
  const routed = route(question, ctx, targetAgentId)
  const agent = routed.agent || ctx.mainAgent
  const cfg = { topK: 3, minScore: 8, loosen: true, citation: true, fallback: 'notice', baseIds: null, synonyms: [], ...ctx.retrieval }
  const activeBases = cfg.baseIds ? ctx.bases.filter((b) => cfg.baseIds.includes(b.id)) : ctx.bases
  const baseIds = activeBases.map((b) => b.id)
  const visibleDocs = ctx.documents.filter((d) => baseIds.includes(d.kbId))
  const options = { limit: cfg.topK, minScore: cfg.minScore, synonyms: cfg.synonyms }
  let hits = retrieve(question, visibleDocs, options)
  if (!hits.length && cfg.loosen) {
    hits = retrieve(question, visibleDocs, { ...options, minScore: Math.max(3, Math.round(cfg.minScore / 2)) })
  }
  let text
  let usedSkills = []

  if (/agent状态|运行状态|团队状态|团队的\s*agent|智能体状态|当前团队/i.test(question)) {
    text = statusAnswer(ctx)
  } else if (/技能|能力清单|可用的技能|能做什么/i.test(question)) {
    text = skillAnswer(ctx)
  } else if (/周报|月报|日报|报告模板|模板/.test(question)) {
    text = reportAnswer(ctx)
    usedSkills = ctx.skills.filter((s) => s.code === 'doc.parse' && s.status === 'enabled')
  } else if (/空间|成员上限|权限|鉴权|设置/.test(question) && hits.length === 0) {
    text = spaceAnswer(ctx)
  } else if (hits.length) {
    text = retrievalAnswer(question, ctx, hits)
    usedSkills = ctx.skills.filter((s) => s.code === 'law.retrieval' && s.status === 'enabled')
  } else {
    text = emptyRetrievalAnswer(question, ctx, activeBases)
  }

  const citations = cfg.citation
    ? hits.map((hit) => ({
        id: hit.doc.id,
        title: hit.doc.title,
        kbId: hit.doc.kbId,
        kbName: ctx.bases.find((b) => b.id === hit.doc.kbId)?.name || ''
      }))
    : []

  return {
    text,
    agentId: agent?.id || '',
    agentName: agent?.name || 'MAIN Agent',
    basis: routed.basis,
    ruleId: routed.rule?.id || '',
    citations,
    skills: usedSkills.map((s) => ({ id: s.id, name: s.name })),
    elapsedMs: Date.now() - started + 420 + hits.length * 180
  }
}
