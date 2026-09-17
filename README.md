# 江沁钊 · 个人主页

课程项目 **Vibe Coding** 的个人主页。纯静态前端（`HTML + CSS + JS`，无框架、无构建、无依赖），
直接打开就能跑。

最新版本是 **v3**：在主页之外，还加了一个「问题反馈」板块，访客填写的反馈会直接写进
Supabase 数据库（姓名 / 设备 / 反馈内容）。

---

## 在线预览

👉 **https://jqz070803.github.io/Personal-website/**

由 **GitHub Pages** 托管，每次推送到 `main` 分支都会自动重新部署（见 `.github/workflows/pages.yml`）。

## 本地预览

本项目固定用 **8123** 端口，在项目根目录执行：

```bash
python -m http.server 8123
```

然后打开 <http://127.0.0.1:8123/v3-web/v3-index.html>。
（直接双击 `v3-web/v3-index.html` 也能看，但建议用本地服务，避免个别浏览器的本地文件限制。）

## 目录结构

```
.
├── v1-web/            # 版本 v1：MVP 主页
├── v2-web/            # 版本 v2：「学业 · 专业」整页板块 + 视差山峦背景 + 足迹拼图
├── v3-web/            # ★ 版本 v3（最新）：新增「问题反馈」板块，写入 Supabase
│   ├── v3-index.html      # 主页面
│   ├── v3-style.css
│   ├── v3-script.js
│   ├── v3-about-data.js   # 手写单词笔顺数据（唯一真源）
│   ├── supabase-setup.sql # 数据库一键脚本（建表 / 权限 / RLS）
│   ├── assets/            # 图片、字体、首屏视频
│   └── tools/             # 背景与视频生成脚本
├── docs/              # 各版本的迭代进度报告 + 项目记忆库
├── artifacts/screenshots/  # 各版本验收截图
└── .github/workflows/pages.yml  # GitHub Pages 自动部署
```

每个版本**独立成目录**、旧版保留不删，方便回退对照。

## 版本存档点（Git tag）

| tag | 内容 |
| :---: | :--- |
| `v1` | MVP 主页 |
| `v2` | 「学业 · 专业」整页板块 + 视差山峦背景 + 足迹拼图 |
| `v3` | 「问题反馈」板块（姓名 / 设备 / 反馈内容 → Supabase） |

## 反馈功能的说明

「问题反馈」板块的提交地址是 Supabase 的 `public.user_feedback` 表。
前端里用到的只是一把 **publishable key**，它是设计上可以公开的 —— 真正的安全边界在数据库的
**Row Level Security**：匿名访客**只能新增**，读不到、改不了、也删不掉别人的反馈。
要看数据请在 Supabase 控制台的 Table Editor 里看。

## 技术栈

- 纯静态：`HTML` + `CSS` + `JavaScript`，零依赖、零构建
- 后端：`Supabase`（Postgres + 自动生成的 REST API + RLS）
- 托管：`GitHub Pages`
