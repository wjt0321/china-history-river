# 迭代路线图 — china-history-river

> 基于 2026-06 项目审查生成。
> 阶段 1-3 已完成，阶段 4 待执行。

---

## 当前状态总览

| 维度 | 评分 | 说明 |
|---|---|---|
| 视觉完成度 | ⭐⭐⭐⭐⭐ | 已达到「数字博物馆 / 古画卷轴」定位 |
| 数据完整度 | ⭐⭐⭐⭐ | 14 朝代 12 维度，部分朝代事件偏少 |
| 代码架构 | ⭐⭐⭐ | 巨型组件、缺 Hook 抽象 |
| 工程质量 | ⭐⭐ | 零测试、无错误边界、TS 检查宽松 |
| 可维护性 | ⭐⭐⭐ | 文件过大、CSS/JS 混用 |
| 性能 | ⭐⭐⭐⭐ | Canvas 持续渲染可优化 |

---

## 迭代优先级原则

1. **先固基，后加花** — 测试 + 错误处理 > 视觉打磨 > 新功能
2. **增量改动** — 每个子任务可独立完成和验证
3. **不破坏现有功能** — 重构时保持面级行为不变
4. **每完成一个 tick 可 commit**

---

## 阶段 4A — 工程质量加固（🔴 高优先，预计 2-3 天）

> 目标：让面试官看到的不只是好看的 UI，更是扎实的工程功底。

### 4A.1 添加测试框架

```
[ ] 安装 vitest + jsdom + @testing-library/react
[ ] 创建 src/utils/__tests__/format.test.ts
      - formatYear：公元前/公元、short/full 风格
[ ] 创建 src/utils/__tests__/color.test.ts
      - hexToRgba：6位hex、3位hex、边界 alpha
      - adjustBrightness：正值变亮、负值变暗、cap 在 0-255
[ ] 创建 src/stores/__tests__/appStore.test.ts
      - setSelected：切换朝代后 isDetailOpen 应为 true
      - hoveredDynastyId：hover 预览态正确
      - timeRange：resetTimeRange 恢复全范围
      - soundEnabled：开关切换
[ ] 创建 src/data/__tests__/dynasties.test.ts
      - 每个朝代必须有 id / name / startYear / endYear / geoFile
      - startYear < endYear
      - events 中每个有坐标的事件必须同时有 coords[0] 和 coords[1]
      - color 必须是合法 hex
[ ] 添加 npm run test 脚本到 package.json
```

### 4A.2 添加错误边界

```
[ ] 创建 src/components/ErrorBoundary.tsx
      - Class Component（React 错误边界必须是 class）
      - hasError state + getDerivedStateFromError
      - fallback 接受 ReactNode prop
      - 显示「出错了」+ 错误信息 + 重新加载按钮
[ ] 在 App.tsx 中包裹 MapView / Timeline / DetailPanel
[ ] 错误边界 fallback 样式参考 global.css 的 glass-panel
```

### 4A.3 开启 TypeScript 严格检查

```
[ ] tsconfig.json 中设置：
      - noUnusedLocals: true
      - noUnusedParameters: true
[ ] 运行 npm run type-check，逐个修复警告
[ ] 未使用的变量加 _ 前缀或删除
[ ] 未使用的参数加 _ 前缀
```

### 4A.4 提取自定义 Hooks

```
[ ] 创建 src/hooks/useCanvasAnimation.ts
      - 封装 rAF 循环 + resize + visibilitychange
      - 接受 canvasRef + draw(ctx, dt) 回调
      - 返回 { start, stop }
      - Timeline.tsx 改用此 Hook

[ ] 创建 src/hooks/useResizeObserver.ts
      - 封装 ResizeObserver 监听容器尺寸
      - 返回 width / height / dpr
      - Timeline.tsx 和 AtmosphereParticles.tsx 共用

[ ] 创建 src/hooks/useMapTerritory.ts
      - 封装王朝疆域加载 + 缓存 + loading/error 状态
      - 返回 { isLoading, error }
      - MapView.tsx 中的 loadDynasty 改为调用此 Hook
```

### 4A.5 GeoJSON 加载状态

```
[ ] MapView.tsx loadDynasty 增加 loading / error 状态
[ ] Loading：地图左下角显示半透明「加载疆域数据…」提示
[ ] Error：地图左下角显示「疆域数据加载失败」+ 朝代名
[ ] 超时处理：fetch 10s 超时
```

---

## 阶段 4B — 组件拆分与代码卫生（🟡 中优先，预计 2-3 天）

> 目标：每个文件不超过 300 行，职责单一，方便测试和维护。

### 4B.1 拆分 DetailPanel（584 行 → 6 文件）

```
[ ] 创建 src/components/detail/
[ ] OverviewTab.tsx    — 概览（简介 + 兴衰原因 + 史家评价）
[ ] EmperorsTab.tsx    — 帝王长廊（卡片展开/折叠）
[ ] EventsTab.tsx      — 大事年表（含地图联动 hover/click）
[ ] CultureTab.tsx     — 文化遗产（文学/艺术/科技网格）
[ ] TerritoryTab.tsx   — 疆域变化 + 数据概览 + 经济数据
[ ] DataBar.tsx        — 数据对比条（可复用组件）
```

### 4B.2 拆分 Timeline（520 行 → 3 文件）

```
[ ] 创建 src/components/timeline/
[ ] RiverCanvas.tsx       — Canvas 主河流绘制（正弦曲线 + 渐变 + 脉冲）
[ ] BrushController.tsx   — Brush 缩放条（拖拽把手 + 平移窗口 + 点击）
[ ] TimelineSegments.ts   — 河段数据计算（纯函数，可测试）
[ ] Timeline.tsx          — 组装层（状态 + useCanvasAnimation）
```

### 4B.3 拆分 MapView（404 行 → 4 文件）

```
[ ] 创建 src/components/map/
[ ] MapCore.tsx         — 地图初始化 + 容器（封装 useEffect 创建/销毁）
[ ] DynastyLayer.tsx    — 疆域 GeoJSON 层（加载 + fade 过渡 + 多层光晕）
[ ] CapitalMarker.tsx   — 都城朱印标记
[ ] EventMarker.tsx     — 事件圆点 + 脉冲 + Popup 交互
[ ] MapView.tsx         — 组装层
```

### 4B.4 清理杂项

```
[ ] 将 public/images/dl-*.mjs 移到 scripts/downloads/ 目录
[ ] 检查 public/ 下是否有未使用的图片，移除或用 LQIP 替代
[ ] 统一 styles 导入方式：所有组件级 CSS 改为 CSS Modules 或集中管理
[ ] CSS 变量注入统一：优先在 global.css 中定义，减少 JS style.setProperty
```

### 4B.5 ESLint 加强

```
[ ] 安装 eslint-plugin-import
[ ] 规则：import 分组排序（builtin → external → internal → parent → sibling）
[ ] 规则：禁止循环依赖
[ ] 补充 .eslintignore（dist/build 目录）
```

---

## 阶段 4C — 性能优化（🟢 可选，预计 1-2 天）

> 目标：降低不必要的计算，优化首屏和切换体验。

### 4C.1 Canvas 按需渲染

```
[ ] Timeline Canvas：仅在 timeRange / selectedDynastyId / hoveredDynastyId
      变化时才重绘（dirty flag 模式）
[ ] AtmosphereParticles Canvas：当前没有互动阶段时降低帧率
      （从 60fps 降到 30fps 或更低）
```

### 4C.2 包体积优化

```
[ ] 安装 rollup-plugin-visualizer
[ ] 分析 dist 产物，定位大依赖
[ ] MapLibre GL 考虑按需加载（仅地图组件 mount 时动态 import）
[ ] 检查是否有可移除的未使用依赖
```

### 4C.3 首屏优化

```
[ ] index.html 添加 preload 提示（Noto Serif SC 字体）
[ ] 入场动画期间的背景色从 JS 抽到 HTML inline，避免闪白
[ ] 考虑 base64 内联小尺寸 PNG（如印章图标）
```

### 4C.4 动画偏好适配

```
[ ] prefers-reduced-motion 下：完全跳过 AtmosphereParticles 初始化
[ ] prefers-reduced-motion 下：Timeline Canvas 降为静态 SVG 渲染
[ ] prefers-reduced-motion 下：map flyTo duration 设为 0
```

---

## 阶段 4D — 功能增强（🟢 锦上添花，时间不限）

> 需要先确认是否值得投入。

### 4D.1 滚动驱动叙事（原阶段 4 计划）

```
[ ] Intersection Observer 监听滚动位置，映射到时间轴进度
[ ] 滚动时自动切换朝代、地图飞行、粒子过渡
[ ] 参考：The Fallen of World War II (NZZ)
[ ] 可切换：手动模式 / 叙事自动播放模式
```

### 4D.2 配乐

```
[ ] 基于 Web Audio API 的简单古风电子序列
[ ] 朝代切换时音色/节奏变化
[ ] 静音按钮已存在（soundEnabled），扩展即可
```

### 4D.3 中英双语

```
[ ] 创建 src/i18n/zh.ts + en.ts
[ ] 朝代名/事件标题/UI 文案全部抽为 key
[ ] TopBar 增加语言切换按钮
[ ] 注意：古代专有名词（如「尚书·禹贡」）保留原文
```

### 4D.4 导出功能

```
[ ] 当前视图导出为 PNG（使用 canvas.toBlob 或 html2canvas）
[ ] 时间轴 + 地图并列 SVG 导出
[ ] 数据导出为 CSV
```

---

## 执行建议

### 优先级顺序

```
阶段 4A（工程质量加固）  ← 立即开始，对其他迭代零影响
    │
阶段 4B（组件拆分）      ← 4A 完成后开始，为后续铺路
    │
阶段 4C（性能优化）      ← 看包体积分析结果决定是否全做
    │
阶段 4D（功能增强）      ← 有充足时间时挑感兴趣的做
```

### 每次迭代的检查点

- [ ] `npm run type-check` 通过
- [ ] `npm run lint` 通过
- [ ] `npm run test` 通过（4A 之后）
- [ ] `npm run build` 成功
- [ ] `npm run dev` 视觉回归（手动验证）

### Git 提交粒度

每个 `[ ]` tick 一个 commit，信息格式：
```
feat(tests): add formatYear / hexToRgba unit tests
refactor(hooks): extract useCanvasAnimation from Timeline
fix(ts): enable noUnusedLocals and fix 14 warnings
```

---

## 已知 Bug（待修复）

### Bug #1 — MapView.tsx loadDynasty 函数中 fetch 失败日志位置错误
- **位置**：`src/components/MapView.tsx` 约 L160 附近
- **现象**：`console.warn` 语句后紧接着 `.trim().slice(0, 2)`，这不是 fetch 回调的一部分，是代码合并冲突或编辑错误
- **影响**：可能在非 strict 模式下静默吞掉错误；fetch 返回非 ok 时行为不可预测
- **建议**：在 4A.1 测试覆盖前手动修复

---

## 附录：当前文件大小一览

| 文件 | 行数 | 建议上限 | 状态 |
|---|---|---|---|
| DetailPanel.tsx | 584 | 150 | 🔴 需拆分 |
| Timeline.tsx | 520 | 150 | 🔴 需拆分 |
| MapView.tsx | 404 | 200 | 🟡 需拆分 |
| AtmosphereParticles.tsx | 368 | 200 | 🟡 可优化 |
| TopBar.tsx | 115 | 150 | 🟢 合理 |
| IntroAnimation.tsx | 159 | 200 | 🟢 合理 |
| appStore.ts | 68 | 100 | 🟢 合理 |
| dynasty.ts (types) | 121 | 150 | 🟢 合理 |
| global.css | 205 | 300 | 🟢 合理 |

---

**文档结束。随时可选取某个 tick 开始迭代。**
