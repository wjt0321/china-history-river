# 阶段 2 — 血肉（内容深度）设计文档

> 项目：中华 5000 年历史长河（china-history-river）
> 日期：2026-06-12
> 依据：docs/REQUIREMENTS.md 阶段 2 规划

---

## 一、当前状态

阶段 1 已完成，应用可运行：
- 14 朝代数据 + GeoJSON 疆域
- 河流时间轴 + 地图渐变切换
- 卷轴式详情面板
- 5 Tab 框架已存在（概览 / 帝王 / 大事 / 文化 / 疆域）
- 氛围粒子 + 都城标记

阶段 2 需在现有骨架上填充深度交互与可视化，使应用从"可浏览"升级为"可深度探索"。

---

## 二、阶段 2 目标

依据 REQUIREMENTS.md，阶段 2 交付四项能力：

1. **皇帝下钻**：帝王长廊卡片支持展开，查看完整功过详情。
2. **重大事件地图标注**：大事年表中的关键事件在地图上以闪烁标记呈现，与列表 hover/click 联动。
3. **数据卡片**：人口、疆域、经济等核心数据以可视化卡片展示，支持对比感知。
4. **详情面板多 Tab**：确保 5 个 Tab 内容完整、交互一致。

---

## 三、设计决策

### 3.1 事件坐标数据模型

为 `HistoricalEvent` 增加可选字段 `location` 与 `coords`：

```ts
export interface HistoricalEvent {
  year: number
  title: string
  desc: string
  source?: string
  location?: string        // 地点名称，如"咸阳"
  coords?: [number, number] // [经度, 纬度]
}
```

- 仅对具有明确地理意义的事件添加坐标（战役、迁都、重大工程等）。
- 无坐标事件正常显示在年表中，不渲染地图标记。
- 坐标采用 WGS84，与 MapLibre 一致。

### 3.2 地图事件层

在 `MapView.tsx` 中新增 `event-markers` GeoJSON source + symbol/circle layer：

- 每个事件渲染为一个脉冲动画圆点（circle layer + `circle-radius` 过渡动画）。
- 点击标记弹出 MapLibre Popup，显示年份、标题、地点、简介。
- 标记颜色使用当前朝代色，但比疆域填充更亮。
- 朝代切换时清除旧事件标记，加载新朝代事件。

### 3.3 事件列表与地图联动

在 `DetailPanel.tsx` 的 `EventsTab` 中：

- 每个事件项增加 `location` 标签。
- hover 某事件项时，通过 Zustand 临时状态 `highlightedEventId` 通知地图高亮对应标记。
- 点击事件项时，地图 flyTo 到事件坐标并打开 Popup。

新增 Zustand 状态：

```ts
highlightedEventId: string | null
setHighlightedEvent: (id: string | null) => void
```

事件项唯一键使用 `{dynastyId}-{year}-{title}` 字符串。

### 3.4 帝王长廊下钻

在 `EmperorsTab` 中：

- 默认只展示皇帝头像区（姓名、在位、角色、标签）。
- 点击卡片展开/折叠，显示完整功过列表。
- 展开态用 Framer Motion `AnimatePresence` + `motion.div` 做高度动画。
- 单朝代同时最多展开 1 张卡片（可选，提升可读性）。

### 3.5 数据卡片增强

在 `TerritoryTab` 与 `OverviewTab` 中：

- 经济数据卡片使用大数字 + 单位 + 标签的陈列式布局（已存在，需统一样式）。
- 新增"数据对比条"：将当前朝代的 peakArea / peakPopulation 与已知最大值（清）做百分比条形图，帮助用户感知规模。
- 数据条使用 CSS 渐变填充，颜色为当前朝代色。

### 3.6 视觉规范

- 所有新增组件复用 `global.css` 变量。
- 地图标记避免与都城标记重叠：都城为固定圆点，事件标记为脉冲外圈。
- 保持博物馆级低饱和色系，不引入高饱和图标。

---

## 四、文件变更清单

| 文件 | 变更类型 | 说明 |
|---|---|---|
| `src/types/dynasty.ts` | 修改 | `HistoricalEvent` 增加 `location` / `coords` |
| `src/stores/appStore.ts` | 修改 | 增加 `highlightedEventId` 状态 |
| `src/components/MapView.tsx` | 修改 | 增加事件标记图层与 Popup |
| `src/components/DetailPanel.tsx` | 修改 | 事件列表联动 + 帝王展开 + 数据对比条 |
| `src/components/DetailPanel.css` | 修改 | 新增事件标记样式、帝王展开动画、数据条 |
| `src/data/dynasties-*.ts` | 修改 | 为关键事件补充 `location` / `coords` |
| `docs/DECISIONS.md` | 修改 | 记录阶段 2 设计决策 |

---

## 五、数据坐标规划（示例）

为每个朝代挑选 3-5 个最具地理代表性的事件补充坐标：

- 秦：商鞅变法（咸阳）、统一六国（咸阳）、北击匈奴（河套）、焚书坑儒（咸阳）
- 汉：刘邦称帝（定陶/洛阳）、张骞出使（长安）、蔡伦造纸（洛阳）
- 唐：李渊称帝（长安）、安史之乱（范阳/潼关）、黄巢起义（曹州）
- 宋：陈桥兵变（陈桥驿）、靖康之难（开封）、崖山海战（崖山）
- 元：忽必烈改国号（开平/大都）、崖山海战（崖山）
- 明：朱元璋称帝（南京）、郑和下西洋（南京/太仓）、崇祯自缢（北京）
- 清：清军入关（山海关）、鸦片战争（广州/虎门）、辛亥革命（武昌）

坐标使用公开地理信息，精确到城市/遗址级别即可。

---

## 六、验证标准

- [ ] `npm run type-check` 通过
- [ ] `npm run build` 通过
- [ ] 切换朝代时事件标记正确更新
- [ ] hover 事件列表项时对应地图标记高亮
- [ ] 点击帝王卡片可展开/折叠
- [ ] 数据对比条显示正确百分比

---

*设计文档结束，进入实现计划。*
