-- Add views and is_pinned columns to support sorting and pinning features

-- 1. business_listings
ALTER TABLE public.business_listings ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.business_listings ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 2. posts (referenced by license_sales)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 3. license_acquisitions
ALTER TABLE public.license_acquisitions ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.license_acquisitions ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 4. ro_profiles
ALTER TABLE public.ro_profiles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.ro_profiles ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 5. license_sale_submissions
ALTER TABLE public.license_sale_submissions ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.license_sale_submissions ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
