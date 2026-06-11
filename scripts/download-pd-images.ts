// 公有领域图片下载器
// 流程：search API -> imageinfo API -> 下载
// 代理：本地 10808

import fs from 'node:fs'
import path from 'node:path'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const FIG_DIR = path.resolve('public/images/figures')
const SCN_DIR = path.resolve('public/images/scenes')
fs.mkdirSync(FIG_DIR, { recursive: true })
fs.mkdirSync(SCN_DIR, { recursive: true })

const UA = 'china-history-river/0.1 (portfolio; non-commercial)'
const PROXY = 'http://127.0.0.1:10808'
const agent = new ProxyAgent(PROXY)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function get(url: string): Promise<{ status: number; body: Buffer }> {
  const r = await undiciFetch(url, {
    dispatcher: agent,
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  })
  const ab = await r.arrayBuffer()
  return { status: r.status, body: Buffer.from(ab) }
}

async function getWithRetry(url: string, maxRetries = 3): Promise<{ status: number; body: Buffer }> {
  for (let i = 0; i < maxRetries; i++) {
    await sleep(1200)
    const r = await get(url)
    if (r.status !== 429) return r
    console.log('  [429] waiting 8s, attempt', i + 1)
    await sleep(8000)
  }
  return get(url)
}

interface WmImageInfo {
  url: string
  thumburl?: string
  width: number
  height: number
  mime: string
  size: number
}

async function getImageInfo(fileTitle: string): Promise<WmImageInfo | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1024`
  const r = await getWithRetry(url)
  if (r.status !== 200) {
    console.log('  [err', r.status, ']', fileTitle)
    return null
  }
  const d = JSON.parse(r.body.toString('utf-8'))
  const first = Object.values(d.query.pages)[0] as any
  return first?.imageinfo?.[0] ?? null
}

async function searchFiles(query: string, limit = 8): Promise<string[]> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=${limit}`
  const r = await getWithRetry(url)
  if (r.status !== 200) return []
  const d = JSON.parse(r.body.toString('utf-8'))
  return (d.query?.search ?? []).map((m: any) => m.title as string)
}

interface Target {
  query: string
  local: string
  caption: string
  category: 'fig' | 'scn'
  pickIndex?: number
}

const TARGETS: Target[] = [
  // 人物图
  { query: 'Yan Liben Thirteen Emperors painting', local: 'thirteen-emperors.jpg', caption: 'Yan Liben Thirteen Emperors', category: 'fig' },
  { query: 'Emperor Guangwu Han portrait', local: 'han-guangwu.jpg', caption: 'Emperor Guangwu Han', category: 'fig' },
  { query: 'Emperor Taizong Tang portrait painting', local: 'tang-taizong.jpg', caption: 'Emperor Taizong Tang', category: 'fig' },
  { query: 'Emperor Taizu Song portrait', local: 'song-taizu.jpg', caption: 'Emperor Taizu Song', category: 'fig' },
  { query: 'Kangxi Emperor portrait', local: 'kangxi.jpg', caption: 'Kangxi Emperor', category: 'fig' },
  { query: 'Zhu Yuanzhang Ming Emperor', local: 'zhuyuanzhang.jpg', caption: 'Zhu Yuanzhang', category: 'fig' },
  { query: 'Kublai Khan painting', local: 'kublai.jpg', caption: 'Kublai Khan', category: 'fig' },
  { query: 'Emperor Yang Sui portrait', local: 'sui-yangdi.jpg', caption: 'Emperor Yang Sui', category: 'fig' },
  // 场景图 — 已有
  { query: 'Along the River During Qingming Festival painting', local: 'qingming-river.jpg', caption: 'Qingming Festival', category: 'scn' },
  { query: 'A Thousand Li of Rivers and Mountains', local: 'qianli-rivers.jpg', caption: 'Qianli Rivers', category: 'scn' },
  { query: 'Spring Morning in Han Palace painting', local: 'han-palace.jpg', caption: 'Han Palace', category: 'scn' },
  { query: 'Forbidden City Beijing', local: 'forbidden-city.jpg', caption: 'Forbidden City', category: 'scn' },
  { query: 'Great Wall of China Ming dynasty', local: 'scene-greatwall.jpg', caption: 'Great Wall', category: 'scn' },
  { query: 'Dunhuang Mogao cave mural', local: 'scene-dunhuang.jpg', caption: 'Dunhuang', category: 'scn' },
  // 场景图 — 新增：夏商周三国五代
  { query: 'Erlitou bronze jue Xia dynasty', local: 'scene-xia-erlitou.jpg', caption: 'Erlitou Bronze', category: 'scn' },
  { query: 'Houmuwu ding Shang dynasty bronze', local: 'scene-shang-ding.jpg', caption: 'Houmuwu Ding', category: 'scn' },
  { query: 'Zhou dynasty bronze ritual vessel Spring Autumn', local: 'scene-zhou-bells.jpg', caption: 'Zhou Bronze Vessel', category: 'scn' },
  { query: 'Three Kingdoms Liu Bei Guan Yu painting', local: 'scene-sanguo-chibi.jpg', caption: 'Three Kingdoms Heroes', category: 'scn' },
  { query: 'The Night Revels of Han Xizai painting', local: 'scene-wudai-yeyan.jpg', caption: 'Night Revels of Han Xizai', category: 'scn' },
]




async function process(t: Target) {
  const dir = t.category === 'fig' ? FIG_DIR : SCN_DIR
  const dest = path.join(dir, t.local)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log('SKIP', t.local)
    return { ok: true, cached: true }
  }
  const files = await searchFiles(t.query, 10)
  const cands = files.filter(f => /\.(jpg|jpeg|png|JPG|PNG)$/.test(f) && !f.toLowerCase().includes('logo'))
  if (!cands.length) { console.log('MISS', t.query); return { ok: false } }
  for (const title of cands.slice(0, 3)) {
    const inf = await getImageInfo(title)
    if (!inf) continue
    if (inf.size > 8 * 1024 * 1024) { console.log('  skip large', title); continue }
    const url = inf.thumburl || inf.url
    console.log('FETCH', t.local, '<-', title, '(', Math.round(inf.size / 1024), 'KB )')
    const r = await undiciFetch(url, { dispatcher: agent, headers: { 'User-Agent': UA } })
    if (r.status !== 200) { console.log('  HTTP', r.status); continue }
    const ab = await r.arrayBuffer()
    fs.writeFileSync(dest, Buffer.from(ab))
    console.log('OK', t.local, '(', fs.statSync(dest).size, 'bytes)')
    return { ok: true, fileTitle: title, info: inf, size: fs.statSync(dest).size }
  }
  console.log('MISS', t.query)
  return { ok: false }
}

console.log('=== Public Domain Image Downloader ===')
const results = []
for (const t of TARGETS) {
  results.push({ target: t, result: await process(t) })
}

const lines = ['# Image Sources', '', 'All images are Public Domain from Wikimedia Commons.', '']
for (const { target, result } of results) {
  if (!result.ok) {
    lines.push('## MISS  ' + target.local + ' (' + target.caption + ')')
    lines.push('query: ' + target.query)
  } else if (result.cached) {
    lines.push('## SKIP  ' + target.local)
  } else {
    lines.push('## OK    ' + target.local)
    lines.push('- file: ' + result.fileTitle)
    lines.push('- size: ' + Math.round(result.size / 1024) + 'KB')
    lines.push('- src: https://commons.wikimedia.org/wiki/' + encodeURIComponent(result.fileTitle))
    lines.push('- license: Public Domain')
  }
  lines.push('')
}
fs.writeFileSync('public/images/SOURCES.md', lines.join('\n'), 'utf-8')
console.log('Wrote SOURCES.md')
