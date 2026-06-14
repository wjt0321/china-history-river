# AGENTS.md — china-history-river

> 本文档供 AI 编程助手阅读。如果你刚接触本项目，请从头到尾读完此文件再动手改代码。
> 项目语言：中文（zh-CN）。代码注释、文档、UI 文案均以中文为主。

---

## 项目概述

**中华 5000 年历史长河**（`china-history-river`）是一件以"中国历代疆域动态变化"为主线的交互式数据可视化网页作品，用于个人作品集展示。

核心交互：
- **河流时间轴**（底部 Canvas）：14 个朝代如河段横贯屏幕，点击切换。
- **动态疆域地图**（MapLibre GL）：暗色地形底图上叠加朝代 GeoJSON 疆域，切换时 900ms 颜色溶解过渡。
- **卷轴式详情面板**（右侧 Framer Motion）：古画卷轴隐喻，含 5 个 Tab（概览 / 帝王 / 大事 / 文化 / 疆域）。
- **氛围粒子系统**（全屏 Canvas）：按朝代切换四种主题（萤火 / 尘埃 / 花瓣 / 落雪）。

视觉定位：**数字博物馆 / 古画卷轴**。深空黑背景 + 降饱和文物色系 + 宣纸黄点缀。拒绝卡通/荧光/高饱和。

---

## 技术栈

| 层级 | 技术 | 说明 |
|---|---|---|
| 构建工具 | Vite 5 + `@vitejs/plugin-react` | 开发服务器端口 5173，ES2022 目标 |
| 框架 | React 18（StrictMode）+ TypeScript 5.6 | JSX Transform: `react-jsx` |
| 地图 | MapLibre GL 4.7 | 开源 fork，无需 Token，支持 GeoJSON 动态图层 |
| 状态管理 | Zustand 5 | 轻量全局状态，存储当前选中朝代、hover、面板开关 |
| 动画 | Framer Motion 11 | 详情面板滑入/Tab 切换/元素交错入场 |
| 可视化 | D3 7 + d3-geo + topojson-client | 当前主要用于类型定义与地理计算预留 |
| 样式 | 纯 CSS + CSS 变量 | 无 Tailwind / 无 CSS-in-JS。组件级 CSS 文件与全局 CSS 变量共存 |
| 粒子/时间轴 | Canvas 2D 手写 | 不依赖第三方库，逐帧 `requestAnimationFrame` |
| 测试 | Vitest + React Testing Library | 单元测试 + 数据完整性校验 |

---

## 目录结构

```
china-history-river/
├── docs/                          # 项目文档（ REQUIREMENTS.md / DECISIONS.md / CONTENT_SPEC.md / EXAMPLE_QIN.md ）
├── public/
│   ├── dynasties/                 # 14 个朝代的 GeoJSON 疆域文件（{id}.json）
│   ├── geo-data/                  # 中国基础地理数据（china.json 及各省边界）
│   └── images/
│       ├── figures/               # 人物图（Public Domain，Wikimedia Commons 来源）
│       ├── scenes/                # 场景图（Public Domain）
│       └── SOURCES.md             # 图片素材来源清单
├── scripts/                       # Node/TS 辅助脚本（直接 tsx 执行）
│   ├── download-pd-images.ts      # 从 Wikimedia Commons 下载 PD 图片
│   ├── generate-territories.ts    # 生成 14 朝代简化 GeoJSON
│   └── generate-figures-scenes.ts # 生成 SVG 人物牌位与场景线描
├── src/
│   ├── components/                # React 组件（每个组件 = .tsx + .css，部分含 detail/ 子目录）
│   │   ├── MapView.tsx            # 地图主组件（MapLibre 初始化 + 疆域/都城/事件图层管理）
│   │   ├── Timeline.tsx           # 河流时间轴（Canvas 2D 手绘，正弦曲线 + 渐变 + 脉冲高亮 + brush 缩放）
│   │   ├── DetailPanel.tsx        # 卷轴详情面板（5 Tab：概览/帝王/大事/文化/疆域）
│   │   ├── TopBar.tsx             # 顶部导航栏（朝代印章 + 下拉选择 + 详情开关 + 巡游入口）
│   │   ├── AtmosphereParticles.tsx# 全屏氛围粒子（4 主题，对象池管理）
│   │   ├── StoryTour.tsx          # 自动巡游叙事模式（旁白 + 自动切换朝代）
│   │   ├── IntroAnimation.tsx     # 开场动画（黑屏 → 逐朝代亮起 → 印章落下）
│   │   ├── InkDecorations.tsx     # 印章 / 墨迹 SVG 装饰层
│   │   ├── CustomCursor.tsx       # 朝代色光晕自定义光标（触屏自动禁用）
│   │   └── ErrorBoundary.tsx      # 错误边界，对地图/面板分区容错
│   ├── data/                      # 朝代数据（TypeScript 模块，非 JSON）
│   │   ├── dynasties.ts           # 统一导出 14 朝代数组
│   │   ├── dynasties-part1.ts ~ part4.ts
│   │   ├── dynasties-ming.ts
│   │   ├── dynasties-qing.ts
│   │   └── sources.ts             # 史料来源清单元数据
│   ├── hooks/                     # 自定义 hooks
│   │   ├── useMapTerritory.ts     # MapLibre 疆域/事件图层封装
│   │   └── useUrlStateSync.ts     # URL 深链同步（?d=<id>）
│   ├── stores/
│   │   └── appStore.ts            # Zustand store：朝代/hover/面板/时间范围/高亮事件等
│   ├── styles/
│   │   ├── global.css             # CSS 变量、全局滚动条、玻璃拟态基类、响应式断点
│   │   └── mapStyle.ts            # MapLibre StyleSpecification（CartoDB dark_nolabels 底图）
│   ├── types/
│   │   └── dynasty.ts             # Dynasty 类型定义（12 维度内容接口）
│   ├── utils/                     # 工具函数（color / format / motion / sound）
│   ├── App.tsx                    # 根组件：注入朝代主题色 CSS 变量，组合五大组件
│   ├── App.css                    # 根布局（fixed 全屏 + 背景噪点纹理 + 暗角 vignette）
│   └── main.tsx                   # React 入口：createRoot + StrictMode + 导入全局样式
├── index.html                     # HTML 入口，lang="zh-CN"
├── package.json
├── tsconfig.json                  # ES2022 / bundler moduleResolution / paths: {"@/*": ["src/*"]}
└── vite.config.ts                 # alias @ → ./src，manualChunks（maplibre/d3/motion）
```

---

## 构建与开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 5173，自动打开浏览器）
npm run dev

# 类型检查 + 生产构建（输出到 dist/）
npm run build

# 预览生产构建
npm run preview

# 仅类型检查（不emit）
npm run type-check

# ESLint 检查
npm run lint

# 单元测试与数据完整性校验
npm run test
```

**测试策略**：项目已配置 Vitest + React Testing Library，覆盖工具函数、store、数据完整性、ErrorBoundary、URL 同步 hook。每次合并前必须 `npm run test` 全部通过。

---

## 代码组织与架构

### 1. 组件职责边界

- **MapView** 是唯一接触 MapLibre GL 的组件。所有地图图层（疆域填充、发光边线、都城标记、事件点）都在此组件内通过 `useRef` + `useEffect` 管理，避免 React 重渲染干扰 WebGL。
- **Timeline** 与 **AtmosphereParticles** 使用原生 Canvas 2D，同样通过 `useRef` 直接操作 DOM。它们从 Zustand `getState()` 读取状态，不订阅 React render cycle。
- **DetailPanel** 是重度使用 Framer Motion 的 React 组件，负责所有 UI 面板动画。
- **StoryTour** 负责自动巡游叙事：按时间顺序切换朝代、朗读旁白、同步地图与时间轴。
- **ErrorBoundary** 对 MapView 与详情面板分区容错，避免单点错误导致白屏。
- **useUrlStateSync** 在 `App.tsx` 挂载，保持 URL `?d=<id>` 与当前选中朝代双向同步。
- **App.tsx** 负责"主题色注入"——将当前朝代的 `color` 写入 CSS 变量 `--dynasty-color` 及其衍生变量，实现全站色调联动。

### 2. 状态管理

Zustand store（`src/stores/appStore.ts`）核心状态：
- `selectedDynastyId` / `selectedDynasty`：当前选中朝代（切换时自动打开详情面板）。
- `hoveredDynastyId`：时间轴 hover 预览。
- `isDetailOpen`：详情面板展开/收起。
- `timeRange`：时间轴 brush 当前显示的时间窗口。
- `highlightedEventId`：大事 Tab hover/点击时高亮的事件 id，驱动地图事件点半径变化。
- `isStoryTourOpen` / `storyTourPaused`：巡游叙事开关与暂停状态。

所有朝代数据在内存中来自 `src/data/dynasties.ts` 的静态 TS 数组，不通过 API 获取。

### 3. 数据模型

每个朝代遵循 `src/types/dynasty.ts` 的 `Dynasty` 接口，共 **12 维度**：
1. 基本属性（id/name/pinyin/startYear/endYear/capital/founder/lastRuler）
2. `oneLineTag`：一句话定位
3. `summary`：简介（150-250 字）
4. `riseReasons` / `fallReasons`：因何而兴/亡（3-5 条，含 source）
5. `emperors`：帝王长廊（3-12 位，含 reign/years/role/achievements/faults）
6. `events`：大事年表（8-17 个，按 year 排序）
7. `economy`：经济数据（territory/population/currency/roads/others）
8. `battles`：关键战役（5-9 个）
9. `culture`：文化遗产（literature/art/technology/engineering/philosophy/institutions）
10. `foreignRelations`：对外关系（北/西/南/东）
11. `territoryEvolution`：疆域变化节点
12. `evaluations`：史家评价（引用原文）

附加字段：`color`（朝代专属色）、`geoFile`（GeoJSON 文件名，当前均为 `{id}.json`）、`figureIds` / `sceneIds`（预留）。

### 4. 样式系统

全局 CSS 变量定义在 `src/styles/global.css` 的 `:root` 中：
- 背景色阶：`--color-bg-deep` / `--color-bg` / `--color-bg-elev`
- 主色（青金蓝）：`--color-primary` 系列
- 强调色（朱砂红）：`--color-accent` 系列
- 古风点缀：`--color-ink` / `--color-paper`
- 动态主题色：`--dynasty-color` / `--dynasty-color-dim` / `--dynasty-color-bright` / `--dynasty-glow`（由 App.tsx 在朝代切换时注入）

常用工具类：
- `.glass-panel`：玻璃拟态面板（半透明 + backdrop-filter blur）
- `.gradient-text`：渐变文字（用于朝代名称标题）

组件样式文件命名：`ComponentName.css`，与 `.tsx` 同目录。CSS 选择器使用 BEM-like 命名（如 `.detail-panel`、`.detail-header`、`.detail-name`）。

---

## 开发惯例

### TypeScript
- `strict: true`，但 `noUnusedLocals` 和 `noUnusedParameters` 设为 `false`（避免开发阶段过度报错）。
- 路径别名 `@/` 映射到 `src/`。所有 import 使用 `@/components/X`、`@/data/dynasties`、`@/stores/appStore`。
- 允许 `.ts` 扩展名 import（`allowImportingTsExtensions: true`）。

### 颜色规范
- **每个朝代必须有 `color` 字段**。颜色必须是"博物馆昏暗灯光下出土文物"的降饱和氧化色调。
- 禁止：纯黑/纯白/高饱和荧光色。
- 示例：秦 `#8B3535`（沉朱砂）、唐 `#B8943A`（褪金）、夏 `#8B6B4A`（古铜锈）。

### 图片素材
- **所有图片必须为 Public Domain（公有领域）**，来源 Wikimedia Commons。
- 下载脚本 `scripts/download-pd-images.ts` 使用 `undici` + 本地代理 `127.0.0.1:10808` 访问 Commons API。
- 下载后自动生成 `public/images/SOURCES.md` 记录文件来源与授权信息。
- 人物图使用 `object-fit: contain` + `max-height`，避免裁头切边（古画展柜陈列感）。

### 地图数据
- 底图瓦片：`CartoDB dark_nolabels`，栅格图层，`raster-opacity: 0.55`，`raster-saturation: -0.6`。
- 朝代疆域：`public/dynasties/{id}.json`，手工简化多边形（8-15 顶点），WGS84 坐标系。
- 都城坐标：硬编码在 `MapView.tsx` 的 `CAPITAL_COORDS` 对象中。

---

## 脚本使用说明

`scripts/` 下的脚本可直接用 `npx tsx scripts/xxx.ts` 执行（需安装 `tsx`，当前未列入 devDependencies，如需要请临时安装）。

| 脚本 | 用途 | 输出 |
|---|---|---|
| `generate-territories.ts` | 根据硬编码的 14 朝代顶点生成 GeoJSON | `public/dynasties/*.json` |
| `download-pd-images.ts` | 从 Wikimedia Commons 搜索并下载 PD 图片 | `public/images/figures/*.jpg`、`public/images/scenes/*.jpg` + `SOURCES.md` |
| `generate-figures-scenes.ts` | 生成 SVG 人物牌位与场景线描 | `public/figures/*.svg`、`public/scenes/*.svg` + 索引 JSON |

**注意**：`download-pd-images.ts` 依赖本地 HTTP 代理 `127.0.0.1:10808`（V2RayN）。如果代理未启动，脚本会连接失败。非中国大陆环境可去掉 `ProxyAgent` 逻辑。

---

## 阶段规划（当前进度）

- **阶段 1（已完成）**：核心可运行。14 朝代数据 + 地图 + 时间轴 + 详情面板 + 粒子 + 都城标记 + PD 图片。
- **阶段 2（已完成）**：内容深度。皇帝下钻、事件地图标注、数据卡片、详情面板多 Tab 完整内容。
- **阶段 3（已完成）**：视觉打磨与工程加固。入场动画、SVG 印章/墨迹点缀、自定义光标、时间轴 brush 缩放、Vitest 测试、ESLint、ErrorBoundary、URL 深链同步。
- **阶段 4（已完成）**：叙事模式。自动巡游（StoryTour）、事件列表点击聚焦地图、史料来源清单。

**当前代码已完成阶段 1~4**。关键新增组件与能力：
- `src/components/IntroAnimation.tsx`：黑屏 → 逐朝代亮起 → 印章落下 → 进入主界面。
- `src/components/InkDecorations.tsx`：印章 / 墨迹 SVG 装饰层。
- `src/components/CustomCursor.tsx`：朝代色光晕自定义光标（触屏自动禁用）。
- `src/components/Timeline.tsx`：底部 brush 条支持拖拽平移/缩放/重置，已改用 Pointer Events。
- `src/components/StoryTour.tsx`：自动巡游叙事模式。
- `src/components/ErrorBoundary.tsx`：分区错误边界。
- `src/hooks/useUrlStateSync.ts`：URL `?d=<id>` 深链同步。
- `src/data/sources.ts`：史料来源清单。
- `src/stores/appStore.ts`：新增 `timeRange`、`highlightedEventId`、`isStoryTourOpen` 等状态。

---

## 安全与合规

1. **数据来源合规**：
   - 疆域数据参考：谭其骧《中国历史地图集》（公开出版物引用）、CHGIS 哈佛数据集（CC BY-NC-SA 4.0）。
   - 朝代信息：维基百科中文版（CC BY-SA 4.0）、《史记》《资治通鉴》等公版领域古籍。
   - **部署页底部必须保留数据来源与协议声明**（当前在 `MapView.tsx` 的 `.map-attribution` 和 `DetailPanel.tsx` 的 footer 中已有）。

2. **素材版权**：
   - 所有图片均为 Wikimedia Commons Public Domain，禁止引入任何受版权保护的图片/视频。

3. **无敏感环境变量**：项目不使用 `.env` 文件，无 API Key / Token 泄漏风险。MapLibre 为开源库，无需 Mapbox Token。

---

## 给 AI 助手的操作建议

- **改样式前**：先检查 `src/styles/global.css` 的 CSS 变量，优先复用变量而非写死色值。
- **改地图相关代码**：MapLibre 的图层操作（`addLayer`/`setPaintProperty`/`setData`）必须在 `map.on('load')` 之后或确保 `map.loaded()` 为 true。注意清理图层避免内存泄漏。
- **改时间轴/粒子**：这两个组件使用 `requestAnimationFrame` 和 `useRef`，状态读取用 `useAppStore.getState()` 而非 hook 订阅，避免每帧触发 React render。
- **改巡游/URL 同步**：`StoryTour` 与 `useUrlStateSync` 都依赖 store 状态变化，注意避免与手动切换产生竞态；测试 URL 同步时请用真实或 mock 的 `window.location`。
- **新增朝代数据**：在 `src/types/dynasty.ts` 确认接口 → 在 `src/data/` 新增或修改 TS 文件 → 在 `src/data/dynasties.ts` 导入导出 → 生成对应 GeoJSON 放入 `public/dynasties/` → 补充人物/场景图片映射到 `DetailPanel.tsx` 的 `FIGURE_IMAGES` / `SCENE_IMAGES` → 在 `src/data/sources.ts` 补充该朝史料来源。
- **不要引入新的重型依赖**：当前包体积已不小（MapLibre + D3 + Framer Motion），新增库需权衡体积收益比。优先使用原生 Web API / Canvas。
- **保持中文注释**：所有新代码的注释、变量命名（业务语义部分）应保持中文，与现有代码风格一致。
- **合并与部署**：
  1. 合并前确保 `npm run type-check && npm run test && npm run lint && npm run build` 全部通过。
  2. 推送到 `origin/main` 若遇网络问题，可临时配置本地代理 `127.0.0.1:10808`，推送/拉取完毕后立即恢复。
  3. GitHub Pages 通过仓库根目录 `deploy-gh-pages.bat` 部署；部署前必须先生成最新的 `dist/` 产物。

### Windows / Git Bash 命令执行注意

开发环境为 **Windows + Git Bash**，Bash 工具底层调用 `C:\Program Files\Git\bin\bash.exe`。以下坑点已踩过，请优先按正确方式执行：

1. **终止 Windows 进程（如 Vite 开发服务器）**：
   - ❌ 不要直接写 `taskkill /F /PID <pid>`，Git Bash 会把 `/F` 当成路径解析而报错。
   - ✅ 正确写法：`cmd //c taskkill //F //PID <pid>`（用 `//` 传递 Windows 参数）。
   - ✅ 或者先用 `netstat -ano | grep <port>` 找到 PID，再用上述命令终止。

2. **Git Bash 的 `kill` 命令**：
   - ❌ `kill <pid>` 通常无法终止 Windows 原生进程（会报 `No such process`）。
   - ✅ 统一用 `taskkill` 处理。

3. **路径分隔符**：
   - 优先使用工具自带的 `Read`/`Write`/`Edit`/`Glob`/`Grep` 处理文件，避免在 Bash 里用 `cat`/`sed` 等。
   - 若必须在 Bash 里写路径，使用正斜杠 `/`，如 `D:/china-history-river/src`。

---

*文档版本：v1.1（基于阶段 1~4 完成后的 codebase）*
*最后更新：2026-06-14*
