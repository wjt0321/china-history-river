# 史诗长卷视觉 overhaul 整合实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在已有阶段 3 实现（开场动画、印章墨迹装饰、自定义光标、时间轴 brush、卷轴面板、顶栏印章）基础上，补齐氛围基底和地图水墨化的剩余缺口，完成 A+C 风格的视觉统一。

**Architecture:** 不改现有组件结构；通过全局 CSS 变量升温、MapLibre style 自定义、MapView 疆域层增强、HTML Marker 替换都城标记、音效占位层，把现有「科技感深色」彻底转为「宫墙夜色 + 水墨长卷」。

**Tech Stack:** React 18, TypeScript, Vite, MapLibre GL, Framer Motion, Canvas 2D

---

## 当前已实现（不再重复做）

| 模块 | 已完成内容 | 文件 |
|---|---|---|
| 开场动画 | 黑屏 → 逐朝代亮起 → 印章落下 → 进入主界面 | `IntroAnimation.tsx/css` |
| 印章墨迹装饰 | 左上角长河印章、右上角墨迹、右下角晕染、竖排款识 | `InkDecorations.tsx/css` |
| 自定义光标 | 光晕小圆点、hover 放大、边界/失焦恢复系统光标 | `CustomCursor.tsx/css` |
| 顶栏 | 朝代印章 + 下拉选择 + 详情开关 | `TopBar.tsx/css` |
| 详情面板 | 卷轴轴头 + scroll-content 结构 | `DetailPanel.tsx/css` |
| 时间轴 | brush 缩放/平移 + 印章节点 | `Timeline.tsx/css` |
| 氛围粒子 | 4 种主题随朝代切换 | `AtmosphereParticles.tsx` |
| 全局纹理 | 噪点 + 暗角 | `App.css` |

---

## 剩余缺口与整合任务

### Task 1: 接入字体并升温全局色板

**现状：** `global.css` 已引用 `--font-zh: 'Noto Serif SC' ...`，但 `index.html` 没加载字体；色板仍是 `#050810` 科技深蓝黑，缺宫墙/宣纸暖意。

**Files:**
- Modify: `index.html`
- Modify: `src/styles/global.css`

**Step 1: 加载 Google Fonts**

在 `index.html` `<head>` 中追加：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap" rel="stylesheet">
```

**Step 2: 更新色板变量**

将 `:root` 中以下变量替换为宫墙水墨色系：

```css
--color-bg-deep: #0c0b09;
--color-bg: #12110e;
--color-bg-elev: #1a1915;
--color-bg-elev-2: #23211c;

--color-primary: #b8943a;      /* 暗金 */
--color-primary-dim: #7a6a2a;
--color-primary-bright: #d4b050;

--color-accent: #8b3535;       /* 宫墙朱 */
--color-accent-dim: #5a2525;

--color-text: #f5f0e6;         /* 宣纸白 */
--color-text-dim: #a8a090;
--color-text-faint: #5a5548;

--color-ink: #3a3a36;
--color-paper: #f5f0e6;

--color-border: rgba(184, 148, 58, 0.15);
--color-border-bright: rgba(184, 148, 58, 0.4);
```

**Step 3: 更新 App.css 暗角**

将 `App.css` 中的 vignette 从 `rgba(5, 8, 16, 0.5)` 改为 `rgba(12, 11, 9, 0.55)`，与新的背景色融合。

**Step 4: 手动验证**

```bash
npm run dev -- --port 5173
```

刷新页面，确认：
- 页面变暖、不再偏蓝；
- 标题/朝代名使用 Noto Serif SC；
- Network 面板看到 fonts.googleapis.com 请求。

**Step 5: Commit**

```bash
git add index.html src/styles/global.css src/App.css
git commit -m "style(global): load Noto Serif SC and warm palette to palace ink tones"
```

---

### Task 2: 自定义水墨底图

**现状：** `mapStyle.ts` 仍用 CartoDB dark_nolabels，色调偏冷、现代。

**Files:**
- Modify: `src/styles/mapStyle.ts`

**Step 1: 重写底图图层**

将 `DARK_TECHNO_STYLE` 中 `carto-dark-base` 的 paint 改为：

```ts
{
  id: 'carto-dark-base',
  type: 'raster',
  source: 'carto-dark',
  paint: {
    'raster-opacity': 0.22,
    'raster-saturation': -0.9,
    'raster-contrast': 0.05,
  },
}
```

**Step 2: 调整 china-base 图层**

```ts
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
}
```

删除原 `china-base-line` 或合并到 `china-base-coast`。

**Step 3: 手动验证**

刷新页面，确认底图变得非常暗、淡，陆地轮廓像水墨线。

**Step 4: Commit**

```bash
git add src/styles/mapStyle.ts
git commit -m "style(map): muted ink-wash base map with paper landmasses"
```

---

### Task 3: 疆域增加水墨外晕层

**现状：** 疆域已有 `dynasty-glow`/`dynasty-inner-glow`，但边缘仍偏硬，缺外层墨晕。

**Files:**
- Modify: `src/components/MapView.tsx`

**Step 1: 添加 outer-ink 层**

在首次 `addLayer` 序列中，在 `glowLayer` 之前添加：

```ts
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

**Step 2: 统一淡入/切换逻辑**

首次淡入：

```ts
requestAnimationFrame(() => {
  map.setPaintProperty(fillLayer, 'fill-opacity', 0.42)
  map.setPaintProperty(lineLayer, 'line-opacity', 0.9)
  map.setPaintProperty(glowLayer, 'line-opacity', 0.45)
  map.setPaintProperty(innerGlowLayer, 'line-opacity', 0.28)
  map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.18)
})
```

切换分支：

```ts
map.setPaintProperty('dynasty-outer-ink', 'line-color-transition', transition)
map.setPaintProperty('dynasty-outer-ink', 'line-opacity-transition', transition)
map.setPaintProperty('dynasty-outer-ink', 'line-color', color)
map.setPaintProperty('dynasty-outer-ink', 'line-opacity', 0.18)
```

**Step 3: 手动验证**

切换朝代，确认疆域边缘有柔和墨晕。

**Step 4: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "style(map): add outer ink-blur layer to territory"
```

---

### Task 4: 都城标记改为朱印

**现状：** 都城是 `circle` + `symbol` 图层，偏小、像地图标点。

**Files:**
- Modify: `src/components/MapView.tsx`
- Modify: `src/components/MapView.css`

**Step 1: 移除原有 circle/symbol 图层**

删除 `capLayer` 和 `capLabel` 的 `addLayer` 逻辑，保留 `capSourceId` source 更新即可（或直接移除 source）。

**Step 2: 使用 HTML Marker**

在 `loadDynasty` 中创建 Marker：

```ts
const capitalCoords = CAPITAL_COORDS[dynasty.id]
if (capitalCoords) {
  // 清理旧 marker
  if ((map as any).__capitalMarker) {
    ;(map as any).__capitalMarker.remove()
  }
  const el = document.createElement('div')
  el.className = 'capital-seal'
  el.innerHTML = `<span>${dynasty.capital}</span>`
  el.style.setProperty('--capital-color', color)
  const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat(capitalCoords)
    .addTo(map)
  ;(map as any).__capitalMarker = marker
}
```

**Step 3: 添加 CSS**

在 `MapView.css` 新增：

```css
.capital-seal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 2px solid var(--capital-color);
  border-radius: 4px;
  background: rgba(139, 53, 53, 0.85);
  color: var(--color-paper);
  font-family: var(--font-zh);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 0 14px var(--capital-color);
  cursor: pointer;
  transition: transform 0.2s;
}

.capital-seal:hover {
  transform: scale(1.12);
}

.capital-seal span {
  writing-mode: vertical-rl;
  letter-spacing: 0.05em;
}
```

**Step 4: 手动验证**

刷新页面，确认都城像一枚红色印章。

**Step 5: Commit**

```bash
git add src/components/MapView.tsx src/components/MapView.css
git commit -m "style(map): capital markers as red palace seals"
```

---

### Task 5: 事件标记与 Popup 题跋化

**现状：** 事件标记是 circle + pulse，Popup 是默认 MapLibre 样式。

**Files:**
- Modify: `src/components/MapView.tsx`
- Modify: `src/components/MapView.css`

**Step 1: 增大事件标记并加拖尾**

将 `event-dots` 半径改为 8/12（hover 12），`event-pulse` 半径改为 24，opacity 提高：

```ts
map.addLayer({
  id: eventPulseId,
  type: 'circle',
  source: eventSourceId,
  paint: {
    'circle-radius': 24,
    'circle-color': color,
    'circle-opacity': 0.35,
    'circle-blur': 0.6,
  },
})

map.addLayer({
  id: eventLayerId,
  type: 'circle',
  source: eventSourceId,
  paint: {
    'circle-radius': 8,
    'circle-color': color,
    'circle-opacity': 1,
    'circle-stroke-color': '#fff',
    'circle-stroke-width': 2,
    'circle-stroke-opacity': 0.8,
  },
})
```

**Step 2: Popup 改为题跋样式**

```ts
popupRef.current = new maplibregl.Popup({
  offset: 14,
  closeButton: true,
  className: 'event-popup-tibei',
})
  .setLngLat(coordinates)
  .setHTML(`
    <div class="event-popup">
      <div class="event-popup-year">${formatYear(Number(props.year))}</div>
      <div class="event-popup-title">${props.title}</div>
      ${props.location ? `<div class="event-popup-location">${props.location}</div>` : ''}
      <div class="event-popup-desc">${props.desc}</div>
    </div>
  `)
  .addTo(map)
```

**Step 3: 添加题跋 CSS**

```css
.event-popup-tibei .maplibregl-popup-content {
  background: rgba(245, 240, 230, 0.95);
  color: #1a1915;
  border-radius: 2px;
  padding: 14px 16px;
  font-family: var(--font-zh);
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  border: 1px solid rgba(139, 53, 53, 0.25);
}

.event-popup-tibei .maplibregl-popup-tip {
  border-top-color: rgba(245, 240, 230, 0.95);
}

.event-popup-year {
  font-size: 12px;
  color: #8b3535;
  margin-bottom: 4px;
}

.event-popup-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.event-popup-location {
  font-size: 11px;
  color: #5a5548;
  margin-bottom: 8px;
}

.event-popup-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #2a2925;
}
```

**Step 4: 手动验证**

hover/click 事件标记，确认 Popup 像古卷题跋。

**Step 5: Commit**

```bash
git add src/components/MapView.tsx src/components/MapView.css
git commit -m "style(map): event markers and popups as ink-wash tibei"
```

---

### Task 6: 音效占位与静音开关

**现状：** 无音效系统。

**Files:**
- Create: `src/utils/sound.ts`
- Modify: `src/stores/appStore.ts`
- Modify: `src/components/TopBar.tsx`
- Modify: `src/components/TopBar.css`
- Modify: `src/components/IntroAnimation.tsx`
- Modify: `src/components/MapView.tsx`

**Step 1: 创建 SoundManager**

```ts
// src/utils/sound.ts
class SoundManager {
  private enabled = false

  setEnabled(v: boolean) {
    this.enabled = v
  }

  isEnabled() {
    return this.enabled
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled) return
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // ignore
    }
  }

  playSeal() {
    this.playTone(180, 0.25, 'triangle')
  }

  playTransition() {
    this.playTone(120, 0.6, 'sine')
  }
}

export const sound = new SoundManager()
```

**Step 2: store 增加音效开关**

```ts
soundEnabled: boolean
setSoundEnabled: (v: boolean) => void
```

初始化：

```ts
soundEnabled: false
```

**Step 3: 顶栏加静音按钮**

```tsx
<button
  className="sound-toggle"
  onClick={() => {
    const next = !soundEnabled
    setSoundEnabled(next)
    sound.setEnabled(next)
  }}
  title={soundEnabled ? '关闭音效' : '开启音效'}
>
  {soundEnabled ? '🔊' : '🔇'}
</button>
```

**Step 4: 触发点**

- `IntroAnimation` 印章落下时调用 `sound.playSeal()`
- `MapView.loadDynasty` 新疆域淡入时调用 `sound.playTransition()`

**Step 5: Commit**

```bash
git add src/utils/sound.ts src/stores/appStore.ts src/components/TopBar.tsx src/components/TopBar.css src/components/IntroAnimation.tsx src/components/MapView.tsx
git commit -m "feat(sound): add placeholder sound manager and mute toggle"
```

---

### Task 7: 时间轴与面板样式对齐

**现状：** 时间轴已有 brush 和印章节点，但配色仍偏科技青；详情面板卷轴感已存在但可更统一。

**Files:**
- Modify: `src/components/Timeline.css`
- Modify: `src/components/DetailPanel.css`

**Step 1: Timeline 颜色对齐**

将 Timeline.css 中所有科技青/蓝色引用改为金/朱/墨色：

- `#4ecdc4` → `var(--color-primary)` 或 `var(--color-gold)`
- `#0a0e1a` → `var(--color-bg)`
- 河流填充从纯色改为水墨渐变

**Step 2: DetailPanel 文字与 Tab 调性**

- Tab 文字使用 `var(--font-zh)`
- 当前 Tab 下划线改为朱砂色/金色
- 帝王卡片 hover 加淡金光线

**Step 3: Commit**

```bash
git add src/components/Timeline.css src/components/DetailPanel.css
git commit -m "style(ui): align timeline and detail panel with palace ink palette"
```

---

### Task 8: 全局回归验证

**Files:** 所有改动文件

**Step 1: 类型检查**

```bash
npm run type-check
```

**Expected:** 无错误。

**Step 2: 生产构建**

```bash
npm run build
```

**Expected:** `dist/` 生成成功。

**Step 3: 手动走查**

- [ ] 页面加载出现开场动画，印章落下有音效（需开启）。
- [ ] 背景变暖、有宣纸噪点、四角暗角。
- [ ] 标题/朝代名使用 Noto Serif SC。
- [ ] 地图底图暗淡，陆地像水墨轮廓。
- [ ] 切换朝代时疆域有墨晕外发光。
- [ ] 都城标记是朱印。
- [ ] 事件标记清晰，Popup 像题跋。
- [ ] 时间轴河流为墨色渐变，节点为印章。
- [ ] 详情面板卷轴轴头自然。
- [ ] 自定义光标在不同场景正常。
- [ ] 60fps，无卡顿。

**Step 4: Commit**

```bash
git add -A
git commit -m "chore(release): complete phase 3 epic scroll visual overhaul"
```

---

## 提交汇总（预计）

1. `style(global): load Noto Serif SC and warm palette to palace ink tones`
2. `style(map): muted ink-wash base map with paper landmasses`
3. `style(map): add outer ink-blur layer to territory`
4. `style(map): capital markers as red palace seals`
5. `style(map): event markers and popups as ink-wash tibei`
6. `feat(sound): add placeholder sound manager and mute toggle`
7. `style(ui): align timeline and detail panel with palace ink palette`
8. `chore(release): complete phase 3 epic scroll visual overhaul`

---

## 可选增强（不纳入本次必做）

| 增强项 | 说明 | 复杂度 |
|---|---|---|
| 疆域 Canvas 水彩层 | 用 MapLibre custom layer 或叠加 Canvas 实现真正的水彩边缘 | 高 |
| 开场配音/环境音 | 用真实编钟/古琴音频文件替代合成音 | 中 |
| 卷轴展开音效 | DetailPanel 开关时配纸张摩擦声 | 低 |
| 时间轴 hover 音效 | 印章节点 hover 时轻微木石声 | 低 |

---

*整合计划待评审。确认后进入 `superpowers:executing-plans` 执行。*
