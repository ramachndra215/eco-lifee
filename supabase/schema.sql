-- ============================================================
-- Eco-Pulse: Supabase Schema Migration
-- Run this in the Supabase SQL Editor to create the table.
-- ============================================================

CREATE TABLE IF NOT EXISTS repository_footprints (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_name     TEXT        NOT NULL,
  branch        TEXT        NOT NULL,
  carbon_impact NUMERIC     NOT NULL,       -- grams CO2 equivalent
  commit_hash   TEXT        NOT NULL,
  timestamp     TIMESTAMPTZ DEFAULT NOW(),
  lines_changed INTEGER     DEFAULT 0,
  estimated_cpu_seconds NUMERIC DEFAULT 0,
  region        TEXT        DEFAULT 'us-east-1',
  green_score   INTEGER     DEFAULT 100     -- 0-100. Higher = greener
);

-- Index for fast dashboard queries
CREATE INDEX idx_footprints_repo   ON repository_footprints (repo_name);
CREATE INDEX idx_footprints_time   ON repository_footprints (timestamp DESC);

-- Enable Row Level Security (public read for MVP)
ALTER TABLE repository_footprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON repository_footprints
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert from service role"
  ON repository_footprints
  FOR INSERT
  WITH CHECK (true);
