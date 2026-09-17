-- =========================================================
-- 江沁钊个人主页 · V3 问题反馈表单 —— 数据库初始化脚本
--
-- 用法：Supabase 控制台 → 左侧 SQL Editor → New query → 整段粘贴 → Run
-- 特点：幂等，可重复执行，不会报错也不会重复建策略
--
-- 当前实测状态（逐条验证过，2026-09-17 复测）：
--   · 匿名"插入"通道已经可用 —— POST 带 Prefer: return=minimal 返回 201
--   · 表里还缺 name 列 —— POST 带 name 会返回 PGRST204：
--       "Could not find the 'name' column of 'user_feedback' in the schema cache"
--       → 所以下面第 1 步是必须的，不补这一列访客一定提交失败
--   · 匿名"读取"是被挡住的，而且这是**有意设计**（见第 3 步）：
--       - POST 带 Prefer: return=representation 会返回 42501
--         "new row violates row-level security policy"
--         （原因：RETURNING 要过 select 策略，而表上只有 insert 策略。页面用的是
--           return=minimal，所以访客提交完全不受影响）
--       - GET 只返回 [] —— 这**不代表表是空的**
--     ⚠️ 不要为了"能读到数据"给 anon 加 select 策略：反馈内容不该被匿名访客翻看。
--        要看数据请在控制台的 Table Editor / Dashboard 里看（那里绕过 RLS）。
--   · 第 2、3 步是幂等兜底，重复执行不会报错，也不会动你已经配好的策略。
-- =========================================================

-- 1) 补上「姓名」列（原有的 contact / device / content / created_at 继续沿用）
alter table public.user_feedback
  add column if not exists name text;

-- 2) 给匿名访客（anon 角色）开放"插入"权限
grant usage on schema public to anon;
grant insert on table public.user_feedback to anon;

-- 3) 新建 RLS 策略：只放行"新增反馈"，不开放读取 / 修改 / 删除
--    （访客只能写，不能看到别人的反馈，也不能改你表里的任何数据）
drop policy if exists "anon can insert feedback" on public.user_feedback;
create policy "anon can insert feedback"
  on public.user_feedback
  for insert
  to anon
  with check (true);

-- =========================================================
-- 执行完可以自查一下（可选）：
--   select policyname, cmd, roles from pg_policies
--   where tablename = 'user_feedback';
-- 应当能看到 anon can insert feedback / INSERT / {anon} 这一行。
-- =========================================================
