# 阶段 2 — 血肉（内容深度）实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在阶段 1 基础上完成阶段 2 内容深度迭代：事件地图标注、帝王下钻、数据卡片增强、多 Tab 内容完整。

**Architecture:** 在现有 MapLibre 地图组件上叠加事件标记图层，通过 Zustand 状态连接详情面板事件列表与地图标记；帝王长廊使用本地 state 做展开/折叠；数据卡片使用 CSS 百分比条做可视化对比。

**Tech Stack:** React 18 + TypeScript + MapLibre GL + Zustand + Framer Motion + 纯 CSS。

---

## Task 1: 扩展事件类型，增加地理坐标字段

**Files:**
- Modify: `src/types/dynasty.ts:14-20`

**Step 1: 在 HistoricalEvent 接口添加可选字段**

```ts
export interface HistoricalEvent {
  year: number
  title: string
  desc: string
  source?: string
  location?: string
  coords?: [number, number]
}
```

**Step 2: 运行类型检查**

Run: `npm run type-check`
Expected: PASS（仅类型声明扩展，无使用方报错）

**Step 3: Commit**

```bash
git add src/types/dynasty.ts
git commit -m "types: add location and coords to HistoricalEvent"
```

---

## Task 2: 为关键事件补充地理坐标数据

**Files:**
- Modify: `src/data/dynasties-part1.ts`
- Modify: `src/data/dynasties-part2.ts`
- Modify: `src/data/dynasties-part3.ts`
- Modify: `src/data/dynasties-part4.ts`
- Modify: `src/data/dynasties-ming.ts`
- Modify: `src/data/dynasties-qing.ts`

**Step 1: 为每个朝代挑选 3-5 个有地理意义的事件补充 location 与 coords**

坐标示例（WGS84，城市中心/遗址近似）：

```ts
// 秦 - 咸阳
{ year: -221, title: '统一六国', desc: '...', location: '咸阳', coords: [108.7, 34.3], source: '《史记·秦始皇本纪》' }
{ year: -215, title: '北击匈奴', desc: '...', location: '河套', coords: [108.8, 40.8], source: '《史记·蒙恬列传》' }
{ year: -209, title: '大泽乡起义', desc: '...', location: '大泽乡', coords: [117.0, 33.6], source: '《史记·陈涉世家》' }
```

每个朝代补充相同数量的事件（3-5 个），保持数据一致。

**Step 2: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/data/
git commit -m "data: add geo coordinates to key historical events"
```

---

## Task 3: Zustand 增加事件高亮状态

**Files:**
- Modify: `src/stores/appStore.ts:5-19` 接口
- Modify: `src/stores/appStore.ts:25-40` store 实现

**Step 1: 扩展 AppState 接口**

```ts
interface AppState {
  selectedDynastyId: string
  selectedDynasty: Dynasty
  hoveredDynastyId: string | null
  isDetailOpen: boolean
  highlightedEventId: string | null

  setSelected: (id: string) => void
  setHovered: (id: string | null) => void
  toggleDetail: () => void
  closeDetail: () => void
  setHighlightedEvent: (id: string | null) => void
}
```

**Step 2: 在 store 实现中添加状态与 setter**

```ts
export const useAppStore = create<AppState>((set) => ({
  selectedDynastyId: DYNASTIES[0].id,
  selectedDynasty: findDynasty(DYNASTIES[0].id),
  hoveredDynastyId: null,
  isDetailOpen: false,
  highlightedEventId: null,

  setSelected: (id) =>
    set({
      selectedDynastyId: id,
      selectedDynasty: findDynasty(id),
      isDetailOpen: true,
      highlightedEventId: null,
    }),
  setHovered: (id) => set({ hoveredDynastyId: id }),
  toggleDetail: () => set((s) => ({ isDetailOpen: !s.isDetailOpen })),
  closeDetail: () => set({ isDetailOpen: false }),
  setHighlightedEvent: (id) => set({ highlightedEventId: id }),
}))
```

**Step 3: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/stores/appStore.ts
git commit -m "store: add highlightedEventId state for map-event linkage"
```

---

## Task 4: MapView 实现事件标记图层

**Files:**
- Modify: `src/components/MapView.tsx`

**Step 1: 在 loadDynasty 函数中增加事件标记加载逻辑**

在都城标记代码之后、flyTo 之前插入：

```ts
// === 事件标记 ===
const eventFeatures: Feature[] = []
for (const ev of dynasty.events || []) {
  if (!ev.coords) continue
  eventFeatures.push({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: ev.coords },
    properties: {
      id: `${dynasty.id}-${ev.year}-${ev.title}`,
      year: ev.year,
      title: ev.title,
      desc: ev.desc,
      location: ev.location || '',
    },
  })
}
const eventData: FeatureCollection = { type: 'FeatureCollection', features: eventFeatures }
const eventSourceId = 'event-markers'
const eventLayerId = 'event-dots'
const eventPulseId = 'event-pulse'

if (map.getSource(eventSourceId)) {
  ;(map.getSource(eventSourceId) as maplibregl.GeoJSONSource).setData(eventData)
  map.setPaintProperty(eventLayerId, 'circle-color', color)
  map.setPaintProperty(eventPulseId, 'circle-color', color)
} else {
  map.addSource(eventSourceId, { type: 'geojson', data: eventData })
  map.addLayer({
    id: eventPulseId,
    type: 'circle',
    source: eventSourceId,
    paint: {
      'circle-radius': 18,
      'circle-color': color,
      'circle-opacity': 0.2,
      'circle-blur': 0.8,
    },
  })
  map.addLayer({
    id: eventLayerId,
    type: 'circle',
    source: eventSourceId,
    paint: {
      'circle-radius': 6,
      'circle-color': color,
      'circle-opacity': 0.9,
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1.5,
      'circle-stroke-opacity': 0.6,
    },
  })
}
```

**Step 2: 增加事件 Popup 交互**

在 MapView 组件内使用 ref 管理 popup，并在 useEffect 中绑定 click 事件：

```ts
const popupRef = useRef<maplibregl.Popup | null>(null)

useEffect(() => {
  const map = mapRef.current
  if (!map || !isMapLoaded.current) return

  const handleClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
    const feature = e.features?.[0]
    if (!feature) return
    const { year, title, desc, location } = feature.properties as Record<string, string>
    if (popupRef.current) popupRef.current.remove()
    popupRef.current = new maplibregl.Popup({ offset: 12, closeButton: true })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`
        <div class="event-popup">
          <div class="event-popup-year">${formatYear(Number(year))}</div>
          <div class="event-popup-title">${title}</div>
          ${location ? `<div class="event-popup-location">${location}</div>` : ''}
          <div class="event-popup-desc">${desc}</div>
        </div>
      `)
      .addTo(map)
  }

  map.on('click', eventLayerId, handleClick)
  map.on('mouseenter', eventLayerId, () => { map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', eventLayerId, () => { map.getCanvas().style.cursor = '' })

  return () => {
    map.off('click', eventLayerId, handleClick)
    map.off('mouseenter', eventLayerId)
    map.off('mouseleave', eventLayerId)
  }
}, [])
```

**Step 3: 增加高亮事件联动**

订阅 highlightedEventId，改变对应标记半径：

```ts
const highlightedEventId = useAppStore((s) => s.highlightedEventId)

useEffect(() => {
  const map = mapRef.current
  if (!map || !isMapLoaded.current) return
  const radius = highlightedEventId ? 10 : 6
  map.setPaintProperty('event-dots', 'circle-radius', radius)
}, [highlightedEventId])
```

**Step 4: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "feat(map): render event markers with pulse and popup"
```

---

## Task 5: 事件列表与地图联动

**Files:**
- Modify: `src/components/DetailPanel.tsx:339-381` EventsTab

**Step 1: 引入 store setter 并生成事件唯一键**

```ts
function EventsTab({ d }: { d: Dynasty }) {
  const { setHighlightedEvent } = useAppStore()
  const sorted = [...d.events].sort((a, b) => a.year - b.year)
  const makeEventId = (ev: HistoricalEvent) => `${d.id}-${ev.year}-${ev.title}`
  // ...
}
```

**Step 2: 为每个事件项添加 hover/click 处理**

```tsx
<li
  key={i}
  className="timeline-item"
  onMouseEnter={() => setHighlightedEvent(makeEventId(ev))}
  onMouseLeave={() => setHighlightedEvent(null)}
  onClick={() => {
    if (ev.coords) {
      useAppStore.getState().setHighlightedEvent(makeEventId(ev))
    }
  }}
>
  <div className="timeline-dot" />
  <div className="timeline-content">
    <div className="timeline-year">{formatYear(ev.year)}</div>
    <div className="timeline-title">{ev.title}</div>
    {ev.location && <div className="timeline-location">📍 {ev.location}</div>}
    <div className="timeline-desc">{ev.desc}</div>
    {ev.source && <div className="timeline-source">— {ev.source}</div>}
  </div>
</li>
```

**Step 3: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/DetailPanel.tsx
git commit -m "feat(panel): link event list hover with map markers"
```

---

## Task 6: 帝王长廊展开/折叠下钻

**Files:**
- Modify: `src/components/DetailPanel.tsx:301-337` EmperorsTab

**Step 1: 增加展开状态管理**

```ts
import { useState } from 'react'

function EmperorsTab({ d }: { d: Dynasty }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const toggle = (name: string) => setExpanded((cur) => (cur === name ? null : name))
  // ...
}
```

**Step 2: 修改 emperor-card 为可点击展开**

```tsx
<div
  key={i}
  className={`emperor-card ${expanded === e.name ? 'is-expanded' : ''}`}
  onClick={() => toggle(e.name)}
>
  <div className="emperor-head">
    <div className="emperor-name">{e.name}</div>
    <div className="emperor-reign">{e.reign}</div>
  </div>
  <div className="emperor-meta">
    <span className="emp-tag">{e.role}</span>
    <span className="emp-tag">{e.years} 年</span>
  </div>
  <AnimatePresence>
    {expanded === e.name && (
      <motion.div
        className="emperor-detail"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {e.achievements.length > 0 && (
          <div className="emperor-body">
            <div className="emp-subtitle">功</div>
            <ul className="emp-list">{e.achievements.map((a, j) => <li key={j}>{a}</li>)}</ul>
          </div>
        )}
        {e.faults && e.faults.length > 0 && (
          <div className="emperor-body">
            <div className="emp-subtitle fault">过</div>
            <ul className="emp-list">{e.faults.map((a, j) => <li key={j}>{a}</li>)}</ul>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

**Step 3: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/DetailPanel.tsx
git commit -m "feat(panel): expandable emperor cards"
```

---

## Task 7: 数据卡片增强 — 对比条

**Files:**
- Modify: `src/components/DetailPanel.tsx:462-516` TerritoryTab
- Modify: `src/components/DetailPanel.css`

**Step 1: 在 TerritoryTab 中新增 DataBar 组件**

```tsx
function DataBar({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="data-bar">
      <div className="data-bar-label">{label}</div>
      <div className="data-bar-track">
        <div className="data-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="data-bar-value">{value.toLocaleString()} {unit}</div>
    </div>
  )
}
```

**Step 2: 在 TerritoryTab 中使用 DataBar**

```tsx
<section className="detail-section">
  <h3 className="section-title">数据概览</h3>
  <DataBar label="极盛疆域" value={d.economy.territory} max={1400} unit="万 km²" color={d.color || '#e63946'} />
  {d.economy.population && <DataBar label="极盛人口" value={d.economy.population} max={45000} unit="万" color={d.color || '#e63946'} />}
</section>
```

**Step 3: 在 DetailPanel.css 中添加样式**

```css
.data-bar { margin-bottom: 18px; }
.data-bar-label { font-size: 12px; color: var(--color-text-dim); margin-bottom: 6px; }
.data-bar-track { height: 8px; background: var(--color-bg-elev-2); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.data-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s var(--ease-out); }
.data-bar-value { font-family: var(--font-mono); font-size: 12px; color: var(--color-paper); }
```

**Step 4: 运行类型检查**

Run: `npm run type-check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/DetailPanel.tsx src/components/DetailPanel.css
git commit -m "feat(panel): add data comparison bars for territory and population"
```

---

## Task 8: 样式与交互打磨

**Files:**
- Modify: `src/components/DetailPanel.css`
- Modify: `src/components/MapView.tsx` or `src/styles/global.css`

**Step 1: 添加事件 popup 样式**

```css
.event-popup { font-family: var(--font-zh); min-width: 160px; max-width: 240px; }
.event-popup-year { font-size: 11px; color: var(--color-text-faint); margin-bottom: 4px; }
.event-popup-title { font-size: 14px; font-weight: 700; color: var(--color-paper); margin-bottom: 4px; }
.event-popup-location { font-size: 11px; color: var(--dynasty-color, var(--color-primary)); margin-bottom: 6px; }
.event-popup-desc { font-size: 12px; color: var(--color-text); line-height: 1.5; }
```

**Step 2: 添加 timeline-location 样式**

```css
.timeline-location { font-size: 11px; color: var(--dynasty-color, var(--color-primary)); margin-bottom: 4px; }
```

**Step 3: 添加 emperor-card 展开样式**

```css
.emperor-card { cursor: pointer; }
.emperor-card.is-expanded { border-color: var(--dynasty-color, var(--color-primary)); }
.emperor-detail { overflow: hidden; }
```

**Step 4: 运行类型检查 + build**

Run: `npm run type-check && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/DetailPanel.css src/components/MapView.tsx
git commit -m "style: polish event popup, timeline location and emperor expand state"
```

---

## Task 9: 更新 DECISIONS.md

**Files:**
- Modify: `docs/DECISIONS.md`

**Step 1: 在文档末尾追加阶段 2 决策记录**

```markdown
## 2026-06-12 阶段 2 内容深度迭代

- 为 HistoricalEvent 增加可选 location / coords，仅标记有明确地理意义的事件。
- 使用 MapLibre GeoJSON source + circle layer 渲染事件标记，避免与都城标记样式冲突。
- 通过 Zustand highlightedEventId 连接事件列表 hover 与地图标记高亮。
- 帝王长廊卡片使用本地 state + Framer Motion 做展开/折叠下钻。
- 数据卡片使用 CSS 百分比条对比疆域/人口规模。
```

**Step 2: Commit**

```bash
git add docs/DECISIONS.md
git commit -m "docs: record phase 2 design decisions"
```

---

## 验证清单

- [ ] `npm run type-check` 通过
- [ ] `npm run build` 通过
- [ ] 切换朝代时地图事件标记正确更新
- [ ] hover 事件列表项时地图标记变大高亮
- [ ] 点击地图事件标记弹出 Popup
- [ ] 点击帝王卡片展开/折叠功过详情
- [ ] 疆域/人口数据条显示正确百分比

---

**Plan complete and saved to `docs/plans/2026-06-12-phase2-implementation.md`.**
