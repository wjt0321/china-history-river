import fs from 'node:fs'
import path from 'node:path'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const agent = new ProxyAgent('http://127.0.0.1:10808')
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function getR(url) {
  for (let i = 0; i < 4; i++) {
    await sleep(1800)
    const r = await undiciFetch(url, { dispatcher: agent, headers: { 'User-Agent': 'china-history-river' } })
    const ab = await r.arrayBuffer()
    if (r.status !== 429) return { status: r.status, body: Buffer.from(ab) }
    await sleep(10000)
  }
  return null
}
async function search(q) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + encodeURIComponent(q) + '&srnamespace=6&srlimit=10'
  const r = await getR(u)
  if (r.status !== 200) return []
  const d = JSON.parse(r.body.toString())
  return (d.query?.search ?? []).map(m => m.title)
}
async function info(title, w=800) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=' + w
  const r = await getR(u)
  if (r.status !== 200) return null
  const d = JSON.parse(r.body.toString())
  const p = Object.values(d.query.pages)[0]
  return p?.imageinfo?.[0] ?? null
}
async function download(url, dest, maxSize=8*1024*1024) {
  const r = await getR(url)
  if (r.status !== 200) return false
  if (r.body.length > maxSize) { console.log('  skip large'); return false }
  fs.writeFileSync(dest, r.body)
  return true
}

const LOGO = 'D:/china-history-river/public/images/logo.png'

const queries = [
  'Chinese imperial seal carving',
  'Qing imperial seal',
  'Ming imperial seal jade',
  'ancient Chinese seal jade',
]

let chosen = null
for (const q of queries) {
  console.log('Q:', q)
  const files = await search(q)
  for (const f of files.slice(0, 8)) {
    if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(f) || f.toLowerCase().includes('logo')) continue
    const inf = await info(f, 256)
    if (!inf) continue
    if (inf.size > 2*1024*1024) { console.log('  skip large', f); continue }
    console.log('TRY', f, '(', inf.size, ')')
    const ok = await download(inf.thumburl || inf.url, LOGO, 2*1024*1024)
    if (ok) { chosen = f; break }
  }
  if (chosen) break
}
console.log('Chosen:', chosen, 'Bytes:', fs.statSync(LOGO).size)
