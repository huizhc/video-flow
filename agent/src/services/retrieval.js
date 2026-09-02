import { read, write } from './storage'

const STOP = ['帮我', '请问', '一下', '我们', '什么', '怎么', '如何', '哪些', '可以', '需要', '关于', '的', '了', '吗', '呢', '有', '是']

const CACHE_KEY = 'cache.retrieval'
const CACHE_LIMIT = 60

export function terms(query) {
  const cleaned = String(query || '').replace(/[，。？！、；：,.?!;:()（）"'\s]+/g, ' ')
  const segments = cleaned.split(' ').filter(Boolean)
  const out = new Set()
  segments.forEach((seg) => {
    if (/^[A-Za-z0-9]+$/.test(seg)) {
      if (seg.length >= 2) out.add(seg)
      return
    }
    for (let size = Math.min(6, seg.length); size >= 2; size -= 1) {
      for (let i = 0; i + size <= seg.length; i += 1) {
        const gram = seg.slice(i, i + size)
        if (!STOP.includes(gram)) out.add(gram)
      }
    }
  })
  return [...out]
}

function countOccurrences(text, term) {
  if (!term) return 0
  let count = 0
  let index = text.indexOf(term)
  while (index !== -1) {
    count += 1
    index = text.indexOf(term, index + term.length)
  }
  return count
}

export function retrieve(query, documents, limit = 3) {
  const grams = terms(query)
  if (!grams.length) return []
  const scored = documents.map((doc) => {
    const title = doc.title || ''
    const body = `${doc.content || ''} ${(doc.tags || []).join(' ')}`
    let score = 0
    const hits = []
    grams.forEach((gram) => {
      const inTitle = countOccurrences(title, gram)
      const inBody = countOccurrences(body, gram)
      if (inTitle + inBody > 0) hits.push(gram)
      score += (inTitle * 4 + inBody) * Math.min(gram.length, 4)
    })
    return { doc, score, hits }
  })
  const ranked = scored
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  const cached = read(CACHE_KEY, [])
  write(CACHE_KEY, [
    { query: String(query), grams, docIds: ranked.map((item) => item.doc.id), at: new Date().toISOString() },
    ...cached.filter((item) => item.query !== String(query))
  ].slice(0, CACHE_LIMIT))
  return ranked
}

export function pickSentences(content, hits, max = 2) {
  const sentences = String(content || '')
    .split(/[\n。；]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12)
  const ranked = sentences
    .map((sentence) => ({
      sentence,
      score: hits.reduce((sum, gram) => sum + countOccurrences(sentence, gram) * gram.length, 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  const chosen = (ranked.length ? ranked : sentences.slice(0, max).map((sentence) => ({ sentence }))).slice(0, max)
  return chosen.map((item) => (item.sentence.endsWith('。') ? item.sentence : `${item.sentence}。`))
}
