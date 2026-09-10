# 项目连续性说明 · 个人主页

> 这份文档是**给下一位智能体（及用户）看到的关键上下文**。
> 目的是：下次新建对话（v2 及以后）时，即使没有本轮聊天记录，
> 也能凭借本目录下的文件**完整接续**，不遗忘任何细节。
> 请把本文件当作项目的"记忆库"。

---

## 1. 项目是什么
- 在 **Vibe Coding 课程**中，用 AI 辅助编码完成一个**个人网页主页**（个人数字名片）。
- 主人：**江沁钊**，四川成都人，**智能医学工程**专业大一学生，成绩不错。
- 核心人设：**当代"现代徐霞客"** —— 痴迷旅行、足迹遍布山川湖海、醉心各地风土人情；
  自学**摄影、航拍、剪辑**，用镜头保存美好；性格**活泼开朗、时 i 时 e**、乐于助人。
- 社交媒体：**抖音 / 哔哩哔哩 / 视频号**，均为同名账号「**不会飞的jiang**」。
- 使用场景：① 简历/面试给 HR；② 陌生初次见面介绍自己；③ 老师 / 朋友浏览。

## 2. 设计基调（务必保持）
- 关键词：**大气、简约、以"山川湖海"为主题背景**。
- 视觉风格：**Apple 官网式极简高级** —— 大量留白、冷峻蓝灰白配色、现代无衬线字体（SF Pro / PingFang）、轻阴影。
- 主色：深空蓝 `#0b1f38`、Apple 系蓝 `#0a84ff`、白色背景；浅灰分区 `#f5f5f7`。
- 导航：**居中、透明、无品牌名**，滚动后毛玻璃；移动端为汉堡菜单。
- 避免：金色花哨渐变、emoji 图标（改用线性 SVG）、宋体/衬线古风字。
- 保留"游历天下 + 温暖同伴"的双面人设，但呈现方式要克制。

## 3. 课程阶段（Vibe Coding 大纲，评分项）
- **V1** = MVP 最小可行产品（★ 已完成）。评分：MVP、Git checkpoint、AI、数字孪生、GitHub、Feedback 等。
- **V2** = Git / checkpoint（"后悔药"存档）+ 继续完善功能（★ 已完成：新增「学业 · 专业」整页板块 + 导航"学业"入口；
  以及首屏之后淡入的「太阳 + 分层细节山峦」视差背景，并把「学习日常」改写为**劳逸结合**——
  以上**全部属于文件版本 v2**）。
- **V3** = Supabase Dashboard + Feedback（接入后端、数据看板、意见反馈）。
  → 尚未开始；开始时归档为 **`v3-web/`**（见 §4）。
- **V4** = 数字孪生 / AI 集成（把 AI 能力真正融入页面）。

> ⚠️ **两套编号不要混**：**课程阶段**用 V1～V4（大写 V + 大纲顺序），**文件版本**用 v1/v2/v3…（小写 v + 目录名）。
> 目前二者一一对应：**课程 V2 的产出 = 文件版本 v2**（「学业」板块与视差背景同属 v2，用户明确要求**不为视觉打磨单独新开版本号**）。

## 4. 版本命名约定（重要）
- **所有本版本生成的文件，文件名都以 `v1` 开头**（如 `v1-index.html`、`v1-style.css`、`v1-script.js`、`v1-progress-report.md`）。
- **下一次迭代（v2 开新对话）时，所有文件改为 `v2` 开头**，依此类推到 v3、v4。
- 每版都需在 `docs/` 下追加进度记录，并在 `artifacts/screenshots/` 保存截图。
- **每个版本独立成目录**（`v1-web/`、`v2-web/`、`v3-web/`…），旧版本目录**保留不删**，作为可回退存档。
- 已占用/已规划的文件版本号：
  | 文件版本 | 内容 |
  | :---: | --- |
  | v1 | MVP 主页 |
  | v2 | 「学业 · 专业」整页板块 + 视差山峦背景 + 「学习日常」改写（劳逸结合） |
  | v3（规划） | 课程 V3 的 Supabase Dashboard + Feedback |

## 5. 当前文件清单
### v1（已完成）
```
v1-web/
├── v1-index.html          # 主页 HTML（含首屏/关于/足迹/镜头/社交/智能体/联系/页脚，导航居中无品牌名）
├── v1-style.css           # 样式：Apple 式极简主题、响应式、截图模式
├── v1-script.js           # 交互：导航、汉堡菜单、滚动显现、数字滚动、社交占位
└── assets/                # (空) 预留照片与资源目录
docs/
└── v1-progress-report.md  # v1 迭代进度报告
artifacts/
└── screenshots/
    ├── v1-desktop-full.png   # 桌面端全页截图
    └── v1-mobile-full.png    # 移动端全页截图
```
### v2（已完成：「学业 · 专业」整页板块 + 视差山峦背景 + 足迹拼图）
```
v2-web/
├── v2-index.html          # 新增 #study 学业板块（导航新增"学业"，序号顺延至联系08）；<main> 前新增 #bgParallax 背景块；足迹板块改为 .journey-mosaic（10 张 .ms-tile，内含 <img class="ms-tile__media"> 真实照片）；首屏 .hero 内新增 <video class="hero__video">（实拍循环视频背景）+ .hero__veil（压暗遮罩）
├── v2-style.css           # 学业板块样式 + 响应式；.bg-parallax* 背景层 + 磨砂卡片 + 移动端/reduced-motion 降级；.journey-mosaic/.ms-tile* 拼图骨架与入场动效（.ms-tile__media 即 <img>）；.hero__video/.hero__veil/.hero.is-video*（视频层 + 遮罩 + 星空让位，底部收 #08131f 衔接第二页）；html.shot
├── v2-script.js           # 沿用 v1 交互，末尾新增三个独立 IIFE：视差（data-px 位移 + is-parallax-on 淡入）、足迹拼图（四周涌入 + 错峰归位）、首屏视频（play() resolve 才加 .hero.is-video，被拒/失败/降级静默回落渐变）
├── v2-about-data.js       # "About me" 手写 SVG 笔画数据（沿用 v1）
├── assets/
│   ├── journey/           # ★ 足迹实拍照片（10 张，共 2.5MB）：01-shan / 02-hu / 03-hai / 04-cheng-yuren / 05-xingkong / 06-zhuiguang / 07-guzhen / 08-caoyuan / 09-richu / 10-lushang .jpg
│   └── hero/              # ★ 首屏视频背景（8.1MB）：hero-loop.mp4（54.8s / 854x480 / H.264 / 无音轨 / faststart）+ hero-poster.jpg
└── tools/
    ├── gen-bg-parallax.py # ★ 山峦脊线生成器：幂等、可复现，改 LAYERS/PALETTE 即可调参
    └── build-hero-loop.ps1# ★ 首屏视频循环构建器：幂等、可复现（EDL 与交叉时长在文件顶部常量），**不依赖字体/系统目录**
docs/
└── v2-progress-report.md  # v2 迭代进度报告（含四个追加迭代章节）
artifacts/
└── screenshots/
    ├── v2-study-desktop.png     # 桌面端「学业 · 专业」板块（含改写后的学习日常）
    ├── v2-study-mobile.png      # 移动端（375 视口）学业板块
    ├── v2-menu-mobile.png       # 移动端汉堡菜单展开（含"学业"）
    ├── v2-parallax-desktop.png  # 桌面端滚过首屏：太阳 + 三层山峦淡入
    ├── v2-parallax-mobile.png   # 移动端 390 视口：山峦 + 太阳，无溢出
    ├── v2-journey-desktop.png   # 桌面端足迹拼图（10 张圆角卡片拼成完整矩形）
    ├── v2-journey-inflight.png  # 足迹拼图动画冻结在 22%：卡片仍在四周散开
    └── v2-journey-mobile.png    # 移动端 390 视口足迹拼图（6 列骨架，同样成矩形）
    ├── v2-hero-video-desktop.png# 桌面端首屏实拍视频背景（1440×900，?shot=1）
    └── v2-hero-video-mobile.png # 移动端首屏实拍视频背景（390×844，?shot=1）
```
- 学业板块内容：专业名片（**天津大学（深圳） · 智能医学工程 · 大一**）+ 核心课程标签墙 + **学习日常（劳逸结合：周中教室/自习室，周末探索世界）**。
- 背景构成：深空暮色天幕（含太阳侧暖光晕）→ 太阳（`data-px=16`，最远）→ far/mid/near 三层山峦（`data-px=48/88/152`）。
- 每层 = 1 个 `<svg>` + **3 条脊线**（远/中/近，颜色依次加深）+ 1 条**日照金边**；三层共 9 条脊线、3 条金边。
- 山脊算法：**4～6 个宽主峰 + 11～15 个侧坡碎峰 + 8 阶 value noise**，谷底 `floor` 0.22～0.26 抬升 → 层叠山体而非均匀锯齿。
- 视差：`start = hero 高度 × 0.75`，进度归一化后按 `data-px` 做 `translate3d`，rAF 节流、只改 transform。
- 可读性：内容卡 `.section--tinted` 改半透明 `rgba(16,29,48,.62)` + `backdrop-filter: blur(10px) saturate(120%)`。
- **足迹拼图**：`.journey-mosaic` 用 `grid-template-columns: repeat(12,1fr)` + `grid-auto-rows: var(--row)` 搭 **12×6 骨架**，10 张 `.ms-tile`（`--m1`～`--m10`，`--lg` 大字 / `--s` 只留标题 / `--big` 移动端通栏）用 `grid-area` **恰好铺满**；入场由 JS 按每张卡片相对中心的向量算出 `--dx/--dy/--sc`（四周涌入）+ 角度排序的 `--d` 错峰延迟（`STEP = 0.10s`），`cubic-bezier(.16,1,.3,1)` **1.6s** 归位；手机端 760px 以下换 6 列骨架（`span 3` / `--big` 为 `span 6`）。
  - 每张卡已接入**真实照片**：媒体元素即 `<img class="ms-tile__media" src="assets/journey/…" alt="…" loading="lazy" decoding="async">`，`object-fit: cover` + 每张独立 `object-position: var(--pos)`（由 `.ms-tile--mN` 承载，兼作加载失败兜底底色）；`::after` 柔光挂在 `.ms-tile` 上，`.ms-tile__cap` 有 `z-index: 2`。
  - 拼图**几何自检**：`.deepworks/tmp/check-mosaic.html` 在 iframe 中按 `?cols/rows` 还原骨架，断言「外框齐边 + 每单元中心命中且仅命中一张 + 尺寸为整数单元 + 逐行带/列带首尾贴合」；1366 / 900 / 390 三视口全部通过（无空洞、无重叠）。
- 迭代过程见 `docs/v2-progress-report.md` 的**三个**「追加迭代」章节（山峦 r5→r6→r8→r9 四轮；足迹拼图；接入真实照片 + 动画节奏打磨）。

## 6. 技术栈与运行方式
- **纯静态前端**：`HTML + CSS + JS`，无框架、无构建、无 node 依赖，双击 `v2-index.html` 或起本地 HTTP 服务即可预览。
- **本地预览命令**（本项目固定端口 **8123**，在项目根目录执行）：
  `python -m http.server 8123`，然后访问 `http://127.0.0.1:8123/v2-web/v2-index.html`。
- **截图模式**：URL 追加 `?shot=1`（如 `...v2-index.html?shot=1`）可立即显示所有区块并收敛首屏高度；
  该参数还会**强制打开视差背景**（`body.is-parallax-on`）、并让**足迹拼图跳过动画直接定格成拼好的矩形**，便于静态截图取证。
- **山峦背景调参**：改 `v2-web/tools/gen-bg-parallax.py` 里的 `LAYERS`（峰数/宽窄/高度/噪声/谷底）与 `PALETTE`（配色），
  然后 `python v2-web/tools/gen-bg-parallax.py` 重新生成 `v2-index.html` 中的 `#bgParallax` 块（幂等，可反复运行）。
- **照片素材再生成**（幂等）：足迹照片由 `.deepworks/tmp/resize-photos.ps1` 批量缩放生成到 `v2-web/assets/journey/`；
  改映射只改脚本里的 `$map`，然后 `powershell -ExecutionPolicy Bypass -File .deepworks\tmp\resize-photos.ps1`。
  规则：长边 1400px、`HighQualityBicubic`、JPEG 质量 82、读 EXIF `0x0112` 手动旋转。
- **首屏视频循环再生成**（幂等）：源片放在 `uploads/`（gitignore）或传 `-Src`，然后
  `powershell -ExecutionPolicy Bypass -File v2-web\tools\build-hero-loop.ps1`
  → 重新产出 `v2-web/assets/hero/hero-loop.mp4` + `hero-poster.jpg`。
  想换镜头/时长：改脚本顶部 `$edl`（`起点秒, 时长秒` 交替）与 `$fade`。**脚本不烧字、不用字体、不写系统目录**（无权限要求）。
- **无头截图**：`powershell -ExecutionPolicy Bypass -File .deepworks\tmp\shot.ps1 -Url <url> -Out <png> -W 1440 -H 900`
  （自动用唯一 profile + 绝对路径 + 轮询等文件；`.deepworks/tmp/` 已被 gitignore）。
- **判断改动是否真的生效（不靠肉眼）**：`.deepworks/tmp/probe_server.py`（`127.0.0.1:8125`，`/slow` 慢速资源撑住 `load` 事件 + `/report` 收结果）
  配合 `.deepworks/tmp/verify-hero.html`（同源 iframe 探针，把 `getComputedStyle` 等断言 POST 回 `.deepworks/tmp/hero-report.txt`）。
  ⚠️ **别用 `--virtual-time-budget` 测 CSS 过渡**（会读到卡在起始值的假象），也别指望 `--dump-dom` 能拿到 stdout（Edge 是 detached 启动的）。
- **环境注意**：本机 **`node` 不可用**；`python` 可用（3.14.3）但**没有 `PIL`/Pillow** → 图像处理一律走 PowerShell `System.Drawing`。
  ⚠️ **PowerShell 5.1 按 ANSI 读取 `.ps1`**：脚本里写中文会乱码报错，**只用 ASCII 注释**。
  截图用系统 Edge 无头模式（`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`）。
- **Edge 无头截图三坑**（否则会拿到"假的成功截图"）：① 同一 `--user-data-dir` 会命中缓存 → **每次换唯一 profile**；
  ② 截图**异步写盘**，进程退出时文件可能还是旧的 → **先删目标文件再轮询等新文件**；③ `Start-Process -ArgumentList` 不给含空格路径加引号 → 直接用 `& $edge … --screenshot="$out"`。
  取证外壳 `.deepworks/tmp/shot.html` 会**先把 10 张足迹照片预热进 HTTP 缓存**再挂 iframe（`?preload=0` 关闭），避免拍到未解码的空块。

## 6.5 版本进展快照
- **v1**：完成 MVP 主页（响应式 + 智能体预留位 + 多功能块）。
- **v2**（2026-09-10 完成，同日四轮）：
  1. 新增「学业 · 专业」整页板块（专业名片 / 核心课程 / 学习日常），导航新增"学业"锚点，原板块序号顺延；
  2. 追加首屏之后淡入的「太阳 + 分层细节山峦」**视差背景**（3 层 × 3 条脊线 + 日照金边），内容卡改半透明磨砂；
     移动端与 `prefers-reduced-motion` 降级；山峦由幂等脚本参数化生成；并把「学习日常」改写为**劳逸结合**；
  3. 足迹板块改为**「苹果发布会式拼图」**：10 张不等尺寸圆角卡片用 12×6 Grid 恰好铺满，滚动到位后按各自方向**从四周涌入**、错峰归位拼成完整矩形（手机端 6 列骨架）；
  4. 足迹接入**10 张用户实拍照片**（`v2-web/assets/journey/`，2.5MB）：渐变占位 → `<img>` + 逐张 `object-position` 裁切重心；
      m6 文案改**「追光」**、m4 换新图（民俗巡游人海）并连锁重排（原文案图移到 m10）；动画按反馈调为**更慢更从容**（`STEP 0.10s`、归位 1.6s）。
  桌面 / 移动 / 移动菜单 / 视差 / 足迹拼图多视图截图 + 拼图几何自检（三视口无空洞）+ 控制台零错误验证通过；已 git 存档（tag `v2`）。
  5. **首屏 hero 视频背景（已完成，含页面接入）**：从 216s 原始混剪精选 **10 段干净风景**（无字幕卡/无正脸），用 0.8s 交叉淡化拼成 **54.8s 循环**，
     转码为 H.264 / 854×480 / 无音轨 / faststart 的 **8.1MB** 单文件（`v2-web/assets/hero/hero-loop.mp4`）；构建脚本 `v2-web/tools/build-hero-loop.ps1` 幂等可复现。
     **已接进页面**：`.hero__video`（最底层）+ `.hero__veil`（压暗遮罩，底部 `#08131f` 与第二页天幕同色 → 页 1→页 2 无接缝）+ JS 第四个 IIFE
     （`play()` resolve 才淡入；被拒/失败/`?shot=1`/`prefers-reduced-motion` 一律静默回落到原渐变背景）。视频随首屏滚走，**不会跟到第二页**。
     断言（iframe 探针）+ 像素统计（hero 区 `stdev=40.2` vs 渐变区 `6.7`）双重验证通过，详见 `docs/v2-progress-report.md` 第四次追加迭代。
- **下一版（文件版本 v3 = 课程 V3）**：接入 Supabase Dashboard + Feedback（意见反馈后台）。
- **其它待办**：接入真实社交媒体链接。

## 7. 待办 / 下一步
1. **[已完成] 足迹照片**：10 张实拍已接入 `v2-web/assets/journey/`（见 §5）。源图在项目根 `照片展示/`（12 张，约 78MB，**勿提交**）。
   - 换图/调裁切：改 `.deepworks/tmp/resize-photos.ps1` 的 `$map` 重新生成，再调 `v2-style.css` 里对应 `.ms-tile--mN` 的 `--pos`。
   - **[已完成] 首屏 `hero` 主背景**：已升级为**实拍循环视频背景**（`v2-web/assets/hero/hero-loop.mp4`，
     由 `.hero__video` + `.hero__veil` 承载，JS 控制可见性与全部降级路径）。
     原渐变背景**保留**为兜底：自动播放被拒 / `prefers-reduced-motion` / 解码失败时自动回落，不会黑屏。
2. 接入真实社交媒体链接（抖音 / B站 / 视频号，同名「不会飞的jiang」）替换占位跳转。
3. **智能体接入**：把 `#agent` 预留区变成真实可交互的 AI 助手（课程 V4）。
4. **Git 存档点（后悔药）**：仓库已在项目根初始化（`git init`，分支 `master`），已有 tag `v1` / `v2`。
   - 关键改动后执行 `git add <具体文件>` + `git commit -m "vX: 一句说明本次优化点"`。
5. 下一版：课程 V3 → 接入 Supabase 做 Dashboard 和 Feedback（文件版本将命名为 `v3-web/`）。
6. 可选：继续微调山峦（`v2-web/tools/gen-bg-parallax.py` 的 `LAYERS` / `PALETTE`）。

## 8. 已配置的环境
- **git**：已通过 winget 安装（2.55.0），仓库已在项目根目录初始化；配置了 user.name / user.email。
- **本地预览**：用 Python 启动 `http.server` 于端口 **8123**（项目根目录，长期沿用）。
- **截图工具**：使用系统自带 Microsoft Edge 无头模式（headless）截图，已验证可用。
- **node**：本机**不可用**（`node --check` 报 CommandNotFoundException），所以不要依赖 npm/构建链。
- **未纳入版本控制的本地文件**（用户尚未决定是否提交）：`个人主页背景1.mp4`、`个人主页背景1-压缩版.mp4`、
  `个人主页背景2.mp4`（首屏视频的原始素材，`uploads/` 下有同源副本）、`照片展示/`（12 张原图约 78MB）、
  `网页截图/`、`opencode.jsonc`、`.opencode/`、`outputs/`。临时件统一放 `.deepworks/tmp/`（已被 `.gitignore` 忽略）。
- **首屏视频素材已入库**（`v2-web/assets/hero/`，8.1MB）；但**34.7MB 原始源片不入库**（在 gitignore 的 `uploads/` 下）。
  需重建循环时，把源片放进 `uploads/`（脚本自动选取最大的 `.mp4`）或给 `build-hero-loop.ps1` 传 `-Src`。

## 8.5 归档 / commit 规范（★ 用户明确要求，长期遵守）
- **每次 git 存档（commit）的提交标题，必须用一句简洁语言直接标出本次优化的点**。
  - 示例：`v1: 去掉首页标题的山林变体，改用蓝色渐变`、`v1: 移动端导航收敛高度`。
  - 避免含糊标题（如 `update`、`fix`、`改一下`）；要让人一看标题就知道这次改了什么。
- 每次 commit 前，把本次改动的**进展与优化点**同步写进 `docs/v1-progress-report.md`（或对应版本报告）。
- 每完成一个里程碑，可顺手打一个 `tag`（如 `v1`），作为可回退的"后悔药"锚点。

## 8.6 预览确认规范（★ 用户明确要求，长期遵守）
- **每完成一轮修改 / 迭代后，必须用 DeepWorks 内置浏览器打开页面，让用户先看效果，再继续后续修改。**
  - 不要只把链接贴在聊天里；要**实际调用内置浏览器打开**（`openwork-browser` 扩展的 `open_url` 动作）。
  - 打开前先确认本地静态服务在运行（本项目固定在 `8123` 端口）：
    项目根目录执行 `python -m http.server 8123`；若未运行需先启动。
  - 当前预览地址：`http://127.0.0.1:8123/<版本目录>/<版本>-index.html`
    （当前 v2 为 `http://127.0.0.1:8123/v2-web/v2-index.html`；下一版开始替换为对应版本目录）。
- 打开后**等待用户看过并给出反馈**，再进入下一步修改；用户确认前不要自行推进大改。

## 9. 给下一位智能体的提示
- 项目根目录 = 本文件所在目录（即个人主页工作区）。不要用 `uploads/` 或全局路径。
- 中文编码：PowerShell/命令中处理 UTF-8 中文时，用 `[System.Text.Encoding]::UTF8.GetString($bytes)` 解码，避免乱码误判。
- 每次迭代务必：**做新功能 → 用内置浏览器打开预览给用户看 → 截图（桌面+移动）→ 更新进度报告 md → git commit 存档**（见 §8.6）。
- **commit 标题必须是一句简短、能说明本次优化点的中文**（见 §8.5）。
- **不要提交**未确认的本地文件（见 §8 末尾清单）；`git add` 时逐项写具体路径，避免误提交视频/截图等大文件。
- **当前预览地址**：`http://127.0.0.1:8123/v2-web/v2-index.html`（v1 路径仅作历史参考）。
- **改山峦背景**：改 `v2-web/tools/gen-bg-parallax.py` 的 `LAYERS`/`PALETTE` → 跑 `python v2-web/tools/gen-bg-parallax.py`；
  脚本幂等（先删后插），连续运行输出字节一致。
- **改首屏视频**：换镜头/时长改 `v2-web/tools/build-hero-loop.ps1` 顶部 `$edl`/`$fade` 后重跑；
  只调"压暗程度/遮罩"改 `v2-style.css` 里 `.hero__video` 的 `filter: brightness(...)` 与 `.hero__veil` 的渐变 alpha 即可，**无需重新编码视频**。
  当前调校值：`brightness(1) saturate(1) contrast(1.1)`，遮罩 α 中心 .08 / 边缘 .36、纵向 .22/.10/.17；
  **窄屏（≤720px）另有单独加强的遮罩**（.22/.50、纵向 .36/.20/.28）—— 窄屏 `cover` 会把横片放大到只截最亮的天空区。
  配套：`.hero__title/__subtitle/__eyebrow` 的 `text-shadow` 已加强、`.tag` 底色提到 .09（**提亮必须用文字侧对比度补偿**）。
  ⚠️ **`.hero__veil` 纵向渐变的 `100%` 必须是纯 `#08131f`**（与 `.bg-parallax__sky` 顶色相同）——这是页 1→页 2 无接缝的唯一依据；调亮时最容易顺手改掉，改掉就会出现一条可见亮线。
  ⚠️ **量 hero 亮度必须避开文字**：采样区含白色字形会把统计值整体抬高（p95 一度到 215，其实那是白字自己，不是背景）。
     要量就用**左侧纯背景竖条**（x=0–12/18，只有视频+遮罩）。实测真实背景：桌面 ~68 / 移动 ~51，白字对比度毫无压力。
  ⚠️ 提亮优先**降遮罩 α**，别无限拉 `brightness`；`brightness` 接近 1 时画面发灰，**务必同时提高 `contrast`**。
- **验证改动的正确姿势**（血泪教训）：`--virtual-time-budget` 会让 CSS 过渡卡在起始值 → **误判成 bug**；
  `--dump-dom` 在 detached 启动下拿不到 stdout → 必须用 `probe_server.py` + `verify-hero.html` 走 HTTP 回报。
