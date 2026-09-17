# v3 迭代进度报告 —— 「问题反馈」板块（课程 V3：Supabase + Feedback）

> 文件版本 **v3**（目录 `v3-web/`），对应**课程阶段 V3**（Supabase Dashboard + Feedback）。
> 上一版报告：`docs/v2-progress-report.md`；项目记忆库：`docs/project-continuity.md`。
> 本轮日期：2026-09-17。

---

## 0. 本轮目标（用户原话）

> 在页面下面再加一页"问题反馈"对话框；一个可以填姓名的框，右侧一个可以选择设备的框（电脑 / 手机 / 平板等）；
> 下面一个大反馈框，有**灰色引导字**，输入后引导字消失。引导内容大致为
> "描述具体位置；你的实际体验；遇到的问题或异常；希望我改进的方向"。

用户同时确认了三件事：① 新建 `v3-web/`，**不**把反馈页塞进 `v2-web/`；② 姓名**新增 `name` 列**，不复用已有的 `contact`；③ 数据库表用户已自行建好。

---

## 1. 交付物

`v3-web/` 由 `v2-web/` 整体复制（11.46 MB，含 `assets/` 里 8.1MB 的 hero 循环视频），
四个源文件改为 `v3-` 前缀（与 §4 的版本命名约定一致），`tools/`、`assets/` 原样保留：

| 文件 | 大小 | 说明 |
| :--- | ---: | :--- |
| `v3-web/v3-index.html` | 70,814 B | 主页面；新增 `#feedback` 板块与 `#fbForm` |
| `v3-web/v3-style.css` | 50,394 B | 末尾追加 `.fb*` 反馈表单样式（约 150 行） |
| `v3-web/v3-script.js` | 47,264 B | 末尾追加反馈表单 IIFE（约 220 行，含 Supabase 提交） |
| `v3-web/v3-about-data.js` | 5,792 B | 手写单词笔顺数据源，v3 未改 |
| `v3-web/supabase-setup.sql` | 3,716 B | 数据库**一键脚本**（建表/补列 + RLS 策略 + 清测试数据 + 自查三连），用户整段粘进 SQL Editor 即可 |

---

## 2. 页面与交互

### 2.1 结构（`v3-index.html`）

- 顶部导航在原 7 项之后**追加「反馈」**（`<a class="nav__link" href="#feedback">`），共 8 项；
- 在 `#contact` 之后、`</main>` 之前插入：
  `section section--tinted` + `id="feedback"`，板块编号 **09**，标题**「留句话给我」**，
  副标题「这个页面还在长。你的每一条反馈，都会让它更接近该有的样子。」
- 表单 `#fbForm`（`novalidate`，整块带 `reveal` 类，沿用既有滚动显现机制）：
  - `.fb__row` —— 左「你的名字」`#fbName`（单行输入，占位「怎么称呼你？」）+ 右「你用的设备」`#fbDevice`（下拉：电脑 / 手机 / 平板 / 其他设备）；
  - `.fb__field--wide` —— 「反馈内容」`#fbContent`（`rows=8`、`maxlength=1000`）+ 右下角字数 `#fbCount`；
  - `.fb__actions` —— 蓝色主按钮 `#fbSubmit`「提交反馈」+ 状态位 `#fbStatus`；
  - 两处行内错误位 `#fbNameErr` / `#fbContentErr`（`.fb__err:empty{display:none}`）。
- footer 版本标注由 `v2 · 学业与专业` 改为 **`v3 · 问题反馈`**；
- 三个资源引用统一改 `?v=1`（新目录新版本线）。

### 2.2 灰色引导字（用户重点要求）

`#fbContent` 的 `placeholder` 共 **52 字**，用的就是用户给的四个角度：

> 可以从这几个角度说说：具体位置（哪一屏、哪个板块）；你的实际体验；遇到的问题或异常；希望我改进的方向……

使用原生 `placeholder`，因此**输入即消失、清空即回来**，不需要任何额外 JS。
颜色 `rgba(198,204,214,.34)`，在深色卡片上呈"灰"而非"暗白"，符合"灰色引导字"的要求。

### 2.3 样式（`v3-style.css` 末尾 `.fb*` 块）

磨砂玻璃卡片（`--card`/`--card-hi`/`--line` 设计变量全部沿用 v2，无新增色）；
输入框 `:hover`/`:focus` 冷蓝发光；下拉框自绘箭头 + 深底 `option`；
文本域 `min-height: 190px`；`.fb__row` 两列 → **≤760px 堆叠**，提交按钮同断点占满整行。
`.fb` 带 `reveal`，所以它会随滚动淡入上浮，与其它板块一致。

### 2.4 交互与提交（`v3-script.js` 末尾 IIFE）

- **设备自动预选**：按 UA 猜测（iPadOS 靠 `maxTouchPoints > 1` 与 iPhone 区分），用户仍可手动改；
- **字数提示**：实时 `n / 1000`；
- **草稿暂存**：内容变化时写入 `localStorage`（`v3-feedback-draft`），刷新后恢复并提示「上次没写完的内容，我帮你留着了。」；提交成功清空；
- **校验**：姓名非空、内容 ≥ 5 字，错误就近显示在对应字段下方；
- **提交**：`POST {SUPABASE_URL}/rest/v1/user_feedback`，请求头带 `apikey` + `Authorization: Bearer` + `Prefer: return=minimal`，
  body 为 `{ name, device, content }`；成功后 `form.reset()`、清草稿、重设设备默认，并显示绿字「收到啦，谢谢你花时间写这些。」；
  失败按服务端 `code` / HTTP 状态给出可读提示，并提示可用邮件兜底；`lock()` 防止重复提交。

---

## 3. Supabase 接入情况

- 项目 URL：`https://joqhbooccydgajunwnwf.supabase.co`
  （publishable key 写在 `v3-web/v3-script.js` 顶部常量 `SUPABASE_KEY`；该 key 设计上可公开，安全边界由 RLS 负责）。
- 表：`public.user_feedback`，列 `id` / `name` / `device` / `content` / `contact` / `created_at`
  （`name` 由用户在 2026-09-17 执行 `supabase-setup.sql` 补齐，**现已全部就位**）。
- **实测结论（逐条验证）**：

| 探测 | 结果 | 含义 |
| :--- | :--- | :--- |
| 匿名 `POST {device, content}` + `Prefer: return=minimal` | **`201`** | **匿名写入通道已打通**（页面用的就是这一种） |
| 匿名 `POST {device, content}` + `Prefer: return=representation` | `42501`<br>`new row violates row-level security policy` | 表上**只有 insert 策略、没有 select 策略**，而 `RETURNING` 要过 select 策略 → 报错 |
| 匿名 `POST {name, device, content}` | 补列前 `400 PGRST204`<br>`Could not find the 'name' column` | 表里**当时缺 `name` 列** —— **已修复**，见 §4.2 |
| 匿名 `GET ?select=*` | `200 []` | **不代表表为空**（anon 没有 select 策略） |
| 匿名 `DELETE` | `204` / `[]` | **一行也删不掉**（没有 delete 策略） |

> **关键澄清（本轮新增，推翻此前的"策略时好时坏"记录）**：
> `42501` 与 `201` 的差别**不是** RLS 策略不稳定，而是**请求头 `Prefer` 不同**：
> `return=minimal` 插入成功（`201`）；`return=representation` 需要 `RETURNING`，
> 而 `RETURNING` 受 select 策略约束 → `42501`。
> 页面用的正是 `return=minimal`（`v3-script.js` L1110），**所以访客提交完全不受影响**。
>
> **匿名读不到反馈是有意设计**：访客只能写，不能翻别人的反馈。
> 要看数据请在 Supabase 控制台的 Table Editor / Dashboard 里看（那里用服务端身份，绕过 RLS）。
> ⚠️ **不要给 anon 加 select 策略**来解决"读不到"的问题。
>
> ⚠️ 副作用：因为 anon 既无 select 也无 delete 权限，本轮排障时插入的测试行
> **我删不掉也看不见**，需要你在 SQL Editor（owner 身份）里清理 → 见 §5 第 2 条。

- 数据库侧当时**只差一步**：在 Supabase 控制台 → SQL Editor 执行 `v3-web/supabase-setup.sql`。
  ✅ **2026-09-17 用户已执行完毕** —— `name` 列就位、测试数据清空、页面提交成功，Feedback 部分闭环（见 §4.2）。

---

## 4. 验证记录

无 node 环境（沿用 v2 结论），因此用 **headless Edge + iframe 探针页**（`.deepworks/tmp/fbprobe.html`）读页面内部状态，
而不是只看截图：

| 断言 | 实测 | 结论 |
| :--- | :--- | :--- |
| 主脚本执行 | `html.class = [shot]` | `?shot=1` 由 JS 添加 → 脚本在跑 |
| 页面总高 / 视口 | `docHeight = 9598`，`innerH = 900` | — |
| `#feedback` | FOUND，`offsetTop=8483`，`h=961`，`opacity=1` | 板块存在且显现 |
| `#fbForm` | FOUND，`h=493`，`display=grid`，`visibility=visible` | 表单渲染正常且可见 |
| 设备预选 | `fbDevice.value = [电脑]` | **本轮新写的 IIFE 确实执行了** |
| 字数计数 | `fbCount = [0 / 1000]` | 计数器已初始化 |
| 灰色引导字 | `fbContent.placeholder` 长度 = **52** | 与设计文案一致 |
| 静态资源 | `v3-index.html / v3-style.css / v3-script.js / v3-about-data.js` 均 `200` | 服务可访问 |
| 移动端 390×844 | 字段**垂直堆叠**，标题/编号/字数/按钮齐全，无溢出 | 响应式断点生效 |

截图产物（临时，位于 `.deepworks/tmp/`）：`v3-probe-shot.png`（桌面探针）、`v3-mobile-shot.png`（移动端）。

### 4.1 端到端提交验证（真浏览器填表 → 真发请求 → 回读页面状态）

上面那张表只证明"板块渲染出来了"，不证明"点了提交会怎样"。于是又写了探针页
`.deepworks/tmp/fbsubmit.html`：在**同源 iframe 里真实填表 + `#fbSubmit.click()`**，再回读页面内部状态。
其中 `?mock=ok` 模式会在请求体里**剥掉 `name` 字段**，用来模拟"补列之后"的表结构。

| 场景 | 回读结果 | 结论 |
| :--- | :--- | :--- |
| 真实填表 | `count = 18 / 1000`（与所填内容字数完全一致） | 字数计数准确 |
| 点提交（当前表结构） | `status.class = "fb__status is-err"`、颜色 `rgb(255,154,154)`、文案「没能提交成功（PGRST204）…欢迎直接发邮件给我」 | **失败路径可读、不白屏、不卡死** |
| 同上 | `btn.disabled = false`、`draft kept = {"name":"端到端探针",…}` | 失败后**能重试**，且**草稿保住了**（不丢用户写的内容） |
| `mock=ok`（模拟补列后） | `status.class = "fb__status is-ok"`、颜色 `rgb(110,231,168)`、文案「收到啦，谢谢你花时间写这些。」 | **成功路径正常**，绿字提示 |
| 同上 | `draft kept = null`（`form.reset()` + 清草稿 + 设备恢复默认） | 成功后**清草稿并重置表单** |

两个分支都验过了，所以"补上 `name` 列之后到底能不能用"这件事，**除列本身以外的环节已无悬念**。

### 4.2 补列后复测（无损自检）与最终确认

| 时间 | 动作 | 结果 |
| :--- | :--- | :--- |
| 补列后 | 匿名 `GET ?select=name` | `200 []` → **列已存在**（列不存在时 PostgREST 会回 `400`），且**没有读到任何数据** |
| 补列后 | 匿名 `POST {name, device, content}` + `Prefer: return=representation` | `42501`（被 `RETURNING` 那层 RLS 拦下）→ **字段校验已通过**，不再是 `PGRST204`；**且没有写入任何行** |
| 推理 | 页面用的是 `Prefer: return=minimal` | 字段校验是同一道，因此**页面这条路必然成功** |
| 用户实测 | 在页面上真实填表提交 → Table Editor 查看 | ✅ **用户确认成功** |

> **值得记住的无损自检手法**：想确认"页面 payload 与线上表结构是否匹配"时，
> 用 `Prefer: return=representation` 发一次同 body 的请求 ——
> 字段不匹配 → `400 PGRST204`（直接告诉你是哪一列缺了）；字段匹配 → 被 `RETURNING` 那层拦成 `42501`。
> **两种结果都不会写入数据**，所以可以放心拿它检查线上表，不会留下垃圾行。

> 小提示：失败文案会把 PostgREST 的错误码（如 `PGRST204`）直接显示给访客。
> 这是**故意保留**的（方便一眼看出是数据库问题）；若觉得太技术化，下一轮可改为
> "稍后再试"并把错误码只写进 `console`。

---

## 5. 遗留 / 下一步

1. **[已完成] 数据库侧配置**：用户在 Supabase 控制台 → SQL Editor 执行了 `v3-web/supabase-setup.sql`
   （一键脚本：建表 / 补 `name` 列 + RLS 策略 + 清空测试数据），并确认页面提交成功。
   **课程 V3 的 Feedback 部分到此闭环**，已打 tag `v3`。
2. **[未开始] 课程 V3 的 Dashboard（数据看板）** —— 应当在 Supabase **控制台**里做
   （Table Editor + 图表 / SQL 报表即可满足课程要求）。
   ⚠️ **不要**为了"能在网页上读数据"而给 anon 加 select 策略：反馈内容不该被任何匿名访客翻看。
3. **[可选] 目前只采集了姓名与设备**：若后续想回信，可启用已预留的 `contact` 列。
4. **[可选] 失败提示里的错误码**：当前失败文案会把 `PGRST204` 这类技术码直接显示给访客（排障期故意保留）；
   若觉得太技术化，可改为统一「稍后再试」，把错误码只写进 `console`。
5. 抖音 / 视频号 链接（v2 遗留）仍未拿到。

---

## 6. 交付 / 上线（2026-09-17）

- **代码仓库**：<https://github.com/jqz070803/Personal-website>（public），分支 `main`（本地由 `master` 改名而来），
  tag `v1` / `v2` / `v3` 已全部推送。
- **在线地址**：**<https://jqz070803.github.io/Personal-website/>**
- **部署方式**：GitHub Actions（`.github/workflows/pages.yml`）——推送 `main` 即自动发布，
  它把 `v3-web/` **整个目录**当作站点根（`v3-index.html` 改名为 `index.html`）。
  ⇒ **以后改完 v3 页面只要 `git push`，线上约 1 分钟自动更新**，不需要手动上传。
- **前置条件（一次性）**：仓库 Settings → Pages → Source 必须选 `GitHub Actions`，
  否则工作流会卡在「配置 Pages」那一步失败。
- **上线验收**：线上首页 `200` / 70814 B（与本地 `v3-index.html` 字节数一致）、`v3-style.css` `200` / 50394 B、
  `v3-script.js` `200` / 47264 B、`assets/hero/hero-loop.mp4` `200` / 8.5 MB；
  截图证据 `artifacts/screenshots/v3-live-github-pages-desktop.png`（导航 8 项 / 首屏视频 / 两个按钮 / 山峦渲染正常）。
  → 反馈板块的提交链路在线上同样可用（同一份 JS + 同一个 Supabase 表）。
- 接入过程与踩坑（无关历史合并、`github.com` 连接不稳、GCM 非交互不弹窗）见 `docs/project-continuity.md` **§6.6**。

---

## 7. 上线后增量迭代（2026-09-17）

### 7.1 首屏 CTA 改为「下滑引导」（用户反馈）

**问题**：首屏那两个实体按钮（`走进我的世界` / `看看我的镜头`）"容易让别人去点击，而不是往下滑看内容" ——
按钮的视觉强度盖过了"继续滚动"的意图。

**改动**：

| 位置 | 改动 |
| :--- | :--- |
| `v3-index.html` | 删除 `.hero__actions` 两个 `.btn`；原 `.hero__scroll`（鼠标形状）改为 **文案 + 箭头 + 文案** 三段式 |
| `v3-style.css` | 删除 `.hero__actions` 规则与 420px 下的按钮堆叠；新增 `.hero__scroll` / `.hero__scroll-link` / `.hero__scroll-arrow` / `@keyframes heroArrowFloat` |

- **中间箭头**：内联 SVG（竖线 + 人字箭头，`stroke-linecap: round`），`heroArrowFloat` 1.7s 循环上下浮动 4px/3px 并做明暗呼吸；
  系统开启"减少动效"时自动静止（仍可见）。
- **两侧文案**：**保留可点**（`#journey` / `#lens`），但去掉按钮的全部外观（无底色、无描边、无阴影、无大内边距），
  默认 `rgba(255,255,255,.62)`，hover 才提亮到 `.96` + 浮现一条细下划线 → 「细看才像链接」，不再抢走下滑意图。
- **无障碍**：容器去掉了原来的 `aria-hidden="true"`（里面现在有可聚焦链接，不能再整体隐藏）。
- **缓存**：`?v=1 → ?v=2`（CSS/JS/数据脚本三处同步）。

**验证**：1440×900 与 390×844 实拍均正常 —— 三段式一行排开、不折行、箭头居中、`hero__actions` 无残留；
`.btn` 保留后页脚邮箱与反馈提交按钮样式不受影响。实拍见 `artifacts/screenshots/v3-hero-scrollhint-desktop.png` / `-mobile.png`。

### 7.2 「山川湖海足迹」照片点击放大（lightbox）

**诉求**（用户原话）：点单张照片看大图；**大图不要填满整屏、四周留白**；背景用"网站此时的虚化效果"当底图；
大图右上角要有叉可关闭；**点大图周边的空白处也能关闭**。

**实现**：

| 位置 | 改动 |
| :--- | :--- |
| `v3-index.html` | `<body>` 内、两个 `<script>` **之前**新增 `.lbox` 结构（backdrop + stage + `#lboxImg` + `#lboxClose` + 两段说明文字）；版本 `?v=2 → ?v=3` |
| `v3-style.css` | 新增 `.lbox*` 一整段（放在 `.journey-note` 之后，与足迹板块相邻） |
| `v3-script.js` | **文件末尾追加一个新 IIFE**（原有 11 个 IIFE 一字未动） |

- **为什么插在 `<script>` 之前**：`.lbox` 是 `position: fixed`，必须挂在 `<body>` 直接子级；
  一旦落在带 `transform` / `filter` 的祖先里，`fixed` 会退化成"相对该祖先定位"。
- **四周留白**：`.lbox__img` 用 `max-width: min(1120px, 86vw)` + `max-height: 74vh`（移动端 `92vw` / `66vh`），
  舞台 `padding: clamp(16px, 5vh, 60px) clamp(16px, 7vw, 96px)` ⇒ 1440×900 下大图约 1120×630，四周各留 160 / 117 px 以上。
  取的是**原图**（`media.currentSrc || media.src`）+ `object-fit: contain`，不做二次裁切；足迹 10 张原图 1050~1400 px，缩到 1120 仍清晰。
- **虚化底图**：`.lbox__backdrop` 铺满视口，`backdrop-filter: blur(24px) saturate(1.15)` + `rgba(4,11,21,.55)` 压暗
  ⇒ 模糊的是"**此刻页面本身**"，不是一张固定背景图，所以滚到哪、模糊的就是哪一块。
- **关闭**：右上角 `.lbox__close`（42px 圆形毛玻璃，`top/right: -14px` 略微探出图外）；
  舞台 `.lbox__stage` 设 `pointer-events: none`、只让图片与叉 `auto` ⇒ **点大图周边空白会自然落到 backdrop 上**（关闭），
  而**点大图本身什么也不会发生**（放大看细节时防误触，刻意设计）。
- **滚动锁**：`html.lbox-open { overflow: hidden }`（只给 body 设 overflow 在部分浏览器无效），
  并按 `innerWidth - clientWidth` 补 `padding-right`，避免锁上/解开时整页横向抖一下。
- **无障碍**：容器 `role="dialog" aria-modal="true"`；打开时焦点移到关闭按钮，关闭后把焦点还给刚才那张照片；
  `prefers-reduced-motion` 下取消过渡。
- **提示光标**：`.ms-tile { cursor: zoom-in }`。

**验证**（本环境无 node、无交互式浏览器，改用"真实页面副本 + 脚本触发 + `--dump-dom` 读真实 DOM"的方式）：

| 检查项 | 结果 |
| :--- | :--- |
| 点照片 | `is-open` + 滚动锁生效；`src` = 被点那张原图（`03-hai.jpg`）；标题取自 `figcaption`（`海`） |
| 按 Esc / 点周边空白 / 点右上角叉 | 三条路径均正确关闭并解锁 |
| 点大图本身 | 保持打开（符合设计） |
| 视觉 | 桌面 1440×900 / 移动 390×844：大图居中留白、圆角与投影、右上角圆形叉、下方说明文字，背景是被模糊的页面 |

实拍见 `artifacts/screenshots/v3-lightbox-open-desktop.png` / `-mobile.png`（把足迹区顶进视口后触发真实点击所得）。

**踩坑记录**：headless 截图在页面**发生过滚动**之后会拍出纯色空图（`window.scrollTo` 之后无论加不加 `?shot=1` 都一样），
与灯箱本身无关；改用负 `margin-top` 把目标板块顶进视口（不用 `transform`，避免破坏 `position: fixed`）后拍摄正常。
