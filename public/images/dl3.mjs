import fs from 'node:fs'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const agent = new ProxyAgent('http://127.0.0.1:10808')
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function get(url) {
  const r = await undiciFetch(url, { dispatcher: agent, headers: { 'User-Agent': 'china-history-river' } })
  const ab = await r.arrayBuffer()
  return { status: r.status, body: Buffer.from(ab) }
}
async function getR(url) {
  for (let i = 0; i < 4; i++) {
    await sleep(1800)
    const r = await get(url)
    if (r.status !== 429) return r
    await sleep(10000)
  }
  return get(url)
}
async function search(q) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=' + encodeURIComponent(q) + '&srnamespace=6&srlimit=10'
  const r = await getR(u)
  if (r.status !== 200) return []
  const d = JSON.parse(r.body.toString())
  return (d.query?.search ?? []).map(m => m.title)
}

const queries = ['Yu the Great', 'Da Yu', 'Yu Gong taming flood']
for (const q of queries) {
  console.log('SEARCH', q)
  const files = await search(q)
  console.log('  got', files.length, 'results')
  for (const f of files.slice(0, 5)) console.log('  -', f)
}
