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
  {
    id: '0l3i55k21g023i31kk3i349k77g55i58',
    name: '行政域智能体',
    org: '行政部门',
    description: '面向企业行政办公场景，服务于日常行政事务咨询，支持会议安排、用印办理、公文流转、车辆调度、办公用品统筹等日常行政工作场景。',
    scene: '智能会议管理,用印与公文审批,车辆调度与派车,办公用品申领,差旅申请与报销,行政效率分析,访客预约与接待,固定资产盘点,档案借阅管理,通知公告发布',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-07-14 14:37:30'
  },
  {
    id: '134f66b327134942bb49450bee76696f',
    name: '研发域智能体',
    org: 'AI快车',
    description: '面向产品研发管理场景，服务研发项目管理人员日常咨询，支持新品项目节点管控、图纸资料管理、物料替代核对、项目进度跟进、研发文档归档等研发办公场景。',
    scene: '产品BOM管理与版本追溯,ECN变更影响分析,图纸与设计文档管理,仿真数据对比,物料替代方案推荐,研发项目里程碑监控,需求-设计-测试追溯,专利情报与竞品分析,技术标准合规校验,研发知识库智能检索',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-05-13 15:02:59'
  },
  {
    id: '1m4j66l32h134j42ll4j450l88h66j6p',
    name: '人力资源域智能体',
    org: '人力资源',
    description: '面向企业人力资源场景，服务于人事岗位日常咨询，支持入离职管理、考勤核算、薪酬福利、绩效考核、员工培训、人事制度落地等人力基础场景。',
    scene: '组织架构与编制管理,考勤异常与加班分析,绩效考核与评估,人才盘点与继任计划,培训需求与完成率追踪,薪酬对标与激励方案,招聘漏斗与到岗分析,员工离职风险预警,入职与转正流程管理,员工满意度调查分析',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-04-01 13:50:36'
  },
  {
    id: '2b850c544645424ab6960f0b4cd9dadb',
    name: '数据分析智能体',
    org: 'AI快车',
    description: '面向经营数据查询场景，服务各部门业务人员日常咨询，支持经营指标查询、业务数据汇总、数据异常核对、报表制作指引、业务数据解读等数据查询场景。',
    scene: '自助式可视化数据探索,拖拽式报表与仪表盘设计,多维度OLAP下钻与旋转,指标卡与KPI预警监控,异常检测与归因分析,自然语言转SQL查询,数据血缘与影响分析,定时报表推送与订阅,数据导出与API开放,分析结果协作与评论',
    createTime: '2026-05-08 15:14:43',
    updateTime: '2026-05-08 15:14:43'
  },
  {
    id: '2d5a77c438245a53cc5a561cff877a7g',
    name: '销售域智能体',
    org: '销售部门',
    description: '面向全链路销售业务场景，服务销售运营岗位日常咨询，支持线索跟进、报价审批、合同签订、订单履约、回款核对等销售全流程场景。',
    scene: '商机管理与销售漏斗分析,报价与合同审批,订单履约跟踪,回款计划与逾期催收,客户360画像,销售预测与目标分解,丢单根因分析,价格策略与折扣管理,销售行为与拜访分析,大客户关系维护',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-03-31 15:15:07'
  },
  {
    id: '3e6b88d549356b64dd6b672d00988b8h',
    name: '制造域智能体',
    org: '制造部门',
    description: '面向全厂制造运营场景，服务生产管理岗位日常咨询，支持产线效率查询、设备状态汇总、生产进度跟踪、物料齐套核对、生产异常梳理等制造管理场景。',
    scene: '产线OEE实时监控,设备状态与健康度监测,在线质量检测与预警,生产进度与工单追踪,物料齐套与配送调度,异常事件根因分析,设备预测性维护,质量SPC分析,数字孪生与工艺仿真,能源消耗监控',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-04-02 09:11:01'
  },
  {
    id: '44109146733e47da8532ecc496464014',
    name: '生产域智能体',
    org: '生产部门',
    description: '面向企业生产运营场景，服务于生产运营岗位咨询，支持生产计划落地、生产物料统筹、产能效率优化、生产过程管理、生产复盘总结等运营场景。',
    scene: '物料需求计划与齐套检查,高级生产排程与调度,产线任务下发与报工,库存水位优化与调拨,设备运维与维修工单管理,生产质量全过程追溯,生产瓶颈智能识别,能效监控与优化,工艺路线管理,生产看板与关键指标驾驶舱',
    createTime: '2026-03-31 09:00:34',
    updateTime: '2026-03-31 15:15:25'
  },
  {
    id: '4f7c99e65a467c75ee7c783e11a99c9i',
    name: '服务域智能体',
    org: '财务部门',
    description: '面向企业售后服务场景，服务于售后运营岗位咨询，支持售后工单流转、客户诉求协调、设备维保统筹、服务标准执行、售后复盘优化等服务场景。',
    scene: '服务工单创建与派发,客户投诉受理与闭环,维保合同与设备档案查询,备件申请与退换货,远程故障诊断指导,现场服务工程师调度,客户满意度调查与分析,服务质量指标监控,售后知识库检索,服务费用结算与核销',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-04-01 13:31:59'
  },
  {
    id: '5g8d00f76b578d86ff8d894f22b00d0j',
    name: '质量域智能体',
    org: '财务部门',
    description: '面向企业全流程质量场景，服务于质量岗位日常咨询，支持各环节质检规范、不良问题判定、质量问题整改、品质过程管理、质量情况复盘等质量场景。',
    scene: '来料检验与供应商质量评分,过程质量SPC监控,成品检验与放行管理,不合格品处理与纠正预防,质量全流程追溯,缺陷帕累托分析,CPK过程能力评估,质量成本归集与分析,客诉质量根因回溯,体系审核与认证管理',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-04-01 13:32:19'
  },
  {
    id: '6h9e11g87c689e97gg9e905g33c11e1k',
    name: '工艺域智能体',
    org: '财务部门',
    description: '面向生产工艺管理场景，服务于工艺岗位日常咨询，支持生产工艺标准、现场作业规范、工艺执行管理、工艺迭代优化、工艺经验沉淀等工艺场景。',
    scene: '工艺路线与工序设计,工艺参数标准管理,工艺变更与版本控制,工时定额与材料定额计算,工艺仿真与验证,现场工艺指导书下发,工艺纪律检查,工艺改进与优化建议,典型工艺知识库,工艺装备与工装管理',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-03-31 15:15:07'
  },
  {
    id: '7i0f22h98d790f08hh0f016h44d22f2l',
    name: '财务域智能体',
    org: '财务部门',
    description: '面向企业基础财务场景，服务于财务岗位日常咨询，支持基础账务处理、收支业务规范、费用统筹管理、预算执行跟进、财务台账梳理等财务场景。',
    scene: '总账与科目明细查询,应收应付与账龄分析,现金流监控与预测,预算编制与执行对比,成本归集与分摊计算,资金计划与付款审批,财务三大报表生成,税务计算与申报辅助,费用报销与合规审核,经营指标驾驶舱',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-03-31 15:15:07'
  },
  {
    id: '8j1g33i09e801g19ii1g127i55e33g3m',
    name: '设备域智能体',
    org: '财务部门',
    description: '面向企业设备管理场景，服务于设备岗位日常咨询，支持设备台账管理、日常巡检保养、设备故障处置、备件库存统筹、设备运维规范等设备场景。',
    scene: '设备台账与资产档案管理,预防性维保计划与工单,设备巡检与点检管理,故障报修与维修闭环,备件库存预警与申领,设备健康度与剩余寿命预测,设备OEE指标分析,设备故障知识库,特种设备与计量器具管理,设备生命周期成本分析',
    createTime: '2026-03-30 17:41:21',
    updateTime: '2026-03-31 15:15:07'
  }
]

function parseSeedTime(value) {
  return new Date(String(value).replace(' ', 'T')).toISOString()
}

export function seedBusinessSpaces() {
  const colors = ['red', 'purple', 'pink', 'blue', 'green', 'cyan', 'amber']
  return BUSINESS_SPACE_RAW.map((item, index) => ({
    id: item.id,
    name: item.name,
    category: '业务域',
    color: colors[index % colors.length],
    org: item.org,
    description: item.description,
    tags: item.scene.split(',').map((tag) => tag.trim()),
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
