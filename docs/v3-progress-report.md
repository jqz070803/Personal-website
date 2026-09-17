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
| 匿名 `POST {device, content}` + `Prefer: return=minimal` | **`201`** | **匿名写入通道已打通**（页面用的就是这一种） |
| 匿名 `POST {device, content}` + `Prefer: return=representation` | `42501`<br>`new row violates row-level security policy` | 表上**只有 insert 策略、没有 select 策略**，而 `RETURNING` 要过 select 策略 → 报错 |
| 匿名 `POST {name, device, content}` | `400 PGRST204`<br>`Could not find the 'name' column` | 表里**还缺 `name` 列** |
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

> 小提示：失败文案会把 PostgREST 的错误码（如 `PGRST204`）直接显示给访客。
> 这是**故意保留**的（方便一眼看出是数据库问题）；若觉得太技术化，下一轮可改为
> "稍后再试"并把错误码只写进 `console`。

---

## 5. 遗留 / 下一步

1. **[待用户 · 阻塞项]** 在 Supabase 控制台 → SQL Editor 执行 `v3-web/supabase-setup.sql` 的**第 1 步**
   （`alter table public.user_feedback add column if not exists name text;`）。
   **不补这一列，访客提交一定失败**（`400 PGRST204`）。
2. **[待用户 · 清理测试数据]** 排障期间我往表里插入过测试行，而 anon 既没有 select 也没有 delete 权限，
   **我删不掉也看不见**。请在 SQL Editor（owner 身份，绕过 RLS）里先看一眼、再清掉：

   ```sql
   -- ① 先看看表里到底有什么（包括我留下的测试行）
   select id, contact, device, content, created_at
     from public.user_feedback
    order by created_at desc;
   ```

   ```sql
   -- ② 确认后清掉测试行（也可以直接在 Table Editor 里勾选删除）
   delete from public.user_feedback
    where content in ('probe', 'probe-b')
       or content like '%dw-probe-marker%'
       or content like '%端到端测试%';
   ```
3. **[待做]** 用户补列后，我再跑一次**不带 `mock`** 的端到端提交，确认表内真的多出一行 →
   然后 `git commit` 并打 tag `v3`。
4. 课程 V3 的 **Dashboard**（数据看板）尚未开始 —— 它应当在 Supabase 控制台里做，
   **不要**为了"能读到数据"而给 anon 加 select 策略。
5. 抖音 / 视频号 链接（v2 遗留）仍未拿到。
