# china-history-river

中华 5000 年历史长河 — 交互式数据可视化作品集案例

> 当前视觉版本：**数字博物馆 / 古画卷轴** 风格  
> 以“河流时间轴 + 动态疆域 + 卷轴详情”为核心交互，14 个朝代完整覆盖。  
> 当前工程状态：**阶段 1-3 已完成，核心迭代路线 P0-P6 已基本落地，进入视觉回归与素材补齐阶段**。

---

## 在线演示

GitHub Pages：

- https://wjt0321.github.io/china-history-river/

---

## 项目亮点

- **历史长河时间轴**：Canvas 2D 手绘河流式时间轴，支持朝代 hover、点击切换与 brush 缩放。
- **动态疆域地图**：MapLibre GL 暗色底图 + 朝代 GeoJSON 疆域图层 + 都城朱印标记 + 大事事件点。
- **卷轴式详情面板**：Framer Motion 实现右侧卷轴动效，包含概览 / 帝王 / 大事 / 文化 / 疆域五个 tab。
- **沉浸式氛围系统**：按朝代主题切换萤火、尘埃、花瓣、落雪粒子效果。
- **视觉统一**：深空黑背景、降饱和文物色、宣纸黄点缀，强调“数字博物馆”观感。
- **工程加固**：TypeScript、ESLint、Vitest、ErrorBoundary、懒加载、URL 状态同步、数据完整性测试已接入。

---

## 项目状态

✅ **阶段 1-3 已完成** — 核心可运行、内容扩展、视觉打磨均已落地。  
✅ **P0-P6 核心迭代已基本完成** — 性能、安全、文档、交互、移动端、可信度与叙事模式均已完成基础版。  
🔄 **当前收尾重点** — 视觉回归、截图/GIF 展示素材、移动端 bottom sheet 与逐朝代来源精细化。

已完成能力：

- [x] 14 朝代数据 + GeoJSON 疆域文件
- [x] 河流式 Canvas 时间轴（正弦曲线、渐变、脉冲高亮、brush 缩放）
- [x] MapLibre 动态疆域地图（疆域填充、多层光晕、都城标记、事件点）
- [x] 卷轴式详情面板（概览 / 帝王 / 大事 / 文化 / 疆域）
- [x] 氛围粒子系统（萤火 / 尘埃 / 花瓣 / 落雪）
- [x] 开场动画、墨迹装饰、自定义光标
- [x] ErrorBoundary 错误边界
- [x] Vitest 单元测试与数据完整性测试
- [x] MapView / DetailPanel 懒加载优化
- [x] popup 安全改造：使用 `setDOMContent` 替代 HTML 字符串拼接
- [x] URL 状态同步与分享链接（`?dynasty=tang&detail=open`）
- [x] 详情面板上一朝 / 下一朝导航
- [x] 事件列表点击定位地图事件点
- [x] Timeline Pointer Events 移动端触摸优化
- [x] ARIA 与键盘操作增强
- [x] 疆域示意免责声明
- [x] 主要来源清单结构与展示入口
- [x] 自动巡游叙事模式基础版
- [x] PD 图片素材与来源清单

待收尾方向：

- [ ] README 截图 / GIF 展示素材补齐
- [ ] 移动端 bottom sheet 详情面板
- [ ] 逐朝代精细化 `sources` URL 与争议标签
- [ ] 自动巡游叙事模式的事件级聚焦与配乐

---

## 技术栈

- React 18 + Vite 5 + TypeScript 5
- MapLibre GL 4（地图 + GeoJSON 疆域）
- Zustand 5（全局状态）
- Framer Motion 11（面板与入场动画）
- Canvas 2D（河流时间轴 + 氛围粒子）
- Vitest + React Testing Library（测试基础）
- 原生 CSS + CSS 变量（无 Tailwind / CSS-in-JS）

---

## 文档导航

- [需求文档](./docs/REQUIREMENTS.md) — 项目定位、视觉风格、内容范围、阶段规划
- [决策记录](./docs/DECISIONS.md) — 项目关键技术与设计决策
- [内容规格](./docs/CONTENT_SPEC.md) — 每个朝代需填充的内容维度
- [设计说明](./docs/DESIGN_NOTES.md) — 视觉隐喻、地图策略、数据边界与工程取舍
- [迭代建议与路线图](./docs/ITERATION.md) — 项目审查结论、优先级与后续任务

---

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run type-check     # TypeScript 检查
npm run test           # Vitest 测试
npm run lint           # ESLint 检查
npm run build          # 生产构建
npm run preview        # 预览生产构建
npm run optimize-images # 图片优化脚本
```

推荐每次迭代后至少运行：

```bash
npm run type-check
npm run test
npm run lint
npm run build
```

---

## 目录结构

```txt
china-history-river/
├── docs/                  # 项目文档（需求 / 决策 / 内容规格 / 设计说明 / 迭代路线图）
├── public/
│   ├── dynasties/         # 14 个朝代 GeoJSON 疆域文件
│   ├── geo-data/          # 基础地理数据
│   ├── images/            # 人物 + 场景图片与 SOURCES.md
│   └── showcase/          # 作品集截图/GIF 占位目录
├── scripts/               # 数据、图片与优化脚本
├── src/
│   ├── components/        # React 组件
│   ├── data/              # 朝代 TS 数据
│   ├── hooks/             # 自定义 hooks
│   ├── stores/            # Zustand store
│   ├── styles/            # 全局样式与地图样式
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 展示素材

建议后续补充以下文件到 [`public/showcase/`](./public/showcase/)：

- `cover.png` — 项目首屏封面
- `map-transition.gif` — 朝代疆域切换动效
- `timeline-brush.gif` — 时间轴 brush 交互
- `detail-panel.png` — 卷轴详情面板
- `mobile-preview.png` — 移动端预览

当前目录已提供占位说明，图片/GIF 可在后续视觉回归时补齐。

---

## 数据与版权说明

- 本项目**代码部分**采用 [MIT License](./LICENSE) 开源。
- 历史人物/场景图片主要来自 **Wikimedia Commons Public Domain** 资源，来源清单见 [`public/images/SOURCES.md`](./public/images/SOURCES.md)。
- 历史地图、地理数据与文本资料引用维基百科、古籍、谭其骧《中国历史地图集》、CHGIS 等公开资料。
- 疆域图为历史疆域**简化示意**，用于展示动态变化趋势，不代表精确边界或现代行政、主权范围。

---

## 当前质量基线

最近一次迭代验证：

```txt
npm run type-check  ✅
npm run test        ✅ 4 files / 42 tests passed
npm run lint        ✅
npm run build       ✅
```

已知构建提示：`maplibre-gl` 第三方 chunk 体积较大，但已通过懒加载将地图模块从主入口路径中拆出。
