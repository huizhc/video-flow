const DAY = 86400000

function ago(days, hours = 0) {
  return new Date(Date.now() - days * DAY - hours * 3600000).toISOString()
}

export const ROLES = [
  { value: 'super', label: '超级管理员' },
  { value: 'admin', label: '空间管理员' },
  { value: 'member', label: '业务成员' },
  { value: 'viewer', label: '只读成员' }
]

export const ROLE_MATRIX = [
  { feature: 'Agent 管理', super: '全部', admin: '全部', member: '查看 / 调用', viewer: '查看' },
  { feature: '知识库', super: '全部', admin: '全部', member: '查看 / 新增文档', viewer: '查看' },
  { feature: '技能管理', super: '全部', admin: '全部', member: '调用 / 测试', viewer: '查看' },
  { feature: '文件中心', super: '全部', admin: '全部', member: '上传 / 下载', viewer: '下载' },
  { feature: '业务规则', super: '全部', admin: '全部', member: '查看', viewer: '查看' },
  { feature: '成员管理', super: '全部', admin: '邀请 / 编辑', member: '—', viewer: '—' },
  { feature: '业务空间管理', super: '全部', admin: '新增 / 修改', member: '进入', viewer: '进入' },
  { feature: '空间设置', super: '全部', admin: '全部', member: '查看', viewer: '查看' },
  { feature: '系统管理', super: '全部', admin: '日志查看', member: '—', viewer: '—' }
]

export const AGENT_CATEGORIES = [
  '调度中枢',
  '合规审查',
  '数据核算',
  '报告编制',
  '监测诊断',
  '知识检索',
  '文档处理',
  '体系审核',
  '风险排查',
  '调查评估',
  '评估评级',
  '应急响应',
  '申报审批',
  '运营支持'
]

export const SKILL_CATEGORIES = ['知识检索', '文档处理', '数据计算', '报表输出', '外部接口', '通知提醒']

export const BUSINESS_TAGS = ['环境合规', '碳管理', '监测运维', '安全生产', 'ESG披露', '危废管理']

export const SPACE_CATEGORIES = ['业务域', '功能域', '角色域', '场景域', '项目域']

export const SPACE_ORGS = ['行政部门', 'AI快车', '人力资源', '销售部门', '制造部门', '生产部门', '财务部门', '测试部门']

export const SPACE_COLORS = [
  { value: 'red', from: '#fb7185', to: '#e11d48' },
  { value: 'purple', from: '#a78bfa', to: '#7c3aed' },
  { value: 'pink', from: '#f472b6', to: '#db2777' },
  { value: 'blue', from: '#60a5fa', to: '#2563eb' },
  { value: 'green', from: '#34d399', to: '#059669' },
  { value: 'cyan', from: '#22d3ee', to: '#0891b2' },
  { value: 'amber', from: '#fbbf24', to: '#d97706' }
]

export const SPACE_STRATEGIES = [
  { value: 'round', label: '轮询分发', hint: '按顺序在可用 Agent 间轮转，适合负载均衡' },
  { value: 'tag', label: '标签优先', hint: '优先匹配业务标签一致的 Agent，标签不命中时回落至 Main Agent' },
  { value: 'idle', label: '负载最低优先', hint: '优先分发给当前运行任务最少的 Agent' }
]

export const RULE_GROUPS = ['请求路由', '监测预警', '台账管理', '审批流转', '数据质量']

export const RULE_FIELDS = [
  { value: 'message.tag', label: '请求业务标签', kind: 'text' },
  { value: 'message.text', label: '请求内容', kind: 'text' },
  { value: 'emission.cod', label: '化学需氧量 (mg/L)', kind: 'number' },
  { value: 'emission.nh3', label: '氨氮 (mg/L)', kind: 'number' },
  { value: 'monitor.source', label: '监测点位', kind: 'text' },
  { value: 'ledger.missingDays', label: '台账缺失天数', kind: 'number' },
  { value: 'file.ext', label: '文件类型', kind: 'text' },
  { value: 'task.type', label: '任务类型', kind: 'text' }
]

export const RULE_OPS = [
  { value: 'eq', label: '等于' },
  { value: 'ne', label: '不等于' },
  { value: 'contains', label: '包含' },
  { value: 'gt', label: '大于' },
  { value: 'gte', label: '大于等于' },
  { value: 'lt', label: '小于' },
  { value: 'lte', label: '小于等于' }
]

export const RULE_ACTIONS = [
  { value: 'assign', label: '指派 Agent' },
  { value: 'notify', label: '提醒标签责任人' },
  { value: 'tag', label: '写入业务标签' },
  { value: 'escalate', label: '升级人工处理' },
  { value: 'webhook', label: '调用外部接口' }
]

function registryItem(code, name, category, version, description, capabilities) {
  return {
    id: `reg-${code}`,
    code,
    name,
    category,
    version,
    provider: 'SOA 智能体中心',
    description,
    capabilities,
    registeredAt: ago(60 + code.length, 3)
  }
}

export const REGISTRY = [
  registryItem('env-compliance-review', '环境合规审查Agent', '合规审查', 'v2.3.1', '依据现行环保法规与体系标准审查企业文件、台账与整改记录的合规性。', ['条款比对', '缺陷定位', '整改建议']),
  registryItem('carbon-accounting', '碳排放核算Agent', '数据核算', 'v1.8.0', '按核算指南汇总活动水平数据与排放因子，输出组织与产品级碳排放结果。', ['因子匹配', '边界核定', '核算报表']),
  registryItem('eia-report', '环评报告编制Agent', '报告编制', 'v2.0.4', '按项目类别生成环境影响评价报告书章节草稿并校验必备要素。', ['章节生成', '要素校验', '引用溯源']),
  registryItem('permit-discharge', '排污许可申报Agent', '申报审批', 'v1.6.2', '梳理排放口、污染因子与许可量，生成排污许可申报材料清单。', ['排口梳理', '许可量测算', '材料清单']),
  registryItem('monitor-anomaly', '在线监测异常诊断Agent', '监测诊断', 'v1.4.7', '识别在线监测数据的漂移、缺失与超标特征并给出处置建议。', ['异常识别', '趋势分析', '处置建议']),
  registryItem('waste-manifest', '危废转移单核验Agent', '合规审查', 'v1.2.9', '核验危险废物转移联单要素完整性与运输资质有效期。', ['联单核验', '资质校验', '台账比对']),
  registryItem('energy-audit', '能耗审计Agent', '数据核算', 'v1.5.0', '按用能单元拆解能耗结构，定位高耗能环节与节能空间。', ['能耗拆解', '标杆对比', '节能测算']),
  registryItem('iso14001-audit', 'ISO14001内审Agent', '体系审核', 'v2.1.0', '生成环境管理体系内审检查表并归集不符合项。', ['检查表生成', '不符合归集', '审核报告']),
  registryItem('iso45001-audit', 'ISO45001内审Agent', '体系审核', 'v2.0.6', '面向职业健康安全管理体系的内审策划与结果汇总。', ['审核策划', '风险评价', '报告输出']),
  registryItem('safety-inspect', '安全隐患排查Agent', '风险排查', 'v1.7.3', '按作业场景生成隐患排查清单并跟踪闭环状态。', ['清单生成', '风险分级', '闭环跟踪']),
  registryItem('esg-report', 'ESG披露报告Agent', '报告编制', 'v2.2.0', '对照披露框架整理指标数据并生成披露章节。', ['指标映射', '数据核对', '章节撰写']),
  registryItem('water-quality', '水质数据分析Agent', '监测诊断', 'v1.3.4', '分析废水监测数据达标情况与工艺关联因素。', ['达标判定', '因子关联', '趋势预测']),
  registryItem('air-emission', '废气排放核算Agent', '数据核算', 'v1.4.1', '核算有组织与无组织废气排放量并生成排放清单。', ['排放清单', '因子核算', '总量校核']),
  registryItem('noise-assess', '厂界噪声评估Agent', '监测诊断', 'v1.1.8', '依据厂界噪声标准评估监测结果并定位超标源。', ['标准比对', '声源定位', '评估结论']),
  registryItem('soil-survey', '土壤污染状况调查Agent', '调查评估', 'v1.2.2', '梳理调查布点、检测项目与风险筛查结论。', ['布点建议', '检出比对', '风险筛查']),
  registryItem('law-retrieval', '环保法规检索Agent', '知识检索', 'v1.9.5', '检索法律法规、标准与地方细则条款并给出适用范围说明。', ['条款检索', '效力判断', '适用说明']),
  registryItem('doc-extract', '文档要素抽取Agent', '文档处理', 'v2.4.0', '从报告、批复与检测单据中抽取结构化要素。', ['要素抽取', '表格还原', '字段校验']),
  registryItem('ledger-check', '环境台账稽核Agent', '合规审查', 'v1.6.6', '稽核运行记录、监测台账与设施台账的完整性与一致性。', ['完整性稽核', '一致性比对', '缺项提醒']),
  registryItem('training-plan', '环保培训计划Agent', '运营支持', 'v1.0.9', '按岗位职责生成年度环保培训计划与考核要点。', ['计划编排', '课程匹配', '考核出题']),
  registryItem('supplier-esg', '供应商ESG评估Agent', '评估评级', 'v1.3.0', '基于问卷与公开信息对供应商进行ESG风险评级。', ['问卷解析', '风险评级', '改进建议']),
  registryItem('emergency-drill', '突发环境事件应急Agent', '应急响应', 'v1.5.5', '生成应急预案演练脚本并评估处置响应时效。', ['预案匹配', '演练脚本', '响应评估']),
  registryItem('cleaner-production', '清洁生产审核Agent', '体系审核', 'v1.4.3', '识别清洁生产机会并测算方案投入产出。', ['机会识别', '方案测算', '绩效评估']),
  registryItem('carbon-quota', '碳配额履约Agent', '申报审批', 'v1.2.7', '跟踪碳配额缺口与履约节点，生成履约方案建议。', ['缺口测算', '履约排期', '方案建议'])
]

export const WELCOME_ICONS = ['🤖', '💬', '📊', '📚', '📝', '🧩', '🔍', '📁', '⚙️', '🌱', '⚡', '✅']

export const EMBED_MODELS = ['bge-large-zh', 'bge-base-zh', 'm3e-base', 'text-embedding-3-large']

export const RETRIEVAL_FALLBACKS = [
  { value: 'notice', label: '提示补充知识文档', hint: '未命中时列出已接入知识库并建议补充对应文档' },
  { value: 'main', label: '由 Main Agent 直接应答', hint: '未命中时改由调度中枢依据空间配置作答' }
]

const resourceGroup = (key, icon, title, rows) => ({
  key,
  icon,
  title,
  items: rows.map(([code, name, desc]) => ({ code, name, desc }))
})

export const RESOURCE_GROUPS = [
  resourceGroup('skill', '🧩', 'SKILL 技能', [
    ['kb.query', '知识库查询', '通过 OpenClaw 检索知识库文档并返回原文片段'],
    ['file.submit', '文件提交', '通过 OpenClaw 将文件提交至文件中心并登记'],
    ['agent.chat', 'Agent对话', '通过 OpenClaw 与指定 Agent 建立对话'],
    ['llm.reason', 'LLM 推理', '通过 OpenClaw 调用大模型完成文本推理'],
    ['image.generate', '图片生成', '通过 OpenClaw 按描述生成图片'],
    ['image.caption', '图片描述', '通过 OpenClaw 识别图片内容并生成描述'],
    ['audio.tts', '语音合成', '通过 OpenClaw 将文字转换为语音'],
    ['audio.asr', '音频转录', '通过 OpenClaw 将音频转写为文字'],
    ['video.generate', '视频生成', '通过 OpenClaw 按脚本生成短视频'],
    ['web.search', '网页搜索', '通过 OpenClaw 搜索公开网页内容'],
    ['web.fetch', '网页抓取', '通过 OpenClaw 抓取网页正文并解析为结构化文本'],
    ['browser.auto', '浏览器自动化', '通过 OpenClaw 驱动浏览器完成页面操作'],
    ['embed.vector', '嵌入向量', '通过 OpenClaw 生成文本嵌入向量']
  ]),
  resourceGroup('tool', '🔧', 'TOOL 工具', [
    ['dev.insulation', '查询绝缘电阻', '调用 ACR1V01 设备属性绝缘电阻（01947000001001）'],
    ['dev.leakage', '查询泄漏电流', '调用 ACR1V01 设备属性泄漏电流（01947000001101）'],
    ['dev.winding', '查询绕组温度', '调用 ACR1V01 设备属性绕组温度（01947000001201）'],
    ['dev.runtime', '查询累计运行时长', '调用 ACR1V01 设备属性累计运行时长（01947000001301）'],
    ['browser.operate', '浏览器操作', '通过 OpenClaw 在门户网站完成点击、输入与跳转'],
    ['browser.shot', '浏览器截屏', '通过 OpenClaw 获取当前页面截图并回传']
  ]),
  resourceGroup('agent', '🛡️', 'Agent 智能体', [
    ['agt-vuln-scan', '自动发现漏洞测试'],
    ['agt-verify-test', '验证测试Agent'],
    ['agt-ui-repair', 'UI修复测试Agent'],
    ['agt-code-writer', '代码编写Agent生产版'],
    ['agt-rd', '研发Agent生产版'],
    ['agt-env-brain', '环保大脑Agent v2.0.0'],
    ['agt-space-scheduler', '团队空间调度Agent'],
    ['agt-ts-prep', '时序数据预处理Agent']
  ]),
  resourceGroup('workflow', '🔀', 'Workflow 工作流模板', [
    ['wf-data-analysis', '数据分析工作流', '通过 MCP Server 获取数据并输出分析图表'],
    ['wf-customer-check', '客户信息核查', '调用业务系统接口核查客户主体信息'],
    ['wf-weather-report', '天气报告生成', '按厂区位置生成逐日天气报告'],
    ['wf-device-status', '设备状态监控', '采集设备运行状态并输出监控结论'],
    ['wf-line-anomaly', '产线异常检测（排产管理）', '比对排产计划识别产线异常工单'],
    ['wf-risk-assess', '综合风险评估（关联分析）', '汇总多源指标输出综合风险评分'],
    ['wf-fault-diagnose', '故障诊断（知识增强）', '结合故障知识库定位设备故障原因'],
    ['wf-factory-audit', '工厂全面审计（逻辑校验）', '按审计清单逐项校验记录一致性'],
    ['wf-line-perf', '产线绩效监测（事件驱动）', '按事件触发统计产线绩效指标'],
    ['wf-prod-overview', '生产数据总览', '汇总班次产量、能耗与质量数据'],
    ['wf-device-inspect', '设备巡检', '生成巡检路线并归集巡检记录'],
    ['wf-craft-qa', '工艺知识问答', '面向工艺文件的条款问答与引用'],
    ['wf-line-config', '产线绿色配置', '输出低碳工艺参数配置建议'],
    ['wf-device-anomaly', '设备异常分析', '分析异常测点并给出处置优先级'],
    ['wf-env-compliance', '环保合规监控', '比对许可要求监控排放合规状态'],
    ['wf-emission-alert', '排放异常预警', '识别排放数据异常趋势并触发预警'],
    ['wf-energy-audit', '用能审核辅助', '拆解用能结构并定位节能空间'],
    ['wf-fraud-detect', '交易反欺诈检测', '识别异常交易特征并输出核查建议'],
    ['wf-credit-review', '信贷审核流程', '归集材料要素并输出审核结论草稿'],
    ['wf-agent-collab', '跨Agent协作调度', '拆分复杂任务并汇总多 Agent 结果'],
    ['wf-ontology-query', 'ontology-query', '基于本体模型查询设备与工艺关系'],
    ['wf-insulation-risk', '评估绝缘老化风险', '结合绝缘电阻与温度趋势评估老化风险']
  ])
]
