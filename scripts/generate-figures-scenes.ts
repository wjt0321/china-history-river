/**
 * 朝代代表人物 + 场景 SVG 生成器
 *
 * 风格：印章 + 文字牌位 + 几何线描
 * - 不画真实人脸（避免争议）
 * - 用牌位 + 朝代书法体风格 + 一句评价
 * - 场景用极简几何线描（宫殿/城墙/山水）
 */

import fs from 'node:fs'
import path from 'node:path'

const FIG_DIR = path.resolve('public/figures')
const SCN_DIR = path.resolve('public/scenes')
fs.mkdirSync(FIG_DIR, { recursive: true })
fs.mkdirSync(SCN_DIR, { recursive: true })

// ============== 人物牌位 ==============
interface Figure {
  id: string
  name: string         // 姓名
  title: string        // 身份（如 "汉武帝"）
  quote: string        // 一句话评价
  seal: string         // 印章文字（2字）
  /** 朝代 id，对应详情面板 */
  dynastyId: string
  color?: string
}

const FIGURES: Figure[] = [
  { id: 'qin-shi-huang', name: '嬴政', title: '秦始皇', quote: '朕为始皇帝，后世以计数', seal: '始皇', dynastyId: 'qin', color: '#E63946' },
  { id: 'han-wudi', name: '刘彻', title: '汉武帝', quote: '明犯强汉者，虽远必诛', seal: '武帝', dynastyId: 'han' },
  { id: 'tang-taizong', name: '李世民', title: '唐太宗', quote: '以铜为鉴，可以正衣冠', seal: '文皇', dynastyId: 'tang', color: '#F4E4BA' },
  { id: 'wu-zetian', name: '武曌', title: '武则天', quote: '日月当空，照临天下', seal: '则天', dynastyId: 'tang', color: '#F4E4BA' },
  { id: 'song-taizu', name: '赵匡胤', title: '宋太祖', quote: '卧榻之侧，岂容他人酣睡', seal: '太祖', dynastyId: 'song' },
  { id: 'kangxi', name: '玄烨', title: '康熙帝', quote: '愿天下永安', seal: '康熙', dynastyId: 'qing', color: '#F4E4BA' },
  { id: 'zhuyuanzhang', name: '朱元璋', title: '明太祖', quote: '驱逐胡虏，恢复中华', seal: '洪武', dynastyId: 'ming' },
  { id: 'kublai', name: '忽必烈', title: '元世祖', quote: '应天者惟以至诚', seal: '世祖', dynastyId: 'yuan', color: '#9B5DE5' },
  { id: 'yangdi', name: '杨广', title: '隋炀帝', quote: '若无水殿龙舟事，功过何须议', seal: '大业', dynastyId: 'sui', color: '#9B5DE5' },
]

function makeFigureSVG(f: Figure): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" fill="none">
  <defs>
    <filter id="grain-${f.id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
  </defs>

  <!-- 背景 -->
  <rect width="300" height="360" fill="#0f1424" />

  <!-- 牌位 -->
  <g transform="translate(150, 60)">
    <rect x="-90" y="-20" width="180" height="40" fill="${f.color ?? '#1a2238'}" stroke="${f.color ?? '#4ecdc4'}" stroke-width="1" />
    <text x="0" y="8" text-anchor="middle" font-family="serif" font-size="20" font-weight="700"
      fill="#0a0e1a" letter-spacing="6">${f.title}</text>
  </g>

  <!-- 大字（名字） -->
  <g transform="translate(150, 200)">
    <text text-anchor="middle" font-family="serif" font-size="84" font-weight="900"
      fill="${f.color ?? '#F4E4BA'}" letter-spacing="8" filter="url(#grain-${f.id})">${f.name}</text>
  </g>

  <!-- 引言 -->
  <g transform="translate(150, 270)">
    <text text-anchor="middle" font-family="serif" font-size="13" font-style="italic"
      fill="#8a96a8" letter-spacing="2">「${f.quote}」</text>
  </g>

  <!-- 印章（右下角） -->
  <g transform="translate(250, 320)">
    <rect x="-20" y="-20" width="40" height="40" rx="2" fill="#E63946" />
    <text x="0" y="2" text-anchor="middle" font-family="serif" font-size="14" font-weight="700"
      fill="#F4E4BA" letter-spacing="-1">${f.seal}</text>
  </g>

  <!-- 边框（古风点缀） -->
  <rect x="6" y="6" width="288" height="348" fill="none" stroke="#4ecdc4" stroke-width="0.5" stroke-opacity="0.3" />
</svg>`
}

// ============== 场景线描 ==============
interface Scene {
  id: string
  dynastyId: string
  name: string
  /** SVG 生成函数 */
  draw: () => string
}

const SCENES: Scene[] = [
  {
    id: 'qin-xian-yang',
    dynastyId: 'qin',
    name: '秦咸阳宫',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 远山 -->
  <path d="M0,160 L60,120 L120,140 L180,100 L240,130 L300,90 L360,120 L400,110 L400,180 L0,180 Z"
    fill="none" stroke="#4ecdc4" stroke-width="0.5" stroke-opacity="0.3" />
  <!-- 宫殿主体 -->
  <g transform="translate(80, 90)">
    <!-- 屋脊 -->
    <path d="M0,40 L20,20 L60,20 L80,40 Z" fill="none" stroke="#F4E4BA" stroke-width="1.2" />
    <!-- 殿身 -->
    <rect x="20" y="40" width="40" height="50" fill="none" stroke="#F4E4BA" stroke-width="1" />
    <!-- 柱 -->
    <line x1="28" y1="40" x2="28" y2="90" stroke="#F4E4BA" stroke-width="0.8" />
    <line x1="40" y1="40" x2="40" y2="90" stroke="#F4E4BA" stroke-width="0.8" />
    <line x1="52" y1="40" x2="52" y2="90" stroke="#F4E4BA" stroke-width="0.8" />
    <!-- 台基 -->
    <rect x="10" y="90" width="60" height="8" fill="none" stroke="#F4E4BA" stroke-width="1" />
  </g>
  <!-- 副殿 -->
  <g transform="translate(220, 100)">
    <path d="M0,30 L15,15 L45,15 L60,30 Z" fill="none" stroke="#F4E4BA" stroke-width="1" />
    <rect x="15" y="30" width="30" height="40" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
    <rect x="5" y="70" width="50" height="6" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  </g>
  <!-- 文字 -->
  <text x="200" y="220" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">秦 · 咸阳宫</text>
</svg>`,
  },
  {
    id: 'han-changan',
    dynastyId: 'han',
    name: '汉长安城',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 城墙 -->
  <rect x="60" y="60" width="280" height="140" fill="none" stroke="#4ecdc4" stroke-width="1.5" />
  <!-- 城门 -->
  <rect x="190" y="50" width="20" height="20" fill="none" stroke="#F4E4BA" stroke-width="1" />
  <path d="M190,70 L200,55 L210,70" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  <!-- 角楼 -->
  <rect x="55" y="55" width="14" height="14" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  <rect x="331" y="55" width="14" height="14" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  <!-- 城内宫殿剪影 -->
  <g opacity="0.6">
    <path d="M100,170 L100,140 L120,125 L140,140 L140,170" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
    <path d="M170,170 L170,130 L195,115 L220,130 L220,170" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
    <path d="M250,170 L250,140 L270,125 L290,140 L290,170" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
  </g>
  <!-- 文字 -->
  <text x="200" y="225" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">汉 · 长安城</text>
</svg>`,
  },
  {
    id: 'tang-changan',
    dynastyId: 'tang',
    name: '唐长安',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 里坊（方格网） -->
  <g stroke="#4ecdc4" stroke-width="0.4" opacity="0.5">
    <line x1="60" y1="80" x2="340" y2="80" />
    <line x1="60" y1="110" x2="340" y2="110" />
    <line x1="60" y1="140" x2="340" y2="140" />
    <line x1="60" y1="170" x2="340" y2="170" />
    <line x1="100" y1="60" x2="100" y2="190" />
    <line x1="140" y1="60" x2="140" y2="190" />
    <line x1="180" y1="60" x2="180" y2="190" />
    <line x1="220" y1="60" x2="220" y2="190" />
    <line x1="260" y1="60" x2="260" y2="190" />
    <line x1="300" y1="60" x2="300" y2="190" />
  </g>
  <!-- 城墙 -->
  <rect x="55" y="55" width="290" height="140" fill="none" stroke="#F4E4BA" stroke-width="1.2" />
  <!-- 大明宫（突出） -->
  <g transform="translate(180, 100)">
    <path d="M0,30 L15,15 L50,15 L65,30 Z" fill="#E63946" fill-opacity="0.2" stroke="#F4E4BA" stroke-width="1.2" />
    <rect x="10" y="30" width="45" height="30" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  </g>
  <!-- 文字 -->
  <text x="200" y="225" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">唐 · 长安</text>
</svg>`,
  },
  {
    id: 'song-bian-jing',
    dynastyId: 'song',
    name: '宋汴京',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 河流（汴河） -->
  <path d="M40,130 Q120,110 200,140 T360,130" fill="none" stroke="#4ecdc4" stroke-width="1.5" stroke-opacity="0.7" />
  <path d="M40,135 Q120,115 200,145 T360,135" fill="none" stroke="#4ecdc4" stroke-width="0.5" stroke-opacity="0.3" />
  <!-- 桥 -->
  <g transform="translate(190, 130)">
    <path d="M-15,0 Q0,-12 15,0" fill="none" stroke="#F4E4BA" stroke-width="1.2" />
    <line x1="-15" y1="0" x2="15" y2="0" stroke="#F4E4BA" stroke-width="0.5" />
  </g>
  <!-- 城 -->
  <rect x="60" y="60" width="280" height="60" fill="none" stroke="#F4E4BA" stroke-width="1" />
  <!-- 城内建筑 -->
  <g opacity="0.7">
    <path d="M90,110 L90,80 L100,70 L120,80 L120,110" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
    <path d="M150,110 L150,75 L165,65 L180,75 L180,110" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
    <path d="M210,110 L210,80 L225,70 L240,80 L240,110" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
    <path d="M270,110 L270,75 L285,65 L300,75 L300,110" fill="none" stroke="#F4E4BA" stroke-width="0.7" />
  </g>
  <!-- 文字 -->
  <text x="200" y="225" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">宋 · 汴京繁华</text>
</svg>`,
  },
  {
    id: 'ming-feng-yi',
    dynastyId: 'ming',
    name: '明紫禁城',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 故宫中轴线 -->
  <line x1="200" y1="40" x2="200" y2="200" stroke="#E63946" stroke-width="0.5" stroke-opacity="0.5" stroke-dasharray="2,2" />
  <!-- 太和殿（主殿） -->
  <g transform="translate(200, 100)">
    <!-- 屋脊 -->
    <path d="M-50,10 L-30,-15 L-10,-25 L10,-25 L30,-15 L50,10 Z" fill="none" stroke="#F4E4BA" stroke-width="1.3" />
    <!-- 屋檐二层 -->
    <path d="M-35,10 L-20,0 L20,0 L35,10" fill="none" stroke="#F4E4BA" stroke-width="1" />
    <!-- 殿身 -->
    <rect x="-30" y="10" width="60" height="40" fill="none" stroke="#F4E4BA" stroke-width="1" />
    <!-- 柱 -->
    <line x1="-20" y1="10" x2="-20" y2="50" stroke="#F4E4BA" stroke-width="0.6" />
    <line x1="0" y1="10" x2="0" y2="50" stroke="#F4E4BA" stroke-width="0.6" />
    <line x1="20" y1="10" x2="20" y2="50" stroke="#F4E4BA" stroke-width="0.6" />
    <!-- 三层台基 -->
    <rect x="-45" y="50" width="90" height="6" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
    <rect x="-50" y="56" width="100" height="6" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  </g>
  <!-- 配殿 -->
  <g opacity="0.6">
    <path d="M110,140 L110,115 L120,105 L140,115 L140,140 Z" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
    <path d="M260,140 L260,115 L280,105 L300,115 L300,140 Z" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  </g>
  <!-- 文字 -->
  <text x="200" y="225" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">明 · 紫禁城</text>
</svg>`,
  },
  {
    id: 'qing-zi-jin',
    dynastyId: 'qing',
    name: '清盛世',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 龙纹（简化） -->
  <g transform="translate(200, 100)" fill="none" stroke="#E63946" stroke-width="1.5">
    <path d="M-60,0 Q-40,-30 -10,-20 Q20,-10 40,-30 Q60,-50 80,-30" />
    <path d="M-60,10 Q-40,30 0,20 Q30,10 50,30" />
    <!-- 龙头 -->
    <circle cx="-65" cy="5" r="6" />
    <circle cx="-65" cy="5" r="2" fill="#E63946" />
  </g>
  <!-- 文字装饰 -->
  <g transform="translate(200, 60)">
    <text text-anchor="middle" font-family="serif" font-size="24" font-weight="700" fill="#F4E4BA" letter-spacing="8">康乾盛世</text>
  </g>
  <!-- 印章 -->
  <g transform="translate(150, 200)">
    <rect x="-25" y="-15" width="50" height="30" fill="#E63946" />
    <text x="0" y="6" text-anchor="middle" font-family="serif" font-size="14" font-weight="700" fill="#F4E4BA" letter-spacing="-1">承平日久</text>
  </g>
</svg>`,
  },
  {
    id: 'yuan-da-du',
    dynastyId: 'yuan',
    name: '元大都',
    draw: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" fill="none">
  <rect width="400" height="240" fill="#0f1424" />
  <!-- 草原线（远处） -->
  <path d="M0,80 Q100,70 200,80 T400,75" fill="none" stroke="#9B5DE5" stroke-width="0.5" stroke-opacity="0.4" />
  <!-- 大都城（方城） -->
  <rect x="80" y="70" width="240" height="130" fill="none" stroke="#F4E4BA" stroke-width="1.2" />
  <!-- 内城（宫城） -->
  <rect x="130" y="100" width="140" height="80" fill="none" stroke="#9B5DE5" stroke-width="1" />
  <!-- 宫殿 -->
  <g transform="translate(200, 130)">
    <!-- 蒙古包造型 -->
    <path d="M-25,20 Q-25,-5 0,-15 Q25,-5 25,20 Z" fill="none" stroke="#F4E4BA" stroke-width="1.2" />
    <line x1="0" y1="-15" x2="0" y2="20" stroke="#F4E4BA" stroke-width="0.6" />
    <rect x="-30" y="20" width="60" height="6" fill="none" stroke="#F4E4BA" stroke-width="0.8" />
  </g>
  <!-- 文字 -->
  <text x="200" y="225" text-anchor="middle" font-family="serif" font-size="13" fill="#4ecdc4" letter-spacing="6">元 · 大都</text>
</svg>`,
  },
]

// ============== 输出 ==============
let count = 0
for (const f of FIGURES) {
  fs.writeFileSync(path.join(FIG_DIR, `${f.id}.svg`), makeFigureSVG(f), 'utf-8')
  count++
}
console.log(`✅ Wrote ${count} figures to ${FIG_DIR}`)

count = 0
for (const s of SCENES) {
  fs.writeFileSync(path.join(SCN_DIR, `${s.id}.svg`), s.draw(), 'utf-8')
  count++
}
console.log(`✅ Wrote ${count} scenes to ${SCN_DIR}`)

// 输出索引 JSON
const figuresIndex = FIGURES.map((f) => ({
  id: f.id,
  dynastyId: f.dynastyId,
  name: f.name,
  title: f.title,
  quote: f.quote,
  file: `/figures/${f.id}.svg`,
}))
const scenesIndex = SCENES.map((s) => ({
  id: s.id,
  dynastyId: s.dynastyId,
  name: s.name,
  file: `/scenes/${s.id}.svg`,
}))

fs.writeFileSync(
  path.join(FIG_DIR, 'index.json'),
  JSON.stringify(figuresIndex, null, 2),
  'utf-8',
)
fs.writeFileSync(
  path.join(SCN_DIR, 'index.json'),
  JSON.stringify(scenesIndex, null, 2),
  'utf-8',
)
console.log(`✅ Wrote indices`)
