BEGIN;

-- 1. 持牌法團 (Licensed Corporations)
CREATE TABLE IF NOT EXISTS public.licensed_corporations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_zh TEXT,
    name_en TEXT NOT NULL,
    established_at DATE,
    central_entity_number TEXT,
    license_types TEXT[],
    business_introduction TEXT,
    founders_and_team TEXT,
    website_url TEXT,
    address TEXT,
    contact_phone TEXT,
    office_map_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 牌照申請 (License Applications)
CREATE TABLE IF NOT EXISTS public.license_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_type TEXT NOT NULL CHECK (applicant_type IN ('company', 'individual')),
    applicant_name TEXT NOT NULL,
    location TEXT,
    industry_and_domain TEXT[],
    other_industry TEXT,
    license_types_applied TEXT[],
    has_ro_candidate BOOLEAN,
    contact_phone TEXT,
    email TEXT,
    wechat TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 牌照收購 (License Acquisitions)
CREATE TABLE IF NOT EXISTS public.license_acquisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acquirer_type TEXT NOT NULL CHECK (acquirer_type IN ('company', 'individual')),
    acquirer_name TEXT NOT NULL,
    location TEXT,
    industry_and_domain TEXT[],
    other_industry TEXT,
    license_types_sought TEXT[],
    budget TEXT,
    contact_phone TEXT,
    email TEXT,
    wechat TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. RO資訊 - 我是RO (RO Profiles)
CREATE TABLE IF NOT EXISTS public.ro_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name_zh TEXT,
    name_en TEXT NOT NULL,
    central_entity_number TEXT,
    license_types TEXT[],
    industry_experience TEXT,
    languages TEXT[],
    is_director BOOLEAN,
    is_hong_kong_resident BOOLEAN,
    availability_date DATE,
    expected_salary TEXT,
    contact_info JSONB, -- { phone, email }
    cv_url TEXT, -- URL to the uploaded CV file
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. RO資訊 - 尋找RO (RO Searches)
CREATE TABLE IF NOT EXISTS public.ro_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name_zh TEXT,
    company_name_en TEXT NOT NULL,
    central_entity_number TEXT,
    license_types_needed TEXT[],
    office_location TEXT,
    salary_range TEXT,
    contact_person_name TEXT,
    contact_person_title TEXT,
    contact_info JSONB, -- { phone, email }
    other_requirements TEXT,
    business_card_url TEXT, -- URL to the uploaded business card
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. 牌照出售 (License Sales) - Extending existing posts table
-- We will add a new table to hold the specific sales details
-- and link it to the posts table.
CREATE TABLE IF NOT EXISTS public.license_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    company_name_en TEXT NOT NULL,
    company_name_zh TEXT,
    has_holding_structure BOOLEAN,
    license_types TEXT[],
    license_conditions TEXT,
    business_can_be_developed TEXT,
    licensing_date DATE,
    office_rent TEXT,
    shareholders_background TEXT,
    number_of_employees TEXT,
    number_of_ro TEXT,
    total_salaries_for_ro TEXT,
    number_of_clients INTEGER,
    has_regulated_activities_website BOOLEAN,
    sfc_disciplinary_actions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_licensed_corporations_name_en ON public.licensed_corporations (name_en);
CREATE INDEX IF NOT EXISTS idx_ro_profiles_user_id ON public.ro_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_license_sales_post_id ON public.license_sales (post_id);

-- Enable Row Level Security for all new tables
ALTER TABLE public.licensed_corporations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_acquisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ro_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Start with some sensible defaults.
-- Allow public read access for most informational tables.
CREATE POLICY p_licensed_corporations_select_all ON public.licensed_corporations FOR SELECT USING (true);
CREATE POLICY p_license_sales_select_all ON public.license_sales FOR SELECT USING (true);
CREATE POLICY p_ro_searches_select_all ON public.ro_searches FOR SELECT USING (true);

-- Allow authenticated users to insert into application/acquisition/profile tables.
CREATE POLICY p_license_applications_insert_auth ON public.license_applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_license_acquisitions_insert_auth ON public.license_acquisitions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY p_ro_profiles_insert_auth ON public.ro_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Allow users to see and manage their own RO profile.
CREATE POLICY p_ro_profiles_select_self ON public.ro_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY p_ro_profiles_update_self ON public.ro_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Admin policies: Admins should have full access.
CREATE POLICY p_admin_all_access_licensed_corporations ON public.licensed_corporations FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
CREATE POLICY p_admin_all_access_license_applications ON public.license_applications FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
CREATE POLICY p_admin_all_access_license_acquisitions ON public.license_acquisitions FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
CREATE POLICY p_admin_all_access_ro_profiles ON public.ro_profiles FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
CREATE POLICY p_admin_all_access_ro_searches ON public.ro_searches FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
CREATE POLICY p_admin_all_access_license_sales ON public.license_sales FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

COMMIT;
