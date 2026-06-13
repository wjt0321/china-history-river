import fs from 'node:fs'
import path from 'node:path'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const FIG = 'D:/china-history-river/public/images/figures'
const dest = path.join(FIG, 'xia-yu.jpg')
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

// 强制 800px 缩略图
const infoUrl = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=File:King%20Yu%20of%20Xia.jpg&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800'
const r1 = await getR(infoUrl)
const d = JSON.parse(r1.body.toString())
const inf = Object.values(d.query.pages)[0].imageinfo[0]
console.log('thumb info:', inf.thumbwidth || inf.width, 'x', inf.thumbheight || inf.height, 'size:', inf.size, 'thumbSize:', inf.thumbsize)

const url = inf.thumburl || inf.url
const r2 = await getR(url)
if (!r2 || r2.status !== 200) { console.log('DL FAIL', r2?.status); process.exit(1) }
fs.writeFileSync(dest, r2.body)
console.log('OK', dest, fs.statSync(dest).size, 'bytes')
