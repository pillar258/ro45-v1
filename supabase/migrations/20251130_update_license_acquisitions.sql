
ALTER TABLE public.license_acquisitions 
ADD COLUMN IF NOT EXISTS acquisition_method TEXT[],
ADD COLUMN IF NOT EXISTS other_license_type TEXT;
