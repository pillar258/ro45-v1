BEGIN;

CREATE TABLE IF NOT EXISTS public.license_sale_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_types TEXT[] NOT NULL,
    has_legal_entity BOOLEAN NOT NULL,
    has_bank_account BOOLEAN NOT NULL,
    ro_count INTEGER NOT NULL,
    asking_price NUMERIC NOT NULL,
    contact_phone TEXT NOT NULL,
    email TEXT NOT NULL,
    wechat TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.license_sale_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert license sale submissions"
ON public.license_sale_submissions
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow admin users to view all license sale submissions"
ON public.license_sale_submissions
FOR SELECT TO authenticated
USING (
  exists(
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'admin'
  )
);

COMMIT;