-- Supabase SQL Migration: Project subtitle + public view counter
-- Run this in the Supabase SQL Editor.

ALTER TABLE portfolio_projects ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE portfolio_projects ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Visitors need to bump the view count without gaining general write access
-- (writes are otherwise locked to the owner — see 00004_restrict_writes_to_owner.sql).
-- SECURITY DEFINER lets this one narrow operation bypass RLS.
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE portfolio_projects SET views = views + 1 WHERE id = project_id;
$$;

GRANT EXECUTE ON FUNCTION increment_project_views(UUID) TO anon, authenticated;
