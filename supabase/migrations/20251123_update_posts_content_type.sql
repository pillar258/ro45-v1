-- First, drop the existing constraint
ALTER TABLE public.posts
DROP CONSTRAINT IF EXISTS posts_content_type_check;

-- Then, add the new constraint with the updated values
ALTER TABLE public.posts
ADD CONSTRAINT posts_content_type_check
CHECK (content_type IN ('news', 'research', 'education', 'events', 'opinion', 'license_sale'));
