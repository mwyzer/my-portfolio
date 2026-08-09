-- Supabase SQL Migration: Restrict all writes to the site owner
-- Run this in the Supabase SQL Editor.
--
-- Previously, INSERT/UPDATE/DELETE policies only checked
-- `TO authenticated ... WITH CHECK (true)` — i.e. ANY authenticated
-- Supabase user (including one who just signed themselves up) could
-- write to every table. This scopes every write policy to a single
-- owner email instead.
--
-- If you ever need a second admin, add their email with OR here.

-- Portfolio Projects
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON portfolio_projects;
CREATE POLICY "Owner can insert projects"
  ON portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can update projects" ON portfolio_projects;
CREATE POLICY "Owner can update projects"
  ON portfolio_projects FOR UPDATE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com')
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON portfolio_projects;
CREATE POLICY "Owner can delete projects"
  ON portfolio_projects FOR DELETE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com');

-- Portfolio About
DROP POLICY IF EXISTS "Authenticated users can insert about" ON portfolio_about;
CREATE POLICY "Owner can insert about"
  ON portfolio_about FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can update about" ON portfolio_about;
CREATE POLICY "Owner can update about"
  ON portfolio_about FOR UPDATE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com')
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can delete about" ON portfolio_about;
CREATE POLICY "Owner can delete about"
  ON portfolio_about FOR DELETE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com');

-- Blog Posts
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON blog_posts;
CREATE POLICY "Owner can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
CREATE POLICY "Owner can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com')
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;
CREATE POLICY "Owner can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com');

-- Site Settings
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON site_settings;
CREATE POLICY "Owner can insert settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can update settings" ON site_settings;
CREATE POLICY "Owner can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com')
  WITH CHECK (auth.email() = 'muhammad.wyzer@gmail.com');

DROP POLICY IF EXISTS "Authenticated users can delete settings" ON site_settings;
CREATE POLICY "Owner can delete settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (auth.email() = 'muhammad.wyzer@gmail.com');
