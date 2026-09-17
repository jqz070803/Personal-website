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
| `v3-web/supabase-setup.sql` | 1,858 B | 数据库初始化脚本（补列 + RLS 兜底），交给用户在 SQL Editor 执行 |

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
- 表：`public.user_feedback`，现有列 `id` / `contact` / `device` / `content` / `created_at`。
- **实测结论（逐条验证）**：

| 探测 | 结果 | 含义 |
| :--- | :--- | :--- |
| 匿名 `GET ?select=*` | `200 []` | 匿名可读（返回空表） |
| 匿名 `POST {device, content}` | **`201`** | **匿名写入通道已打通**，RLS 已放行 insert |
| 匿名 `POST {name, device, content}` | `400 PGRST204`<br>`Could not find the 'name' column` | 表里**还缺 `name` 列** |

> 注：本轮开始时匿名 POST 曾被 RLS 拒绝（`42501 new row violates row-level security policy`），
> 后经复测已返回 201 —— 以**当前实测**为准。

- 因此数据库侧**只差一步**：在 Supabase 控制台 → SQL Editor 执行 `v3-web/supabase-setup.sql` 的**第 1 步**
  （`alter table public.user_feedback add column if not exists name text;`）。
  脚本里的第 2、3 步（grant + RLS 策略）是幂等兜底，重复执行不会报错，也不会动已配好的策略。

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

---

## 5. 遗留 / 下一步

1. **[待用户]** 执行 `v3-web/supabase-setup.sql` 第 1 步补 `name` 列 —— 完成后提交链路才真正可用；
2. **[待做]** 用户补列后做一次**端到端提交**（浏览器里真实填表 → 表内应出现新行）；
3. **[待做]** 本节完成后再 `git commit` 并打 tag `v3`；
4. 课程 V3 的 **Dashboard** 部分（数据看板）尚未开始；抖音 / 视频号 链接（v2 遗留）仍未拿到。
