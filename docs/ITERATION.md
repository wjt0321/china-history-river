# 迭代建议与路线图 — china-history-river

> 基于 2026-06 项目审查整理。本文档用于后续迭代排期与任务拆分。  
> 当前验证状态：`type-check` / `lint` / `test` / `build` 均通过；生产构建存在 MapLibre 大 chunk 警告。  
> 迭代状态：P0-P6 核心任务已基本落地，当前进入视觉回归、截图素材与内容精细化阶段。

---

## 1. 当前项目状态

### 1.1 项目定位

**中华 5000 年历史长河**是一件以“中国历代疆域动态变化”为主线的交互式数据可视化网页作品，目标是用于个人作品集展示。

当前核心体验已经成型：

- 河流式 Canvas 时间轴：按朝代切换与 brush 缩放。
- MapLibre 动态疆域地图：GeoJSON 疆域、都城标记、事件点联动。
- 卷轴式详情面板：概览 / 帝王 / 大事 / 文化 / 疆域五类信息。
- 氛围粒子系统：萤火 / 尘埃 / 花瓣 / 落雪。
- 开场动画、墨迹装饰、自定义光标、错误边界、基础测试已具备。

### 1.2 质量验证结果

本次审查已运行：

```bash
npm run type-check
npm run test
npm run lint
npm run build
```

结果：

| 命令 | 状态 | 说明 |
|---|---|---|
| `npm run type-check` | ✅ 通过 | 无 TypeScript 编译错误 |
| `npm run test` | ✅ 通过 | 6 个测试文件，49 个测试全部通过 |
| `npm run lint` | ✅ 通过 | ESLint 无错误输出 |
| `npm run build` | ✅ 通过 | Vite 构建成功，但 MapLibre chunk 较大 |

构建警告摘要：

```txt
assets/maplibre-*.js 约 801 kB，gzip 后约 218 kB
Some chunks are larger than 500 kB after minification.
```

### 1.3 当前优势

| 维度 | 评价 |
|---|---|
| 主题辨识度 | 高。历史长河 + 疆域演变具备作品集记忆点 |
| 视觉统一性 | 高。数字博物馆 / 古画卷轴风格明确 |
| 技术完整度 | 较高。React + MapLibre + Canvas + Zustand + Framer Motion 组合完整 |
| 内容结构 | 较完整。14 朝代、12 维度数据模型已经成型 |
| 工程基础 | 良好。已有测试、错误边界、hooks、utils、构建脚本 |

### 1.4 主要问题

| 问题 | 影响 | 优先级 |
|---|---|---|
| MapLibre 第三方 chunk 仍较大 | 已通过懒加载隔离，但构建仍提示大 chunk | 中 |
| `AtmosphereParticles` 仍偏长 | 后续维护与测试成本较高 | 中 |
| 移动端详情面板尚未 bottom sheet 化 | 窄屏体验仍可继续优化 | 中 |
| README 截图 / GIF 展示素材未补齐 | 影响 GitHub 作品集第一印象 | 中 |
| 逐朝代来源 URL 与争议标签仍较粗 | 内容可信度可继续精细化 | 中 |

---

## 2. 迭代原则

后续不建议继续盲目堆视觉特效，而应围绕以下方向迭代：

1. **更快打开**：首屏性能、懒加载、资源控制。
2. **更好讲故事**：叙事模式、朝代巡游、事件联动。
3. **更可信**：来源标注、疆域免责声明、争议内容区分。
4. **更易分享**：URL 状态同步、README 展示、截图/GIF。
5. **更适合移动端**：Pointer Events、底部抽屉、响应式导航。

每次迭代完成后至少运行：

```bash
npm run type-check
npm run test
npm run lint
npm run build
```

---

## 3. 推荐优先级总览

| 优先级 | 方向 | 目标 |
|---|---|---|
| P0 | 性能与首屏体验 | 降低首屏 JS 压力，消除明显构建警告 |
| P1 | 安全与工程细节 | 修复 popup HTML 注入风险，补充数据完整性测试 |
| P2 | 作品集文档展示 | 更新 README、补充截图与设计说明 |
| P3 | 交互体验增强 | 前后朝代切换、事件地图双向联动、URL 分享 |
| P4 | 移动端与可访问性 | Pointer Events、ARIA、键盘操作、bottom sheet |
| P5 | 叙事模式 | 从“展示型可视化”升级为“数字叙事作品” |

---

# P0：性能与首屏体验优化

## P0.1 MapView 懒加载

### 背景

`maplibre-gl` 是当前最大依赖，构建后单独 chunk 约 `801 kB`。目前 `App.tsx` 初始渲染即挂载 `MapView`，开场动画期间地图也会参与加载和初始化。

### 建议

将 `MapView` 改为 `React.lazy` + `Suspense`：

```tsx
import { lazy, Suspense } from 'react'

const LazyMapView = lazy(() =>
  import('@/components/MapView').then((m) => ({ default: m.MapView })),
)
```

并考虑在 `IntroAnimation` 完成后再挂载地图：

```tsx
{introDone && (
  <Suspense fallback={<div className="map-loading">加载地图中…</div>}>
    <LazyMapView />
  </Suspense>
)}
```

### 验收标准

- `npm run build` 通过。
- 首屏不因地图初始化导致明显卡顿。
- 地图懒加载 fallback 视觉上不突兀。
- MapLibre chunk 仍可能存在，但不阻塞首屏主交互。

---

## P0.2 DetailPanel 懒加载

### 背景

详情面板依赖 Framer Motion，并包含多个 tab 子组件。虽然 `motion` 已经单独拆包，但详情面板不一定需要首屏立刻加载。

### 建议

将 `DetailPanel` 改为懒加载，仅在需要打开详情时加载。

### 验收标准

- 点击“查看详情”时正常显示面板。
- 初次打开时有轻量 loading 或不明显延迟。
- tab 切换动画保持正常。

---

## P0.3 生产环境 sourcemap 控制

### 背景

`vite.config.ts` 当前配置：

```ts
sourcemap: true
```

公开作品集部署通常不需要默认暴露 sourcemap。

### 建议

改为按环境控制：

```ts
sourcemap: process.env.NODE_ENV !== 'production'
```

或者直接关闭：

```ts
sourcemap: false
```

### 验收标准

- `npm run build` 正常。
- `dist/assets` 中不再默认输出 `.map` 文件，或仅在需要调试时输出。

---

## P0.4 建立性能预算

### 建议目标

- 单个业务 chunk 尽量小于 300 kB minified。
- 第三方大 chunk 必须有说明。
- 图片资源通过 `npm run optimize-images` 处理。
- 每次重大视觉改动后跑一次 Lighthouse 或手动性能检查。

---

# P1：安全与工程细节

## P1.1 Map popup 从 `setHTML` 改为 `setDOMContent`

### 背景

`src/components/MapView.tsx` 中事件弹窗使用字符串拼接：

```ts
popup.setHTML(`...${props.title}...${props.desc}...`)
```

当前数据来自本地文件，风险较低；但从工程规范看，直接拼接 HTML 不够稳妥。

### 建议

使用 DOM API 创建节点，并通过 `textContent` 写入文本：

```ts
const root = document.createElement('div')
root.className = 'event-popup'

const title = document.createElement('div')
title.className = 'event-popup-title'
title.textContent = props.title

root.append(title)
popup.setDOMContent(root)
```

### 验收标准

- 地图事件 popup 视觉不变。
- 不再使用用户/数据字段拼接 HTML。
- `npm run lint` / `npm run test` / `npm run build` 通过。

---

## P1.2 补充地图与数据完整性测试

### 建议测试项

新增或扩展 `src/data/__tests__/dynasties.test.ts`：

- 每个 `dynasty.id` 都有对应 `public/dynasties/{id}.json`。
- 每个 `dynasty.geoFile` 指向的文件存在。
- 每个 GeoJSON 坐标均为 `[longitude, latitude]` 数字对。
- 每个有 `coords` 的历史事件都具备合法经纬度。
- 每个朝代都有 `color`，且为合法 hex。
- 每个朝代至少具备一条事件和一条文化信息。

### 验收标准

- `npm run test` 通过。
- 如果后续新增朝代或改文件名，测试能及时发现遗漏。

---

## P1.3 提取 MapView 纯函数

### 背景

`MapView.tsx` 中混合了 React 生命周期、MapLibre 图层管理、GeoJSON 构造、popup 创建、质心计算等逻辑。

### 建议

优先提取无副作用逻辑：

```txt
src/components/map/
├── mapData.ts        # buildEventFeatures / CAPITAL_COORDS
├── mapPopup.ts       # createEventPopupContent
├── mapGeometry.ts    # computeCentroid
```

### 验收标准

- `computeCentroid` 可单独测试。
- 事件 FeatureCollection 构造可单独测试。
- `MapView.tsx` 行数下降，职责更集中。

---

# P2：作品集文档展示

## P2.1 更新 README 当前状态

### 背景

README 仍写“阶段 1 完成”，但实际代码已经具备阶段 1-3 的大量能力：

- 开场动画
- 墨迹装饰
- 自定义光标
- brush 时间轴
- ErrorBoundary
- Vitest 测试
- 图片优化脚本

### 建议

更新 README：

- 项目状态改为“阶段 1-3 已完成，进入迭代优化阶段”。
- 文档导航加入本文件：`docs/ITERATION.md`。
- 增加质量验证命令。
- 增加核心亮点介绍。
- 增加截图/GIF 占位说明。

### 验收标准

- GitHub 首页能快速说明项目价值。
- README 与实际代码状态一致。

---

## P2.2 增加设计说明文档

建议新增：

```txt
docs/DESIGN_NOTES.md
```

建议内容：

- 为什么使用“河流”作为时间隐喻。
- 为什么采用“数字博物馆 / 古画卷轴”视觉语言。
- 地图为何选择 MapLibre。
- 疆域边界如何简化，局限是什么。
- Canvas 与 React 状态之间的取舍。
- 对性能、动效和可访问性的权衡。

---

## P2.3 增加截图与演示素材

建议准备：

```txt
public/showcase/
├── cover.png
├── map-transition.gif
├── timeline-brush.gif
├── detail-panel.png
└── mobile-preview.png
```

README 中展示：

- 首屏开场截图
- 朝代疆域切换 GIF
- 详情面板截图
- 时间轴 brush 交互 GIF

---

# P3：交互体验增强

## P3.1 增加上一朝 / 下一朝按钮

### 背景

当前用户主要通过时间轴和下拉菜单切换朝代。详情面板内缺少顺序浏览入口。

### 建议

在详情面板 header 或 footer 增加：

- 上一朝
- 下一朝

切换逻辑基于 `DYNASTIES_BY_TIME`。

### 验收标准

- 点击后切换 `selectedDynasty`。
- 地图、粒子、时间轴主题同步更新。
- 第一朝 / 最后一朝有禁用状态或循环切换策略。

---

## P3.2 事件与地图双向联动

### 当前状态

`EventsTab` hover 事件时会设置 `highlightedEventId`，地图事件点半径变化。

### 建议增强

- 点击事件列表项后，地图飞到该事件坐标。
- 点击地图事件点后，详情面板自动打开并切到“大事”tab。
- 事件列表滚动定位到对应事件。
- 当前事件点显示更明显的脉冲动画。

### 实现建议

在 store 增加：

```ts
activeTab: DetailTabKey
focusedEventId: string | null
mapFocusTarget: [number, number] | null
```

或者先做轻量版：只实现“事件列表点击 → 地图飞行”。

---

## P3.3 URL 状态同步

### 目标

支持直接分享某个朝代或 tab：

```txt
/china-history-river/?dynasty=tang&tab=culture
```

### 建议同步状态

- `dynasty`
- `tab`
- 可选：`event`
- 可选：`detail=open|closed`

### 验收标准

- 刷新后恢复对应朝代。
- 分享链接可直接打开目标视图。
- 无效参数回退到默认朝代。

---

# P4：移动端与可访问性

## P4.1 时间轴改用 Pointer Events

### 背景

`Timeline.tsx` 当前主要使用 mouse 事件：

```ts
mousemove / mousedown / mouseup / click
```

移动端触摸体验会受限。

### 建议

统一改为：

```ts
pointerdown
pointermove
pointerup
pointerleave
```

并使用 `setPointerCapture` 提升拖拽稳定性。

### 验收标准

- 桌面鼠标行为不退化。
- 移动端可拖拽 brush。
- 点击朝代仍能正确切换。

---

## P4.2 详情面板移动端 bottom sheet

### 建议

桌面保持右侧卷轴，移动端改成底部抽屉：

- 默认高度 `65vh`
- 展开高度 `85vh`
- 可拖拽关闭
- tab 横向滚动
- 地图保留在上半屏

---

## P4.3 ARIA 与键盘操作增强

建议改进：

- `TopBar` 朝代下拉：增加 `aria-expanded`、`aria-controls`。
- 详情 tab：增加 `role="tablist"`、`role="tab"`、`aria-selected`。
- 关闭按钮支持 `Esc`。
- 朝代选择支持键盘上下移动。
- Canvas 时间轴提供替代的朝代列表导航。

---

# P5：内容可信度与历史表达

## P5.1 疆域示意免责声明

### 建议文案

在地图角落或疆域 tab 明确展示：

> 本图为历史疆域简化示意，用于展示动态变化趋势，不代表精确边界或现代行政、主权范围。

### 验收标准

- 地图或详情面板中可见。
- README / 文档中也有说明。

---

## P5.2 每朝代来源清单

建议在 `Dynasty` 类型中扩展：

```ts
sources?: {
  title: string
  url?: string
  type: '古籍' | '地图集' | '百科' | '论文' | '数据集'
}[]
```

并在详情 footer 或“概览”tab 中展示。

---

## P5.3 区分“史实 / 评价 / 传说 / 争议”

尤其是早期朝代内容，可给事件或叙述增加标签：

- 文献记载
- 考古证据
- 传统说法
- 学界争议

这能显著提升内容可信度。

---

## P5.4 增加制度演变维度

建议新增一个横跨朝代的专题视角：

- 分封制
- 郡县制
- 察举制
- 九品中正制
- 三省六部
- 科举制
- 行省制
- 内阁制
- 军机处

这可以让项目从“朝代陈列”提升到“历史结构变化”的表达。

---

# P6：叙事模式

## P6.1 自动巡游模式

### 目标

增加“开始巡游”按钮，让用户无需主动探索，也能体验完整历史叙事。

### 建议流程

1. 夏商周：文明源流与礼制形成。
2. 秦汉：大一统框架建立。
3. 三国两晋南北朝：分裂、迁徙与融合。
4. 隋唐：制度整合与开放盛世。
5. 宋元明清：经济、技术、疆域与近世转折。

### 自动联动

- 自动切换朝代。
- 地图 flyTo 当前疆域中心。
- 时间轴同步高亮。
- 详情面板显示简短旁白。
- 事件点依次高亮。
- 可暂停 / 继续 / 跳过。

---

## P6.2 叙事旁白数据结构

建议新增：

```txt
src/data/storyline.ts
```

示例：

```ts
export interface StoryStep {
  id: string
  dynastyId: string
  title: string
  narration: string
  focus?: {
    type: 'territory' | 'event' | 'culture' | 'emperor'
    eventId?: string
  }
  durationMs: number
}
```

---

# 4. 推荐执行顺序

如果按最稳妥路线推进，建议：

```txt
第一轮：P0 + P1
  - MapView 懒加载
  - DetailPanel 懒加载
  - 关闭或控制生产 sourcemap
  - popup 改 setDOMContent
  - 补地图/GeoJSON 数据完整性测试

第二轮：P2
  - 更新 README
  - 补截图/GIF
  - 新增 DESIGN_NOTES.md

第三轮：P3 + P4
  - 上一朝/下一朝
  - 事件地图双向联动
  - URL 状态同步
  - Pointer Events
  - ARIA 增强

第四轮：P5 + P6
  - 疆域示意说明
  - 来源清单
  - 争议标签
  - 自动巡游叙事模式
```

---

# 5. 核心任务完成状态

已完成：

1. ✅ **MapView 懒加载，降低首屏包体积压力。**
2. ✅ **关闭生产 sourcemap 或按环境控制。**
3. ✅ **Map popup 从 `setHTML` 改为 `setDOMContent`。**
4. ✅ **README 更新到当前阶段 1-3 完成状态。**
5. ✅ **补充 GeoJSON / dynasty 数据完整性测试。**
6. ✅ **详情面板增加上一朝 / 下一朝。**
7. ✅ **Canvas 时间轴改用 Pointer Events 支持移动端。**
8. ✅ **设计并落地自动巡游叙事模式基础版。**
9. ✅ **URL 状态同步与分享链接。**
10. ✅ **事件列表点击聚焦地图事件点。**
11. ✅ **ARIA 与键盘操作增强。**
12. ✅ **疆域示意免责声明与主要来源清单入口。**
13. ✅ **工程清理：删除冗余 `all.json`、旧版下载脚本与废弃 hooks，补充站点 favicon。**
14. ✅ **迭代分支清理合并：将 `iteration/pre-launch-cleanup` 合并回 `main` 并推送。**

后续收尾建议：

1. **补齐 `public/showcase/` 截图与 GIF。**
2. **把移动端详情面板改成 bottom sheet。**
3. **逐朝代补充精细化 `sources` URL。**
4. **为早期朝代补“文献记载 / 考古证据 / 传统说法 / 学界争议”标签。**
5. **增强自动巡游：事件级聚焦、旁白节奏、配乐。**
6. **建立持续部署：合并 main 后自动构建并推送 GitHub Pages。**

---

# 6. 每次迭代检查清单

每完成一个任务，至少检查：

```bash
npm run type-check
npm run test
npm run lint
npm run build
```

涉及视觉或交互时，额外手动检查：

- 朝代切换是否正常。
- 地图疆域与都城标记是否正常。
- 详情面板 tab 是否正常。
- 时间轴 hover / click / brush 是否正常。
- `prefers-reduced-motion` 下是否无明显问题。
- 移动端窄屏是否可用。

---

# 7. 结论

当前项目已经完成从“核心可运行”到“可展示、可分享、可叙事”的主要迭代：

> 更快打开、更好讲故事、更可信、更容易分享、更适合移动端。

下一阶段不再建议继续大幅堆功能，优先做 **视觉回归 + 截图/GIF 展示素材 + 移动端 bottom sheet + 来源精细化**。这样更适合作品集交付与线上展示。
