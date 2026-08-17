-- Supabase SQL Migration: Add category to portfolio_projects
-- Run this in the Supabase SQL Editor.

ALTER TABLE portfolio_projects
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL
  CHECK (category IN ('personal', 'work', 'freelance'));
