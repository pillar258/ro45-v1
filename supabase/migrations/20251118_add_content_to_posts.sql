-- Add content field to posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'posts' 
        AND column_name = 'content'
    ) THEN
        ALTER TABLE public.posts ADD COLUMN content text;
    END IF;
END
$$;