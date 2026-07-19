-- Supabase SQL Migration: Portfolio & Blog Schema
-- Run this in the Supabase SQL Editor to set up your database

-- 1. Portfolio Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

-- 2. Portfolio About / Profile
CREATE TABLE IF NOT EXISTS portfolio_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'::jsonb
);

-- 3. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID NOT NULL,
  tags TEXT[] DEFAULT '{}'
);

-- 4. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_about_updated_at ON portfolio_about;
CREATE TRIGGER update_portfolio_about_updated_at
  BEFORE UPDATE ON portfolio_about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can do everything, public can only read
-- Drop existing policies first to allow re-runs

-- Portfolio Projects
DROP POLICY IF EXISTS "Public can read projects" ON portfolio_projects;
CREATE POLICY "Public can read projects"
  ON portfolio_projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON portfolio_projects;
CREATE POLICY "Authenticated users can update projects"
  ON portfolio_projects FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON portfolio_projects;
CREATE POLICY "Authenticated users can delete projects"
  ON portfolio_projects FOR DELETE
  TO authenticated
  USING (true);

-- Portfolio About
DROP POLICY IF EXISTS "Public can read about" ON portfolio_about;
CREATE POLICY "Public can read about"
  ON portfolio_about FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert about" ON portfolio_about;
CREATE POLICY "Authenticated users can insert about"
  ON portfolio_about FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update about" ON portfolio_about;
CREATE POLICY "Authenticated users can update about"
  ON portfolio_about FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete about" ON portfolio_about;
CREATE POLICY "Authenticated users can delete about"
  ON portfolio_about FOR DELETE
  TO authenticated
  USING (true);

-- Blog Posts
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON blog_posts;
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update posts" ON blog_posts;
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON blog_posts;
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Site Settings
DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
CREATE POLICY "Public can read settings"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert settings" ON site_settings;
CREATE POLICY "Authenticated users can insert settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update settings" ON site_settings;
CREATE POLICY "Authenticated users can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete settings" ON site_settings;
CREATE POLICY "Authenticated users can delete settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);
