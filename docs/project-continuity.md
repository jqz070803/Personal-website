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
├── v2-index.html          # 新增 #study 学业板块（导航新增"学业"，序号顺延至联系08）；<main> 前新增 #bgParallax 背景块；足迹板块改为 .journey-mosaic（10 张 .ms-tile，内含 <img class="ms-tile__media"> 真实照片）；首屏 .hero 内新增 <video class="hero__video">（实拍循环视频背景）+ .hero__veil（压暗遮罩）；01 关于左栏改为 .about-photo__frame 内的 4 张 .about-photo__img 照片墙（舞龙 / 华为门店自拍 / 地铁自拍 / 证件照，滚动时依次交叉渐显）
├── v2-style.css           # 学业板块样式 + 响应式；第二页手写单词 `.about-screen__word` / `.word-svg` / `.word-ghost-text` / `.word-ink-text` / `.word-brush` / `.word-pen`（`@font-face` 内置 Pacifico + 双层 `<text>` + 圆头遮罩推进 + 纸飞机笔尖）；.bg-parallax* 背景层 + 磨砂卡片 + 移动端/reduced-motion 降级；.journey-mosaic/.ms-tile* 拼图骨架与入场动效（.ms-tile__media 即 <img>）；.hero__video/.hero__veil/.hero.is-video*（视频层 + 遮罩 + 星空让位，底部收 #08131f 衔接第二页）；.about-photo__frame/__img 绝对堆叠照片墙；.nav::after 毛玻璃底（底边 22px mask 渐隐，消除切断太阳辉光的硬边）；.ms-tile__cap 暗角收紧；#social 桌面底留白 72px；html.shot
├── v2-script.js           # 沿用 v1 交互（含 splitText 拆字：标题空白先归一再拆，否则整行会被推偏；第二页手写单词由独立 IIFE 驱动：**内置 Pacifico 字体字形 + 彩虹渐变 + 圆头遮罩推进**，按单词顶边越过视口 60% 才开演，`?shot=1`/reduced-motion 定格）；末尾四个独立 IIFE：01 照片墙交叉渐显（按 .about-main 的滚动行程依次溶解，reduced-motion 定格证件照）、视差（data-px 位移 + is-parallax-on 淡入）、足迹拼图（**进入视野才开演**：元素顶边越过视口 80% 触发，四周涌入 + 错峰归位）、首屏视频（play() resolve 才加 .hero.is-video，被拒/失败/降级静默回落渐变）
├── v2-about-data.js       # ⚠ **已不再被引用**（第九次迭代改用真字体字形，`<script>` 标签已移除，文件留盘备查）："About me" 手写 SVG 笔画数据（网格化描摹路径，是"弯曲处有棱角"的根源，己弃用）
├── assets/
│   ├── journey/           # ★ 足迹实拍照片（10 张，共 2.5MB）：01-shan / 02-hu / 03-hai / 04-cheng-yuren / 05-xingkong / 06-zhuiguang / 07-guzhen / 08-caoyuan / 09-richu / 10-lushang .jpg
│   ├── hero/              # ★ 首屏视频背景（8.1MB）：hero-loop.mp4（54.8s / 854x480 / H.264 / 无音轨 / faststart）+ hero-poster.jpg
│   ├── about/             # ★ 01 左栏照片墙（4 张，均预裁 1080×1440 / 3:4，共 0.6MB）：photo-01-dragon / photo-02-selfie-huawei / photo-03-selfie-metro / portrait .jpg
│   └── fonts/             # ★ 第二页手写单词的花体字体（第九次迭代引入，**必须入库**）：pacifico-latin.woff2（32KB，Google Fonts latin 子集）+ Pacifico-OFL.txt（SIL OFL 1.1 许可原文，随字体一起保留）
└── tools/
    ├── gen-bg-parallax.py # ★ 山峦脊线生成器：幂等、可复现，改 LAYERS/PALETTE 即可调参
    └── build-hero-loop.ps1# ★ 首屏视频循环构建器：幂等、可复现（EDL 与交叉时长在文件顶部常量），**不依赖字体/系统目录**
docs/
└── v2-progress-report.md  # v2 迭代进度报告（含九个追加迭代章节）
artifacts/
└── screenshots/
    ├── v2-study-desktop.png     # 桌面端「学业 · 专业」板块（含改写后的学习日常）
    ├── v2-study-mobile.png      # 移动端（375 视口）学业板块
    ├── v2-menu-mobile.png       # 移动端汉堡菜单展开（含"学业"）
    ├── v2-parallax-desktop.png  # 桌面端滚过首屏：太阳 + 三层山峦淡入
    ├── v2-parallax-mobile.png   # 移动端 390 视口：山峦 + 太阳，无溢出
    ├── v2-journey-desktop.png   # 桌面端足迹拼图（10 张圆角卡片拼成完整矩形）
    ├── v2-journey-inflight.png  # 足迹拼图动画冻结在 22%：卡片仍在四周散开
    ├── v2-journey-flyin-late.png # ★ 真实时间抓图：动画飞入中（上排已归位，追光/古镇/日落仍模糊 + 位移）
    ├── v2-journey-flyin-done.png # 同一位置的归位后对照帧（is-done 定格）
    ├── v2-journey-mobile.png    # 移动端 390 视口足迹拼图（6 列骨架，同样成矩形）
    ├── v2-hero-video-desktop.png# 桌面端首屏实拍视频背景（1440×900，?shot=1 暂停态）
    ├── v2-hero-video-mobile.png # 移动端首屏实拍视频背景（390×844，?shot=1 暂停态）
    ├── v2-hero-live-desktop.png # 桌面端首屏**真实播放中**（真实时间抓图，不是 ?shot=1 暂停态）
    ├── v2-seam-before-desktop.png # 修复前：首屏→第二页接缝有横向台阶（行间跳变 9.49）
    ├── v2-seam-after-desktop.png  # 修复后：同位置台阶消失（0.89）
    ├── v2-hero-title-offcenter-before.png # 修复前：首屏姓名被拆字空白推偏
    ├── v2-hero-title-fixed-desktop.png    # 修复后：桌面姓名居中（三个字偏差 0）
    ├── v2-hero-title-fixed-mobile.png     # 修复后：移动 390 单行居中（偏差 0）
    ├── v2-about-photo-desktop.png         # 01 左栏照片位：占位图 → 真实证件照
    ├── v2-about-photo-mobile.png          # 同上，移动 390
    ├── v2-photowall-01-dragon.png         # 照片墙第 1 张「舞龙」
    ├── v2-photowall-02-huawei.png         # 第 2 张（门店灯光自拍）渐显中
    ├── v2-photowall-03-metro.png          # 第 3 张（地铁自拍）渐显中
    ├── v2-photowall-04-idphoto.png        # 第 4 张证件照：贴顶定格 + caption
    ├── v2-photowall-mobile-idphoto.png    # 移动 390：第 4 张 + caption
    ├── v2-journey-caption-scrim-after.png # C1：足迹字幕暗角收紧后（10 条字幕均清晰）
    ├── v2-about-word-writing.png  # ★ 第二页手写单词「书写中」：'abou' 已上彩虹、't' 只填了左上角、'me' 仍是幽灵层，纸飞机笔尖在 'ou' 附近
    ├── v2-about-word-rest.png     # 同一位置「定格」：整词彩虹、无半透明残留、纸飞机已淡出
    └── v2-about-word-mobile.png   # 移动端 390：字宽 335/390，整词写出
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
- **01 左栏照片墙**：`.about-photo__frame` 内 4 张 `.about-photo__img`（绝对堆叠、`object-fit: cover`），由 `v2-script.js` 第 4 个 IIFE 按**整块 `.about-main` 的滚动行程**（`vh*0.72` → `-h*0.1`）依次交叉渐显、最后定格证件照；`:first-child{opacity:1}` 是禁用 JS 的兜底，`prefers-reduced-motion` 直接定格最后一张。素材由 `.deepworks/tmp/mkimg.ps1` 生成（换图见 §6）。
- **C1 足迹字幕**：`.ms-tile__cap` 暗角 `0% → 0.5 @44% → 0.9 @100%` + 轻 `text-shadow`（亮部照片压到标题行也读得清）。
- **C2 导航底边**：毛玻璃底改挂 `.nav::after` + 底边 22px `mask-image` 渐隐，不再把视差太阳辉光横向切断（原 `border-bottom` 发丝线已移除）。
- **C3 06 社交面板**：桌面 `#social.section{padding-bottom:72px}`，消掉面板下半截的 56px 空档（面板高 555 → 499）。
- 迭代过程见 `docs/v2-progress-report.md` 的**九个**「追加迭代」章节（山峦 r5→r6→r8→r9 四轮；足迹拼图；接入真实照片 + 动画节奏打磨；首屏 hero 视频；收尾打磨；首屏姓名居中 + 照片位；01 照片墙 + C1/C2/C3；足迹拼图触发时机修复；第二页手写单词改真字体字形 + 彩虹遮罩写出）。
- **第二页手写单词（第九次迭代起）**：`v2-index.html` 的 `#aboutScreenWord` 内 = 幽灵层 `#wordGhostText` + 彩虹层 `#wordInkText`（`fill="url(#wordRainbow)"`、`mask="url(#wordBrushMask)"`）+ 遮罩路径 `#wordBrush` + 纸飞机 `#wordPen`；
  字体 `@font-face "Pacifico"`（`assets/fonts/pacifico-latin.woff2`），字号由 JS 按画布宽自适应（内联 `style.fontSize`，**不可用呈现属性**），渐变 `x1/x2` 按实测字宽写死。
  单词实体几何（桌面 1440×900）：`#aboutScreenWord` 屏幕位 `x340 w760 h198`、文档 absTop **1276** → 开演 scrollY ≈ **736**；墨迹实测 **699×179**、`x 373..1072`、`y 477..656`。
  ⚠️ 已知取舍：字体轮廓是并集整体，参考图那种"笔画交叠半透明"无法复现（详见第九次追加迭代）。

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
  ⚠️ **PowerShell 变量名大小写不敏感**：在取证脚本里把"最大亮度"写成 `$x1`，会**直接覆盖参数 `$X1`（右边界）**
  → 循环瞬间退出、统计全 0，现象极像"机制完全没生效"。**避免用 `$x1/$y1/$n2` 这类与参数同名的局部变量**（改 `$hi1/$lo1`）。
  ⚠️ 同一个脚本里 `function` 返回 hashtable 再取属性，本机 5.1 曾拿到空值 → **取证脚本一律完全内联**，比调函数稳。
  截图用系统 Edge 无头模式（`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`）。
- **Edge 无头截图三坑**（否则会拿到"假的成功截图"）：① 同一 `--user-data-dir` 会命中缓存 → **每次换唯一 profile**；
  ② 截图**异步写盘**，进程退出时文件可能还是旧的 → **先删目标文件再轮询等新文件**；③ `Start-Process -ArgumentList` 不给含空格路径加引号 → 直接用 `& $edge … --screenshot="$out"`。
  取证外壳 `.deepworks/tmp/shot.html` 会**先把 10 张足迹照片预热进 HTTP 缓存**再挂 iframe（`?preload=0` 关闭），避免拍到未解码的空块。
- **查「滚动中才出现」的接缝 / 过渡问题**：`.deepworks/tmp/seam.html?gap=0.5` —— 用 `/slow` 撑住外壳页的 `load`，
  让 Edge 在**真实时间**抓图（而非虚拟时间），并把首屏底边滚到视口正中；再逐行算平均亮度找**最大行间跳变**
  （阈值 1.5，画面固有抖动噪声约 0.9）。移动端加 `&w=390&h=844`。
  ⚠️ 这类问题**用静态单屏截图永远查不出来**，必须真实时间 + 把接缝滚进视口。
- **⚠️「改了却看不见」→ 先怀疑样式表缓存**：浏览器对 `v2-style.css` 走 HTTP 缓存，而加在**页面 URL 上的 `?v=xxx` 只能刷新 HTML，刷不到 CSS**。
  因此 `v2-index.html` 的 `<link rel="stylesheet">` 与 `<script>` 一律**带版本号**（当前 `?v=12`）；**每次改 CSS/JS 后必须把版本号 +1**，再让用户重新打开页面。
  排查顺序：① 版本号是否已 +1 → ② `Invoke-WebRequest "http://127.0.0.1:8123/v2-web/v2-style.css?v=12"` 确认服务端返回的是新内容 → ③ 再做像素级测量。
  💡 想确认探针拿到的是**新 JS**，不必非升 `?v`：让新旧算法在小数位上不同（如照片墙 opacity 保留 3 位），看数字指纹即可（`http.server` 带 `Last-Modified`，文件 mtime 变了自然会取新的）。
- **⚠️「写了却看不见」不都是缓存问题 → 还要查选择器是否真的匹配**：01 关于右栏空白就是 `reveal` 写成了**裸属性**
  （`<div class="about-info" data-stagger reveal>`），`.reveal` 压根匹配不到 → IntersectionObserver 不观察 → `[data-stagger].is-visible > *` 的揭示规则永不生效 → 子项永久 `opacity:0`。
  查法：`.deepworks/tmp/seam.html?probe=1&pys=<滚动位置>&psel=<选择器>`，把 `getComputedStyle` 的 `opacity / transform / classList` POST 回 `hero-report.txt` 看数字，**别靠肉眼**。
- **中文断行（窄屏）**：长文案在窄屏被按字断行时会出现"`自己`被拆成两行"这类难看断点、或末行孤字。
  修法是插一个**窄屏专用换行** `<br class="hero__br--m" />`（默认 `display:none`，`@media (max-width:560px){ display:inline }`），在**词组边界**断开；桌面端不受影响。
- **拆字类动画（splitText）先归一空白再拆**：标题在 HTML 里多行书写时，`textContent` 会带上换行 + 缩进；
  原样逐字包 `span` 会让这些空白变成**含 `&nbsp;` 的实宽 `inline-block`**（不参与空白折叠），一起参与 `text-align:center` → 整行被推偏。
  统一 `.replace(/\s+/g, " ").trim()` 即可。
- **滚动驱动的"渐显 / 擦除"类动效**：驱动元素要选**非 sticky** 的那个（sticky 元素停驻期 `rect` 不变 → 进度会冻住）；
  用「区块在视口里走过的行程」当进度条，且**纯滚动位置函数**（不累积状态）→ 往回滚能原路返回。
  写 `opacity` 时**始终写数值**：`o === 1 ? "" : o` 这种省略会让它回落到 CSS 的 `:first-child{opacity:1}` 规则 → 出现"该亮的不亮"。
- **"滚动触发的入场动画"绝不要用"加载后 N 秒"兜底**：页面一打开就播 → 用户滚到该板块时早播完了
  （本次 03 足迹拼图"看不到动画"的真因就是 `setTimeout(start, 2500)`）。也别用 `IntersectionObserver` 的**面积比例**
  `threshold: 0.16` 之类：元素比视口高得多时（窄屏更明显）永远达不到比例 → 回调不触发，最终退化成"加载即播"。
  **可靠判据**：`el.getBoundingClientRect().top < innerHeight * 0.8`（**判顶边、与元素自身高度无关**，窄屏一样成立）
  + `scroll` / `resize` / `load` 各查一次 + `started` 守卫 + **开演即 `removeEventListener`**（不重播）；
  `window.setTimeout(check, 400)` 只用来兜底"直接落在该板块附近打开 / 锚点跳转"这种情况。
- **探针快照的 `n` 字段只保留前两个 class**（`split(/\s+/).slice(0, 2).join(".")`）→ `is-in` / `is-done` **会被截掉**，
  据此判断"动画有没有触发"会**误判成没触发**。快照对象已加完整类名字段 **`cls`**（`String(el.className || "").trim()`），
  **判断状态一律看 `cls`**。
- **抓"过渡进行中"的帧**：`--virtual-time-budget` 会把 CSS 过渡与 `setTimeout` **一起快进到终点** → 必须去掉它，
  改用 `/slow`（`probe_server.py`）撑住外壳页的 `load` + `seam.html` 的 **`&y_at=<毫秒>`**（把滚动推迟到指定时刻）在**真实时间**里抓图；
  `.deepworks/tmp/shot.ps1` 已加 **`-RealTime`** 开关（自动去掉 `--virtual-time-budget`）。
  ⚠️ 无渲染帧时过渡不推进 → **别用截帧里的 `opacity` 判断动画是否在跑**，看"类名 + `transform` 数值"更可靠。
- **导航毛玻璃底 + 底边渐隐**：毛玻璃底要挂在**伪元素**上（`.nav::after`）才能用 `mask-image` 让底边平滑收尾；
  挂在本体上时 `border-bottom` 会把背后的太阳辉光**横向切断**成一条硬边（实测 2px 内跳 +22~+33 → 修后 +2.9/+0.7）；`mask` 对 `backdrop-filter` 同样生效。
- **`.section` 的 `padding: clamp(72px,10vw,128px)` 是"面板发空"的常见来源**：内容只有一行时，下半截全是这段统一留白
  → 用 `@media (min-width:761px){ #id.section{ padding-bottom:72px } }` 单独收（实测面板 555 → 499、空白 128 → 72）。
- **探针 `psel` 里含 `#` 必须编码成 `%23`**（否则被当 URL fragment → 选择器残缺 → 抛 `not a valid selector`）；
  `psel` 走 `querySelectorAll`，**作用于整篇文档、与滚动位置无关** → 可用逗号并列一次取多个板块的元素。
  例（第二页手写单词改为 canvas 后）：`psel=%23wordCanvas,%23aboutScreenWord,%23wordPen`（旧的 `#wordInkText` / `#wordPen`(svg) 等已不存在）。
- **每批 probe 前重启 `probe_server.py`**：它**约 150s 未收到报告就自退**（残留或已退出时不重启会出现 "REPORT MISSING" 假象）；
  报告要**轮询等**（`Start-Sleep 3` 常常不够）；探针那次运行自带的截图是初始态（y=0），要看画面必须另跑普通截图。
- **`getBoundingClientRect()` 含 `.reveal` 的 `translateY(28px)`**：元素未揭示时读到的 `top` 比真实值大 28px（别误判成布局错位）。
- **移动端 1 列 grid 里 `position: sticky` 等于失效**：grid item 的 sticky 行程 = 自己的 grid area 高度 = 自身高度 → 行程 0
  （桌面 2 列时靠兄弟元素把行撑高才有效）。想让手机端也"钉住"就把 `≤760px` 的容器由 `grid` 改 `block`（用户已确认**保持现状**）。
- **"手写感 + 边缘平滑"不要靠坐标描摹**：拿网格化坐标写 SVG 路径去描一整个单词，曲线**段间切线不连续** →
  放大后必然是一串多边形折角（v2 第二页"弯曲处有棱角"的真因，加大字号只会更糟）。正解是**用花体字体渲染字形**
  （边缘由字形轮廓决定，天然平滑）+ 推进遮罩制造"写出"过程。字体要能随项目分发就用 **SIL OFL**（本项目 Pacifico，
  `v2-web/assets/fonts/pacifico-latin.woff2` 32KB + `Pacifico-OFL.txt` 许可原文同放）；`@font-face` 加 `font-display: block`，
  并**等 `document.fonts.load('400 150px "Pacifico"')` 就绪后再量尺寸**（否则量到后备字体，整块缩放全错）。
- **"写出感"必须是笔尖沿笔画走，不能是水平横扫遮罩**（用户明确否决了横扫："不要这种从左向右填充的感觉"）：
  横扫遮罩无论多圆头，观感都是"横向擦除"。正确做法是**在字形像素上算沿笔画的测地距离场**
  （`getImageData` 取 alpha 蒙版 → 8 邻接 flood fill 拆连通块 → 每块取"最左列最上像素"为起笔点 →
  块内 8 邻接 Dijkstra，直边 1 / 斜边 1.414 → 距离即"笔尖走过的路程" → 逐帧 `t ≤ p` 上色、`t > p` 留幽灵），
  笔尖位置用"同一帧刚上色像素质心"反馈，才**始终贴在书写前沿**。
  ⚠️ **多连通块必须串行分配时间窗**（按起笔点 x 排序、时长 ∝ 路径长度、窗口不重叠）；
  若给各块各自"按 x 错开起笔 + 固定时长"，块的**时间窗会重叠** → 两处同时书写 → 笔尖质心跳到别的字母上（第一版就是这个 bug）。
- **怎么证明"是沿笔画写"而不是"横扫"（数字证据）**：`.deepworks/tmp/wordstat.ps1`
  —— 以**定格帧的饱和像素**作字形蒙版，取**中途帧**逐列比对覆盖率：
  ① 先做 **±4px 对齐搜索**（best dx 应落在 0，且明显压过 ±1，否则说明两帧错位）；
  ② 再看**部分着色的列占比**（横扫填充几乎只会是 0% 或 100%，本次实测 **196/537 = 36.5%**）；
  ③ 加 **±1px 容差**后数字若几乎不变，则"部分着色"不是边缘对不齐的假象（本次 27,387 → 27,490）；
  ④ 字形之外的多余饱和像素即**笔尖**，其 x 应紧贴"最右着色列"（本次笔尖中心 695.5 vs 前沿 745）。
  该脚本用 PowerShell `System.Drawing` 读位图（本机无 PIL，`node` 也不可用），中间帧必须用 `-RealTime` 抓。
- **SVG 呈现属性会被 CSS 类规则覆盖**：`el.setAttribute("font-size", 250)` 干不过 `.word-ink-text{font-size:150px}` →
  缩放**静默失效**（探针实测字宽 424px，应约 706px）。**凡是要动态改尺寸，一律写内联 `el.style.fontSize`**；
  这类"改了没生效"要量**元素实测宽度**，别靠肉眼。
- **`getBBox()` 对 `<text>` 返回的是字体 em 盒，不是墨迹范围**（Pacifico ≈ 1.76em 高 = 334px，而墨迹只有 179px）→
  **纵向几何不能由 box 推导**（笔刷会被拉到字外），改用画布中线 + 固定粗细（本项目 `stroke-width: 260`，略大于画布高）；
  而"盒中心对齐画布中心"仍可用（实测墨迹中心 566 vs 容器中心 575）。
- **`maskUnits="userSpaceOnUse"` 的矩形会真的裁掉字形**：遮罩区要给足余量（本次从 `y 0..260` 放宽到 `y=-200 h=660`），
  否则 em 盒偏大的字被切边且**看不出原因**。
- **`probe_server.py` 收到 `/report` 就自杀**（`main()` 等 `OUT.exists()`）→ **探针批次与其后的抓图绝不能共用同一次服务会话**：
  后续抓图的 `/slow` 立即失败 → 外壳页 `load` 提前 → 截图停在**页顶**，现象极像"滚动没生效"。**每张（批）抓图前重启 8125**。
- **"截图到底停在哪个板块"用颜色锚点判，别靠肉眼**：第二页彩虹单词左端是**绿色**，而首屏没有绿色 →
  数"绿通道显著大于红/蓝"的像素即可判定（本次靠它发现两张图其实停在页顶：绿像素 0 → 重启后 22,845 / 42,868）。
  逐像素统计直接用 PowerShell `System.Drawing`（本机无 PIL）。⚠️ 首屏的蓝色按钮/高亮文字也会被"彩色"判据命中，**要限定 x 范围避开**。
- **换 01 照片墙的图**（幂等）：原图 → `powershell -ExecutionPolicy Bypass -File .deepworks\tmp\mkimg.ps1 -Src <原图> -Out v2-web\assets\about\<名>.jpg -W 1080 -H 1440`
  （3:4、质量 86）→ 覆盖 `v2-web/assets/about/` 里的同名文件 → 同步 `v2-index.html` 里那 4 个 `alt`。**书写顺序 = 渐显顺序，最后一张是停住的画面**。

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
      **已接进页面**：`.hero__video`（最底层）+ `.hero__veil`（压暗遮罩，底部 `#08131f` 与第二页天幕同色）+ JS 第四个 IIFE
      （`play()` resolve 才淡入；被拒/失败/`?shot=1`/`prefers-reduced-motion` 一律静默回落到原渐变背景）。视频随首屏滚走，**不会跟到第二页**。
      断言（iframe 探针）+ 像素统计（hero 区 `stdev=40.2` vs 渐变区 `6.7`）双重验证通过，详见 `docs/v2-progress-report.md` 第四次追加迭代。
      **亮度按用户反馈迭代三轮**（`.62→.80→.90→1.0`，第 ③ 轮配 `contrast(1.1)` 防发灰，用户已确认"亮度刚好"）；窄屏另有单独加强的遮罩。
      **首屏→第二页接缝已修复**：真实时间逐行扫描发现 9.49 的行间台阶（山峦剪影 `#050D19` vs 第二页顶色 `#06182D~#062039`，
      属旧版遗留、与视频无关），已在 `.about-screen__bg::before` 压同色 140px 渐隐窄带 → **9.49 → 0.89**（桌面/移动均 PASS）。
      ⚠️ 注意：`.hero__veil` 在 DOM 里位于山峦**之下**，所以"遮罩底部 `#08131f`"只保证剪影**以上**区域与天幕同色，管不到首屏最底那一行。
  6. **收尾打磨（用户本轮确认范围）**：
     ① 修掉 01 关于右栏空白的**真 bug** —— `class="about-info" data-stagger reveal` 里的 `reveal` 是裸属性，改为 `class="about-info reveal"`，三张卡片恢复可见；
     ② 首屏标签行新增 **「智能医学工程在读」**（排首位），副标题第二行改为 **「也在大一，把课表上的每一门基础课啃成自己的底气。」**，上方小字改 **「现代徐霞客 · 天津大学（深圳）」**；
     ③ 抖音 / 视频号 占位卡片改为**不可点 + 「筹备中」小圆标**（不再弹原生 alert）；④ 04 镜头直角引号改中文弯引号。
     详见 `docs/v2-progress-report.md` 第五次追加迭代。
  7. **收尾打磨（第二次）**：① 修掉首屏姓名被拆字空白推偏的**真因**（`splitText()` 先归一空白再拆字，桌面/移动偏差均归零）；
     ② 01 左栏占位图换成真实证件照，`.about-photo` 补上 `reveal` 类（原来只有 `data-dir="left"`，缺 `.reveal` → 揭示规则永不触发，与第五次同类坑）。详见第六次追加迭代。
  8. **01 左栏照片墙 + 三项打磨**：① 左栏照片位改为 **4 张照片随滚动依次交叉渐显**（舞龙 → 华为门店自拍 → 地铁自拍 → **证件照收尾**），
     驱动源是整块 `.about-main` 的滚动行程（桌面/移动实测 opacity 与公式逐点吻合，重叠期不透底）；
     ② **C1** 足迹字幕暗角收紧（亮部照片上白字也读得清）；③ **C2** 导航毛玻璃底改挂 `.nav::after` + 底边 22px `mask` 渐隐，
     消掉切断太阳辉光的横向硬边（2px 内 +22~+33 → +2.9/+0.7）；④ **C3** 06 社交面板桌面底留白 128 → 72px（面板高 555 → 499，`docH` 9221 → 9165）。
      详见第七次追加迭代。
   9. **03 足迹拼图"看不到动画"修复**：真因是**加载后 2.5s 的兜底定时器**（页面一打开就播完，用户滚到时只剩静态结果）
      + `IntersectionObserver` 的面积比例 `threshold: 0.16` 在高瘦拼图上永远达不到 → 进一步退化成"加载即播"。
      改为**元素顶边越过视口 80% 才开演**（`rect.top < vh * 0.8`）+ `scroll`/`resize`/`load` 触发 + `started` 守卫 + 开演摘监听。
      实测：y=0 停留 7s 仍 `is-armed`（**无** `is-in`）→ y=4200（top=672 < 720）才 `is-in` → y=4700 已 `is-done`。
      实拍 `artifacts/screenshots/v2-journey-flyin-late.png`（飞入中）/ `v2-journey-flyin-done.png`（归位后）。详见第八次追加迭代。
   10. **第二页手写单词改为"真字体字形 + 彩虹渐变 + 推进写出"**：`v2-about-data.js` 网格化**描摹路径的段间接线不连续**就是"弯曲处有棱角"的真因 →
       改用内置 **Pacifico**（SIL OFL）渲染字形（边缘天然平滑），`linearGradient` 按实测字宽铺满七档彩虹；
       触发按**单词顶边越过视口 60%**（absTop 1276 → ≈scrollY 736）。
       实测：字宽 424 → **706px**（修掉"`font-size` 呈现属性被 CSS 覆盖"这个真 bug）、墨迹 **699×179**、纵向中心偏差 9px、移动端字宽 335/390。详见第九次追加迭代。
       ⚠️ 该版的"写出"是**一条圆头描边从左向右横扫遮罩** → 观感是"横向填充"，**已被第十次迭代否决替换**。
   11. **"横向填充"改为"一笔一笔写出"（沿笔画测地距离场）**：用户反馈"需要一笔连贯书写的感觉，不要从左向右填充" →
       放弃 SVG 遮罩，改 `<canvas>` 逐像素渲染：alpha 蒙版 → 连通块 → 每块"最左列最上像素"起笔 → 块内 **Dijkstra 测地距离场**
       （距离 ≈ 笔尖走过的路程）→ **块间串行时间窗**（按起笔点 x 排先后、时长 ∝ 路径长度、窗口不重叠）→ 逐帧 `t≤p` 上色 / `t>p` 白幽灵，
       笔尖用"刚上色像素质心"跟随；修掉了第一版"块间时间窗重叠 → 笔尖跳到别的字母上"的 bug。
       数字验证（`wordstat.ps1`）：定格蒙版 44,750px、中途帧已写 **61.2%**、**部分着色列 196/537 = 36.5%**（横扫只会 ~0%）、
       对齐 dx=0 且 ±1px 容差后几乎不变（27,387 → 27,490，排除错位假象）、笔尖中心 **695.5** 紧贴前沿 745。
       实拍 `v2-about-word-writing.png` / `v2-about-word-rest.png` / `v2-about-word-mobile.png`（三张均已换新）。详见第十次追加迭代。
- **下一版（文件版本 v3 = 课程 V3）**：接入 Supabase Dashboard + Feedback（意见反馈后台）。
- **其它待办**：抖音 / 视频号 主页链接（B站 已接入真实链接）。

## 7. 待办 / 下一步
1. **[已完成] 足迹照片**：10 张实拍已接入 `v2-web/assets/journey/`（见 §5）。源图在项目根 `照片展示/`（12 张，约 78MB，**勿提交**）。
   - 换图/调裁切：改 `.deepworks/tmp/resize-photos.ps1` 的 `$map` 重新生成，再调 `v2-style.css` 里对应 `.ms-tile--mN` 的 `--pos`。
   - **[已完成] 首屏 `hero` 主背景**：已升级为**实拍循环视频背景**（`v2-web/assets/hero/hero-loop.mp4`，
     由 `.hero__video` + `.hero__veil` 承载，JS 控制可见性与全部降级路径）。
     原渐变背景**保留**为兜底：自动播放被拒 / `prefers-reduced-motion` / 解码失败时自动回落，不会黑屏。
   - **[已完成] 首屏 `hero` 亮度调校**：按用户三轮反馈迭代 `.hero__video` 的 `filter` 与 `.hero__veil` 的 α，
     当前 `brightness(1) saturate(1) contrast(1.1)`；**CSS 侧已到顶**，再亮只能改文字侧或重编视频时烘焙 gamma。
   - **[已完成] 首屏→第二页 接缝修复**：真实时间逐行扫描发现首屏底边行间跳变 **9.49**（= 山峦剪影 `#050D19` 与
     第二页顶色 `#06182D~#062039` 直接相接；**旧版遗留，与视频无关**），已在 `.about-screen__bg::before` 压同色
      140px 渐隐窄带 → 修复后 **0.89**（桌面/移动均 PASS）。证据 `artifacts/screenshots/v2-seam-{before,after}-desktop.png`。
   - **[已完成] 01 左栏照片墙**：4 张照片（`v2-web/assets/about/`）随滚动依次交叉渐显、收在证件照上；换图见 §6 的 `mkimg.ps1` 一行命令（**书写顺序 = 渐显顺序**）。
   - **[已完成] 首屏姓名居中**：`splitText()` 先归一空白再拆字，桌面/移动中心偏差均 **0**（详见第六次追加迭代）。
2. **社交媒体链接**：B站 已是真实链接；抖音 / 视频号 主页链接待补 → 已按用户要求做成**不可点卡片 + 「筹备中」标注**
   （`div.social-card.social-card--soon`，不再弹 alert）。拿到链接后：把 `div` 换回 `<a href="…">`、去掉 `social-card--soon`、把「筹备中」换回 `→`。
3. **智能体接入**：把 `#agent` 预留区变成真实可交互的 AI 助手（课程 V4）。
4. **Git 存档点（后悔药）**：仓库已在项目根初始化（`git init`，分支 `master`），已有 tag `v1` / `v2`。
   - 关键改动后执行 `git add <具体文件>` + `git commit -m "vX: 一句说明本次优化点"`。
5. 下一版：课程 V3 → 接入 Supabase 做 Dashboard 和 Feedback（文件版本将命名为 `v3-web/`）。
6. 可选：继续微调山峦（`v2-web/tools/gen-bg-parallax.py` 的 `LAYERS` / `PALETTE`）。
7. **about-screen 下沿横向硬边（下一轮修，用户已定）**：文档 y=1800（about-screen 底 vs 视差天幕交界）横贯天空有 **+11.6** 的逐行亮度跳变，
   **非本轮引入**。做法照首屏→第二页接缝：在交界处压一条同色渐隐窄带，实测目标 **< 1.5**。数值见第七次追加迭代。
8. **手机端照片墙是否"钉住"**：用户已确认**保持现状**（不钉住，照片随页面上滚）。
   若要改：把 `≤760px` 的 `.about-main` 由 `grid` 改 `block`，让 `.about-photo` 的 sticky 真正生效（另见 §6 末条）。

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
