# 个人主页 · 迭代进度报告（v2）

> 作者：江沁钊（智能医学工程 · 大一）
> 课程：Vibe Coding（个人网页主页项目）
> 本文件记录 **v2 迭代**的进展与优化点，配套截图见 `artifacts/screenshots/`。
> 项目上下文与命名约定见 `docs/project-continuity.md`。

---

## 版本时间线

| 版本 | 日期 | 阶段 | 关键产出 | 截图 |
| :---: | :---: | :---: | --- | --- |
| v1 | 2026-09-03 | MVP 最小可行产品 | 完整个人主页（响应式 + 智能体预留位 + 多功能块） | `v1-desktop-full.png` / `v1-mobile-full.png` |
| **v2** | 2026-09-10 | Git / checkpoint 存档 + 功能完善 | **新增「学业 · 专业」整页板块** + 导航「学业」入口；同日追加两次：①**首屏之后淡入的「太阳 + 分层细节山峦」视差背景** + 「学习日常」改写为**劳逸结合**；②**足迹板块改为「苹果发布会式拼图」**（10 张不等尺寸圆角卡片从四周涌入、最终拼成完整矩形）；v2 文件独立成目录、作为可回退存档点 | `v2-study-desktop.png` / `v2-study-mobile.png` / `v2-menu-mobile.png` / `v2-parallax-desktop.png` / `v2-parallax-mobile.png` / `v2-journey-desktop.png` / `v2-journey-inflight.png` / `v2-journey-mobile.png` |
| v3 | 待开发 | Supabase Dashboard + Feedback | - | - |
| v4 | 待开发 | 数字孪生 / AI 集成 | - | - |

---

## v2 · 本次迭代

### 🎯 版本目标
- 在 v1 主页基础上**新增一整页「学业 · 专业」板块**，补上"学生身份"这一最重要的信息面。
- 该板块定位：**专业信息 + 学习情况**结合，而不是单纯罗列成绩。
- 导航（桌面居中导航 / 移动端汉堡菜单）同步新增「学业」入口，与板块锚点联动。
- 按项目约定：v2 所有文件以 `v2` 开头并置于独立目录，形成可回退的 checkpoint。

### ➕ 新增「学业 · 专业」板块
板块序号 **02**（紧跟"关于我"之后），采用与整站一致的深色分区与 Apple 式极简排版：

1. **专业名片 `.study-id`**
   - 线性 SVG 学士帽徽标（非 emoji）。
   - 学校：**天津大学（深圳）**；专业：**智能医学工程 · 本科在读（大一）**。
   - 一句话定位：把**医学、工程与信息技术**拧在一起的交叉学科——既要读懂生命，也要动手把想法做出来。
2. **核心课程 `.course-list`**
   - 以标签墙形式列出大一硬核基础课：高等数学 / 线性代数 / 大学物理 / 程序设计基础 /
     医学导论 / 生物医学工程导论 / 工程制图 / 大学英语。
   - 结尾补充方向课预告：信号与系统、医学成像、人工智能等。
3. **学习日常 `.daily-list`**（同日改写为**劳逸结合**）
   - 一句话点题：**劳逸结合**——周中把心沉进教室与自习室，周末把脚迈向山海。
   - **周中**待在教室和自习室，把基础课一门一门啃扎实；**周末**出门探索世界——学校周边、深圳周边走一走，看风景。
   - 再接"习惯把课上学到的东西**亲手复现**一遍——「跑通了」才算真的学会"，
     收在"再忙也想保留一点看世界的时间：**学业与远方**，我都想认真对待"，与前文"现代徐霞客"人设呼应。

### 🧭 导航与结构联动
- 导航新增 `<a class="nav__link" href="#study">学业</a>`（桌面导航与汉堡菜单共用同一 `#navMenu`，一处改动两端生效）。
- 页脚标识更新为 `v2 · 学业与专业`。
- **板块序号顺延**：学业 = 02，其后 足迹 = 03、镜头 = 04、技能 = 05、社交 = 06、智能体 = 07、联系 = 08。

### 📱 响应式与截图适配
- 新增 `.study-grid` 在桌面为双列，`@media (max-width:760px)` 下自动堆叠为单列，标签墙可换行。
- 为截图/预览模式补充 `html.shot { scroll-behavior: auto; }`，避免带锚点截图时平滑滚动导致取景错位。

### ✅ 验证结果
- **桌面端**（1440 宽）：`v2-study-desktop.png` —「学业 · 专业」板块排版正常，导航可见"学业"。
- **移动端**（375 视口）：`v2-study-mobile.png` — 单列堆叠，无横向溢出、无裁切。
- **移动端菜单**：`v2-menu-mobile.png` — 汉堡菜单展开为不透明深色下拉，含
  关于 / 学业 / 足迹 / 镜头 / 技能 / 社交 / 智能体 共 7 项，"学业"已就位。
- 480 宽中间断点亦验证无溢出。

### 📱 技术要点
- 仍为**纯前端静态实现**（HTML + CSS + JS），无框架、无构建依赖。
- v2 复用 v1 的全部交互（滚动显现、数字滚动、导航变色、汉堡菜单、手写笔触），仅按增量扩展。
- 本地预览：项目根目录执行 `python -m http.server 8123`，访问
  `http://127.0.0.1:8123/v2-web/v2-index.html`；追加 `?shot=1` 进入截图模式。

### 🔧 文件结构（v2）
```
v2-web/
├── v2-index.html      # 主页结构（新增 #study 学业板块、导航"学业"项、序号重排；追加 #bgParallax 背景块；足迹板块改为 .journey-mosaic 拼图）
├── v2-style.css       # 样式（学业板块 + 响应式；追加深色山景背景层 + 磨砂卡片 + reduced-motion 降级；追加拼图骨架与入场动效）
├── v2-script.js       # 交互逻辑（沿用 v1；末尾追加视差 IIFE 与足迹拼图 IIFE）
├── v2-about-data.js   # "About me" 手写 SVG 笔画数据（沿用 v1）
└── tools/
    └── gen-bg-parallax.py   # ★ 山峦脊线生成器（幂等、可复现，是山形/配色的唯一调参入口）
docs/
├── v2-progress-report.md   # 本进度报告
└── project-continuity.md   # 项目记忆库（已同步 v2 状态）
artifacts/
└── screenshots/            # v2-study-desktop / v2-study-mobile / v2-menu-mobile
                            # + v2-parallax-desktop / v2-parallax-mobile
                            # + v2-journey-desktop / v2-journey-inflight / v2-journey-mobile
```

### 🚧 待办与后续方向（供 v3 继续）
- [x] 视差山峦背景（本追加迭代已完成，见下文）。
- [ ] **上传真实照片**：替换首屏背景与足迹卡片占位图。
- [ ] 接入真实社交媒体主页链接（抖音 / B站 / 视频号）。
- [ ] **智能体接入**：在 `#agent` 预留区接入真实 AI 助手（课程 V4）。
- [ ] **课程 V3 → 文件版本 v3**：接入 Supabase 做 Dashboard 与 Feedback（意见反馈）。
- [ ] 微调山峦（可选）：改 `v2-web/tools/gen-bg-parallax.py` 顶部的 `LAYERS` / `PALETTE` 后重跑。
- [x] 建立 Git 版本控制 checkpoint（本次 v2 已作为存档点提交）。

### 🏷️ 本次迭代自评
- 补齐了"学业 · 专业"这一核心信息面，主页从"旅行人格"扩展到"完整的人"。
- 新板块视觉与整站在配色、图标语言、留白节奏上保持一致，无明显拼贴感。
- 桌面 / 移动 / 移动菜单三种关键视图均已截图验证通过。

---

## v2 · 追加迭代（同日）：首屏之后的「太阳 + 分层细节山峦」视差背景

### 🎯 追加目标
- 让首页**不再只是"深色背景 + 卡片"**，而是有真实纵深感的场景：一个**太阳 + 层叠山峦**的暮色山景。
- 该背景**只在首屏之后淡入**，随滚动产生**视差位移**，让中后段内容"浮"在山景之上。
- 视觉必须**克制、不抢内容**：所有内容卡改为半透明 + 背景模糊，保证文字对比度。

### 🏔️ 背景构成（`#bgParallax`）
插入在 `<main id="top">` 之前，`position: fixed; inset: 0; z-index: -1`，整体在 `body.is-parallax-on` 时 `opacity` 由 0 过渡到 1（0.9s）：

1. **天幕 `.bg-parallax__sky`** — 深空暮色 + 太阳侧暖光晕（`radial-gradient(80% 62% at 78% 12%)`）+ 地平线暖光。
2. **太阳 `.bg-parallax__sun`** — 右上方暖金发光圆（`right:13%; top:9%`），带多层 `box-shadow` 光晕；`data-px="16"`（位移最小 = 最远）。
3. **三层山峦 `.bg-parallax__layer--{far,mid,near}`**

   | 层 | `data-px` | 高度 | 位置 | 模糊 |
   | --- | :---: | :---: | :---: | :---: |
   | far（远·最亮最雾） | 48 | 54vh | `bottom:-5%` | 1.4px |
   | mid（中） | 88 | 45vh | `bottom:-13%` | 0.5px |
   | near（近·最深） | 152 | 36vh | `bottom:-21%` | — |

   每层是一个 `<svg preserveAspectRatio="none">`，内部含 **3 条脊线**（back / inner / front，颜色依次加深）+ 1 条 `stroke="url(#px*Rim)"` 的**日照金边**（太阳方向的暖金渐变，opacity 0 → 0.72）。

### 🧮 山脊生成算法（`v2-web/tools/gen-bg-parallax.py`）
不用现成素材、不靠手绘坐标，而是**用脚本按参数生成平滑且细节丰富的山脊折线**，便于反复调参：

- **两档峰结构**：每层每条脊线 = **4～6 个"宽而高"的主峰** + **11～15 个"窄而低"的侧坡碎峰**（高斯叠加）。
- **细碎稜线**：叠加 **8 阶 value noise**（`fine_freq` 11～12），让轮廓有真实山脊的碎起伏。
- **谷底抬升**：归一化时引入 `floor`（0.22～0.26），使谷底不直插画面底部 —— 得到"连绵山体 + 分明主峰"，而非均匀锯齿或深 V。
- 脚本**幂等**：会先用正则移除已有的 `#bgParallax` 块再重建，可反复运行；已验证连续三次运行 SHA256 完全一致。

> 该脚本使用 Python 标准库（`random` / `re`），无第三方依赖；`random.Random(seed)` 固定随机种子，因此**任何参数组合都能一比一复现**。

### 🎞️ 视差实现（`v2-script.js` 末尾独立 IIFE）
- 选取 `#bgParallax` 与所有 `[data-px]` 元素；`start = hero.offsetHeight * 0.75`。
- `span = documentHeight - innerHeight - start`；滚动进度 `p = (y - start) / span` 归一化到 0～1。
- 每层位移 `translate3d(0, -p * d px, 0)`（`d` = `data-px`），**用 `requestAnimationFrame` 节流**，只读滚动位置、只写 `transform`，不触发重排。
- `y > start` 时给 `<body>` 加 `is-parallax-on` → 背景淡入；回到首屏以上则移除。
- `?shot=1` 截图模式**强制加 `is-parallax-on`**，便于静态截图取证。
- `prefers-reduced-motion: reduce` 时**只显示、不位移**（可访问性降级）。

### 🔤 内容可读性改造
- `.section--tinted` → `rgba(16, 29, 48, .62)` + `backdrop-filter: blur(10px) saturate(120%)`，卡片像"磨砂玻璃"浮在山景上。
- `.about-screen__bg` 改为半透明渐变，让远景透出。
- `@media (max-width: 760px)` 下降低背景层高度与模糊，避免小屏糊成一片。

### 🔁 调参过程（用户逐轮反馈驱动）
| 轮次 | 山脊形态 | 用户反馈 |
| :---: | --- | --- |
| r5 | 24 峰/层，窄峰均匀密布 | "细节再多些，但**不是密集的小山峰**" |
| r6 | 主峰减到 5～6 个但过宽 | "**峰再少而分明些**" |
| r8 | 主峰收窄 + 侧坡碎峰 | "山的**细节再多些**，但不是密集小山峰" |
| **r9（定稿）** | **每层 3 条脊线叠压 + 8 阶噪声** | ✅ 用户确认"达标" |

> 结论：用户要的"细节"是**山体内部的层次（层叠山脊 + 碎稜线）**，而不是**天上更多的峰**。

### ✅ 验证结果
- **结构自检**：`<svg>` 24:24、`<defs>` 4:4、`<linearGradient>` 15:15、`<div>` 56:56、`<section>` 10:10、`<script>` 2:2 全部配平；页面内**无重复 id**；`data-px` = 16/48/88/152 各一；每层 1 条日照金边（共 3 条）。
- **生成器幂等**：连续运行 3 次，`v2-index.html` 的 `#bgParallax` 块字节完全一致。
- **桌面端**（1240 视口，滚过首屏）：`v2-parallax-desktop.png` — 太阳 + 三层山峦淡入，层叠山脊清晰，卡片磨砂透出山景。
- **移动端**（390 视口）：`v2-parallax-mobile.png` — 山峦与太阳正常渲染，无横向溢出、无内容遮挡。
- **学业板块**：`v2-study-desktop.png` / `v2-study-mobile.png` — 改写后的「劳逸结合」文案在桌面双列与移动单列下均完整可见。

### 🏷️ 追加迭代自评
- 主页从"扁平深色卡片"升级为**有纵深的山景场景**，视觉记忆点明显增强，同时保持 Apple 式克制。
- 视差逻辑独立成 IIFE、只改 `transform`，对既有交互零侵入；并提供 `reduced-motion` 与移动端降级。
- 山峦由**参数化脚本生成**而非贴图，后续想调整峰形/配色只需改几行参数并重跑，可维护性高。

---

## v2 · 追加迭代（同日·第二次）：足迹板块改「苹果发布会式拼图」

### 🎯 需求来源
> 用户原话：*「山川湖海足迹那一页我希望是可以图片（要有圆角效果）从四周涌入，有一个丝滑的动画，然后每个图片可以大小不同，但所有图片最后停下之后要拼成一个长方形，要美观。就是苹果发布会上这种感觉」*（附 Apple 活动页卡片网格参考图）

拆成 5 个硬指标：① 圆角；② 从**四周**涌入；③ 动画**丝滑**；④ 每张**大小不同**；⑤ 停下后**严丝合缝拼成矩形**。

### 🧩 版式骨架：12 列 × 6 行拼图
原来 4 张等大卡片（3 列网格）→ 改为 **10 张不等尺寸卡片**，用 `grid-template-columns: repeat(12, minmax(0,1fr))` + `grid-auto-rows: var(--row)` 搭骨架，每张卡片用 `grid-area` 精确占位：

| 卡片 | 文案 | 占比（列×行） | 尺寸感 |
| :---: | --- | :---: | --- |
| m1 | 山 · 云端之上，徒步者的信仰 | 5×3 | 主视觉（大字） |
| m2 | 湖 · 静水如镜，倒映天空 | 4×2 | 中 |
| m3 | 海 · 潮起潮落，看尽人间 | 3×3 | 竖长（大字） |
| m4 | 城与人 · 每一次停留，都是故事 | 4×1 | 扁条（只留标题） |
| m5 | 星空 · 银河落在头顶 | 3×1 | 扁条 |
| m6 | 雪与云 · 风雪兼程，向高处走 | 6×2 | 横幅（大字） |
| m7 | 古镇 · 人间烟火 | 3×1 | 扁条 |
| m8 | 草原 · 风把草吹成海 | 3×2 | 中 |
| m9 | 日出 · 等一场日出 | 3×2 | 中 |
| m10 | 在路上 · 下一站，未定 | 6×1 | 扁条 |

> 12×6 = 72 个单元被 10 张卡片**恰好铺满**；`--row: clamp(56px, 6.1vw, 82px)`、`--gap: 14px`、圆角 `20px`，随视口自适应缩放。

### 🎞️ 入场动画（`v2-script.js` 末尾独立 IIFE）
- **方向 = 真实的"四周"**：对每张卡片，用 `offsetLeft/offsetTop`（不是 `getBoundingClientRect`，后者会被已施加的 transform 污染）算出它相对拼图中心的向量 `(nx, ny)`，取 `atan2` 得到方向角、按距离归一化得到"飞多远"（`rad` 夹在 0.55～1.5）。
  - `--dx = cos(ang) * rad * spreadX`、`--dy = sin(ang) * rad * spreadY`，其中 `spreadX = w*0.46`、`spreadY = max(h*0.55, 240)`。
  - 于是**左侧的卡从左边进、右侧的从右边进、上下的从上下进、角落的从斜对角进**，而不是统一从下方淡入。
- **丝滑**：初态 `translate3d(±dx, ±dy, 0) scale(0.85~0.90)` + `opacity: 0`，桌面端再加 `blur(14px)` 起飞虚化；终态归位 `translate3d(0,0,0) scale(1)` + 清晰。过渡曲线 `cubic-bezier(0.16, 1, 0.3, 1)`（≈ easeOutExpo 的"快速起步、极缓收尾"），时长 1.15s。
- **错峰涟漪**：按方向角排序后写入 `--d = rank * 0.055s`，延迟作用于 `transition-delay` —— 卡片像一圈涟漪依次涌入，而不是从上到下"扫"一遍。
- **触发**：用 `IntersectionObserver`（`threshold: 0.16`）在板块进入视口时播放；`is-armed`（起点锁）只在 JS 正常执行后才加，因此**禁用 JS / 脚本报错时内容照常可见**（渐进增强）。
- **收尾**：全部归位后加 `is-done` → 释放 `will-change`、切换成更利落的过渡并支持悬停微动（`translateY(-6px) scale(1.012)` + 图片内部 `scale(1.05)`）。
- **降级**：`?shot=1` 截图模式与 `prefers-reduced-motion: reduce` 下**直接定格成拼好的矩形**，不播放动画；窗口 resize 时（未播放前）180ms 防抖重算起点。

### 📱 手机端
`@media (max-width: 760px)` 换成 **6 列骨架**：所有卡片 `grid-column: span 3` + `grid-row: span 2`，`.ms-tile--big`（m1 山 / m6 雪与云）`span 6` 通栏 → DOM 宽度序列 6,3,3,3,3,6,3,3,3,3 **恰好排满 6 行**，同样是一个完整矩形。

### ✅ 验证结果（自动几何校验 + 截图三类视口）
用自写的 `.deepworks/tmp/check-mosaic.html`（在 iframe 里载入页面，按 `?cols/rows` 还原骨架，逐项断言）在三个视口下校验，**全部通过**：

| 视口 | 容器盒 | 外框平齐 | 单元覆盖 | 重叠 | 卡片命中 | 分带拼合 | 结论 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1366 / 12×6 | 1030×562 | ✅ 偏差 0.0px | 72/72 无空洞 | 0 | 10/10 | 行 0 错 / 列 0 错 | ✅ |
| 900 / 12×6 | 835×406 | ✅ 偏差 0.0px | 72/72 无空洞 | 0 | 10/10 | 行 0 错 / 列 0 错 | ✅ |
| 390 / 6×12 | 325×662 | ✅ 偏差 0.0px | 72/72 无空洞 | 0 | 10/10 | 行 0 错 / 列 0 错 | ✅ |

- 校验项：① 所有卡片并集外接矩形 == 容器内容盒（四周齐边）；② 每个单元中心点恰好落在**一张**卡片内（有空洞则该格落空、有压叠则命中 >1）；③ 每张卡片宽高都是**整数个单元**（含跨格缝隙）；④ 逐行带 / 逐列带检查首尾贴住容器、相邻卡片间距恰好等于 `gap`（证明无缝隙错位与空洞）。
- 另用 Edge 无头模式抓取控制台日志，确认新增 IIFE **无 `Uncaught` / `SyntaxError`**，`ms-tile` = 10 张。
- **截图**：`v2-journey-desktop.png`（拼合完成：10 张圆角卡片大小错落、严丝合缝成一个矩形）、`v2-journey-inflight.png`（把动画冻结在 22% 进度：卡片仍在四周向外散开、带虚化，可看到"涌入"过程）、`v2-journey-mobile.png`（390 视口，6 列骨架同样拼成完整矩形）。

### 🏷️ 追加迭代自评
- 用**纯 CSS Grid + transform** 实现了发布会级的"拼图归位"观感：位移只走合成层（`translate3d` + `opacity` + `blur`），不动布局、不触发重排，滑动时保持流畅。
- "从四周涌入"不是写死的四组方向，而是**由每张卡片的真实位置反推方向**，因此改版式（换尺寸、加卡片）后动画方向会自动跟随，不需要重新调参。
- 做了三重兜底：`is-armed` 只在 JS 执行成功后加（无 JS 也在）、`IntersectionObserver` 未触发时 2.5s 自动播放、`shot`/`reduced-motion` 直接定格，避免"内容永远不出现"。

### 🚧 遗留
- 仍为**渐变占位图**（`.ph`），结构已预留 `TODO(v2)`：把 `.ms-tile__media` 换成 `<img src="...">` 即可无缝替换为真实照片（样式已写好 `object-fit: cover`）。
  → 已在**第三次追加迭代**中完成（见下节）。

---

## v2 · 追加迭代（同日·第三次）：足迹接入真实照片 + 动画节奏打磨

### 🎯 需求来源
> 用户把 11 张实拍照片放进项目根目录 `照片展示/`，说*「足迹这里的图片可以用我提供的」*；
> 并对上一轮动画反馈：*「感觉图片移动的速度可以再慢一点，然后更多一点错落感」*。

拆成两件事：① 把 10 张渐变占位换成**真实照片**；② 动画**更慢更从容 + 错峰更明显**。

### 🖼️ 素材流水线（无 PIL，纯 PowerShell）
- 本机 **没有 `PIL`/Pillow**、`node` 也不可用 → 缩图改用 **`System.Drawing`（.NET）**：`.deepworks/tmp/resize-photos.ps1`。
- 处理规则：长边压到 **1400px**、等比缩放、`HighQualityBicubic`、JPEG **质量 82**、白底填充、**读 EXIF `PropertyId 0x0112` 手动旋转**
  （浏览器会自动按 EXIF 转、`System.Drawing` 不会 → 不处理会歪；本次 10 张 orient 全为 1）。
- ⚠️ **PowerShell 5.1 按 ANSI 读脚本**：`.ps1` 里写中文（无 BOM）会乱码并报 `InvalidLeftHandSide` → **脚本内只用 ASCII 注释**。
- 输出到 `v2-web/assets/journey/`，10 张共 **2.5MB**（单张 95KB～635KB），全部 HTTP `HEAD` 校验 **200**。

### 📷 照片 → 卡片映射
| 文件 | 来源 | 内容 | 卡片 | 文案 |
| :--- | :---: | --- | :---: | --- |
| `01-shan.jpg` | p04 | 雪山与徒步者 | m1 | 山 · 云端之上，徒步者的信仰 |
| `02-hu.jpg` | p02 | 湖面倒影 | m2 | 湖 · 静水如镜，倒映天空 |
| `03-hai.jpg` | p10 | 海边日落 | m3 | 海 · 潮起潮落，看尽人间 |
| `04-cheng-yuren.jpg` | ★ p12（用户后补） | 夜色里民俗巡游的人海 | m4 | 城与人 · 每一次停留，都是故事 |
| `05-xingkong.jpg` | p08 | 打铁花夜景 | m5 | 星空 · 银河落在头顶 |
| `06-zhuiguang.jpg` | p07 | 大漠光伏阵列 | m6 | **追光 · 把阳光收进每一格** |
| `07-guzhen.jpg` | p03 | 亭台飞檐 + 银杏 | m7 | 古镇 · 人间烟火 |
| `08-caoyuan.jpg` | p01 | 绿色草坡 | m8 | 草原 · 风把草吹成海 |
| `09-richu.jpg` | p09 | 云海粉紫日出 | m9 | 日出 · 等一场日出 |
| `10-lushang.jpg` | p05 | 山谷栈道的两位同行者 | m10 | 在路上 · 下一站，未定 |

- **去重发现**：源目录 p04 与 p06 **字节完全相同**（MD5 `3EA572317B11…`，2,505,508 B）→ 原 11 张里只有 10 张唯一。
- **打铁花重复的处理**：原本 m5、m11 都是打铁花 → 用户选择「其中一张换成别的照片」并补进第 12 张（民俗巡游人海）→
  用**连锁重排**消化：新图进 m4「城与人」、原 m4 的两位同行者移到 m10「在路上」、原 p11（打铁花河面倒影）**弃用** → 打铁花在 m5 只出现一次。
- **文案微调**：m6 原「雪与云 · 风雪兼程，向高处走」与照片（光伏阵列）不符 → 用户选择保留此图并改文案为 **「追光 · 把阳光收进每一格」**；
  `06-xue-yun.jpg` 相应改名 `06-zhuiguang.jpg`。

### 🧱 HTML / CSS 改造（占位 → 真实照片）
- `v2-index.html`：10 个 `<div class="ms-tile__media ph">` → `<img class="ms-tile__media" src="assets/journey/xx.jpg" alt="…" loading="lazy" decoding="async">`；
  `alt` 写实际内容（如 m4「夜色里民俗巡游的人海」、m10「走山谷栈道的两位同行者」）。
- `v2-style.css`：
  - `.ms-tile__media` **本身就是 `<img>`**（`position:absolute; inset:0; width/height:100%; object-fit:cover; object-position: var(--pos, center)`）；删掉 `TODO(v2)` 与给内层 `img` 的规则。
  - 柔光 `::after` 从 `.ms-tile__media` **上移到 `.ms-tile`**（图片换 `<img>` 后 `::after` 会盖不到内容）；`.ms-tile__cap` 加 `z-index: 2`。
  - 原 10 条 `.ms-tile--mN .ph` 渐变**改挂到 `.ms-tile--mN`** → 既作图片加载失败的兜底底色，又可承载每张的裁切重心 `--pos`。
  - 每张给独立 `--pos`（裁切重心，避免主体被切）：m4/m5 `50% 45%`、m6 `50% 42%`、m7 **`50% 68%`**、m8/m9 `50% 45%`、m10 **`50% 48%`**，m1～m3 居中。
    （m7 由 30% 调到 68% 后，古镇的**琉璃瓦飞檐**正好露出。）
- `.journey-note` 文案改为：*「※ 以上均为我在旅途中的实拍，会随足迹持续更新。」*

### 🎞️ 动画节奏调整（按用户反馈）
| 参数 | 旧 | 新 | 效果 |
| --- | :---: | :---: | --- |
| 错峰步长 `STEP` | 0.055s | **0.10s** | 涟漪错落更明显 |
| 归位时长 `transform` | 1.15s | **1.6s** | 更慢更从容（`opacity` 0.9s、`filter` 0.95s） |
| `is-done` 收尾定时 | `maxDelay*1000+1420` | **`+1870`** | 匹配更长时长，避免提前解除 `will-change` |

> 飞入距离 / 虚化 / 缩放幅度按用户选择**保持不变**，只动"快慢与错峰"。

### ✅ 验证结果
- **几何自检三视口全通过**（`.deepworks/tmp/check-mosaic.html`）：1366（12×6，盒 1030×562）/ 900（12×6）/ 390（6×12，盒 340×662），
  均 `flush` 齐边、`uncovered=0`、`overlapped=0`、命中 10/10、分带 0 错 → `PERFECT-RECTANGLE-NO-HOLES`。
- **控制台零错误**：Edge `--enable-logging=stderr` 跑正常页与 `?shot=1`，无 `Uncaught` / `SyntaxError` / `TypeError` / `net::ERR` / `404`。
- **图片加载诊断**：`.deepworks/tmp/probe-imgs.html` 逐张断言 `complete=true`、`naturalWidth>0`、`object-position` 生效 → 10/10 正常。
- **截图重出**：`v2-journey-desktop.png`（10 张实拍拼合完成）、`v2-journey-inflight.png`（动画中段，四周散开带虚化）、
  `v2-journey-mobile.png`（390 视口 6 列骨架）；桌面端已肉眼核对语义归位、无重复主题、古镇露出飞檐。

### ⚠️ 截图踩坑（写给下一位，务必照做）
- Edge 无头模式**同一 `--user-data-dir` 会命中缓存**，导致新截图与旧图**字节数完全一致**（假成功）。
- Edge **异步写盘**：进程早已退出、文件可能还是旧的 → 必须**每次换唯一 profile**、**先删目标文件**、`--virtual-time-budget` 给足、再**轮询等文件出现**。
- `Start-Process -ArgumentList` **不会**给含空格的路径加引号 → 用直接调用 `& $edge ... --screenshot="$out"`。
- `.deepworks/tmp/shot.html` 外壳已升级：**先用 `new Image()` 把 10 张足迹照片预热进 HTTP 缓存**，再挂载 iframe（`?preload=0` 可关），
  避免"图还没解码就截图"拍出空块。

### 🚧 遗留
- 首屏主背景仍为渐变/风格化背景（未换成实拍），社交链接仍为占位跳转。
- 素材再生成命令（幂等，改映射只改脚本里的 `$map`）：
  `powershell -ExecutionPolicy Bypass -File .deepworks\tmp\resize-photos.ps1`

---

## v2 · 追加迭代（同日·第四次）：首屏 hero 视频背景（**素材已就绪，页面待接入**）

### 🎯 需求（用户原话要点）
把首屏 hero 背景换成**视频**：① 叠在**最下层**当背景；② 整体**亮度压暗**；③ **只属于第一页**，下滑时随第一页一起离开、不跟到第二页；
④ 第一页 → 第二页要**丝滑过渡**；⑤ 视频需**压缩**以保证网页流畅播放（"流畅是前提"；用户接受"精选 60 秒循环"方案）。

### 🔍 源素材分析
- 源文件：`uploads/ses_f7558ff21ffeau8q6tDcaca6ZV/个人主页背景2.mp4`（**34.74MB**，uploads/ 已 gitignore，不入库）。
- 参数：**HEVC Main 10 / yuv420p10le（10-bit）**、854×480、30fps、216.433s、视频 1.15Mbps + AAC 音轨。
- **必须转码的两条硬理由**：① 10-bit HEVC 在多数 Chrome/Edge 上无法解码或严重卡顿；② 带音轨时浏览器**不允许自动播放**（网页背景必须静音）。

### 📊 编码基准（60s 样本，H.264 `preset slow`）
| 方案 | 体积 | SSIM |
| :-- | --: | --: |
| CRF20 | 20.3 MB | 0.988 |
| CRF23 | 15.1 MB | 0.983 |
| CRF26 | 11.1 MB | 0.976 |
| CRF29 | 8.0 MB | 0.966 |
| CRF26 + 轻降噪 `hqdn3d` | 11.0 MB | 0.974 |
- **结论**：本片为手持噪点型素材，H.264 同质量码率**高于**源 HEVC —— 全长 216s 转码后 **42.6MB，比源文件还大**。
  故"不降画质 + 小体积"不可同时满足，改用**精选片段循环**控制体积。
- VP9（cpu-used 4）实测 SSIM 仅 0.92 且体积更大 → **弃用**；不生成 WebM/AV1 双源（单 H.264 已可全平台硬解，双源只会让仓库翻倍）。

### 🎬 精选循环 EDL（10 段，均已逐秒核对：无字幕卡、无正脸）
| # | 源起点 | 时长 | 内容 |
| :-: | --: | --: | :-- |
| 1 | 14.0s | 9.0s | 盐湖镜面 · 湿沙落日倒影（**开场**） |
| 2 | 23.0s | 3.5s | 风车群金色日落 |
| 3 | 32.0s | 4.0s | 海边古镇 + 城市天际线 |
| 4 | 37.0s | 10.0s | 壶口瀑布 · 黄河奔流 |
| 5 | 48.0s | 5.5s | 夜色烟花 · 打铁花 |
| 6 | 116.0s | 6.0s | 丹霞瀑布 · 峡谷 |
| 7 | 156.0s | 6.0s | 夜色古镇灯会 |
| 8 | 176.0s | 6.0s | 茶园螺旋航拍 |
| 9 | 188.0s | 5.0s | 壶口航拍 · 风车落日 |
| 10 | 131.0s | 7.0s | 海面落日 · 镜面（**收尾 → 与开场同为暖色水面，循环接缝柔和**） |
- 段间 `xfade=fade`、**0.8s** 交叉淡化；总时长 **54.8s**。

### 📦 产出物（**已入库**）
- `v2-web/assets/hero/hero-loop.mp4` —— **8,503,324 B ≈ 8.1MB**；`h264 / High / yuv420p`、854×480、30fps、**54.8s**、1241 kbps、**无音轨、+faststart**。
- `v2-web/assets/hero/hero-poster.jpg` —— 15.6KB 封面帧（t=2.0s）。
- `v2-web/tools/build-hero-loop.ps1` —— **幂等、可复现**构建脚本（EDL / 交叉时长在文件顶部常量）；
  **不依赖字体、不写系统目录**，重跑输出字节一致，已实测复跑一次确认。

### ✅ 页面接入（已完成）
1. **`v2-index.html`**（`.hero__bg` 之后、星空之前）插入：
   ```html
   <video class="hero__video" autoplay muted loop playsinline preload="auto"
          poster="assets/hero/hero-poster.jpg" aria-hidden="true" tabindex="-1">
     <source src="assets/hero/hero-loop.mp4" type="video/mp4" />
   </video>
   <div class="hero__veil" aria-hidden="true"></div>
   ```
2. **`v2-style.css`** 新增三条规则（插在 hero 段落，`.hero__stars` 定义之前）：
   - `.hero__video` —— `position:absolute; inset:0; object-fit:cover; z-index:0; opacity:0; pointer-events:none;
     transition:opacity 1.2s ease; filter:brightness(.80) saturate(.96) contrast(1.04)`；
     **默认透明**是安全设计 —— 只有 JS 成功接管播放时才由 `.hero.is-video .hero__video{opacity:1}` 淡入。
   - `.hero__veil` —— 压暗遮罩：中部放射渐变（中心 α.18 / 边缘 α.54）+ 纵向渐变
     `rgba(4,10,18,.44) → rgba(5,13,23,.24) → rgba(6,16,28,.34) → #08131f`；
     **底部收在 `#08131f`，与第二页 `.bg-parallax__sky` 顶色完全一致**（实测第二页 `.about-screen__bg` 顶色
     ≈ `#071320`，与 `#08131f` 仅差 1/255，肉眼无接缝）。
   - `.hero.is-video .hero__stars{opacity:0; animation:none; transition:opacity 1.2s ease}` —— 实拍启用后星空让位，避免"星星叠在白天风景上"。
   - `html.shot .hero__video/.hero__veil/.hero__stars{transition:none}` —— **截图模式去掉过渡**，避免无头截图抓到淡入中间态。
3. **`v2-script.js`** 末尾新增第 4 个 IIFE（首屏视频控制）：
   - 强制 `muted` + `playsinline`（背景视频不静音则浏览器一律禁止自动播放）；
   - `video.play()` 返回的 Promise **resolve 时才加 `.hero.is-video`**，**reject 时静默移除**（回落夜景渐变，绝不黑屏）；
   - `video` / `<source>` 的 `error` 事件同样触发回落；
   - `?shot=1` 或 `prefers-reduced-motion` → `pause()` + 直接显示封面静帧（画面确定、可复现、不耗电）；
   - `visibilitychange` 切后台暂停、切回续播。
4. **"只留在第一页" 天然满足**：视频是 `.hero` 内的 `position:absolute` 子元素，`.hero{overflow:hidden}`，
   随首屏一起滚走，不会跟随到第二页。

### 🔬 验证证据（**已通过**，非目测）
用 `.deepworks/tmp/verify-hero.html`（同源 iframe 探针）+ `.deepworks/tmp/probe_server.py`（回报端点）
在 Edge headless 中做断言，并把结果 POST 回文件：

- **实时模式**（`?` 无参数，`--autoplay-policy=no-user-gesture-required`）：
  | 时刻 | hero.className | video opacity | paused | readyState | 尺寸 | currentTime |
  | :-- | :-- | --: | :-- | --: | :-- | --: |
  | 加载 158ms | `hero is-video` | 0（淡入中） | false | 4 | 854×480 | 0.003 |
  | +2.5s | `hero is-video` | **1** | false | 4 | 854×480 | 2.507 |
  | +6s | `hero is-video` | **1** | false | 4 | 854×480 | 6.017 |
  - `veil opacity` 在 +2.5s 起 = **1**；`stars opacity = 0`；`inner zIndex = 2`；视频盒子 `1425×900 @ (0,0)` = **完整铺满首屏**；
    `muted=true`、`error=null`、`duration=54.8`；CSS 中三条 `is-video` 规则均已加载匹配。
- **截图模式**（`?shot=1`）：`video opacity=1 / transition 0s / paused=true / readyState=4`，`body` 带 `is-parallax-on` —— 定格可复现。
- **像素统计反证**（`System.Drawing` 采样截图，排除"其实没渲染出来"）：
  - 桌面 hero 区（y 60–500）：`meanLum=31.2  stdev=40.2  distinctColors=102`
  - 桌面下方（视差渐变区对照）：`meanLum=23.4  stdev=6.7  distinctColors=33`
  - 移动 hero 区：`meanLum=45.9  stdev=56.9  distinctColors=148`
  → hero 区**方差远高于**渐变区，证明渲染的是实拍画面而非平滑渐变。
- **HTTP**：`hero-loop.mp4 → 200 video/mp4`、`hero-poster.jpg → 200 image/jpeg`、页面 `200`。

### ⚠️ 无头验证踩坑（写给下一位，省 1 小时）
- **`--virtual-time-budget` 下 CSS 过渡不可靠**：`getComputedStyle().opacity` 会长时间停在**起始值**（本项目实测 veil 一直报 0，
  而真实浏览器 2.5s 就到 1），**极易误判成 CSS bug**。→ 需要真实时间测量时，用 `probe_server.py` 的 `/slow`
  慢速资源（`sleep 20s` 的 1×1 gif）把父页 `load` 拖住，Edge 就会**在真实时间**下存活，过渡正常推进。
- **`--dump-dom` 拿不到 stdout**：Edge 是 detached 启动的，`> file` 或 `*>&1 | Out-File` 全是 0 字节。
  → 要拿 DOM/断言结果，**用 HTTP 端点回报**（页面 `fetch(POST)` → Python 落盘），不要指望 stdout。
- **`--screenshot` 必须给绝对路径**：相对路径会被写到 Edge 自己的工作目录，文件"凭空消失"。
- 探针里改 `transition:none` 再读 `opacity` 是**污染性测量**：它会把过渡直接"跳"到终态并**永久改变实际值**，
  之后读到的 1 是假象。只可用于判断"选择器是否匹配"，不可用于判断过渡是否完成。

### 📸 本轮截图
- `artifacts/screenshots/v2-hero-video-desktop.png`（1440×900）、`artifacts/screenshots/v2-hero-video-mobile.png`（390×844）。

### 🔆 亮度调校（用户连续反馈三轮 · 仅改 CSS，未重新编码视频）
用户在内置浏览器预览后依次反馈"调亮一些"→"再亮一点"→"还想再亮一点"。**全程只动 CSS**，视频文件零改动：

| 项目 | 初始 | 第 ① 轮 | 第 ② 轮 | 第 ③ 轮（最终） |
| :-- | :-- | :-- | :-- | :-- |
| `.hero__video` filter | `brightness(.62) saturate(.92) contrast(1.02)` | `brightness(.80) saturate(.96) contrast(1.04)` | `brightness(.90) saturate(.98) contrast(1.06)` | **`brightness(1) saturate(1) contrast(1.1)`** |
| `.hero__veil` 放射渐变 | 中心 α.30 / 边缘 α.66 | 中心 α.18 / 边缘 α.54 | 中心 α.14 / 边缘 α.46 | 中心 **α.08** / 边缘 **α.36** |
| `.hero__veil` 纵向渐变 | .62 / .42 / .52 → #08131f | .44 / .24 / .34 → #08131f | .28 / .14 / .22 → #08131f | **.22 / .10 / .17** → #08131f |
| `.hero__veil` 窄屏（≤720px） | 同桌面 | 同桌面 | **单独加强** .22/.54、纵向 .36/.22/.30 | 单独加强 **.22/.50、纵向 .36/.20/.28** |
| 文字 `text-shadow` | 标题 .25 / 副标 .35，eyebrow **无** | 同左 | 同左 | 标题 **.45** / 副标 **.55** / eyebrow **新增 .55**；`.tag` 底色 .05→**.09** |

**遮罩底部始终是 100% `#08131f`** —— 这是"页 1 → 页 2 无接缝"的唯一依据，三轮调亮**都没动它**。

第 ③ 轮同时**加强了文字阴影与标签底色**：提亮必然削弱文字对比度，与其只靠"不许超过某个亮度"来回避，
不如把文字的对比度预算做厚 —— 这样既满足"更亮"，又不牺牲可读性。

#### ⚠️ 测量方法纠错（重要，前面两轮我量错了）
前两轮我报的是"hero 区平均亮度"，但那个区域**包含白色文字字形本身**。字形是 255 的纯白，
会把统计值整体抬高 —— 第 ③ 轮 `p95=215/255` 一度让我误判"背景太亮、白字要糊了"，
其实**那 215 几乎全是白字自己**。真正该量的是**没有文字的背景**。

改用「**左侧纯背景竖条**」（hero 左边距内 x=0–12/18，只有视频+遮罩，无任何文字）：

| 采样区域 | 桌面 | 移动 |
| :-- | --: | --: |
| 文字带（**含白字，会失真**）mean | 79.9 | 73.9 |
| 文字带（含白字）p50 | 75.6 | 57.5 |
| **纯背景竖条** p50 | **67.8** | **51.0** |
| **纯背景竖条** p90 | **71.2** | **55.3** |
| **纯背景竖条** p95 | **71.2** | **55.5** |

→ 真实背景只有 **桌面 ~68 / 移动 ~51**（边缘带渐晕，画面中心更亮）。白字（255）对它的对比度差 **180+**，
**根本不存在可读性风险**。结论：**统计 hero 亮度时必须避开文字，否则测的是字不是景**。

> 沿用的历史序列（含白字，仅用于看**相对趋势**）：桌面 31.2 → 48.7 → 63.8 → **79.9**；移动 45.9 → 62.0 → 66.8 → **73.9**。
> stdev 40.2 → 37.8 → 36.0：调暗时大量像素被压到 0 造成**截断堆积**把方差顶高，提亮后直方图铺开、方差回落；
> hero 区仍**远高于**纯渐变区的 7.2 → 证明渲染的确实是实拍画面。

#### 关于"窄屏单独加强"
第 ② 轮起给 `@media (max-width:720px)` 加了比桌面更强的遮罩。原因不是"移动端更亮"（实测背景反而更暗，51 vs 68），
而是**窄屏的 `object-fit: cover` 会把 854×480 横片放大到只截取中间约 43%**，正好是画面最亮的天空区域，
局部亮带更集中。加强后移动端与桌面观感基本持平（移动端仅略暗），**桌面完全不受影响**。

#### 经验边界（留给下一位）
- `.hero__veil` 纵向渐变的 `100%` **必须是纯 `#08131f`** —— 调亮时最容易顺手改掉，改掉就会在页 1→页 2 出现一条可见亮线。
- 提亮优先用**降低遮罩 α**（保留视频自身层次），而不是无限拉 `brightness`；`brightness` 拉到接近 1 时画面会开始"发灰"，
  所以第 ③ 轮同步把 `contrast` 提到 `1.1` 找回层次 —— **提亮务必配 contrast**。
- 亮度已经到顶：再亮就必须改**文字侧**（更大/更粗/更实的阴影或半透明底板），而不是继续压遮罩。

### 🧵 首屏 → 第二页 接缝体检与修复（本轮新增）

用户要求"页 1 → 页 2 必须丝滑过渡"。此前只用**静态单屏截图**检查过 —— 而接缝恰恰是"滚动中才出现"的问题，
静态截图永远查不出来。本轮改为**真实时间 + 逐行像素扫描**复查，果然抓到一条真实的横向台阶。

**方法**（`.deepworks/tmp/seam.html`）
- 外壳页挂一张 1×1 的 `/slow`（服务端 `sleep 20s`）拖住该页的 `load` 事件，让 Edge `--screenshot` 在**真实时间**下抓图，
  而不是靠 `--virtual-time-budget`（后者会让 CSS 过渡卡在起始值，产生假象）。
- `?gap=0.5` 把首屏底边滚到视口正中，再用 `System.Drawing` 逐行算平均亮度，找最大行间跳变。

**发现**：`y=450`（= 首屏底边）出现 **9.49** 的行间跳变，而相邻行的固有抖动噪声只有 ~0.9 → 是一条真实的 1px 横向台阶。

**根因**（与视频无关，旧版就存在）
- 首屏最底一行是**山峦剪影底层 `#050D19`**（全宽 20 点采样只有这 1 种颜色）。
- 第二页顶部是 `rgba(7,19,33,.94)` **叠加中心蓝色辉光**，实际约 `#06182D`（靠边）~ `#062039`（居中），比剪影亮。
- 两者直接相接就形成台阶。`.hero__veil` 在 DOM 里位于山峦**之下**，盖不住剪影 —— 所以此前那条"遮罩底部必须是 `#08131f`"的设计只在剪影以上成立。

**修复**：`.about-screen__bg::before` 压一条**同色 `#050D19`、向下 140px 渐隐**的窄带把台阶抹平（纯 CSS，无 HTML 改动、无权限依赖）。

**结果**

| | 修复前 | 修复后 desktop | 修复后 mobile |
| :-- | :-- | :-- | :-- |
| 接缝处最大行间跳变 | **9.49**（y=450） | **0.89** | **0.89** |
| 判定（阈值 1.5） | FAIL | PASS | PASS |

修复后 0.89 与画面固有抖动噪声同量级，且已不在接缝行；上下两侧色彩连续过渡。证据见
`artifacts/screenshots/v2-seam-before-desktop.png` 与 `v2-seam-after-desktop.png`。

**附带产出**：`artifacts/screenshots/v2-hero-live-desktop.png` —— 真实时间下抓到的"视频正在播放"首屏
（此前所有交付截图都是 `?shot=1` 暂停态，这张补上了真实播放证据）。

**教训**：查接缝/滚动过渡类问题，必须**真实时间 + 把接缝滚进视口 + 逐行扫描**；
只看单屏截图会漏掉这类问题。

**补记：用户复看仍报"还能看到一条线" → 定位结论**
- 复测确认接缝在**左 / 中 / 右三处、上下相邻 7 行都精确等于 `#050D19`**（亮度与色相均连续）
  → **磁盘上的 CSS 已不存在台阶**，0.89 与 9.49 不是同一回事。
- 逐项排除其他可能的横线：
  1. **第二页暗区色带**：沿竖线扫 290 行出现 276 种颜色、没有"长平段"，是 ±1 的细密抖动 → 肉眼不可见；
  2. `.bg-parallax__layer--far` 的顶边正好落在视口 51% 高度，但远山路径的脊线从 `viewBox y≈119` 起 → 层顶以上是透明的，不产生切线；
  3. `.hero__mountains` 这个 SVG 盒子的顶边（页面坐标 y≈440）：无背景填充、只有渐变山体路径 → 上方透明，不产生切线。
- 因此判定用户看到的是**浏览器里的旧样式**：`v2-style.css` 当时**完全没有版本号**，而 `?v=seamfix` 只刷新了 HTML、刷不到 CSS。
- **处置**：给 `v2-index.html` 的 `<link>` / `<script>` 加版本号（`?v=4`），并把"**改 CSS/JS 后版本号 +1**"写进工程约定（见 `project-continuity.md` §6）。
  → 若用户在带版本号的新页面上**仍**能看到线，则说明线不在接缝处，需要用户指出大致位置再查。

### ⚠️ 时间码踩坑（写给下一位）
- 早先那张 `_inspect/winA.png` 的烧入时间码是**相对** `-ss` 起点的，比真实时间**少 4s**（标签 00:00:08 实际是源 00:00:12）。
- 本文所有时间码均为**源绝对秒数**，来自 `.deepworks/tmp/vtest/mksheet.ps1` 生成的**无字** contact sheet（按 `Start + (row*Cols+col)*Step` 推算，不烧字 → 不需要字体、不需要任何系统目录权限）。

---

## v2 · 追加迭代同日（第五次：01 关于右栏空白真 bug + 首屏文案/标签 + 社交占位卡处置）

### 🐞 真 bug：01「关于我」右栏三张卡片永久不可见（本轮修复）

**用户反馈**：01 关于板块右侧一栏是空白的。

**根因**（探针实测确认，**不是**样式表缓存问题）
- `v2-index.html` 写的是 `<div class="about-info" data-stagger reveal>` —— `reveal` 被写成了**裸属性**，不是类名。
- 于是 `.reveal` 选择器**永远匹配不到**它 → IntersectionObserver 从不观察它 → `.is-visible` 永不加 →
  `[data-stagger].is-visible > *` 的揭示规则永不成立 → 三张卡片永久停在 `opacity:0; translateY(24px)`。
- 全页共 18 处 `class="… reveal"`，**只有这 1 处写错**；其余 4 个 stagger 容器（`study-grid` / `grid--three` / `skill-grid` / `social-grid`）子项均正常。

**修复**：`class="about-info" data-stagger reveal` → `class="about-info reveal" data-stagger`（只挪了这一个词）。

**证据**（`.deepworks/tmp/seam.html?probe=1&pys=1800` → `.deepworks/tmp/hero-report.txt`）

| 元素 | 修复前 | 修复后 |
| :-- | :-- | :-- |
| `div.about-info`（`.reveal`） | `is-visible` 未加，`vis=false` | `vis=true`（已加 `is-visible`） |
| 3 × `div.card.about-card` | `opacity:0`、`translateY(24px)` | **`opacity:1`、`translateY(0)`** |

实拍：`.deepworks/tmp/r5-about-desktop.png`（「一处坐标 / 一个灵魂 / 科研 · 获奖成果」三张卡片全部显示）。

**教训**：`reveal` 与 `class="reveal"` 在源码里只差几个字符，但前者是**没有任何效果的裸属性**。
排查"内容明明写了却看不到"时，除了查样式表缓存，**还要确认选择器是否真的匹配到了** —— 用探针跑 `getComputedStyle` 看数字，别靠肉眼。

### ✍️ 首屏文案与标签（用户要求）
- 标签行新增 **「智能医学工程在读」并排在首位**（与「旅行摄影 / 航拍 / 剪辑 / 乐于助人」同级）；
- 副标题第二行 `用镜头定格每一帧转瞬即逝的美好。` → **`也在大一，把课表上的每一门基础课啃成自己的底气。`**
  （用户原话："换成和我的学习状态相关的话，不要给人的感觉是我只会玩"）；
- 上方小字改为 `现代徐霞客 · 天津大学（深圳）`，避免与新标签「智能医学工程在读」重复（用户选定）。

### 🀄 中文断行修复（移动端真问题）
- 新文案 24 字，390px 下列宽不够，被浏览器按字断行 → 出现 **「…每一门基础课啃成自 / 己的底气。」**：`自己` 被拦腰截断，且末行只剩 3 字（孤行）。
- 修复：加 `<br class="hero__br--m" />` —— **窄屏专用换行**，在词组边界断开，仅在 `@media (max-width:560px)` 生效；桌面端 `display:none`，不影响单行排版。
- 结果：390px / 480px 均为干净三行（`…每一门基础课` ⏎ `啃成自己的底气。`），1440px 仍单行、无回归。

### 🔗 06 社交：占位卡片改为"不可点"
- 抖音 / 视频号 原为 `href="#"`，点击会弹出**原生 `alert`**（"链接暂未配置"）——体验差、像半成品。
- 处置（用户选定"暂时改成不可点"）：`<a href="#">` → **`<div class="social-card social-card--soon">`**，
  右侧箭头 `→` → **「筹备中」小圆标**；新增 `.social-card--soon` 关掉 hover 上浮/配色变化（不再暗示"能点"）。
- B站 保持真实链接与 `→` 箭头不变；同时**删掉已失效的 JS 占位弹窗拦截**（否则它会误绑到新的 `div` 上再次弹窗）。
- 待办：拿到抖音 / 视频号主页链接后，把 `div` 换回 `a`、去掉 `--soon`、把「筹备中」换回 `→`。

### 🀄 标点
- 04 镜头「航拍」卡：`"上帝之眼"` 直角引号 → 中文弯引号 `“上帝之眼”`（全站直角引号清零）。

### 验证
- 探针断言（上表）+ 真实时间截图 1440×900 / 480×844 / 390×844（`.deepworks/tmp/r5-*`、`r6-*`、`r7-*`）。
- 改动同时把 `v2-index.html` 的 `<link>`/`<script>` 版本号 `?v=4` → **`?v=6`**（含 CSS 改动，见 `project-continuity.md` §6）。

## v2 · 追加迭代同日（第六次：首屏姓名被拆字空白推偏 + 01 左栏照片位接入）

### 🀄 首屏姓名不居中（拆字动画的空白未归一）

**用户反馈**：首屏姓名那行（逐字浮入的拆字动画）看起来不是居中的。

**根因**：`splitText()` 把 `el.textContent` **原样**逐字符包 `span`。HTML 里标题是多行书写的，源码中的换行 + 缩进会被 `textContent` 带进来；这些空白被包成**含 `&nbsp;` 的实宽 `inline-block`** 后就**不再参与空白折叠**，于是它们作为真实宽度一起参与 `text-align:center` 的居中计算 → 整行被推偏（严重时挤到第二行）。

**修复**（`v2-script.js` `splitText()` 首行）：

```js
var text = el.textContent || "";
// →
var text = (el.textContent || "").replace(/\s+/g, " ").trim();
```

统一压成单个空格、再去掉首尾空白。**做拆字类动画时，一律先归一空白再拆。**

**验证**（探针量每个字的中心点与容器中心偏差）：桌面 1440 → 610 / 720 / 830，偏差 **0 / 0 / 0**；移动 390 → 145 / 195 / 245，偏差 **0 / 0 / 0**，两个视口均为**单行**。
证据 `artifacts/screenshots/v2-hero-title-offcenter-before.png`、`v2-hero-title-fixed-desktop.png`、`v2-hero-title-fixed-mobile.png`。

### 🖼 01 左栏占位图 → 真实证件照

- `.about-photo__frame` 里的占位 SVG 换成真实照片 `<img class="about-photo__img" src="assets/about/portrait.jpg">`；
- `.about-photo` 同时补上 `reveal` 类（原来只有 `data-dir="left"` —— 而 `[data-dir]` 的揭示规则**要求元素同时带 `.reveal`**，否则永不触发，与第五次那个 `reveal` 裸属性是同一类坑）；
- 图片按 3:4 预裁 1080×1440，`object-fit: cover` + `object-position: 50% 40%` 仅作换图时的兜底裁切重心。

证据 `artifacts/screenshots/v2-about-photo-desktop.png` / `-mobile.png`。本轮含 CSS/JS 改动 → 版本号 `?v=6` → **`?v=7`**。

## v2 · 追加迭代同日（第七次：01 左栏照片墙 4 张滚动渐显 + C1/C2/C3 打磨）

### 🎯 需求（用户）

把 01「关于」左栏那个照片位做成**照片墙**：滚轮下滑时**依次渐显**切换 4 张照片，**最后停在证件照**上（用户明确：**证件照不要放第一张**）。

### 🧱 素材

- 用户本轮新放三张原图在项目根（`微信图片_20260910235441_86_58.jpg` / `…_235442_87_58.jpg` / `…_235443_88_58.jpg`，**不入库**）；
- 用 `.deepworks/tmp/mkimg.ps1`（读 EXIF `0x0112`、`HighQualityBicubic`、质量 86）统一裁成 **1080×1440（3:4）** 存到 `v2-web/assets/about/`：
  `photo-01-dragon.jpg`（舞龙）/ `photo-02-selfie-huawei.jpg`（门店灯光自拍）/ `photo-03-selfie-metro.jpg`（地铁自拍）/ `portrait.jpg`（证件照）。

### ⚙️ 实现

- **CSS**：`.about-photo__frame` 加 `position: relative`；`.about-photo__img` 改**绝对定位满铺**（`object-fit: cover`、`opacity: 0`、`will-change: opacity`）；
  `.about-photo__img:first-child { opacity: 1 }` 作为**禁用 JS / 脚本报错时的兜底画面**。
- **JS**（`v2-script.js` 末尾新增第 4 个 IIFE）：以**整块 `.about-main`** 在视口里走过的行程当进度条
  —— **不能用 `.about-photo`**：它是 `position: sticky`，停驻期间 `rect` 不再变化，进度会冻住。
  `from = vh * 0.72` 记 0（照片刚露头、`reveal` 也已触发）→ `to = -rect.height * 0.1` 记 1（区块再往上走 0.1 个自身高度）。
  4 张各占 `SEG = 1/4`，重叠宽 `fade = SEG * 0.55`，第 i 张 `opacity = min(in, out)`；
  rAF 节流 + `{ passive: true }` + `resize` 重算；**纯滚动位置函数 → 往回滚能原路返回**，不会出现单向状态。
  `prefers-reduced-motion: reduce` → **不挂监听，直接定格在最后一张（证件照）**。
  ⚠️ **必须始终写数值** `String(Math.round(o * 1000) / 1000)`：曾写成 `o === 1 ? "" : o`，空字符串会让 `opacity` 回落到 CSS 的
  `:first-child { opacity: 1 }`（对 i ≥ 1 的图即 0）→ 出现"该亮的不亮"。

### ✅ 验证（数值 + 实拍双证）

桌面 1440×900（`.about-main` absTop 2138 / h 850 / vh 900 → `t = (scrollY - 1490) / 733`）：

| scrollY | t | 4 张 opacity（书写顺序） | 实拍 |
| --: | --: | :-- | :-- |
| 1500 | 0.014 | 1 / 0 / 0 / 0 | 舞龙 ✓ |
| 1700 | 0.286 | 0.739 / 1 / 0 / 0 | — |
| 1950 | 0.628 | 0 / 0.076 / 1 / 0.105 | 地铁自拍 ✓ |
| 2100 | 0.832 | 0 / 0 / 0.406 / 1 | 照片贴顶定格（top 96） |
| 2250 | 1.000 | 0 / 0 / 0 / 1 | 证件照 + caption ✓ |
| 2600 | 1.000 | 0 / 0 / 0 / 1 | 照片已随区块离场 |

实测值与公式预测**逐点吻合到小数点后三位**；相邻两张重叠期 opacity 之和 ≥ 1 → **无背景透底**。
移动 390×844（`.about-main` absTop 1927 / h 1439）：1400 → `1/0/0/0`（此时 `reveal` 尚未触发）→ 1600 → `0.179/1/0.002/0` → 1800 → `0/0/1/0.196` → 2000 / 2200 → `0/0/0/1`，序列单调、最后定格证件照。
实拍 `artifacts/screenshots/v2-photowall-{01-dragon,02-huawei,03-metro,04-idphoto}.png`、`v2-photowall-mobile-idphoto.png`。

- 照片落位无回归：桌面 `l=204 / w=451 / cx=430`（与容器中心一致）；移动 `l=35 / w=320 / cx=195`。
- **移动端照片不"钉住"**：≤760px 时 `.about-main` 是**单列 grid**，`.about-photo` 的 sticky 行程 = 自身高度 → 行程 0，照片随页面上滚。
  用户已确认**保持现状**（第 4 张证件照出现在照片快滚出上沿时，可接受）。

### ✨ C1：足迹字幕可读性

`.ms-tile__cap` 的暗角由 `0% → 0.74 @78%` 改为 **`0% → 0.5 @44% → 0.9 @100%`**，并加一层很轻的 `text-shadow`：
亮部照片（湖面 / 海面 / 草原天空）压到标题行时白字仍清晰，同时不再整块发黑。实拍 `artifacts/screenshots/v2-journey-caption-scrim-after.png`。

### ✨ C2：导航底边把太阳辉光切断（硬边）

**真因**：`.bg-parallax__sun` 的 `box-shadow` 辉光向上溢到导航高度，而 `.nav--scrolled` 把毛玻璃底**画在 `.nav` 本体**上，
底边的 `border-bottom` 就在辉光中间切出一条横向硬边（视差背景淡入后整页常驻）。

**修复**：毛玻璃底挪到 **`.nav::after`**（`z-index: -1`、`opacity` 过渡），并给底边做 **22px 渐隐**的 `mask-image`
（`#000 66% → 透明 100%`；mask 同时作用于 `backdrop-filter`，连模糊都是平滑收尾）；**同时移除**原来的 `border-bottom` 发丝线。

**实测**（真实时间截图逐行平均亮度，x = 1050–1220）：导航底边处 **+22 ~ +33（2px 内） → +2.9 / +0.7**，全段最大 |Δ| = 5.1 且位于日轮自身渐变内部。

⚠️ 副作用（须知悉）：**导航栏下面那条 1px 发丝线没有了** —— 这是消除硬边的必要代价（用户已确认）。

### ✨ C3：06 社交面板下方 128px 空档

**真因**：`.section { padding: clamp(72px, 10vw, 128px) 24px }` —— 1440 下上下各 128px；06 社交只有一行卡片，
内容止于 ≈425，面板下半截就是这段统一留白本身（不是布局错位）。

**修复**：`@media (min-width: 761px) { #social.section { padding-bottom: 72px } }`（窄屏本来就是 72px）。

**实测**：`#social` 面板高 **555 → 499**；卡片底到面板底 **128 → 72**；`docH 9221 → 9165`（正好 −56）；
**移动端 docH 10762 不变** → 确认该覆盖只作用于桌面。

### 🔎 顺手量出一条非本轮引入的硬边（已记入待办）

`y=1550` 截图视口 y ≈ 250 处（= 文档 y=1800，**about-screen 下沿 vs 视差天幕交界**）存在 **+11.6 的逐行亮度跳变**，横贯整个天空宽度。
非本轮引入（本轮未碰背景），但既然量到了就记录：**用户已定"下一轮修"**（照首屏→第二页接缝的做法压同色渐隐带，实测降到 1.5 以下为止）。
之前几轮没发现的原因：都在 y=1800 取样，那时这条线正好落在视口 y=0、被导航挡住。

### 🧰 本轮工具坑（已写进 `project-continuity.md` §6）

1. **探针 `psel` 里含 `#` 必须 URL 编码成 `%23`**：浏览器把 `#` 之后当 URL fragment，`#social.section` 进到探针只剩 `section`，直接抛 `Failed to execute 'querySelectorAll' … '.ms-tile__cap,' is not a valid selector.`。
2. **每批 probe 前必须重启 8125 的 `probe_server.py`**：它**约 150s 未收到报告就自退**，上一批残留 / 已自退时下一批会出现 "REPORT MISSING" 假象。
3. **报告要轮询等**（3s 常常不够）：`for ($i = 0; $i -lt 25; $i++) { if (Test-Path …) { break }; Start-Sleep 3 }`。
4. **探针那次运行自带的截图是初始态（y=0）**，对观感没有价值 → 要看画面必须另跑一次普通截图。
5. **`getBoundingClientRect()` 含 `.reveal` 的 `translateY(28px)`**：未揭示时读到的 `top` 比真实值大 28px（移动端 1955 vs 1927 就是这么来的）。

本轮含 CSS/JS 改动 → 版本号 `?v=7` → **`?v=8`**（三处：`v2-style.css` / `v2-about-data.js` / `v2-script.js`）。

---

## v2 · 追加迭代（第八次：03 足迹拼图改为"进入视野才开演"，去掉加载即播的兜底）

### 🎯 现象（用户反馈原话）
> "足迹拼图的动画看不到，是不是图片加载太早了？"

### 🔍 根因（两条，都在 `v2-script.js` 的足迹 IIFE 里）

1. **加载即播的兜底定时器**：`if (armed) { window.setTimeout(start, 2500) }` —— 页面打开 **2.5 秒后无论用户在哪都会开演**。
   而桌面 `[data-mosaic]` 在文档 y=**4872**，用户从首屏滚到 03「山川湖海足迹」要好几秒 —— 滚到时动画**早就播完了**，
   只剩拼好的静态结果。这正是"看不到动画"的**直接原因**。
2. **`IntersectionObserver` 用面积比例 `threshold: 0.16` 不可靠**：拼图比视口高得多时（窄屏 6 列骨架更明显），
   可见面积永远到不了 16% → 回调永不触发 → 实际只剩上面那条定时器在起作用（动画退化成"加载即播"）。

### ⚙️ 修复（只动**触发**，不动动画本身的算法与时长）

```
旧（要点）：
  new IntersectionObserver(cb, { threshold: 0.16 }).observe(mosaic);
  if (armed) { window.setTimeout(start, 2500); }      // ← 元凶

新：
  var TRIGGER = 0.8;                                   // 视口高度的 80%
  var started = false;
  function visible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return mosaic.getBoundingClientRect().top < vh * TRIGGER;
  }
  function check() { if (!started && visible()) start(); }
  function start() {
    if (started) return;
    started = true;
    window.removeEventListener("scroll", check);       // 开演即摘监听，绝不重播
    window.removeEventListener("resize", check);
    layout();                                          // 开演前再校正一次位移向量
    play();
  }
  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);
  if (document.readyState === "complete") check();
  else window.addEventListener("load", check);
  window.setTimeout(check, 400);                       // 兜底：直接落在 03 附近打开 / 锚点跳转
```

- 判据是**元素顶边 vs 视口高度**，**与元素自身多高无关** → 窄屏 6 列骨架同样成立（不再有面积比例死角）；
- **去掉一切"加载后 N 秒"**：只有真的进入视野才开演；
- `started` 守卫 + 开演摘监听 → 不会重复播放；
- `?shot=1` / `prefers-reduced-motion` 的**定格分支未动**（仍直接 `is-in is-done`，静态截图行为不变）。

### ✅ 验证（探针实测，桌面 1440×900，`seam.html?probe=1`）

| 快照 | scrollY | `[data-mosaic]` top | `cls`（完整类名） | 首张 `.ms-tile` 的 transform |
| :-- | --: | --: | :-- | :-- |
| 第 1 次（t≈3s） | 0 | 4872 | `journey-mosaic is-armed` | `opacity 0`、`scale .861`、位移 `(-280, -158)` |
| 第 2 次（t≈5s） | 0 | 4872 | `journey-mosaic is-armed` | 同上 —— **已超过旧的 2.5s，仍未播 → 兜底确实被去掉了** |
| 第 3 次（t≈7s） | 0 | 4872 | `journey-mosaic is-armed` | 同上 |
| 第 4 次 | 3600 | 1272 | `journey-mosaic is-armed` | 同上（1272 > 触发线 720 → **正确地不开演**） |
| 第 5 次 | 4200 | 672 | `journey-mosaic is-armed is-in` | `opacity 1`，位移已收拢到 `-0.05px`（**正在归位**） |
| 第 6 次 | 4700 | 172 | `journey-mosaic is-armed is-in is-done` | `transform: none`（**已定格**） |

触发线 = `0.8 × 900 = 720`：top 从 **1272（不触发）** 到 **672（触发）**，实测与公式一致。

### 📸 真实时间实拍（抓"过渡进行中"的帧）

虚拟时钟会把过渡**快进到终点**（连 `setTimeout` 也一起快进），所以中段帧必须走真实时间。
本轮给取证外壳 `.deepworks/tmp/seam.html` 加了 **`&y_at=<毫秒>`**：把滚动推迟到指定时刻，
并用 `/slow` 拖住外壳页的 `load` → headless 在真实时间里活到 20s 才截图：

- `artifacts/screenshots/v2-journey-flyin-late.png` —— **飞入中**：上排（山 / 湖 / 海 / 城与人）已归位且清晰，
  「追光 / 古镇 / 日落」仍处于**模糊 + 位移**中（`filter: blur(14px)` 尚未收尾）；
- `artifacts/screenshots/v2-journey-flyin-done.png` —— 同一位置**归位后**的对照帧。

### 🧰 本轮工具坑（已写进 `project-continuity.md` §6）

1. **探针的快照 `n` 字段只保留前两个 class**（`String(className).trim().split(/\s+/).slice(0, 2).join(".")`）→
   `is-in` / `is-done` **被截掉**，一度据此**误判"触发没生效"**。已给快照对象加 `cls: String(el.className || "").trim()`（完整类名），
   判断状态**一律看 `cls`**。
2. **`--virtual-time-budget` 会快进过渡与定时器** → 抓"动画中段"必须**去掉该参数**
   （`shot.ps1` 新增 `-RealTime` 开关）+ `/slow` 撑住 `load` + `&y_at` 控制滚动时刻；
   同一次会话里 y_at=18900 与 19200 抓到的相位明显不同（文件 954,629B vs 692,492B），证明真实时间链路生效。
3. **无渲染帧时过渡不推进** → 不要用截帧里的 `opacity` 判断动画是否在跑；
   用"**类名是否加上 + `transform` 数值**"更可靠（本次两张实拍 + 探针数值互相印证）。

本轮含 JS 改动 → 版本号 `?v=8` → **`?v=9`**（三处：`v2-style.css` / `v2-about-data.js` / `v2-script.js`）。

---

## v2 · 追加迭代（第九次：第二页 aboutme 改成苹果发布会 hello 式"丝滑手写"）

### 🎯 现象（用户反馈原话）
> "第二页 aboutme 想换成苹果发布会 hello 开场那种丝滑效果，现在的文字弯曲处都还有棱角，颜色也要苹果发布会那种彩色。"

随后用户发来参考图：**白底、连笔花体 hello、彩虹渐变（h 绿→黄、e 黄→橙、l 橙红→粉、l 粉紫→紫、o 紫→蓝带小尾巴）、笔画粗细均匀边缘圆润**。
已用确认框对齐三件事：**文字保留 "about me"**、**现在就开工**、**允许引入开源手写字体**。

### 🔍 棱角真因
旧实现是**描摹**：`v2-about-data.js` 里 10 条 `C` 路径（坐标被网格化成 172.86 / 144.29 / 230.0 …），逐笔 `stroke-dashoffset` 写出。
描摹曲线在**段与段相接处切线不连续** → 放大后就是多边形折角，这正是"弯曲处都有棱角"的来源；
而且**字号越大折角越明显**（此路无解，只能换做法）。

### ⚙️ 新方案（字是"打"出来的，不是"描"出来的）
1. **真字体字形**：单词交给内置花体字体 **Pacifico**（SIL OFL 1.1 / Google Fonts latin 子集 32KB）渲染 →
   视觉边缘由**字形轮廓**决定，天然平滑无折角。`@font-face` 用 `font-display: block`；
   JS 先 `document.fonts.load('400 150px "Pacifico"')`，**就绪后才量尺寸**（否则量到后备字体，缩放全错）。
2. **彩虹渐变**：`<linearGradient gradientUnits="userSpaceOnUse">` 七档
   （`#5fd35f → #b8e34a → #ffd23f → #ff9b42 → #ff5f9e → #b06bff → #4aa8ff`），
   `x1/x2` 由 JS 按**实测字宽**写死 → 无论字号怎么变，彩虹始终"左绿右蓝"铺满整词。
3. **遮罩推进"写出"**：一条圆头粗描边（`.word-brush`，白色）走一条略带回勾的水平路径，作为 `<mask>` 从左向右扫；
   `strokeDasharray = L L` + `strokeDashoffset = L*(1-t)`（t=0 全隐、t=1 全显），**圆头的弧线就是"笔尖推进边"**。
4. **笔尖跟随**：纸飞机用 `getPointAtLength(L*t)` 定位 + `atan2` 转向，收笔后 0.35s 淡出。
5. **节奏**：`smoothstep`（`p²(3-2p)`）+ **2000ms**（起笔轻、行笔稳、收笔缓）。
6. **触发**：沿用第八次教训，按**单词元素自身顶边越过视口 60%** 才开演（单词 absTop = **1276**，桌面开演 scrollY ≈ **736**）；
   若按 section 顶边 `0.8*vh` 算，scrollY=180 就播完了（用户还在首屏）。
   另有 `scroll` / `resize` / `load` 触发 + `started` 守卫 + 开演摘监听 + `setTimeout(check,400)` 兜底；
   `?shot=1` / `prefers-reduced-motion` 直接 `render(1)` 定格 + 笔尖隐藏。

### 🧰 本轮踩到的四个坑（已写进 `project-continuity.md` §6）

1. **`font-size` 写成 SVG 呈现属性会被 CSS 覆盖** → 缩放静默失效。
   探针实测字宽只有 **424px**（应约 **706px**）；改成内联 `style.fontSize` 后 **706px** ✓（本轮唯一"改了没生效"的真 bug）。
2. **`getBBox()` 对 `<text>` 返回的是字体 em 盒**（Pacifico ≈ 1.76em 高 = 334px）**≠ 墨迹范围**（179px）→
   笔刷的**纵向位置与粗细不能由 box 推导**（会偏到字外），改用**画布中线 + 固定粗细 260**；
   而"按盒中心 = 画布中心"的居中仍然可用（实测墨迹中心 566 vs 容器中心 575，仅高 9px）。
3. **`maskUnits="userSpaceOnUse"` 的矩形会真的裁掉字形** → 遮罩区域从 `0..260` 放宽到 `y=-200 h=660`。
4. **`probe_server.py` 收到 `/report` 就自杀**（`main()` 等 `OUT.exists()`）→ **探针与其后的抓图不能共用同一次服务会话**，
   否则后面抓图的 `/slow` 立即失败、`load` 提前 → 截图停在页顶，看起来极像"滚动没生效"。

### ✅ 验证

| 项目 | 手段 | 结果 |
| :-- | :-- | :-- |
| 截图是否真在第二页 | 逐像素找"绿通道显著大于红/蓝"的颜色锚点（首屏没有绿色） | 首轮两张图 **0** 个绿像素 → 查出它们其实停在页顶；重启服务后 **22,845 / 42,868** ✓ |
| 字宽 / 居中 | 探针 `#wordInkText` | `w 424 → 706`、`l 367`、`cx 720`（= 容器中心）✓ |
| 书写进度 | 逐像素量彩色墨迹横向范围 | 书写中 `x 373..729`（≈50%）；定格 `x 373..1072`（整词 **699px**）✓ |
| 纵向位置 | 同上 | 墨迹 `y 477..656`，中心 **566** vs 容器中心 575 ✓ |
| 笔尖收笔 | 探针 `#wordPen` 的 `op` / `tf` | 书写中 `op=1`、`tf … 714.9, 160.2`（在字中段且带旋转）；定格 `op=0` ✓ |
| 移动端 | 390×844 实拍 | 字宽 **335/390**、整词写出 ✓ |

实拍（`artifacts/screenshots/`）：`v2-about-word-writing.png`（书写中）/ `v2-about-word-rest.png`（定格，笔尖已隐）/ `v2-about-word-mobile.png`（移动）。

### ⚠️ 已知取舍
字体轮廓是**并集后的整体形状** → 参考图里"笔画交叠处半透明叠加"那种细节**无法用字体复现**（可近似、不可等同）。
若后续坚持要这个细节，得回到**手绘重叠笔画**的路子（即放弃"字形级平滑"，或改用图片素材）。

本轮含 HTML/CSS/JS 改动 + 新增字体文件 → 版本号 `?v=9` → **`?v=10`**（两处：`v2-style.css` / `v2-script.js`；
同时**移除** `v2-about-data.js` 的 `<script>` 标签，改为不再加载）。
