-- Supabase SQL Migration: Storage bucket for project gallery images
-- Run this in the Supabase SQL Editor.

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read project images" ON storage.objects;
CREATE POLICY "Public can read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Owner can upload project images" ON storage.objects;
CREATE POLICY "Owner can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Owner can update project images" ON storage.objects;
CREATE POLICY "Owner can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images' AND auth.email() = 'muhammad.wyzer@gmail.com')
  WITH CHECK (bucket_id = 'project-images' AND auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Owner can delete project images" ON storage.objects;
CREATE POLICY "Owner can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images' AND auth.email() = 'muhammad.wyzer@gmail.com');
