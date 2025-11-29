BEGIN;

-- 1. Create Storage Bucket for Business Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for business-images bucket
CREATE POLICY "Allow authenticated uploads to business-images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'business-images');

CREATE POLICY "Allow public read access to business-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'business-images');

-- 2. Create Business Listings Table
CREATE TABLE IF NOT EXISTS public.business_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('introduction', 'business')), -- 公司介绍 vs 业务信息
    category TEXT NOT NULL, -- licensed_corp, cpa, law_firm, compliance, other
    name TEXT NOT NULL, -- 公司/机构名称
    description TEXT, -- 公司介绍/业务说明 (1000字以内)
    website TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_listings_type ON public.business_listings (type);
CREATE INDEX IF NOT EXISTS idx_business_listings_category ON public.business_listings (category);
CREATE INDEX IF NOT EXISTS idx_business_listings_created_at ON public.business_listings (created_at);
CREATE INDEX IF NOT EXISTS idx_business_listings_views ON public.business_listings (views);

-- Enable RLS
ALTER TABLE public.business_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public to read approved listings
CREATE POLICY p_business_listings_select_public ON public.business_listings 
FOR SELECT USING (status = 'approved' OR user_id = auth.uid());

-- Allow authenticated users to insert
CREATE POLICY p_business_listings_insert_auth ON public.business_listings 
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own listings
CREATE POLICY p_business_listings_update_own ON public.business_listings 
FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY p_admin_all_access_business_listings ON public.business_listings 
FOR ALL USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

COMMIT;
