-- Supabase SQL Migration: Add YouTube link to portfolio_projects
-- Run this in the Supabase SQL Editor.

ALTER TABLE portfolio_projects
  ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL;
