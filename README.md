# china-history-river

中华 5000 年历史长河 — 交互式数据可视化作品集案例

> 当前视觉版本：**数字博物馆 / 古画卷轴** 风格  
> 以"河流时间轴 + 动态疆域 + 卷轴详情"为核心交互，14个朝代完整覆盖。

## 开源与素材声明
- 本项目**代码部分**采用 [MIT License](./LICENSE) 开源。
- 项目所使用的历史人物/场景图片主要来自 **Wikimedia Commons** 的 **Public Domain（公有领域）** 资源。
- 图片来源清单见 [`public/images/SOURCES.md`](./public/images/SOURCES.md)。如个别素材的原始页面许可说明发生变化，请以其来源页面为准。
- 历史地图、地理数据与文本资料的引用与说明，请以项目内文档和页面中的来源声明为准；相关权利归各自原始来源所有。


## 文档导航
- [需求文档](./docs/REQUIREMENTS.md) — 项目定位、视觉风格、内容范围、阶段规划
- [决策记录](./docs/DECISIONS.md) — 我们讨论中达成的关键决策
- [内容规格](./docs/CONTENT_SPEC.md) — 每个朝代需填充的内容维度

## 项目状态
✅ **阶段 1 完成** — MVP 可运行，含完整视觉重做

- [x] 14 朝代数据 + GeoJSON 疆域
- [x] 河流式 Canvas 时间轴（正弦曲线 + 渐变 + 脉冲高亮）
- [x] 卷轴式详情面板（木质轴头 + 深褐背景）
- [x] 氛围粒子系统（萤火 / 尘埃 / 花瓣 / 落雪，按朝代切换）
- [x] 都城标记（14 个坐标，圆点 + 标签）
- [x] CartoDB 暗色底图（`opacity:0.55` 弱化）
- [x] 降饱和文物色系（出土氧化质感）
- [x] 疆域渐变过渡（`transition: 900ms`）
- [x] PD 图片素材（场景 + 人物，Wikimedia Commons）

## 技术栈
- React 18 + Vite + TypeScript
- MapLibre GL（地图 + GeoJSON 疆域）
- Zustand（状态管理）
- Framer Motion（面板动画）
- Canvas 2D（河流时间轴 + 氛围粒子）

## 目录结构
```
china-history-river/
├── docs/                  文档（需求 / 决策 / 内容规格）
├── data/                  原始数据
├── screenshots/           阶段截图
├── scripts/               数据/图片下载脚本
├── src/
│   ├── components/        React 组件
│   ├── data/              朝代 TS 数据文件
│   ├── stores/            Zustand stores
│   ├── styles/            全局样式 + 地图样式
│   ├── types/             TypeScript 类型
│   ├── utils/             工具函数
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── dynasties/         GeoJSON 疆域文件
│   ├── images/            人物 + 场景图片
│   └── geo-data/          基础地理数据
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 启动开发
```bash
npm install
npm run dev
```

## 素材来源
所有图片均为 Wikimedia Commons **Public Domain** 素材，详见 [`public/images/SOURCES.md`](./public/images/SOURCES.md)。
