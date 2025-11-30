ALTER TABLE public.cpt_courses ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Cantonese';

UPDATE public.cpt_courses SET language = 'Cantonese' WHERE language IS NULL;
