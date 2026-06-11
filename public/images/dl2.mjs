// 临时下载脚本
import fs from 'node:fs'
import path from 'node:path'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const FIG = 'D:/china-history-river/public/images/figures'
const SCN = 'D:/china-history-river/public/images/scenes'
fs.mkdirSync(FIG, { recursive: true })
fs.mkdirSync(SCN, { recursive: true })

const UA = 'china-history-river/0.1 (portfolio)'
const agent = new ProxyAgent('http://127.0.0.1:10808')
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function get(url) {
  const r = await undiciFetch(url, { dispatcher: agent, headers: { 'User-Agent': UA, Accept: 'application/json' } })
  const ab = await r.arrayBuffer()
  return { status: r.status, body: Buffer.from(ab) }
}

async function getR(url, n=4) {
  for (let i = 0; i < n; i++) {
    await sleep(1800)
    const r = await get(url)
    if (r.status !== 429) return r
    console.log('  429, wait 10s')
    await sleep(10000)
  }
  return get(url)
}

async function info(title) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1024'
  const r = await getR(u)
  if (r.status !== 200) return null
  const d = JSON.parse(r.body.toString())
  const p = Object.values(d.query.pages)[0]
  return p?.imageinfo?.[0] ?? null
}

async function search(q, lim=8) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + encodeURIComponent(q) + '&srnamespace=6&srlimit=' + lim
  const r = await getR(u)
  if (r.status !== 200) return []
  const d = JSON.parse(r.body.toString())
  return (d.query?.search ?? []).map(m => m.title)
}

const NEW = [
  ['Dayu Yu taming flood', 'xia-yu.jpg', FIG],
  ['Tang of Shang', 'shang-tang.jpg', FIG],
  ['King Wu of Zhou', 'zhou-wuwang.jpg', FIG],
  ['Zhuge Liang portrait painting', 'sanguo-zhuge.jpg', FIG],
  ['Wang Xizhi calligraphy', 'jin-wangxizhi.jpg', FIG],
  ['Dunhuang Mogao Caves', 'scene-dunhuang.jpg', SCN],
  ['Great Wall Ming dynasty', 'scene-greatwall.jpg', SCN],
]

const log = []
for (const [q, local, dir] of NEW) {
  const dest = path.join(dir, local)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log('SKIP', local); log.push('SKIP ' + local); continue
  }
  const files = await search(q, 10)
  const cands = files.filter(f => /\.(jpg|jpeg|png|JPG|PNG)$/.test(f) && !f.toLowerCase().includes('logo'))
  if (!cands.length) { console.log('MISS', q); log.push('MISS ' + q); continue }
  let ok = false
  for (const title of cands.slice(0, 4)) {
    const inf = await info(title)
    if (!inf) continue
    if (inf.size > 8*1024*1024) { console.log('  skip large', title); continue }
    const url = inf.thumburl || inf.url
    console.log('FETCH', local, '<-', title)
    const r = await undiciFetch(url, { dispatcher: agent, headers: { 'User-Agent': UA } })
    if (r.status !== 200) { console.log('  HTTP', r.status); continue }
    const ab = await r.arrayBuffer()
    fs.writeFileSync(dest, Buffer.from(ab))
    console.log('OK', local, '(', fs.statSync(dest).size, 'bytes)')
    log.push('OK ' + local + ' <- ' + title)
    ok = true; break
  }
  if (!ok) { console.log('MISS', q); log.push('MISS ' + q) }
}

// 追加到 SOURCES.md
const append = '\n\n## Round 2 (additional)\n\n' + log.join('\n')
fs.appendFileSync('D:/china-history-river/public/images/SOURCES.md', append, 'utf-8')
console.log('Done')
