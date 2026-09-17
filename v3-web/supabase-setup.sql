-- =========================================================
-- 江沁钊个人主页 · V3 问题反馈表单 —— 数据库初始化脚本
--
-- 用法：Supabase 控制台 → 左侧 SQL Editor → New query → 整段粘贴 → Run
-- 特点：幂等，可重复执行，不会报错也不会重复建策略
--
-- 当前实测状态（逐条验证过）：
--   · 匿名"插入"通道已经可用 —— 直接 POST 返回 201，说明这一步你已经配好了
--   · 但表里还缺 name 列 —— POST 带 name 会返回 PGRST204：
--       "Could not find the 'name' column of 'user_feedback' in the schema cache"
--   所以下面第 1 步是必须的；第 2、3 步是幂等兜底，重复执行不会报错，
--   也不会动你已经配好的策略。
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
