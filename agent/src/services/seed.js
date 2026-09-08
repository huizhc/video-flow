import { REGISTRY } from './catalog'

const DAY = 86400000

function ago(days, hours = 0) {
  return new Date(Date.now() - days * DAY - hours * 3600000).toISOString()
}

export const CURRENT_USER = {
  id: 'usr-admin',
  name: '系统管理员',
  account: 'admin',
  role: 'super',
  tags: ['环境合规'],
  status: 'active',
  joinedAt: ago(96, 5)
}

export const DEFAULT_SPACE = {
  name: '团队空间',
  subtitle: '环境Agent',
  spaceId: '5a1b2c3d4e5f67890abcdef123456780',
  mainAgentEndpoint: 'http://localhost:3003',
  description: '面向环境管理与合规业务的 Agent 协同空间，由 Main Agent 统一调度团队内智能体、知识库与技能。',
  icon: '🤖',
  memberLimit: 15,
  scheduleStrategy: 'tag',
  tagRouting: true,
  jwtEnabled: true,
  jwtTtl: 8,
  schedulerEnabled: true,
  sessionRetainDays: 30,
  sessionMaxCount: 100,
  concurrency: 8,
  integrated: true,
  createdAt: ago(96, 5)
}

function seedAgents() {
  return [
    {
      id: 'agt-main',
      code: 'main-agent',
      name: 'MAIN Agent',
      category: '调度中枢',
      isMain: true,
      status: 'running',
      version: 'v3.0.0',
      protocol: 'v2.0.0',
      description: '团队空间调度中枢，负责意图识别、标签路由与业务 Agent 编排。',
      prompt: '你是环境Agent团队空间的调度中枢，负责理解用户意图、按业务标签选择合适的业务 Agent 并汇总结果。',
      skillIds: ['skl-law-retrieval', 'skl-doc-parse', 'skl-emission-calc'],
      kbIds: ['kb-iso14001', 'kb-regulation', 'kb-ledger'],
      tags: ['环境合规', '碳管理'],
      calls: 1286,
      source: 'built-in',
      createdAt: ago(96, 5),
      updatedAt: ago(2, 3)
    },
    {
      id: 'agt-compliance',
      code: 'env-compliance-review',
      name: '环境合规审查Agent',
      category: '合规审查',
      isMain: false,
      status: 'running',
      version: 'v2.3.1',
      protocol: 'v2.0.0',
      description: '依据现行环保法规与体系标准审查企业文件、台账与整改记录的合规性。',
      prompt: '你是环境合规审查专家，请依据知识库中的法规与标准条款判断材料合规性，并列出条款依据与整改建议。',
      skillIds: ['skl-law-retrieval', 'skl-doc-parse'],
      kbIds: ['kb-iso14001', 'kb-regulation'],
      tags: ['环境合规'],
      calls: 512,
      source: 'registry',
      createdAt: ago(41, 2),
      updatedAt: ago(1, 6)
    },
    {
      id: 'agt-carbon',
      code: 'carbon-accounting',
      name: '碳排放核算Agent',
      category: '数据核算',
      isMain: false,
      status: 'running',
      version: 'v1.8.0',
      protocol: 'v2.0.0',
      description: '按核算指南汇总活动水平数据与排放因子，输出组织与产品级碳排放结果。',
      prompt: '你是碳排放核算专家，请核定核算边界、匹配排放因子并给出计算过程与结果表。',
      skillIds: ['skl-emission-calc'],
      kbIds: ['kb-ledger'],
      tags: ['碳管理'],
      calls: 238,
      source: 'registry',
      createdAt: ago(27, 8),
      updatedAt: ago(3, 1)
    }
  ]
}

function seedSkills() {
  return [
    {
      id: 'skl-law-retrieval',
      code: 'law.retrieval',
      name: '法规条款检索',
      category: '知识检索',
      version: 'v1.4.0',
      status: 'enabled',
      shared: true,
      description: '在法规知识库中检索条款原文，返回条款编号、适用范围与效力状态。',
      timeout: 15,
      retry: 1,
      calls: 642,
      params: [
        { name: 'keyword', type: 'string', required: true, default: '', desc: '检索关键词' },
        { name: 'scope', type: 'string', required: false, default: '国家标准', desc: '检索范围' },
        { name: 'topK', type: 'number', required: false, default: '5', desc: '返回条款数量' }
      ],
      versions: [
        { version: 'v1.4.0', at: ago(9, 2), note: '补充地方标准索引，条款召回率提升' },
        { version: 'v1.3.0', at: ago(38, 4), note: '新增效力状态判断' },
        { version: 'v1.0.0', at: ago(88, 1), note: '首次发布' }
      ],
      createdAt: ago(88, 1),
      updatedAt: ago(9, 2)
    },
    {
      id: 'skl-doc-parse',
      code: 'doc.parse',
      name: '报告文档解析',
      category: '文档处理',
      version: 'v2.1.0',
      status: 'enabled',
      shared: true,
      description: '解析监测报告、批复文件与检测单据，抽取结构化要素与表格数据。',
      timeout: 30,
      retry: 2,
      calls: 318,
      params: [
        { name: 'fileId', type: 'string', required: true, default: '', desc: '文件中心文件标识' },
        { name: 'mode', type: 'string', required: false, default: 'structured', desc: '解析模式' }
      ],
      versions: [
        { version: 'v2.1.0', at: ago(14, 6), note: '支持跨页表格合并' },
        { version: 'v2.0.0', at: ago(52, 2), note: '重写要素抽取管线' }
      ],
      createdAt: ago(76, 3),
      updatedAt: ago(14, 6)
    },
    {
      id: 'skl-emission-calc',
      code: 'emission.calc',
      name: '排放数据核算',
      category: '数据计算',
      version: 'v1.2.0',
      status: 'enabled',
      shared: true,
      description: '按排放因子集与统计周期核算排放量，输出核算过程与结果表。',
      timeout: 20,
      retry: 1,
      calls: 205,
      params: [
        { name: 'factorSet', type: 'string', required: true, default: '国家温室气体清单', desc: '排放因子集' },
        { name: 'period', type: 'string', required: true, default: '2026-Q2', desc: '统计周期' },
        { name: 'unit', type: 'string', required: false, default: 'tCO2e', desc: '结果单位' }
      ],
      versions: [
        { version: 'v1.2.0', at: ago(6, 4), note: '增加产品级核算口径' },
        { version: 'v1.0.0', at: ago(63, 7), note: '首次发布' }
      ],
      createdAt: ago(63, 7),
      updatedAt: ago(6, 4)
    }
  ]
}

function seedKnowledgeBases() {
  return [
    {
      id: 'kb-iso14001',
      name: 'ISO14001环境管理体系标准库',
      domain: '体系标准',
      model: 'bge-large-zh',
      visibility: 'space',
      visibleTags: [],
      description: '收录环境管理体系标准条款、内审要点与体系文件模板。',
      indexStatus: 'ready',
      indexedAt: ago(4, 2),
      createdAt: ago(90, 4),
      updatedAt: ago(4, 2)
    },
    {
      id: 'kb-regulation',
      name: '排污许可与环评法规库',
      domain: '法律法规',
      model: 'bge-large-zh',
      visibility: 'space',
      visibleTags: [],
      description: '收录排污许可、环境影响评价及配套技术规范的现行条款。',
      indexStatus: 'ready',
      indexedAt: ago(2, 7),
      createdAt: ago(84, 6),
      updatedAt: ago(2, 7)
    },
    {
      id: 'kb-ledger',
      name: '企业环境台账',
      domain: '运行记录',
      model: 'bge-base-zh',
      visibility: 'tag',
      visibleTags: ['环境合规', '碳管理'],
      description: '归集监测数据、设施运行与能耗活动水平的台账资料。',
      indexStatus: 'ready',
      indexedAt: ago(1, 3),
      createdAt: ago(70, 2),
      updatedAt: ago(1, 3)
    }
  ]
}

function seedDocuments() {
  return [
    {
      id: 'doc-14001-clause',
      kbId: 'kb-iso14001',
      title: '环境管理体系 GB/T 24001 条款要求解读',
      category: '标准条款',
      tags: ['体系', '条款'],
      content:
        '环境管理体系要求组织确定环境管理体系的范围，识别与活动、产品和服务相关的环境因素，并评价其环境影响的重要程度。组织应在考虑生命周期观点的前提下建立环境因素识别准则，形成重要环境因素清单并保持文件化信息。\n最高管理者应对环境管理体系的有效性承担责任，确保环境方针与目标同组织战略方向一致，并在组织内分配职责与权限。合规义务的识别与获取应持续更新，涉及排放限值、许可要求与地方规定的变化需在制度中及时反映。',
      updatedBy: '系统管理员',
      createdAt: ago(88, 3),
      updatedAt: ago(12, 1)
    },
    {
      id: 'doc-14001-audit',
      kbId: 'kb-iso14001',
      title: '内部审核检查表编制要点',
      category: '审核工具',
      tags: ['内审', '检查表'],
      content:
        '内部审核检查表应覆盖标准全部条款，并结合组织实际过程细化审核问题。检查表条目需明确审核对象、证据来源与判定准则，避免出现无法取证的宽泛提问。\n审核发现分为不符合项、观察项与改进机会三类。不符合项须写明事实描述、违反条款与责任部门，并在规定期限内完成纠正措施验证。',
      updatedBy: '系统管理员',
      createdAt: ago(80, 5),
      updatedAt: ago(20, 4)
    },
    {
      id: 'doc-14001-target',
      kbId: 'kb-iso14001',
      title: '环境目标与管理方案模板',
      category: '文件模板',
      tags: ['目标', '模板'],
      content:
        '环境目标应可测量、可监视，并与重要环境因素、合规义务及风险机遇相对应。管理方案需明确措施内容、责任人、资源投入、完成时限与结果评价方式。\n目标完成情况按季度评审，未达成目标须分析偏差原因并调整措施，评审记录作为管理评审输入。',
      updatedBy: '系统管理员',
      createdAt: ago(66, 2),
      updatedAt: ago(31, 6)
    },
    {
      id: 'doc-permit-apply',
      kbId: 'kb-regulation',
      title: '排污许可申报材料要求',
      category: '许可管理',
      tags: ['排污许可', '申报'],
      content:
        '申请排污许可证应提交申请前信息公开情况说明、主要生产工艺流程图、排污口位置及数量、污染物种类与排放浓度限值、自行监测方案以及环境管理台账记录要求。\n排放口应区分主要排放口与一般排放口，主要排放口需载明许可排放量。变更事项涉及排放口数量、污染物种类或许可排放量增加时，应重新申请许可。',
      updatedBy: '系统管理员',
      createdAt: ago(76, 7),
      updatedAt: ago(8, 2)
    },
    {
      id: 'doc-eia-class',
      kbId: 'kb-regulation',
      title: '环境影响评价分类管理与报批流程',
      category: '环评管理',
      tags: ['环评', '流程'],
      content:
        '建设项目按环境影响程度实行分类管理，分别编制环境影响报告书、报告表或填报环境影响登记表。报告书编制应完成现状监测、影响预测、环境保护措施论证与环境经济损益分析。\n报批流程包括编制单位内部审核、专家技术评审、审批部门受理与批复。批复文件中的环境保护措施要求应纳入设计与施工合同，并在竣工环境保护验收中逐项核查。',
      updatedBy: '系统管理员',
      createdAt: ago(72, 3),
      updatedAt: ago(15, 5)
    },
    {
      id: 'doc-monitor-plan',
      kbId: 'kb-regulation',
      title: '自行监测方案编制规范',
      category: '监测管理',
      tags: ['自行监测', '规范'],
      content:
        '自行监测方案应包括监测点位、监测因子、监测频次、执行标准、采样与分析方法、质量保证与质量控制措施以及信息公开方式。\n废水总排口与主要废气排放口应按规定安装自动监测设备并与生态环境主管部门联网。手工监测数据与自动监测数据均需保存原始记录，保存期限不少于五年。',
      updatedBy: '系统管理员',
      createdAt: ago(58, 6),
      updatedAt: ago(6, 3)
    },
    {
      id: 'doc-ledger-water',
      kbId: 'kb-ledger',
      title: '2026年二季度废水在线监测台账',
      category: '监测台账',
      tags: ['废水', '在线监测'],
      content:
        '本季度废水总排口化学需氧量日均浓度区间为 21.4 至 38.6 mg/L，氨氮日均浓度区间为 1.2 至 4.7 mg/L，均低于许可排放浓度限值。5 月 18 日因生化池曝气机检修出现一次数据缺失，缺失时段已按有效数据补遗规则填报并留存检修记录。\n季度累计排放水量 82,640 m³，化学需氧量排放量 2.31 t，氨氮排放量 0.28 t，均在许可排放量范围内。',
      updatedBy: '系统管理员',
      createdAt: ago(30, 4),
      updatedAt: ago(3, 2)
    },
    {
      id: 'doc-ledger-energy',
      kbId: 'kb-ledger',
      title: '2026年二季度能源活动水平记录',
      category: '能耗台账',
      tags: ['能耗', '碳核算'],
      content:
        '本季度外购电量 1,842,300 kWh，天然气消耗 126,500 m³，柴油消耗 18.6 t。各项活动水平数据取自计量器具月度抄表记录，计量器具均在检定有效期内。\n按国家温室气体清单排放因子核算，季度范围一与范围二温室气体排放合计 1,486.2 tCO2e，其中外购电力对应排放 1,049.7 tCO2e。',
      updatedBy: '系统管理员',
      createdAt: ago(28, 2),
      updatedAt: ago(2, 5)
    }
  ]
}

function seedFiles() {
  return [
    { id: 'fd-system', name: '体系文件', type: 'folder', parentId: null, size: 0, owner: '系统管理员', createdAt: ago(90, 2), updatedAt: ago(12, 4) },
    { id: 'fd-monitor', name: '监测报告', type: 'folder', parentId: null, size: 0, owner: '系统管理员', createdAt: ago(88, 6), updatedAt: ago(3, 1) },
    { id: 'fd-ledger', name: '台账与记录', type: 'folder', parentId: null, size: 0, owner: '系统管理员', createdAt: ago(85, 3), updatedAt: ago(2, 2) },
    {
      id: 'fl-permit',
      name: '排污许可证.pdf',
      type: 'file',
      parentId: null,
      ext: 'pdf',
      size: 2458624,
      owner: '系统管理员',
      content:
        '排污许可证\n证书编号：91330000-2024-045\n有效期：2024-07-01 至 2029-06-30\n许可排放口：废水总排口 1 个、有组织废气排放口 3 个\n主要污染物：化学需氧量、氨氮、颗粒物、二氧化硫、氮氧化物\n许可排放量：化学需氧量 9.8 t/a，氨氮 1.2 t/a，颗粒物 4.6 t/a',
      createdAt: ago(74, 5),
      updatedAt: ago(74, 5)
    },
    {
      id: 'fl-manual',
      name: '环境管理手册.docx',
      type: 'file',
      parentId: 'fd-system',
      ext: 'docx',
      size: 1836032,
      owner: '系统管理员',
      content:
        '环境管理手册\n第一章 组织概况与体系范围\n第二章 环境方针与目标\n第三章 环境因素识别与评价\n第四章 合规义务管理\n第五章 运行控制与应急准备\n第六章 监视测量与内部审核\n第七章 管理评审与持续改进',
      createdAt: ago(70, 3),
      updatedAt: ago(12, 4)
    },
    {
      id: 'fl-procedure',
      name: '程序文件清单.xlsx',
      type: 'file',
      parentId: 'fd-system',
      ext: 'xlsx',
      size: 264192,
      owner: '系统管理员',
      content:
        '程序文件清单\nEP-01 环境因素识别与评价控制程序\nEP-02 合规义务管理程序\nEP-03 环境目标与管理方案控制程序\nEP-04 运行控制程序\nEP-05 应急准备与响应控制程序\nEP-06 监视测量与合规性评价程序\nEP-07 内部审核程序\nEP-08 管理评审程序',
      createdAt: ago(70, 2),
      updatedAt: ago(28, 7)
    },
    {
      id: 'fl-target',
      name: '环境目标与管理方案.txt',
      type: 'file',
      parentId: 'fd-system',
      ext: 'txt',
      size: 1284,
      owner: '系统管理员',
      content:
        '2026年度环境目标\n1. 单位产品综合能耗同比下降 3%，责任部门：生产部，完成时限：2026-12-31\n2. 废水化学需氧量年排放量控制在 9.5 t 以内，责任部门：环保部\n3. 一般工业固体废物资源化利用率不低于 92%，责任部门：设备部\n4. 全年环境违法事件为零，责任部门：各生产单元',
      createdAt: ago(64, 4),
      updatedAt: ago(9, 3)
    },
    {
      id: 'fl-water-report',
      name: '2026Q2废水监测报告.pdf',
      type: 'file',
      parentId: 'fd-monitor',
      ext: 'pdf',
      size: 5242880,
      owner: '系统管理员',
      content:
        '2026年第二季度废水监测报告\n监测点位：废水总排口（DW001）\n执行标准：GB 8978-1996 一级标准\n监测因子：化学需氧量、氨氮、总磷、悬浮物、pH\n监测结果：化学需氧量 21.4~38.6 mg/L，氨氮 1.2~4.7 mg/L，总磷 0.18~0.42 mg/L，pH 6.8~7.6\n结论：本季度各监测因子均满足排放标准与许可要求。',
      createdAt: ago(6, 5),
      updatedAt: ago(6, 5)
    },
    {
      id: 'fl-air-report',
      name: '2026Q2废气监测报告.pdf',
      type: 'file',
      parentId: 'fd-monitor',
      ext: 'pdf',
      size: 4823449,
      owner: '系统管理员',
      content:
        '2026年第二季度废气监测报告\n监测点位：锅炉排放口（FQ001）、涂装废气排放口（FQ002）、车间无组织监测点\n执行标准：GB 13271-2014、GB 16297-1996\n监测结果：颗粒物 4.2~9.8 mg/m³，二氧化硫 12~31 mg/m³，氮氧化物 48~86 mg/m³，非甲烷总烃 2.6~7.4 mg/m³\n结论：各排放口污染物浓度低于排放限值，无组织监测点满足厂界要求。',
      createdAt: ago(5, 2),
      updatedAt: ago(5, 2)
    },
    {
      id: 'fl-energy-ledger',
      name: '能源活动水平台账.xlsx',
      type: 'file',
      parentId: 'fd-ledger',
      ext: 'xlsx',
      size: 719872,
      owner: '系统管理员',
      content:
        '能源活动水平台账（2026年二季度）\n外购电量：4月 612,400 kWh / 5月 598,700 kWh / 6月 631,200 kWh\n天然气：4月 41,300 m³ / 5月 40,800 m³ / 6月 44,400 m³\n柴油：4月 6.1 t / 5月 5.9 t / 6月 6.6 t\n数据来源：计量器具月度抄表记录，器具均在检定有效期内。',
      createdAt: ago(28, 3),
      updatedAt: ago(2, 2)
    }
  ]
}

function seedRules() {
  return [
    {
      id: 'rul-route-compliance',
      name: '合规审查请求路由',
      group: '请求路由',
      priority: 1,
      enabled: true,
      description: '带有环境合规标签的请求直接分派给环境合规审查Agent。',
      conditions: [{ field: 'message.tag', op: 'eq', value: '环境合规', join: 'and' }],
      actions: [{ type: 'assign', target: 'agt-compliance' }],
      hits: 148,
      lastHitAt: ago(0, 5),
      createdAt: ago(40, 2),
      updatedAt: ago(11, 4)
    },
    {
      id: 'rul-route-carbon',
      name: '碳核算请求路由',
      group: '请求路由',
      priority: 2,
      enabled: true,
      description: '碳管理标签请求分派给碳排放核算Agent。',
      conditions: [{ field: 'message.tag', op: 'eq', value: '碳管理', join: 'and' }],
      actions: [{ type: 'assign', target: 'agt-carbon' }],
      hits: 63,
      lastHitAt: ago(1, 2),
      createdAt: ago(26, 6),
      updatedAt: ago(7, 3)
    },
    {
      id: 'rul-emission-alert',
      name: '废水指标超限预警',
      group: '监测预警',
      priority: 3,
      enabled: true,
      description: '化学需氧量日均值超过 50 mg/L 时提醒环境合规责任人并转合规审查。',
      conditions: [
        { field: 'emission.cod', op: 'gt', value: '50', join: 'and' },
        { field: 'monitor.source', op: 'eq', value: '废水总排口', join: 'and' }
      ],
      actions: [
        { type: 'notify', target: '环境合规' },
        { type: 'assign', target: 'agt-compliance' }
      ],
      hits: 12,
      lastHitAt: ago(4, 7),
      createdAt: ago(35, 1),
      updatedAt: ago(4, 7)
    },
    {
      id: 'rul-ledger-missing',
      name: '台账缺失提醒',
      group: '台账管理',
      priority: 4,
      enabled: false,
      description: '连续三日无台账记录时写入台账异常标签并提醒责任人。',
      conditions: [{ field: 'ledger.missingDays', op: 'gte', value: '3', join: 'and' }],
      actions: [
        { type: 'tag', target: '台账异常' },
        { type: 'notify', target: '环境合规' }
      ],
      hits: 5,
      lastHitAt: ago(18, 3),
      createdAt: ago(22, 5),
      updatedAt: ago(18, 3)
    }
  ]
}

function baseRuntime() {
  return {
    memberLimit: 15,
    scheduleStrategy: 'tag',
    tagRouting: true,
    jwtEnabled: true,
    jwtTtl: 8,
    schedulerEnabled: true,
    sessionRetainDays: 30,
    sessionMaxCount: 100,
    concurrency: 8,
    integrated: true
  }
}

const BUSINESS_SPACE_RAW = [
  { id: "0l3i55k21g023i31kk3i349k77g55i58", name: "行政域智能体", category: "业务域", org: "行政部门", description: "面向企业行政办公场景，服务于日常行政事务咨询，支持会议安排、用印办理、公文流转、车辆调度、办公用品统筹等日常行政工作场景。", scene: "智能会议管理,用印与公文审批,车辆调度与派车,办公用品申领,差旅申请与报销,行政效率分析,访客预约与接待,固定资产盘点,档案借阅管理,通知公告发布", createTime: "2026-03-30 17:41:21", updateTime: "2026-07-14 14:37:30" },
  { id: "134f66b327134942bb49450bee76696f", name: "研发域智能体", category: "业务域", org: "AI快车", description: "面向产品研发管理场景，服务研发项目管理人员日常咨询，支持新品项目节点管控、图纸资料管理、物料替代核对、项目进度跟进、研发文档归档等研发办公场景。", scene: "产品BOM管理与版本追溯,ECN变更影响分析,图纸与设计文档管理,仿真数据对比,物料替代方案推荐,研发项目里程碑监控,需求-设计-测试追溯,专利情报与竞品分析,技术标准合规校验,研发知识库智能检索", createTime: "2026-03-30 17:41:21", updateTime: "2026-05-13 15:02:59" },
  { id: "1m4j66l32h134j42ll4j450l88h66j6p", name: "人力资源域智能体", category: "业务域", org: "人力资源", description: "面向企业人力资源场景，服务于人事岗位日常咨询，支持入离职管理、考勤核算、薪酬福利、绩效考核、员工培训、人事制度落地等人力基础场景。", scene: "组织架构与编制管理,考勤异常与加班分析,绩效考核与评估,人才盘点与继任计划,培训需求与完成率追踪,薪酬对标与激励方案,招聘漏斗与到岗分析,员工离职风险预警,入职与转正流程管理,员工满意度调查分析", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 13:50:36" },
  { id: "2b850c544645424ab6960f0b4cd9dadb", name: "数据分析智能体", category: "业务域", org: "AI快车", description: "面向经营数据查询场景，服务各部门业务人员日常咨询，支持经营指标查询、业务数据汇总、数据异常核对、报表制作指引、业务数据解读等数据查询场景。", scene: "自助式可视化数据探索,拖拽式报表与仪表盘设计,多维度OLAP下钻与旋转,指标卡与KPI预警监控,异常检测与归因分析,自然语言转SQL查询,数据血缘与影响分析,定时报表推送与订阅,数据导出与API开放,分析结果协作与评论", createTime: "2026-05-08 15:14:43", updateTime: "2026-05-08 15:14:43" },
  { id: "2d5a77c438245a53cc5a561cff877a7g", name: "销售域智能体", category: "业务域", org: "销售部门", description: "面向全链路销售业务场景，服务销售运营岗位日常咨询，支持线索跟进、报价审批、合同签订、订单履约、回款核对等销售全流程场景。", scene: "商机管理与销售漏斗分析,报价与合同审批,订单履约跟踪,回款计划与逾期催收,客户360画像,销售预测与目标分解,丢单根因分析,价格策略与折扣管理,销售行为与拜访分析,大客户关系维护", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3e6b88d549356b64dd6b672d00988b8h", name: "制造域智能体", category: "业务域", org: "制造部门", description: "面向全厂制造运营场景，服务生产管理岗位日常咨询，支持产线效率查询、设备状态汇总、生产进度跟踪、物料齐套核对、生产异常梳理等制造管理场景。", scene: "产线OEE实时监控,设备状态与健康度监测,在线质量检测与预警,生产进度与工单追踪,物料齐套与配送调度,异常事件根因分析,设备预测性维护,质量SPC分析,数字孪生与工艺仿真,能源消耗监控", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-02 09:11:01" },
  { id: "44109146733e47da8532ecc496464014", name: "生产域智能体", category: "业务域", org: "生产部门", description: "面向企业生产运营场景，服务于生产运营岗位咨询，支持生产计划落地、生产物料统筹、产能效率优化、生产过程管理、生产复盘总结等运营场景。", scene: "物料需求计划与齐套检查,高级生产排程与调度,产线任务下发与报工,库存水位优化与调拨,设备运维与维修工单管理,生产质量全过程追溯,生产瓶颈智能识别,能效监控与优化,工艺路线管理,生产看板与关键指标驾驶舱", createTime: "2026-03-31 09:00:34", updateTime: "2026-03-31 15:15:25" },
  { id: "4f7c99e65a467c75ee7c783e11a99c9i", name: "服务域智能体", category: "业务域", org: "财务部门", description: "面向企业售后服务场景，服务于售后运营岗位咨询，支持售后工单流转、客户诉求协调、设备维保统筹、服务标准执行、售后复盘优化等服务场景。", scene: "服务工单创建与派发,客户投诉受理与闭环,维保合同与设备档案查询,备件申请与退换货,远程故障诊断指导,现场服务工程师调度,客户满意度调查与分析,服务质量指标监控,售后知识库检索,服务费用结算与核销", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 13:31:59" },
  { id: "5g8d00f76b578d86ff8d894f22b00d0j", name: "质量域智能体", category: "业务域", org: "财务部门", description: "面向企业全流程质量场景，服务于质量岗位日常咨询，支持各环节质检规范、不良问题判定、质量问题整改、品质过程管理、质量情况复盘等质量场景。", scene: "来料检验与供应商质量评分,过程质量SPC监控,成品检验与放行管理,不合格品处理与纠正预防,质量全流程追溯,缺陷帕累托分析,CPK过程能力评估,质量成本归集与分析,客诉质量根因回溯,体系审核与认证管理", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 13:32:19" },
  { id: "6h9e11g87c689e97gg9e905g33c11e1k", name: "工艺域智能体", category: "业务域", org: "财务部门", description: "面向生产工艺管理场景，服务于工艺岗位日常咨询，支持生产工艺标准、现场作业规范、工艺执行管理、工艺迭代优化、工艺经验沉淀等工艺场景。", scene: "工艺路线与工序设计,工艺参数标准管理,工艺变更与版本控制,工时定额与材料定额计算,工艺仿真与验证,现场工艺指导书下发,工艺纪律检查,工艺改进与优化建议,典型工艺知识库,工艺装备与工装管理", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "7i0f22h98d790f08hh0f016h44d22f2l", name: "财务域智能体", category: "业务域", org: "财务部门", description: "面向企业基础财务场景，服务于财务岗位日常咨询，支持基础账务处理、收支业务规范、费用统筹管理、预算执行跟进、财务台账梳理等财务场景。", scene: "总账与科目明细查询,应收应付与账龄分析,现金流监控与预测,预算编制与执行对比,成本归集与分摊计算,资金计划与付款审批,财务三大报表生成,税务计算与申报辅助,费用报销与合规审核,经营指标驾驶舱", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "8j1g33i09e801g19ii1g127i55e33g3m", name: "设备域智能体", category: "业务域", org: "财务部门", description: "面向企业设备管理场景，服务于设备岗位日常咨询，支持设备台账管理、日常巡检保养、设备故障处置、备件库存统筹、设备运维规范等设备场景。", scene: "设备台账与资产档案管理,预防性维保计划与工单,设备巡检与点检管理,故障报修与维修闭环,备件库存预警与申领,设备健康度与剩余寿命预测,设备OEE指标分析,设备故障知识库,特种设备与计量器具管理,设备生命周期成本分析", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "9k2h44j10f912h20jj2h238j66f44h4n", name: "后勤域智能体", category: "业务域", org: "财务部门", description: "面向企业后勤保障场景，服务于后勤岗位日常咨询，支持食宿服务管理、园区运维保障、车辆安保管理、物业报修处理、后勤服务统筹等后勤场景。", scene: "食堂就餐与食材供应链管理,员工宿舍申请与分配管理,企业班车与公务车调度,安保巡逻与门禁管理,清洁卫生与绿化养护,物业报修与工单跟踪,能源与水电费核算,会议室与接待管理,医务室与员工体检,后勤服务质量评价", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "fb6069c02a67420bbc3b507356b5b053", name: "采购域智能体", category: "业务域", org: "测试部门", description: "面向基础采购业务场景，服务于采购岗位日常咨询，支持物资采购申请、比价下单、到货入库协调、供货进度跟进、采购台账梳理等基础场景。", scene: "供应商准入与评估,采购寻源与询比价,采购订单创建与审批,到货计划与交货跟踪,供应商绩效评分与分级,采购成本趋势分析,框架合同与履约监控,质量异议与退换处理,供应商风险管理,采购合规审计与报表", createTime: "2026-03-31 08:58:15", updateTime: "2026-04-01 13:20:24" },
  { id: "2a1b2c3d4e5f67890abcdef123456789", name: "ERP智能体", category: "功能域", org: "财务部门", description: "面向企业进销存财务综合业务场景，服务财务、采购、计划岗位日常咨询，支持库存查询、物料核对、生产订单进度、采购付款流程、成本费用归集等业务场景。\n2.", scene: "库存余量与周转率查询,物料BOM多层展开与反查,生产订单状态与完工追踪,采购申请创建与审批流,成本中心费用与预算对比,应收应付与账龄管理,资产卡片与折旧计算,总账科目余额与明细,销售订单交付与开票,财务报表预制与审计追溯", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2b1c2d3e4f5a67890bcdef234567890", name: "PLM智能体", category: "功能域", org: "财务部门", description: "面向产品资料管理场景，服务研发、工艺岗位日常咨询，支持物料信息查询、产品结构核对、图纸版本管理、设计变更跟进、产品资料查阅等资料管理场景。", scene: "物料主数据创建与维护,BOM多视图配置与对比,图纸检入检出与版本管理,ECN变更申请-评审-发布流程,产品合规与认证信息管理,设计评审与问题追踪,产品配置与变型管理,变更影响范围穿透分析,研发成果归档与复用,供应商图纸外发管理", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2c1d2e3f4a5b67890cdef345678901", name: "CRM 智能体", category: "功能域", org: "财务部门", description: "面向客户经营管理场景，服务销售岗位日常咨询，支持客户信息查询、商机跟进管理、合同履约核对、客户服务记录、客户流失风险梳理等客户管理场景。", scene: "客户360视图与画像分析,销售线索培育与转化,商机阶段推进与评审,报价单与销售合同管理,客户服务请求与工单闭环,销售拜访与活动记录,客户分级与信用额度管理,客户流失预警与挽回策略,市场营销活动效果分析,客户投诉与满意度追踪", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2d1e2f3a4b5c67890def456789012", name: "SCM智能体", category: "功能域", org: "财务部门", description: "面向供应链全流程业务场景，服务采购、仓储岗位日常咨询，支持供应商信息查询、采购订单跟进、物流到货核对、库存协同管理、供方履约评估等供应链场景。", scene: "供应商注册-准入-评估-退出管理,采购订单下单-确认-发货-收货跟踪,物流运输节点可视化追踪,仓储库存多级协同与调拨,合同履约进度与偏差预警,供应商交付及时率与质量评分,原材料市场行情监控,供应商风险雷达扫描,供应链碳排放追踪,需求预测与补货建议", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2e1f2a3b4c5d67890ef567890123", name: "MES智能体", category: "功能域", org: "财务部门", description: "面向车间生产执行场景，服务车间调度、班组长日常咨询，支持工单进度查询、工序产量统计、设备状态查询、物料追溯、生产工时核对等车间作业场景。", scene: "生产工单接收与工序排程,操作工扫码报工与产量统计,设备运行状态实时监控,工艺参数在线下发与防错,首件检验与过程质量控制,物料批次追溯与防错防漏,人员到岗与工时绩效统计,ANDON异常呼叫与升级,生产日报与班组绩效看板,在制品WIP盘点与周转分析", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2f1a2b3c4d5e67890fa678901234", name: "QMS智能体", category: "功能域", org: "财务部门", description: "面向全流程品质管理场景，服务质检岗位日常咨询，支持来料、制程、成品检验规范查询、不良品处理流程、质量问题追溯、品质统计核对等质检场景。", scene: "检验标准与抽样方案管理,来料检验与供应商质量看板,过程巡检与工艺参数CPK监控,成品检验与出货质量判定,不合格品评审-处置-闭环追踪,质量全链条追溯与模拟召回,SPC控制图与过程能力分析,8D报告与纠正预防措施,失效模式FMEA分析,质量成本四象限归集统计", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2g1b2c3d4e5f67890gb789012345", name: "EAM智能体", category: "功能域", org: "财务部门", description: "面向设备全周期管理场景，服务设备管理岗位日常咨询，支持设备台账查询、保养计划安排、故障报修流程、备件库存核对、设备运维统计等设备管理场景。", scene: "设备台账与资产层级结构管理,预防性维保计划自动排程,巡检路线与点检标准执行,故障报修-派工-维修-验收闭环,备件安全库存与消耗关联,设备MTBF/MTTR可靠性分析,设备维护成本全口径归集,设备变更与技改管理,特种设备定期检验管理,设备退役报废与处置审批", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2h1c2d3e4f5a67890hc890123456", name: "IoT智能体", category: "功能域", org: "财务部门", description: "面向设备运行数据查询场景，服务设备运维岗位日常咨询，支持设备运行状态查询、设备异常提醒、设备历史运行记录、设备工况数据查看等设备监控场景。", scene: "设备数据实时采集与数字孪生,时序数据存储与降采样查询,告警规则配置与分级通知,振动/温度等多维特征趋势分析,设备影子状态同步与控制指令,OPC-UA/Modbus/MQTT协议适配,边缘计算节点管理与部署,数据管道与实时流计算,预测性维护模型推理,设备群组与拓扑关系管理", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "2i1d2e3f4a5b67890id901234567", name: "OA办公智能体", category: "功能域", org: "财务部门", description: "面向全员日常办公场景，服务于企业日常办公咨询，支持流程审批、公文流转、会议统筹、日程督办、文档归档管理等办公场景。", scene: "公文起草-会签-签发-归档流转,自定义审批流程与表单设计,会议室预定与冲突检测,企业日程共享与会议邀约,任务分派与进度督办,企业通讯录与组织树,公告通知与制度文库,印章使用与证照管理,出差与请假申请流程,待办中心与超时预警", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "76776b06fd714a7a851a7fcc6ad0638e", name: "企业文化宣传智能体", category: "功能域", org: "AI快车", description: "面向企业文化建设与宣传场景，服务于行政、党建、宣传岗位日常咨询，支持企业文化宣贯、文体活动组织、企业宣传素材、员工文化建设、团建活动统筹等文化场景。", scene: "企业文化，宣传", createTime: "2026-04-28 14:34:23", updateTime: "2026-04-29 13:08:56" },
  { id: "3a1b2c3d4e5f67890abcdef123456780", name: "财务总监经营智能体", category: "角色域", org: "财务部门", description: "为CFO/财务总监打造的专属经营财务管理驾驶舱。提供企业级财务健康状况总览，涵盖盈利能力、偿债能力、营运效率、成长性等核心财务指标。支持预算执行偏差预警、现金流压力测试、投资回报分析、成本结构优化建议、同行业对标、管理层KPI看板等高层决策辅助。", scene: "企业经营仪表盘与KPI监控,利润表/资产负债表/现金流量表三表联动分析,预算编制与执行偏差预警,现金流预测与压力测试,成本结构与降本增效分析,投资回报ROI与NPV分析,应收账款与资金占用优化,行业对标与竞争力分析,税务筹划与合规性审查,董事会与管理层报告自动生成", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 14:22:22" },
  { id: "3b1c2d3e4f5a67890bcdef234567891", name: "成本会计智能体", category: "角色域", org: "财务部门", description: "面向成本核算岗位场景，服务于成本岗位日常咨询，支持产品成本统计、费用归集分摊、成本差异核对、月度成本结算、基础账务梳理等场景。", scene: "产品标准成本与实际成本差异分析,完工产品单位成本计算,车间/工序作业成本归集,费用辅助分摊与结转,成本中心费用控制与对比,存货计价与库龄跌价分析,材料成本差异率监控,成本月结流程与对账,利润中心损益报表,降本项目效益追踪", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3c1d2e3f4a5b67890cdef345678902", name: "设备工程师智能体", category: "角色域", org: "财务部门", description: "面向设备运维场景，服务于设备工程师日常咨询，支持设备故障排查、维修流程规范、定期保养执行、运维经验梳理、设备效能优化等运维场景。", scene: "设备故障诊断与修复方案推荐,历史维修案例相似度匹配,同类型设备MTBF/MTTR对比,备件规格查询与替换兼容分析,维保标准作业SOP调用,设备精度检测与劣化趋势,维修工单派发与进度跟踪,大修与技改项目节点管理,设备FMEA风险优先级评估,故障根因分析与知识入库", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3d1e2f3a4b5c67890def456789013", name: "质量工程师智能体", category: "角色域", org: "财务部门", description: "面向质量技术管理场景，服务于质量工程师日常咨询，支持质量缺陷分析、问题根因排查、整改流程落地、质检标准执行、品质优化提升等技术场景。", scene: "CPK/PPK过程能力评估与对比,缺陷帕累托分析与柏拉图生成,SPC八大判异规则自动检测,量具GR&R重复性与再现性分析,8D问题解决流程向导,FMEA严重度/频度/探测度评分,检验标准与AQL抽样方案匹配,纠正预防措施CAPA闭环跟踪,质量成本归集与指标看板,客户投诉8D分析与回复", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3e1f2a3b4c5d67890ef567890124", name: "生产调度智能体", category: "角色域", org: "财务部门", description: "面向工厂生产调度场景，服务于生产调度岗位咨询，支持生产计划排布、产能资源统筹、生产交期管理、生产进度跟踪、插单调整统筹等调度场景。", scene: "有限产能高级排程与甘特图可视化,紧急插单影响模拟与方案推荐,产线瓶颈资源识别与预警,客户交期承诺ATP/CTP计算,多班次排班与人员负荷均衡,换线/换模时间优化调度,排产方案多版本保存与对比,工单优先级动态调整,物料齐套与产能匹配分析,排产执行偏差与计划达成率追踪", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 14:00:02" },
  { id: "3f1a2b3c4d5e67890fa678901235", name: "采购经理管理智能体", category: "角色域", org: "财务部门", description: "面向采购管理岗位场景，服务于采购管理日常咨询，支持供应商日常管理、采购业务流程、订单履约管理、供货风险排查、采购成本梳理等管理场景。", scene: "供应商绩效平衡计分卡,采购品类支出与成本分析,原材料价格指数与趋势,合同履约率与偏差预警,供应市场情报与风险扫描,寻源策略与谈判决策支持,集中采购与框架协议机会识别,采购合规审计与内控检查,采购人员绩效与效率看板,供应商ESG与可持续发展评估", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3g1b2c3d4e5f67890gb789012346", name: "销售经理管理智能体", category: "角色域", org: "财务部门", description: "面向销售管理岗位场景，服务于销售管理日常咨询，支持销售目标跟进、业绩统计分析、商机阶段管理、订单流程跟进、回款进度统筹等销售管理场景。", scene: "销售目标拆解与达成率红绿灯,销售漏斗阶段转化率与停留分析,商机健康度评分与风险商机预警,区域/行业/产品销售多维分析,丢单归因与竞品动态监控,销售预测与AI趋势外推,应收账款与回款催收联动,大客户RFM分析与深耕策略,销售绩效排名与佣金核算,销售日报/周报/月报自动生成", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3h1c2d3e4f5a67890hc890123457", name: "HRBP人事服务智能体", category: "角色域", org: "财务部门", description: "面向业务部门人事服务场景，服务于部门人事协调咨询，支持团队编制管理、人员结构梳理、员工留存跟进、培训绩效落地、部门人效统筹等人事场景。", scene: "对接部门人员结构与人效看板,编制-在岗-空缺动态管理,离职率趋势与主动离职原因分析,关键岗位继任者地图,人才盘点九宫格与IDP跟进,培训需求调研与学习完成率,绩效分布校准与强制分布,薪酬对标与调薪方案模拟,员工敬业度与组织氛围诊断,人力成本预算与实耗对比", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 14:30:20" },
  { id: "3i1d2e3f4a5b67890id901234568", name: "研发工程师智能体", category: "角色域", org: "财务部门", description: "为研发工程师打造的日常研发工作台。提供图纸快速检索与版本对比、BOM多层级展开与变更影响分析、物料属性与替代关系查询、仿真数据上传与结果对比、实验设计DOE记录、问题单与缺陷追踪、技术文档智能检索、跨项目经验复用等研发效能工具集。", scene: "图纸检入检出与版本差异对比,BOM结构树展开与反查,物料属性/库存/供应商全景查询,ECN变更对下游产品影响分析,仿真任务提交与结果多版本对比,实验室数据与DOE实验设计,设计评审Checklist与问题追踪,专利检索与技术交底书辅助,研发知识库智能问答,跨项目技术方案复用推荐", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "3j1e2f3a4b5c67890je012345679", name: "总经理经营智能体", category: "角色域", org: "财务部门", description: "面向企业全局经营场景，服务于管理层经营咨询，支持企业经营概况、战略目标跟进、经营数据复盘、经营异常梳理、经营决策支撑等统筹场景。", scene: "企业经营总览驾驶舱与KPI红绿灯,战略目标拆解与OKR达成追踪,收入/成本/利润/现金流四象限监控,经营异常自动预警与下钻归因,跨部门业务协同瓶颈识别,管理层MOR周报/月报自动生成,行业景气度与竞品对标分析,重大投资与项目审批决策,风险管控与合规全景视图,董事会汇报材料自动汇总", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "c266d5b1b273432ca94edeff44f4d393", name: "developer", category: "角色域", org: "AI快车", description: "开发者专属协作空间，集成代码生成、技术文档检索、API 调试、部署流程等场景的 Agent 与技能，支持对接代码仓库与 CI/CD 流水线，帮助团队快速定位问题、生成技术方案、自动化日常研发任务", scene: "研发", createTime: "2026-07-28 09:48:58", updateTime: "2026-07-28 09:48:58" },
  { id: "4a1b2c3d4e5f67890abcdef123456780", name: "生产车间现场智能体", category: "场景域", org: "财务部门", description: "面向车间一线作业场景，服务于车间现场人员咨询，支持当班任务派发、现场作业管理、物料配送协调、交接班管理、车间异常处置等现场场景。", scene: "当班工单与班组任务派发,产线OEE与节拍实时监控,设备故障报警推送与处理升级,首件检验与过程巡检执行,物料缺料呼叫与AGV配送调度,交接班记录与产线日志,在制品流转与工序移交,安全事件上报与整改跟踪,操作工技能与资质校验,车间现场5S与可视化管理", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4b1c2d3e4f5a67890bcdef234567891", name: "区域销售团队智能体", category: "场景域", org: "财务部门", description: "面向区域销售业务场景，服务于区域销售日常咨询，支持区域客户维护、重点商机跟进、客户拜访统筹、报价协调、订单交付跟进等业务场景。", scene: "区域客户地图与ABC分层管理,重点商机联合推进与红蓝军对抗演练,客户拜访计划与路线智能规划,售前方案协同编制与报价审批,订单交付全链路透明追踪,客户回款计划与对账单自动生成,区域市场竞争态势与市场份额分析,客户服务记录与健康度评分,销售费用预算与实报实销管理,区域销售复盘与最佳实践分享", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4c1d2e3f4a5b67890cdef345678902", name: "产品研发项目智能体", category: "场景域", org: "财务部门", description: "面向项目经理、研发工程师、测试人员、产品经理，整合PLM、TDM、项目管理、ALM、测试管理系统，打造产品研发全流程协同环境。提供需求规格-设计-开发-测试追溯矩阵、项目甘特图与里程碑预警、图纸与设计评审流程、缺陷管理与修复追踪、测试计划与执行报告、研发效能度量等全栈研发管理能力。", scene: "产品需求-设计-开发-测试追溯矩阵,项目甘特图与关键路径预警,图纸与设计文档在线评审,缺陷生命周期与修复SLA追踪,测试计划-用例-执行-报告全流程,研发代码与文档版本关联,项目资源负荷与冲突检测,阶段评审与交付物检查清单,研发效能量化与团队产能分析,试产问题跟踪与量产移交", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4d1e2f3a4b5c67890def456789013", name: "供应商协同智能体", category: "场景域", org: "财务部门", description: "面向供需协同场景，服务于供需协调人员咨询，支持采购订单确认、供货交期协调、到货数量核对、供方协作管理、合作履约复盘等协同场景。", scene: "采购订单在线确认与承诺交期回复,发货通知ASN与物流可视化,来料报检预约与检验结果实时共享,入库数量对账与差异协同处理,供应商自检报告与出货检验数据上传,质量异常8D报告在线提交与审核,供应商绩效考核数据双向透明,设计变更同步通知与库存消化方案,供应商库存VMI协同补货,对账开票与付款进度在线查询", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4e1f2a3b4c5d67890ef567890124", name: "设备故障会诊智能体", category: "场景域", org: "财务部门", description: "面向设备故障处置场景，服务于设备故障会诊咨询，支持设备故障现象梳理、常见故障原因、维修处置方案、故障复盘总结、运维案例参考等会诊场景。", scene: "故障现象结构化录入与分级,设备实时参数与DCS趋势联动,历史相似故障案例AI匹配推荐,多方专家在线标注与远程诊断,拆解检查与维修方案会商,备件库存查询与紧急采购联动,维修过程记录与标准工时核定,故障根因鱼骨图协同分析,维修后验证与效果评估,故障知识结构化沉淀入库", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4f1a2b3c4d5e67890fa678901235", name: "精益改善小组智能体", category: "场景域", org: "财务部门", description: "面向企业精益优化场景，服务于精益改善岗位咨询，支持业务流程梳理、生产效率提升、资源浪费整改、改善项目推进、优秀经验沉淀等改善场景。", scene: "价值流图VSM在线绘制与数据分析,生产瓶颈数据驱动自动识别,改善机会优先级矩阵排序,改善前后cycle time/良率/成本效益对比,A3报告与改善PDCA看板,改善任务分派与进度追踪,精益工具5Why/鱼骨图/散点图在线使用,改善案例库与最佳实践分享,改善提案提交-评审-实施-激励闭环,车间LAYOUT与物流路径优化分析", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "4g1b2c3d4e5f67890gb789012346", name: "客户服务代表智能体", category: "场景域", org: "财务部门", description: "面向一线客户服务场景，服务于客服岗位日常咨询，支持客户日常咨询、服务诉求受理、工单流程办理、服务标准落地、客户问题闭环等客服场景。", scene: "多渠道服务请求统一受理与智能路由,客户设备档案与维保合同一键查询,故障症状输入-知识库方案智能匹配,设备远程诊断与参数写入（IoT联动）,现场服务工单派发-接单-到达-完成全流程,备件申领出库与物流追踪,服务SLA计时与超时自动升级,客户满意度即时回访与NPS采集,服务费用预估与结算确认,服务知识贡献与内容审核", createTime: "2026-03-30 17:41:21", updateTime: "2026-04-01 14:05:23" },
  { id: "5b1c2d3e4f5a67890bcdef234567891", name: "ERP系统升级项目智能体", category: "项目域", org: "财务部门", description: "面向ERP系统升级/替换专项项目管理，整合项目管理、测试管理、数据迁移、培训管理、上线切换等子系统。提供项目工作包与里程碑总览、测试用例与缺陷修复进度看板、新旧系统数据迁移进度与差异校验报告、用户培训计划与完成率、上线切换Checklist与风险预案、上线后问题快速响应等ERP升级项目专用管理工具。", scene: "项目工作包分解与里程碑进度,测试用例管理-执行-缺陷修复看板,数据迁移ETL进度与数据校验报告,用户培训计划编排与参训率统计,UAT用户验收测试与签字闭环,上线切换剧本与风险应急预案,上线后问题队列与SLA响应监控,项目风险与Issue追踪看板,项目周报与项目集汇报自动生成,知识转移与运维移交确认", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "5c1d2e3f4a5b67890cdef345678902", name: "新产品研发项目智能体", category: "项目域", org: "财务部门", description: "面向新品从开发到量产全流程场景，服务新品项目人员日常咨询，支持新品阶段管控、样机试制跟进、成本目标核对、供应商定点进度、试产爬坡安排等新品开发场景。", scene: "APQP五大阶段门控与交付物清单,概念设计与技术可行性评审,详细设计BOM冻结与变更控制,供应商定点与交样OTS/PPAP进度,样机试制DVT/EVT测试报告追溯,目标成本VAVE达成率动态监控,试产爬坡良率与节拍达成追踪,量产移交Checklist与生产件批准,项目资源负荷与多项目优先级,产品上市准备与市场导入跟进", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "5d1e2f3a4b5c67890def456789013", name: "质量改进攻关智能体", category: "项目域", org: "财务部门", description: "面向专项质量提升场景，服务于质量攻关岗位咨询，支持重点质量难题梳理、专项改善方案、整改措施落地、品质效果提升、项目复盘总结等攻关场景。", scene: "攻关项目立项与目标基线设定,故障率/不良率趋势实时监控看板,鱼骨图根因分析与要因确认,改善措施清单-责任人-完成期限追踪,PDCA循环实验与效果验证记录,改进前后数据对比与统计检验,项目资源与跨部门协作看板,质量成本节约核算,项目里程碑评审与阶段报告,结题报告与标准化固化推广", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "5e1f2a3b4c5d67890ef567890124", name: "数字化转型试点项目智能体", category: "项目域", org: "财务部门", description: "面向数字化试点专项场景，服务转型项目管理人员日常咨询，支持试点运行情况查询、使用效果统计、转型指标对比、落地进度梳理、推广经验汇总等数字化项目场景。", scene: "数字孪生模型运行状态与同步监控,试点用户活跃度与功能采纳率看板,转型前后核心KPI对比与效益量化,技术架构蓝图与集成对接进度,数据中台与数据治理成熟度评估,阶段性成果总结与汇报材料生成,用户反馈收集与体验优化迭代,经验教训Lesson Learned沉淀,可推广方案模板化与复制计划,文化与变革管理活动追踪", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
  { id: "5f1a2b3c4d5e67890fa678901235", name: "产销经营规划智能体", category: "项目域", org: "财务部门", description: "面向企业产销统筹场景，服务于产销规划岗位咨询，支持市场需求梳理、产销产能匹配、库存动态平衡、产销节奏排布、经营数据复盘等产销场景。", scene: "战略地图与重点项目对齐可视化,战略项目集健康度红绿灯总览,多项目资源冲突检测与调配建议,项目组合风险聚合与热点分析,里程碑达成率与偏差预警,项目集ROI与战略目标达成度评估,管理层项目评审与决策材料自动生成,项目间依赖关系与关键链管理,战略项目资源池与预算总额监控,年度战略复盘与新一年项目组合规划", createTime: "2026-03-30 17:41:21", updateTime: "2026-03-31 15:15:07" },
]

function parseSeedTime(value) {
  return new Date(String(value).replace(' ', 'T')).toISOString()
}

export function seedBusinessSpaces() {
  const colors = ['red', 'purple', 'pink', 'blue', 'green', 'cyan', 'amber']
  return BUSINESS_SPACE_RAW.map((item, index) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    color: colors[index % colors.length],
    org: item.org,
    description: item.description,
    tags: item.scene.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
    ...baseRuntime(),
    status: 'active',
    createdAt: parseSeedTime(item.createTime),
    updatedAt: parseSeedTime(item.updateTime)
  }))
}

function seedLogs() {
  const rows = [
    ['知识库', '重建索引', '企业环境台账', 0, 3],
    ['知识库', '新增文档', '2026年二季度能源活动水平记录', 2, 5],
    ['技能管理', '发布版本', '排放数据核算 v1.2.0', 6, 4],
    ['文件中心', '上传文件', '2026Q2废水监测报告.pdf', 6, 5],
    ['业务规则', '更新规则', '废水指标超限预警', 4, 7],
    ['Agent管理', '引入Agent', '碳排放核算Agent', 27, 8],
    ['Agent管理', '更新配置', '环境合规审查Agent', 1, 6],
    ['业务空间', '修改空间配置', '环境合规管理空间 · 标签路由已启用', 9, 2],
    ['成员管理', '分配标签', '系统管理员 · 环境合规', 30, 4],
    ['系统管理', '创建密钥', 'sk-space-main', 44, 6]
  ]
  return rows.map(([module, action, target, d, h], i) => ({
    id: `log-seed-${i}`,
    at: ago(d, h),
    actor: '系统管理员',
    module,
    action,
    target,
    result: 'success'
  }))
}

function seedKeys() {
  return [
    {
      id: 'key-main',
      name: 'sk-space-main',
      scope: 'Agent 调度 / 知识检索',
      key: 'sk-live-9f2c41a7e6b84d05a1c3',
      status: 'active',
      createdAt: ago(44, 6),
      lastUsedAt: ago(0, 2)
    },
    {
      id: 'key-report',
      name: 'sk-report-export',
      scope: '报表导出',
      key: 'sk-live-3ba7c05de1f24968b7a2',
      status: 'active',
      createdAt: ago(19, 3),
      lastUsedAt: ago(2, 9)
    }
  ]
}

export function defaultSpaceSettings() {
  return {
    welcome: {
      icon: '🤖',
      title: 'Agent 智能对话',
      desc: '通过 Main Agent 调度，与团队空间内的业务 Agent 进行智能交互',
      questions: [
        { id: 'wq-status', icon: '📊', text: '帮我分析当前团队的Agent状态' },
        { id: 'wq-doc', icon: '📚', text: '查询知识库中关于排污许可申报的文档' },
        { id: 'wq-report', icon: '📝', text: '帮我生成一份周报模板' },
        { id: 'wq-skill', icon: '🧩', text: '介绍一下我有哪些可用的技能' }
      ]
    },
    resources: {
      skill: ['kb.query', 'llm.reason', 'web.fetch', 'embed.vector'],
      tool: ['dev.insulation', 'dev.leakage', 'dev.winding'],
      agent: ['agt-env-brain', 'agt-ts-prep'],
      workflow: ['wf-env-compliance', 'wf-emission-alert', 'wf-insulation-risk']
    },
    knowledge: {
      model: 'bge-large-zh',
      topK: 3,
      minScore: 8,
      chunkSize: 512,
      chunkOverlap: 64,
      fallback: 'notice',
      citation: true,
      loosen: true,
      bases: {}
    },
    synonyms: [
      { id: 'syn-permit', term: '排污许可', aliases: ['排污证', '排污许可证'], note: '许可管理相关提问统一归并', updatedAt: ago(12, 3) },
      { id: 'syn-cod', term: '化学需氧量', aliases: ['COD', '需氧量'], note: '废水指标英文缩写映射', updatedAt: ago(9, 6) },
      { id: 'syn-nh3', term: '氨氮', aliases: ['NH3-N', '氨态氮'], note: '监测报表字段口径一致', updatedAt: ago(9, 6) },
      { id: 'syn-eia', term: '环境影响评价', aliases: ['环评', 'EIA'], note: '覆盖口语化表述', updatedAt: ago(5, 2) },
      { id: 'syn-carbon', term: '碳排放', aliases: ['温室气体排放', 'GHG'], note: '核算类提问归并', updatedAt: ago(3, 8) }
    ]
  }
}

export const SERVICE_NODES = [
  { name: '调度服务', node: 'scheduler-01', latency: 18 },
  { name: 'Agent 运行时', node: 'runtime-01', latency: 24 },
  { name: '向量检索服务', node: 'vector-01', latency: 31 },
  { name: '对象存储', node: 'storage-01', latency: 12 },
  { name: '鉴权服务', node: 'auth-01', latency: 9 }
]

export const LICENSE = {
  holder: '环境科技',
  edition: '企业版',
  seats: 15,
  modules: ['Agent 调度', '知识库', '技能中心', '业务规则', '团队空间'],
  issuedAt: ago(96, 5),
  expiresAt: new Date(Date.now() + 268 * DAY).toISOString()
}

export const KEYS = {
  space: 'space',
  spaceSettings: 'spaceSettings',
  businessSpaces: 'businessSpaces',
  activeSpaceId: 'activeSpaceId',
  user: 'user',
  members: 'members',
  agents: 'agents',
  skills: 'skills',
  knowledgeBases: 'knowledgeBases',
  documents: 'documents',
  files: 'files',
  rules: 'rules',
  sessions: 'sessions',
  logs: 'logs',
  apiKeys: 'apiKeys',
  tasks: 'tasks',
  meta: 'meta'
}

export function buildSeed() {
  return {
    [KEYS.space]: { ...DEFAULT_SPACE },
    [KEYS.spaceSettings]: defaultSpaceSettings(),
    [KEYS.businessSpaces]: seedBusinessSpaces(),
    [KEYS.activeSpaceId]: '',
    [KEYS.user]: { ...CURRENT_USER },
    [KEYS.members]: [{ ...CURRENT_USER }],
    [KEYS.agents]: seedAgents(),
    [KEYS.skills]: seedSkills(),
    [KEYS.knowledgeBases]: seedKnowledgeBases(),
    [KEYS.documents]: seedDocuments(),
    [KEYS.files]: seedFiles(),
    [KEYS.rules]: seedRules(),
    [KEYS.sessions]: [
      {
        id: 'ses-current',
        title: '新对话',
        mode: 'chat',
        agentId: '',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [KEYS.logs]: seedLogs(),
    [KEYS.apiKeys]: seedKeys(),
    [KEYS.tasks]: [],
    [KEYS.meta]: { registrySize: REGISTRY.length, bootedAt: ago(6, 14), seededAt: new Date().toISOString() }
  }
}
