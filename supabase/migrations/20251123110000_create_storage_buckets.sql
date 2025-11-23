-- Create Storage Bucket for CVs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cv-uploads', 'cv-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for cv-uploads bucket
-- 1. Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'cv-uploads');

-- 2. Allow public read access to the files
CREATE POLICY "Allow public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cv-uploads');
