BEGIN;

-- Create table if it doesn't exist (base structure)
CREATE TABLE IF NOT EXISTS public.license_sale_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_types TEXT[] NOT NULL,
    ro_count INTEGER,
    asking_price NUMERIC,
    contact_phone TEXT,
    email TEXT,
    wechat TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alter table to match new requirements
ALTER TABLE public.license_sale_submissions
    DROP COLUMN IF EXISTS has_legal_entity,
    DROP COLUMN IF EXISTS has_bank_account,
    ADD COLUMN IF NOT EXISTS established_date DATE,
    ADD COLUMN IF NOT EXISTS shareholder_count INTEGER,
    ADD COLUMN IF NOT EXISTS has_holding_structure BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_holding_company_sold BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS employee_count INTEGER,
    ADD COLUMN IF NOT EXISTS total_compensation TEXT;

-- Enable RLS
ALTER TABLE public.license_sale_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public insertion (since it's a public form)
DROP POLICY IF EXISTS "Allow public insertion to license_sale_submissions" ON public.license_sale_submissions;
CREATE POLICY "Allow public insertion to license_sale_submissions" 
ON public.license_sale_submissions FOR INSERT 
WITH CHECK (true);

-- Allow admin access
DROP POLICY IF EXISTS "Allow admin access to license_sale_submissions" ON public.license_sale_submissions;
CREATE POLICY "Allow admin access to license_sale_submissions" 
ON public.license_sale_submissions FOR ALL 
USING (exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

COMMIT;
