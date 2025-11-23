create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  cover text,
  content text,
  source_type text not null check (source_type in ('editorial','community')),
  content_type text check (content_type in ('news','research','education','events','opinion')),
  status text not null check (status in ('draft','pending','published','archived')),
  author_id uuid,
  author_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  location text,
  image text,
  source_type text check (source_type in ('editorial','community')),
  status text not null check (status in ('draft','pending','published','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  created_at timestamptz not null default now()
);
create unique index if not exists idx_event_regs_unique on public.event_registrations (event_id, user_id);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null,
  author_name text,
  content text not null,
  status text default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  content text not null,
  status text default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'member' check (role in ('member','admin')),
  display_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_created_at on public.posts (created_at);
create index if not exists idx_posts_status on public.posts (status);
create index if not exists idx_posts_source_type on public.posts (source_type);
create index if not exists idx_posts_content_type on public.posts (content_type);
create index if not exists idx_posts_author_id on public.posts (author_id);

create index if not exists idx_events_created_at on public.events (created_at);
create index if not exists idx_events_status on public.events (status);
create index if not exists idx_events_source_type on public.events (source_type);
create index if not exists idx_events_date on public.events (date);

create index if not exists idx_comments_created_at on public.comments (created_at);
create index if not exists idx_comments_post_id on public.comments (post_id);
create index if not exists idx_comments_status on public.comments (status);

create index if not exists idx_guestbook_created_at on public.guestbook (created_at);
create index if not exists idx_guestbook_status on public.guestbook (status);

create index if not exists idx_users_role on public.users (role);
create index if not exists idx_users_created_at on public.users (created_at);

alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.comments enable row level security;
alter table public.guestbook enable row level security;
alter table public.users enable row level security;

drop policy if exists p_posts_select_all on public.posts;
drop policy if exists p_events_select_all on public.events;
drop policy if exists p_comments_select_visible on public.comments;
drop policy if exists p_guestbook_select_visible on public.guestbook;
drop policy if exists p_users_select_all on public.users;

drop policy if exists p_posts_select_published_any on public.posts;
drop policy if exists p_posts_select_author_or_admin_auth on public.posts;
drop policy if exists p_posts_insert_author_auth on public.posts;
drop policy if exists p_posts_update_author_or_admin_auth on public.posts;
drop policy if exists p_posts_delete_author_or_admin_auth on public.posts;

drop policy if exists p_events_select_published_any on public.events;
drop policy if exists p_events_select_admin_auth on public.events;
drop policy if exists p_events_write_admin_auth on public.events;
drop policy if exists p_event_regs_select_self on public.event_registrations;
drop policy if exists p_event_regs_insert_self on public.event_registrations;
drop policy if exists p_event_regs_select_admin on public.event_registrations;

drop policy if exists p_comments_select_visible_any on public.comments;
drop policy if exists p_comments_select_admin_auth on public.comments;
drop policy if exists p_comments_insert_auth on public.comments;
drop policy if exists p_comments_write_admin_auth on public.comments;

drop policy if exists p_guestbook_select_visible_any on public.guestbook;
drop policy if exists p_guestbook_select_admin_auth on public.guestbook;
drop policy if exists p_guestbook_insert_auth on public.guestbook;
drop policy if exists p_guestbook_write_admin_auth on public.guestbook;

drop policy if exists p_users_select_admin_auth on public.users;
drop policy if exists p_users_write_admin_auth on public.users;

create policy p_posts_select_published_any on public.posts for select using (status = 'published');
create policy p_posts_select_author_or_admin_auth on public.posts for select to authenticated using (author_id = auth.uid() or exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_posts_insert_author_auth on public.posts for insert to authenticated with check (author_id = auth.uid());
create policy p_posts_update_author_or_admin_auth on public.posts for update to authenticated using (author_id = auth.uid() or exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')) with check (author_id = auth.uid() or exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_posts_delete_author_or_admin_auth on public.posts for delete to authenticated using (author_id = auth.uid() or exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy p_events_select_published_any on public.events for select using (status = 'published');
create policy p_events_select_admin_auth on public.events for select to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_events_write_admin_auth on public.events for all to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')) with check (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy p_event_regs_select_self on public.event_registrations for select to authenticated using (user_id = auth.uid());
create policy p_event_regs_insert_self on public.event_registrations for insert to authenticated with check (user_id = auth.uid());
create policy p_event_regs_select_admin on public.event_registrations for select to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy p_comments_select_visible_any on public.comments for select using (status = 'visible');
create policy p_comments_select_admin_auth on public.comments for select to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_comments_insert_auth on public.comments for insert to authenticated with check (true);
create policy p_comments_write_admin_auth on public.comments for update to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')) with check (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_comments_delete_admin_auth on public.comments for delete to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy p_guestbook_select_visible_any on public.guestbook for select using (status = 'visible');
create policy p_guestbook_select_admin_auth on public.guestbook for select to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_guestbook_insert_auth on public.guestbook for insert to authenticated with check (true);
create policy p_guestbook_write_admin_auth on public.guestbook for update to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')) with check (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_guestbook_delete_admin_auth on public.guestbook for delete to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

create policy p_users_select_admin_auth on public.users for select to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy p_users_write_admin_auth on public.users for all to authenticated using (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')) with check (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

insert into public.users (email, role, display_name) values
  ('admin@example.com','admin','Admin'),
  ('member1@example.com','member','Member One'),
  ('member2@example.com','member','Member Two'),
  ('laia888@example.com','admin','Laia'),
  ('guest@example.com','member','Guest');

insert into public.posts (id, title, excerpt, cover, source_type, content_type, status, author_name)
values
  ('11111111-1111-1111-1111-111111111111','资管行业洞察','市场变化与趋势','https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop','editorial','research','published','member1'),
  ('22222222-2222-2222-2222-222222222222','基金教育指南','基础知识与案例','https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop','community','education','published','member2'),
  ('33333333-3333-3333-3333-333333333333','行业新闻速递','本周新闻摘要','https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop','editorial','news','published','member1'),
  (gen_random_uuid(),'研究报告：风险与回报','回报率分析','https://images.unsplash.com/photo-1475724017904-b712052c192a?q=80&w=1600&auto=format&fit=crop','editorial','research','pending','member2'),
  (gen_random_uuid(),'观点：长期投资','价值与耐心','https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop','community','opinion','published','member1'),
  (gen_random_uuid(),'教育：基金类型','分类与差异',null,'editorial','education','draft','member2'),
  (gen_random_uuid(),'新闻：监管动态','政策更新',null,'editorial','news','published','member1'),
  (gen_random_uuid(),'活动回顾','精彩瞬间','https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop','community','events','archived','member2'),
  (gen_random_uuid(),'研究：资产配置','组合与权重',null,'editorial','research','published','member1'),
  (gen_random_uuid(),'教育：费用结构','透明与合规',null,'community','education','published','member2'),
  (gen_random_uuid(),'新闻：市场波动','宏观与微观',null,'editorial','news','pending','member1'),
  (gen_random_uuid(),'观点：指数化投资','被动与主动',null,'community','opinion','published','member2'),
  (gen_random_uuid(),'研究：风险分散','相关性与多样化',null,'editorial','research','published','member1'),
  (gen_random_uuid(),'教育：基金合同','条款与权利',null,'community','education','published','member2'),
  (gen_random_uuid(),'新闻：行业并购','事件与影响',null,'editorial','news','published','member1');

insert into public.events (title, date, location, image, source_type, status)
values
  ('HKIFA 年度大会','2025-06-23','Hong Kong','https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop','editorial','published'),
  ('行业圆桌','2025-07-10','Shenzhen','https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop','community','published'),
  ('培训工作坊','2025-08-02','Guangzhou','https://images.unsplash.com/photo-1475724017904-b712052c192a?q=80&w=1600&auto=format&fit=crop','editorial','published'),
  ('合规论坛','2025-09-12','Shanghai',null,'editorial','pending'),
  ('投研沙龙','2025-10-05','Beijing',null,'community','published'),
  ('教育公开课','2025-06-30','Hong Kong',null,'editorial','draft'),
  ('市场研讨会','2025-07-20','Shenzhen',null,'community','published'),
  ('指数化峰会','2025-08-18','Guangzhou',null,'editorial','published'),
  ('资管大会','2025-09-25','Shanghai',null,'community','pending'),
  ('研究分享会','2025-10-15','Beijing',null,'editorial','published'),
  ('教育闭门会','2025-10-20','Hong Kong',null,'community','archived'),
  ('市场圆桌','2025-11-01','Shenzhen',null,'editorial','published'),
  ('合规培训','2025-11-08','Guangzhou',null,'community','published'),
  ('行业论坛','2025-11-15','Shanghai',null,'editorial','published'),
  ('投研大会','2025-11-22','Beijing',null,'community','published');

insert into public.comments (post_id, author_name, content, status)
values
  ('11111111-1111-1111-1111-111111111111','member1','很棒的文章','visible'),
  ('11111111-1111-1111-1111-111111111111','member2','观点到位','visible'),
  ('22222222-2222-2222-2222-222222222222','member1','教育内容很实用','visible'),
  ('22222222-2222-2222-2222-222222222222','member2','期待下一篇','visible'),
  ('33333333-3333-3333-3333-333333333333','member1','新闻汇总清晰','visible'),
  ('33333333-3333-3333-3333-333333333333','member2','数据详实','visible'),
  ('11111111-1111-1111-1111-111111111111','member3','建议补充图表','visible'),
  ('22222222-2222-2222-2222-222222222222','member4','希望增加案例','visible'),
  ('33333333-3333-3333-3333-333333333333','member5','支持','visible'),
  ('11111111-1111-1111-1111-111111111111','member6','有收获','visible'),
  ('22222222-2222-2222-2222-222222222222','member7','学习了','visible'),
  ('33333333-3333-3333-3333-333333333333','member8','赞','visible'),
  ('11111111-1111-1111-1111-111111111111','member9','不错','visible'),
  ('22222222-2222-2222-2222-222222222222','member10','感谢分享','visible'),
  ('33333333-3333-3333-3333-333333333333','member11','受益匪浅','visible');

insert into public.guestbook (nickname, content, status)
values
  ('访客A','请增加更多基金教育内容','visible'),
  ('GuestB','活动很精彩，期待下一期','visible'),
  ('访客C','希望增加研究分享','visible'),
  ('GuestD','网站体验不错','visible'),
  ('访客E','建议增加FAQ','visible'),
  ('GuestF','分页演示很清晰','visible'),
  ('访客G','点赞','visible'),
  ('GuestH','继续加油','visible'),
  ('访客I','希望增加课程','visible'),
  ('GuestJ','界面简洁','visible'),
  ('访客K','功能完善','visible'),
  ('GuestL','建议增加筛选','visible'),
  ('访客M','希望有搜索','visible'),
  ('GuestN','不错的项目','visible'),
  ('访客O','期待更新','visible');