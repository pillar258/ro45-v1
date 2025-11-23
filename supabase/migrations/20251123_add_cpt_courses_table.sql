
BEGIN;

-- 5. CPT 课程 (CPT Courses)
CREATE TABLE IF NOT EXISTS public.cpt_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    hours NUMERIC,
    price NUMERIC,
    external_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 插入一些 CPT 课程的示例数据
INSERT INTO public.cpt_courses (title, description, image_url, category, hours, price, external_link) VALUES
('金融科技（FinTech）的合规挑战与机遇', '探讨金融科技创新如何重塑监管环境，以及企业如何应对随之而来的合规挑战。', 'https://images.unsplash.com/photo-1600428880964-c4b263757463?q=80&w=1600&auto=format&fit=crop', '金融科技', 3, 1500, 'https://example.com/course1'),
('资产管理行业的可持续投资（ESG）策略', '深入分析环境、社会及管治（ESG）因素如何影响投资决策，并介绍主流的可持续投资框架。', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop', '资产管理', 2, 1200, 'https://example.com/course2'),
('反洗钱（AML）与恐怖分子资金筹集（CFT）最新法规解读', '全面解读最新的反洗钱与反恐融资法规，帮助金融机构提升合规水平，防范金融犯罪。', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop', '合规与风险管理', 4, 2000, 'https://example.com/course3'),
('量化交易的风险管理与模型验证', '介绍量化交易中的常见风险，并探讨如何通过有效的模型验证与风险控制，确保交易策略的稳健性。', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1600&auto=format&fit=crop', '量化交易', 3, 1800, 'https://example.com/course4'),
('虚拟资产的监管框架与投资实践', '分析全球主要市场对虚拟资产的监管政策，并分享在合规前提下进行虚拟资产投资的实践经验。', 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1600&auto=format&fit=crop', '虚拟资产', 2, 1300, 'https://example.com/course5');

-- 为 CPT 课程表启用 RLS
ALTER TABLE public.cpt_courses ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
-- 允许所有人读取已发布的 CPT 课程
CREATE POLICY p_cpt_courses_select_all ON public.cpt_courses FOR SELECT USING (true);
-- 允许管理员对 CPT 课程进行所有操作
CREATE POLICY p_admin_all_access_cpt_courses ON public.cpt_courses FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

COMMIT;
