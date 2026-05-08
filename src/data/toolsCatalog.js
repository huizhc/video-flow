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
    previewImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '03',
    title: '视频语音翻译',
    cost: 800,
    description: '翻译语音，支持小语种',
    categories: ['video', 'audio'],
    previewImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '04',
    title: '识别语音加字幕',
    cost: 500,
    description: '快速准确，支持多国语言',
    categories: ['video', 'audio'],
    previewImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '06',
    title: '通用翻译',
    cost: 100,
    description: '支持多国语言互翻，快捷准确',
    categories: ['text'],
    previewImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '07',
    title: '视频批量混剪',
    cost: 120,
    description: '几分钟生成上千条视频',
    categories: ['video'],
    previewImage:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '08',
    title: '提取文案分析镜头',
    cost: 300,
    description: '运用AI分析数据，瞬间出结果',
    categories: ['video', 'text'],
    previewImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '09',
    title: '文案转语音',
    cost: 150,
    description: '支持多国语言，给我一段文案即可生成自然语音',
    categories: ['audio', 'text'],
    previewImage:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '11',
    title: '数字人(音频驱动)',
    cost: 1680,
    description: '上传一张照片和口播音频，让人物自然开口',
    categories: ['video', 'audio'],
    previewImage:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
]
