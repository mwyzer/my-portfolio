-- Supabase SQL Migration: Add case study fields to portfolio_projects
-- Run this in the Supabase SQL Editor.
--
-- case_study shape:
-- {
--   "problem": "text",
--   "solution": "text",
--   "architecture": "text",
--   "capabilities": {
--     "fullStackEngineering": ["..."],
--     "backendData": ["..."],
--     "aiEngineering": ["..."],
--     "deliveryQuality": ["..."]
--   }
-- }

ALTER TABLE portfolio_projects
  ADD COLUMN IF NOT EXISTS case_study JSONB DEFAULT NULL;
