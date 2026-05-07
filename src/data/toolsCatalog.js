/** 工具广场卡片数据；categories 用于「全部 / 文字 / 图片 / 音频 / 视频」筛选 */
export const categoryTitles = {
  all: '全部工具',
  text: '文字工具',
  image: '图片工具',
  audio: '音频工具',
  video: '视频工具',
}

export const toolsCatalog = [
  {
    id: '02',
    title: '消除字幕及水印',
    cost: 400,
    description: '运用AI消除不想要的元素',
    categories: ['video', 'image'],
  },
  {
    id: '03',
    title: '视频语音翻译',
    cost: 800,
    description: '翻译语音，支持小语种',
    categories: ['video', 'audio'],
  },
  {
    id: '04',
    title: '识别语音加字幕',
    cost: 500,
    description: '快速准确，支持多国语言',
    categories: ['video', 'audio'],
  },
  {
    id: '06',
    title: '通用翻译',
    cost: 100,
    description: '支持多国语言互翻，快捷准确',
    categories: ['text'],
  },
  {
    id: '07',
    title: '视频批量混剪',
    cost: 120,
    description: '几分钟生成上千条视频',
    categories: ['video'],
  },
  {
    id: '08',
    title: '提取文案分析镜头',
    cost: 300,
    description: '运用AI分析数据，瞬间出结果',
    categories: ['video', 'text'],
  },
  {
    id: '09',
    title: '文案转语音',
    cost: 150,
    description: '支持多国语言，给我一段文案即可生成自然语音',
    categories: ['audio', 'text'],
  },
  {
    id: '11',
    title: '数字人(音频驱动)',
    cost: 1680,
    description: '上传一张照片和口播音频，让人物自然开口',
    categories: ['video', 'audio'],
  },
]

const previewGradients = [
  'from-[#0f766e]/50 to-[#1e293b]/90',
  'from-[#0369a1]/50 to-[#1e293b]/90',
  'from-[#6d28d9]/45 to-[#1e293b]/90',
  'from-[#b45309]/40 to-[#1e293b]/90',
  'from-[#be185d]/40 to-[#1e293b]/90',
  'from-[#047857]/45 to-[#1e293b]/90',
  'from-[#1d4ed8]/45 to-[#1e293b]/90',
  'from-[#a21caf]/40 to-[#1e293b]/90',
]

export function getToolPreviewClass(index) {
  return previewGradients[index % previewGradients.length]
}
