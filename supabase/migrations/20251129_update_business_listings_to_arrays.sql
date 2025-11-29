BEGIN;

-- Drop the constraint on type
ALTER TABLE public.business_listings DROP CONSTRAINT IF EXISTS business_listings_type_check;

-- Change columns to arrays
ALTER TABLE public.business_listings 
    ALTER COLUMN type TYPE TEXT[] USING ARRAY[type],
    ALTER COLUMN category TYPE TEXT[] USING ARRAY[category];

COMMIT;
