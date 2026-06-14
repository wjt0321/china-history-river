# china-history-river

中华 5000 年历史长河 — 交互式数据可视化作品集案例

> 当前视觉版本：**数字博物馆 / 古画卷轴** 风格
> 以"河流时间轴 + 动态疆域 + 卷轴详情"为核心交互，14 个朝代完整覆盖。

---

## 在线演示

GitHub Pages：https://wjt0321.github.io/china-history-river/

分享某朝代的深链（URL 参数 `?d=<id>` 自动定位）：

- https://wjt0321.github.io/china-history-river/?d=tang
- https://wjt0321.github.io/china-history-river/?d=qin

> 合法 id：`xia shang zhou qin han sanguo jin-nanbeichao sui tang wudai song yuan ming qing`

---

## 项目亮点

- **历史长河时间轴**：Canvas 2D 手绘河流式时间轴，正弦波 + 朝代色渐变，支持 hover 预览、点击切换、底部 brush 拖拽缩放/平移。
- **动态疆域地图**：MapLibre GL 暗色底图 + 朝代 GeoJSON 疆域（多层墨晕发光过渡）+ 都城朱印标记 + 大事事件点（点击弹出详情）。
- **卷轴式详情面板**：Framer Motion 实现右侧卷轴滑入，含概览 / 帝王 / 大事 / 文化 / 疆域 五个 tab；概览 tab 附"史料来源"清单与疆域示意免责声明。
- **沉浸式氛围系统**：按朝代切换萤火 / 尘埃 / 花瓣 / 落雪四种粒子主题，切换时溶解过渡。
- **自动巡游叙事模式**：按时间顺序自动播放各朝代旁白，可暂停 / 上/下一段。
- **视觉统一**：深空黑背景 + 降饱和文物色 + 宣纸黄点缀，强调"数字博物馆"观感；每个朝代专属主题色全站联动。
- **无障碍 & 移动端**：`prefers-reduced-motion` 全链路适配；TopBar 下拉支持键盘 Escape 关闭；时间轴提供视觉隐藏的原生 `<select>` 作为键盘可达入口；窄屏详情面板自动变为底部 sheet。
- **工程加固**：TypeScript strict、ESLint、Vitest（38 单测 + 数据完整性校验）、ErrorBoundary 分区容错、URL 深链同步。

---

## 技术栈

- React 18 + Vite 5 + TypeScript 5
- MapLibre GL 4（地图 + GeoJSON 疆域）
- Zustand 5（全局状态，选择器精确订阅）
- Framer Motion 11（面板与入场动画）
- Canvas 2D（河流时间轴 + 氛围粒子，`requestAnimationFrame` 手写）
- Vitest + React Testing Library（测试）
- 原生 CSS + CSS 变量（无 Tailwind / CSS-in-JS）

---

## 本地开发

```bash
npm install
npm run dev          # 启动开发服务器（端口 5173）
```

常用命令：

```bash
npm run type-check     # TypeScript 检查
npm run test           # Vitest 测试
npm run lint           # ESLint 检查
npm run build          # 生产构建（tsc -b && vite build）
npm run preview        # 预览生产构建
npm run optimize-images # 图片优化脚本（需 sharp）
```

推荐每次迭代后至少运行：

```bash
npm run type-check && npm run test && npm run lint && npm run build
```

---

## 目录结构

```txt
china-history-river/
├── docs/                  # 项目文档（需求 / 决策 / 内容规格 / 设计说明 / 迭代路线图）
├── public/
│   ├── dynasties/         # 14 个朝代 GeoJSON 疆域文件（{id}.json）
│   ├── geo-data/          # 中国基础地理数据（备用）
│   ├── images/            # 人物 + 场景图片与 SOURCES.md
│   ├── favicon.svg        # 朱印站点图标
│   └── showcase/          # 作品集截图/GIF 占位目录（待补）
├── scripts/               # 数据生成 / 图片下载 / 优化脚本
├── src/
│   ├── components/        # React 组件（含 detail/ 与 timeline/ 子目录）
│   ├── data/              # 朝代 TS 数据 + 史料来源 sources.ts
│   ├── hooks/             # 自定义 hooks（useMapTerritory / useUrlStateSync）
│   ├── stores/            # Zustand store
│   ├── styles/            # 全局样式与地图样式
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数（color / format / motion / sound）
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 数据与版权说明

- 本项目**代码部分**采用 [MIT License](./LICENSE) 开源。
- 历史人物/场景图片主要来自 **Wikimedia Commons Public Domain**，来源清单见 [`public/images/SOURCES.md`](./public/images/SOURCES.md)。
- 文本与疆域资料引用：司马迁《史记》、司马光《资治通鉴》（公版）、维基百科中文版（CC BY-SA 4.0）、谭其骧《中国历史地图集》、哈佛 CHGIS（CC BY-NC-SA 4.0）。详情面板"概览 → 史料来源"区块有完整清单。
- **疆域图为基于上述资料的历史简化示意**，用于展示动态变化趋势，不代表精确边界或现代行政、主权范围。
- 部分朝代（如秦、隋、元）无专属公有领域场景图，复用了题材相关的画作/照片，已在图注中明确标注"复用"关系。

---

## 已知限制 / 后续方向

本项目为个人作品集案例，以下为已知的待完善项（非阻塞，欢迎 PR）：

- **素材**：`public/showcase/` 截图/GIF 尚未补齐；部分朝代场景图为题材复用而非专属。
- **测试**：现有为单元测试 + 数据完整性校验，尚未覆盖 E2E（朝代切换 → 地图 → 详情面板的核心链路）。
- **性能**：`maplibre-gl` chunk 体积较大（gzip 后约 217 KB），已通过 `manualChunks` 拆分但未做路由级懒加载。
- **内容**：`riseReasons`/`fallReasons`/`evaluations` 的 `source` 字段已标注古籍卷次，但尚未逐条补充可点击的 URL。

---

## 文档导航

- [需求文档](./docs/REQUIREMENTS.md) — 项目定位、视觉风格、内容范围、阶段规划
- [决策记录](./docs/DECISIONS.md) — 项目关键技术与设计决策
- [内容规格](./docs/CONTENT_SPEC.md) — 每个朝代需填充的内容维度
- [设计说明](./docs/DESIGN_NOTES.md) — 视觉隐喻、地图策略、数据边界与工程取舍
- [迭代建议与路线图](./docs/ITERATION.md) — 项目审查结论、优先级与后续任务
