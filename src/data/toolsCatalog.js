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
  {
    id: '12',
    title: '数字人(文案驱动)',
    cost: 1800,
    description: '照片加声音样本加文案，生成数字人口播视频',
    categories: ['video', 'audio', 'text'],
    previewImage:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '15',
    title: '文生视频工具合集',
    cost: 1000,
    description: '多渠道建模、生成与处理，提升视频创作效率',
    categories: ['video', 'text'],
    previewImage:
      'https://images.unsplash.com/photo-1516321310764-8d1b15c4cb8d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '16',
    title: '声音克隆音频',
    cost: 400,
    description: '用指定的声线，说一段口播文字即可生成音频',
    categories: ['audio'],
    previewImage:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '17',
    title: '养号视频',
    cost: 1000,
    description: '快速生成多个养号视频，批量用于日常内容运营',
    categories: ['video'],
    previewImage:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '18',
    title: 'Seedance视频生成',
    cost: 6000,
    description: '国内最强视频模型，适合高质量创意视频生成',
    categories: ['video'],
    previewImage:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '19',
    title: 'Veo3.1视频生成',
    cost: 5600,
    description: 'Veo模型生成视频，适合多类画面和风格表达',
    categories: ['video'],
    previewImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '62',
    title: '快速裂变视频',
    cost: 1000,
    description: '快速制作批量视频，提高素材复用与裂变效率',
    categories: ['video'],
    previewImage:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '81',
    title: '视频剧本作家',
    cost: 100,
    description: '只需要提供几句话，就给您爆款视频剧本灵感',
    categories: ['text', 'video'],
    previewImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '90',
    title: '生成标题及口播文案',
    cost: 150,
    description: '给你源源不断的灵感，快速生成标题和口播文案',
    categories: ['text', 'audio'],
    previewImage:
      'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80',
  },
]
