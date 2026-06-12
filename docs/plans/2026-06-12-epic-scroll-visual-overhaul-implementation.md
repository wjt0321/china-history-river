# 史诗长卷视觉 overhaul 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将当前网页从「深色数据看板」升级为「故宫展陈感 + 水墨长卷」的史诗交互长卷，完成阶段 3.1（氛围基底）、3.2（地图水墨化）、3.3（叙事与细节）全部内容。

**Architecture:** 保持现有 React + Vite + MapLibre + Zustand 架构不变；通过 CSS 变量升级、全局纹理叠加、自定义 MapLibre style、Canvas 2D 重绘时间轴/粒子、Framer Motion 卷轴动画实现视觉 overhaul；所有改动以组件级隔离方式逐步替换，避免一次性大爆炸。

**Tech Stack:** React 18, TypeScript, Vite, MapLibre GL, Framer Motion, Canvas 2D, CSS variables, 思源宋体（Google Fonts）

---

## 前置准备

### Task 0: 切出独立工作区（可选但推荐）

**说明：** 阶段 3 改动面大，建议在独立 worktree 执行，避免污染 main。

**命令：**

```bash
# 使用 superpowers:using-git-worktrees 创建 worktree
```

**替代：** 也可直接在 main 分支新建 `feat/phase3-epic-scroll` 分支执行。

---

## 阶段 3.1：氛围基底

### Task 1: 升级全局色彩变量与字体

**Files:**
- Modify: `src/styles/global.css`
- Modify: `index.html`

**Step 1: 引入思源宋体**

在 `index.html` 的 `<head>` 中加入：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet">
```

**Step 2: 添加字体 CSS 变量**

在 `src/styles/global.css` 的 `:root` 中新增：

```css
--font-serif: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
--font-calligraphy: 'Noto Serif SC', 'KaiTi', 'STKaiti', serif;
```

**Step 3: 更新背景与强调色变量**

保留现有变量名，调整色值并新增：

```css
--color-bg-deep: #0c0b09;
--color-bg: #12110e;
--color-bg-elev: #1a1915;
--color-paper: #f5f0e6;
--color-palace-red: #8b3535;
--color-palace-red-dim: #5a2525;
--color-gold: #b8943a;
--color-gold-dim: #7a6a2a;
--color-ink: #3a3a36;
--color-ink-light: #6a6a60;
```

**Step 4: 手动验证**

运行：

```bash
npm run dev -- --port 5173
```

打开 `http://localhost:5173/china-history-river/`，确认页面背景变得更暖、字体已加载（可在 DevTools Network 看到 Google Fonts 请求）。

**Step 5: Commit**

```bash
git add src/styles/global.css index.html
git commit -m "style(global): introduce Noto Serif SC and palace ink color palette"
```

---

### Task 2: 添加全局宣纸纹理与暗角

**Files:**
- Create: `public/textures/paper-grain.png`（占位，可用 tiny 噪声图）
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Step 1: 准备纹理图片**

由于无法直接生成纹理文件，先创建一个极小的 base64 内联纹理，避免新增二进制依赖：

在 `src/App.css` 底部新增：

```css
.texture-paper {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%);
}
```

**Step 2: 在 App.tsx 中挂载纹理层**

在 `src/App.tsx` return 的最外层 `div` 末尾添加：

```tsx
<div className="texture-paper" aria-hidden="true" />
<div className="vignette" aria-hidden="true" />
```

**Step 3: 更新 App.css 背景**

将 `.app` 或 body 背景改为：

```css
.app {
  background-color: var(--color-bg-deep);
  background-image:
    radial-gradient(ellipse at 20% 0%, rgba(184,148,58,0.04) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 100%, rgba(139,53,53,0.04) 0%, transparent 45%);
}
```

**Step 4: 手动验证**

刷新页面，确认全屏有轻微噪点纹理、四角有暗角、背景带极淡金/红辉光。

**Step 5: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "style(app): add paper grain texture and vignette overlay"
```

---

### Task 3: 顶栏改造成宫墙题跋风格

**Files:**
- Modify: `src/components/TopBar.tsx`
- Modify: `src/components/TopBar.css`

**Step 1: 更新 JSX 结构**

将顶栏改为：

```tsx
<header className="top-bar">
  <div className="top-bar-brand">
    <div className="brand-seal">史</div>
    <div className="brand-text">
      <span className="brand-title">历史长河</span>
      <span className="brand-sub">FIVE THOUSAND YEARS</span>
    </div>
  </div>

  <div className="top-bar-dynasty">
    <button className="dynasty-seal" onClick={toggleDropdown}>
      <span className="dynasty-name">{selectedDynasty.name}</span>
      <span className="dynasty-era">
        {formatYear(selectedDynasty.startYear)} — {formatYear(selectedDynasty.endYear)}
      </span>
    </button>
    {isOpen && (
      <div className="dynasty-scroll">
        {dynasties.map(d => (
          <button key={d.id} className="dynasty-scroll-item" onClick={() => select(d.id)}>
            <span className="item-seal">{d.name[0]}</span>
            <span className="item-name">{d.name}</span>
            <span className="item-era">{formatYear(d.startYear)} — {formatYear(d.endYear)}</span>
          </button>
        ))}
      </div>
    )}
  </div>

  <button className="detail-toggle" onClick={toggleDetail}>
    <span className="detail-toggle-text">{isDetailOpen ? '收卷' : '展卷'}</span>
  </button>
</header>
```

**Step 2: 重写 TopBar.css**

关键样式：

```css
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  z-index: 100;
  background: linear-gradient(180deg, rgba(12,11,9,0.95) 0%, rgba(12,11,9,0.6) 70%, transparent 100%);
  border-bottom: 1px solid rgba(184,148,58,0.15);
}

.brand-seal {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  font-family: var(--font-calligraphy);
  font-size: 22px;
  border-radius: 4px;
  background: rgba(139,53,53,0.2);
}

.dynasty-seal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 22px;
  border: 1px solid rgba(184,148,58,0.4);
  background: rgba(18,17,14,0.7);
  color: var(--color-paper);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dynasty-seal:hover {
  border-color: var(--color-gold);
  box-shadow: 0 0 18px rgba(184,148,58,0.15);
}

.dynasty-name {
  font-family: var(--font-calligraphy);
  font-size: 22px;
  letter-spacing: 0.15em;
}

.dynasty-era {
  font-size: 11px;
  color: var(--color-ink-light);
  letter-spacing: 0.08em;
}

.dynasty-scroll {
  position: absolute;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  background: rgba(18,17,14,0.96);
  border: 1px solid rgba(184,148,58,0.25);
  border-radius: 4px;
  padding: 12px;
  backdrop-filter: blur(8px);
}

.dynasty-scroll-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: var(--color-paper);
  cursor: pointer;
  transition: background 0.2s;
}

.dynasty-scroll-item:hover {
  background: rgba(184,148,58,0.1);
}

.item-seal {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-gold-dim);
  color: var(--color-gold);
  font-family: var(--font-calligraphy);
  font-size: 14px;
  border-radius: 50%;
}
```

**Step 3: 手动验证**

刷新页面，确认顶栏有印章、下拉列表像简牍、hover 有金边辉光。

**Step 4: Commit**

```bash
git add src/components/TopBar.tsx src/components/TopBar.css
git commit -m "style(topbar): redesign as palace seal and scroll dropdown"
```

---

### Task 4: 详情面板改造成卷轴

**Files:**
- Modify: `src/components/DetailPanel.tsx`
- Modify: `src/components/DetailPanel.css`

**Step 1: 添加卷轴结构**

在面板外层添加轴头：

```tsx
<div className={`detail-panel ${isOpen ? 'open' : ''}`}>
  <div className="scroll-roller scroll-roller-top" />
  <div className="scroll-paper">
    {/* 现有内容 */}
  </div>
  <div className="scroll-roller scroll-roller-bottom" />
</div>
```

**Step 2: 重写 CSS**

```css
.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  z-index: 90;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  transform: translateX(100%);
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.detail-panel.open {
  pointer-events: auto;
  transform: translateX(0);
}

.scroll-roller {
  width: 100%;
  height: 24px;
  background: linear-gradient(180deg, #3a2e1e 0%, #5a4630 50%, #3a2e1e 100%);
  border: 1px solid rgba(184,148,58,0.3);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
}

.scroll-paper {
  flex: 1;
  background:
    linear-gradient(90deg, rgba(245,240,230,0.03) 0%, transparent 8%, transparent 92%, rgba(245,240,230,0.03) 100%),
    rgba(18,17,14,0.94);
  border-left: 1px solid rgba(184,148,58,0.18);
  border-right: 1px solid rgba(184,148,58,0.18);
  overflow-y: auto;
  padding: 28px;
  backdrop-filter: blur(10px);
}
```

**Step 3: 调整 Tab 样式为卷轴题签**

```css
.detail-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(184,148,58,0.2);
  margin-bottom: 20px;
}

.detail-tab {
  padding: 8px 14px;
  background: transparent;
  border: none;
  color: var(--color-ink-light);
  font-family: var(--font-calligraphy);
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s;
}

.detail-tab.active {
  color: var(--color-gold);
  border-bottom: 2px solid var(--color-gold);
}
```

**Step 4: 手动验证**

点击"查看详情"，确认面板像卷轴一样从右侧展开，有上下轴头，Tab 像题签。

**Step 5: Commit**

```bash
git add src/components/DetailPanel.tsx src/components/DetailPanel.css
git commit -m "style(detail-panel): transform panel into scroll with rollers"
```

---

## 阶段 3.2：地图水墨化

### Task 5: 自定义水墨底图样式

**Files:**
- Modify: `src/styles/mapStyle.ts`

**Step 1: 替换栅格底图为自定义矢量风格**

将 `DARK_TECHNO_STYLE` 改为以纯色和轮廓为主的"水墨底图"：

```ts
export const DARK_TECHNO_STYLE: StyleSpecification = {
  version: 8,
  name: 'ink-wash-china',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    },
    'china-base': {
      type: 'geojson',
      data: `${import.meta.env.BASE_URL}geo-data/china.json`,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0c0b09',
      },
    },
    {
      id: 'carto-dark-base',
      type: 'raster',
      source: 'carto-dark',
      paint: {
        'raster-opacity': 0.22,
        'raster-saturation': -0.9,
        'raster-contrast': 0.05,
      },
    },
    {
      id: 'china-base-fill',
      type: 'fill',
      source: 'china-base',
      paint: {
        'fill-color': '#151412',
        'fill-opacity': 0.5,
      },
    },
    {
      id: 'china-base-coast',
      type: 'line',
      source: 'china-base',
      paint: {
        'line-color': '#3a3a36',
        'line-width': 0.8,
        'line-opacity': 0.5,
        'line-blur': 2,
      },
    },
    {
      id: 'china-base-glow',
      type: 'line',
      source: 'china-base',
      paint: {
        'line-color': '#2a5a6a',
        'line-width': 4,
        'line-opacity': 0.12,
        'line-blur': 8,
      },
    },
  ],
}
```

**Step 2: 手动验证**

刷新页面，确认底图变得非常暗、淡，陆地轮廓像水墨线，不再抢眼。

**Step 3: Commit**

```bash
git add src/styles/mapStyle.ts
git commit -m "style(map): custom ink-wash base map with muted raster and china outline"
```

---

### Task 6: 疆域填充改为水墨晕染效果

**Files:**
- Modify: `src/components/MapView.tsx`
- Modify: `src/components/MapView.css`

**Step 1: 更新填充层 paint**

在 `loadDynasty` 中，填充层改用渐变和纹理叠加：

```ts
map.addLayer({
  id: fillLayer,
  type: 'fill',
  source: sourceId,
  paint: {
    'fill-color': color,
    'fill-opacity': 0,
  },
})
```

保持不变，但新增一个辅助层用于"墨晕"：

```ts
// 在 addLayer 序列中，fillLayer 之前添加 outer-ink
map.addLayer({
  id: 'dynasty-outer-ink',
  type: 'line',
  source: sourceId,
  paint: {
    'line-color': color,
    'line-width': 28,
    'line-opacity': 0,
    'line-blur': 20,
  },
})
```

**Step 2: 调整淡入目标值**

将淡入目标从单一 opacity 改为多层配合：

```ts
requestAnimationFrame(() => {
  map.setPaintProperty(fillLayer, 'fill-opacity', 0.42)
  map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
  map.setPaintProperty(glowLayer, 'line-opacity', 0.45)
  map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.28)
  map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.18)
})
```

**Step 3: 更新切换逻辑**

在 `if (map.getSource(sourceId))` 分支中，同样更新 `dynasty-outer-ink` 的颜色和透明度：

```ts
map.setPaintProperty('dynasty-outer-ink', 'line-color-transition', transition)
map.setPaintProperty('dynasty-outer-ink', 'line-opacity-transition', transition)
map.setPaintProperty('dynasty-outer-ink', 'line-color', color)
map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.18)
```

**Step 4: 手动验证**

切换朝代，确认疆域边缘有柔和墨晕，不再像硬边多边形。

**Step 5: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "style(map): ink-wash territory with outer blur glow layer"
```

---

### Task 7: 朝代切换改为墨晕扩散动画

**Files:**
- Modify: `src/components/MapView.tsx`

**Step 1: 添加切换状态标记**

在组件顶部添加：

```ts
const isTransitioning = useRef(false)
```

**Step 2: 修改 loadDynasty 开头**

```ts
async function loadDynasty(map: maplibregl.Map, dynasty: Dynasty) {
  if (isTransitioning.current) return
  isTransitioning.current = true
  // ... existing code
}
```

**Step 3: 在 setData 前加入淡出，之后加入淡入**

对于已存在 source 的情况：

```ts
// 先淡出旧疆域
map.setPaintProperty(fillLayer, 'fill-opacity', 0.05)
map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.02)

await new Promise(r => setTimeout(r, 400))

// 更新数据
;(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(data)

// 再淡入新疆域
requestAnimationFrame(() => {
  map.setPaintProperty(fillLayer, 'fill-opacity', 0.42)
  map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.18)
})
```

**Step 4: 首次加载也做淡入**

首次加载时直接淡入即可。

**Step 5: 重置过渡标记**

在 `loadDynasty` 末尾 `finally` 中：

```ts
finally {
  setTimeout(() => { isTransitioning.current = false }, 1200)
}
```

**Step 6: 手动验证**

快速切换朝代，确认有淡出-数据更新-淡入的节奏，没有闪烁或重叠。

**Step 7: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "feat(map): ink-spread fade transition between dynasties"
```

---

### Task 8: 都城标记改为朱印样式

**Files:**
- Modify: `src/components/MapView.tsx`
- Modify: `src/components/MapView.css`

**Step 1: 将 marker 改为自定义 HTML marker**

替换现有 `map.addLayer` 或 marker 创建逻辑：

```ts
const el = document.createElement('div')
el.className = 'capital-seal'
el.innerHTML = `<span>${dynasty.capital}</span>`
new maplibregl.Marker({ element: el, anchor: 'bottom' })
  .setLngLat(capitalCoord)
  .addTo(map)
```

**Step 2: 添加 CSS**

```css
.capital-seal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid var(--color-palace-red);
  border-radius: 4px;
  background: rgba(139,53,53,0.85);
  color: var(--color-paper);
  font-family: var(--font-calligraphy);
  font-size: 13px;
  box-shadow: 0 0 12px rgba(139,53,53,0.4);
  cursor: pointer;
  transition: transform 0.2s;
}

.capital-seal:hover {
  transform: scale(1.1);
}

.capital-seal span {
  writing-mode: vertical-rl;
  letter-spacing: 0.05em;
}
```

**Step 3: 手动验证**

刷新页面，确认都城像一枚红色印章立在地图上。

**Step 4: Commit**

```bash
git add src/components/MapView.tsx src/components/MapView.css
git commit -m "style(map): capital markers as red palace seals"
```

---

## 阶段 3.3：叙事与细节

### Task 9: 时间轴重绘为水墨河带 + 印章节点

**Files:**
- Modify: `src/components/Timeline.tsx`
- Modify: `src/components/Timeline.css`

**Step 1: 调整绘制逻辑**

在现有正弦曲线基础上，把朝代段落改成"墨带渐变"：

```ts
// 每个朝代段从淡墨到浓墨渐变
const grad = ctx.createLinearGradient(segment.x1, 0, segment.x2, 0)
grad.addColorStop(0, 'rgba(58,58,54,0.3)')
grad.addColorStop(1, 'rgba(58,58,54,0.7)')
ctx.fillStyle = grad
ctx.fill()
```

**Step 2: 节点改为印章**

在朝代边界处画圆形印章：

```ts
ctx.beginPath()
ctx.arc(x, y, 14, 0, Math.PI * 2)
ctx.fillStyle = isSelected ? 'rgba(184,148,58,0.9)' : 'rgba(58,58,54,0.6)'
ctx.fill()
ctx.strokeStyle = isSelected ? '#f5f0e6' : '#6a6a60'
ctx.lineWidth = 2
ctx.stroke()

ctx.fillStyle = '#f5f0e6'
ctx.font = '12px "Noto Serif SC"'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillText(dynasty.name[0], x, y)
```

**Step 3: hover 年号浮现**

在 `draw` 循环中检测鼠标位置，hover 时显示小楷年号。

**Step 4: 手动验证**

刷新页面，确认底部河带像水墨渐变，节点像印章，hover 有反馈。

**Step 5: Commit**

```bash
git add src/components/Timeline.tsx src/components/Timeline.css
git commit -m "style(timeline): ink-river with seal-shaped dynasty nodes"
```

---

### Task 10: 粒子系统按朝代主题重做

**Files:**
- Modify: `src/components/AtmosphereParticles.tsx`
- Modify: `src/components/AtmosphereParticles.css`

**Step 1: 扩展粒子主题映射**

```ts
const THEMES: Record<string, ParticleTheme> = {
  xia: { type: 'firefly', colors: ['#b8a03a', '#5a7a4a'] },
  shang: { type: 'firefly', colors: ['#b8a03a', '#8b3535'] },
  zhou: { type: 'dust', colors: ['#8b7b5a', '#6a6a60'] },
  qin: { type: 'dust', colors: ['#8b6b4a', '#5a5a50'] },
  han: { type: 'dust', colors: ['#b8943a', '#8b6b4a'] },
  // ... 其他朝代
}
```

**Step 2: 按主题绘制不同粒子形态**

- `firefly`：小圆点 + 拖尾 + 缓慢上升。
- `dust`：小微粒 + 水平飘动。
- `petal`：椭圆 + 旋转飘落。
- `snow`：小圆点 + 斜向下飘。
- `ember`：金色小点 + 向上飘 + 闪烁。

**Step 3: 添加拖尾效果**

在 update 中保存粒子最近 3-5 个位置，draw 时用低 opacity 线段连接。

**Step 4: 手动验证**

切换朝代，确认粒子主题和颜色变化，有拖尾效果。

**Step 5: Commit**

```bash
git add src/components/AtmosphereParticles.tsx src/components/AtmosphereParticles.css
git commit -m "feat(particles): dynasty-themed particles with ink-wash trails"
```

---

### Task 11: 新增开场动画组件

**Files:**
- Create: `src/components/OpeningSequence.tsx`
- Create: `src/components/OpeningSequence.css`
- Modify: `src/App.tsx`
- Modify: `src/stores/appStore.ts`

**Step 1: 在 store 添加开场状态**

```ts
interface AppState {
  // ... existing
  hasSeenOpening: boolean
  setHasSeenOpening: (seen: boolean) => void
}

setHasSeenOpening: (seen) => set({ hasSeenOpening: seen })
```

初始化时读取 `localStorage`：

```ts
hasSeenOpening: localStorage.getItem('chr-opening-seen') === '1'
```

**Step 2: 创建 OpeningSequence.tsx**

结构：

```tsx
export function OpeningSequence({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="opening-sequence"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 8 }}
      onAnimationComplete={onComplete}
    >
      <motion.div className="opening-chaos" />
      <motion.div className="opening-light" />
      <motion.h1 className="opening-title">历史长河</motion.h1>
      <motion.p className="opening-subtitle">中华五千年疆域变迁</motion.p>
      <button className="opening-skip" onClick={onComplete}>跳过</button>
    </motion.div>
  )
}
```

**Step 3: 添加 CSS**

```css
.opening-sequence {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0c0b09;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.opening-title {
  font-family: var(--font-calligraphy);
  font-size: 72px;
  color: var(--color-gold);
  letter-spacing: 0.3em;
  text-shadow: 0 0 40px rgba(184,148,58,0.3);
}

.opening-subtitle {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--color-ink-light);
  margin-top: 16px;
  letter-spacing: 0.2em;
}

.opening-skip {
  position: absolute;
  bottom: 40px;
  right: 40px;
  background: transparent;
  border: 1px solid var(--color-ink);
  color: var(--color-ink-light);
  padding: 8px 18px;
  cursor: pointer;
}
```

**Step 4: 在 App.tsx 中挂载**

```tsx
const [showOpening, setShowOpening] = useState(!hasSeenOpening)

{showOpening && (
  <OpeningSequence onComplete={() => {
    setShowOpening(false)
    setHasSeenOpening(true)
    localStorage.setItem('chr-opening-seen', '1')
  }} />
)}
```

**Step 5: 手动验证**

首次打开页面，确认有 8 秒开场，标题有金辉，可跳过。

**Step 6: Commit**

```bash
git add src/components/OpeningSequence.tsx src/components/OpeningSequence.css src/App.tsx src/stores/appStore.ts
git commit -m "feat(opening): add cinematic opening sequence with skip"
```

---

### Task 12: 音效占位与静音开关

**Files:**
- Create: `src/utils/sound.ts`
- Modify: `src/components/TopBar.tsx`
- Modify: `src/stores/appStore.ts`

**Step 1: 创建 sound manager**

```ts
// src/utils/sound.ts
class SoundManager {
  enabled = false
  setEnabled(v: boolean) { this.enabled = v }

  playSeal() {
    if (!this.enabled) return
    // 占位：console.log 或播放极短 base64 音效
  }

  playTransition() {
    if (!this.enabled) return
  }
}

export const sound = new SoundManager()
```

**Step 2: store 增加静音状态**

```ts
soundEnabled: boolean
setSoundEnabled: (v: boolean) => void
```

**Step 3: 顶栏加静音按钮**

```tsx
<button className="sound-toggle" onClick={() => setSoundEnabled(!soundEnabled)}>
  {soundEnabled ? '🔊' : '🔇'}
</button>
```

**Step 4: 在朝代切换时触发占位音效**

在 `loadDynasty` 末尾调用 `sound.playTransition()`。

**Step 5: Commit**

```bash
git add src/utils/sound.ts src/components/TopBar.tsx src/stores/appStore.ts
git commit -m "feat(sound): add sound manager placeholder and mute toggle"
```

---

## 收尾与验证

### Task 13: 全面回归验证

**Files:**
- All modified files

**Step 1: 类型检查**

```bash
npm run type-check
```

**Expected:** 无错误。

**Step 2: 生产构建**

```bash
npm run build
```

**Expected:** `dist/` 生成成功，无报错。

**Step 3: 手动走查清单**

- [ ] 页面加载有开场动画。
- [ ] 顶栏像宫墙题跋，印章下拉正常。
- [ ] 地图底图呈水墨暗调，不抢眼。
- [ ] 切换朝代有墨晕淡出/淡入，疆域边缘柔和。
- [ ] 都城标记是朱印样式。
- [ ] 事件标记有水墨扩散动画。
- [ ] 详情面板像卷轴，有上下轴头。
- [ ] 时间轴像水墨河带，节点像印章。
- [ ] 粒子随朝代变化主题。
- [ ] 全局有宣纸纹理和暗角。
- [ ] 60fps 稳定，无卡顿。

**Step 4: Commit**

```bash
git add -A
git commit -m "chore(release): complete phase 3 epic scroll visual overhaul"
```

---

## 风险与降级策略

| 风险 | 影响 | 降级方案 |
|---|---|---|
| Google Fonts 加载慢/失败 | 页面用回退字体，气质下降 | 将 Noto Serif SC 改为本地 font subset 或系统宋体 |
| 水墨晕染性能差 | 低端设备卡顿 | 关闭 outer-ink 层，改用简单 fill opacity |
| 开场动画太长打扰用户 | 体验差 | 缩短到 4 秒，或默认不自动播放 |
| 自定义底图信息不足 | 用户分不清地形 | 保留 CartoDB 栅格但调低 opacity 到 0.35 |

---

## 提交汇总（预计）

1. `style(global): introduce Noto Serif SC and palace ink color palette`
2. `style(app): add paper grain texture and vignette overlay`
3. `style(topbar): redesign as palace seal and scroll dropdown`
4. `style(detail-panel): transform panel into scroll with rollers`
5. `style(map): custom ink-wash base map with muted raster and china outline`
6. `style(map): ink-wash territory with outer blur glow layer`
7. `feat(map): ink-spread fade transition between dynasties`
8. `style(map): capital markers as red palace seals`
9. `style(timeline): ink-river with seal-shaped dynasty nodes`
10. `feat(particles): dynasty-themed particles with ink-wash trails`
11. `feat(opening): add cinematic opening sequence with skip`
12. `feat(sound): add sound manager placeholder and mute toggle`
13. `chore(release): complete phase 3 epic scroll visual overhaul`

---

*计划待评审。确认后进入 `superpowers:executing-plans` 执行。*
