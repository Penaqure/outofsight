-- OUTOFSIGHT schema — mirrors the shapes in types/content.ts and
-- types/portfolio.ts exactly. If you add a field to those types, add the
-- matching column here and vice versa; lib/data/content.ts and
-- lib/data/portfolio.ts assume they're in sync.
--
-- Apply with: npm run db:setup

-- Every *_content table below is a singleton: exactly one row, fixed at
-- id = 1. lib/data/content.ts always reads/writes id: 1, creating the row
-- with seed defaults on first read if it doesn't exist yet.

CREATE TABLE IF NOT EXISTS home_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_text TEXT NOT NULL,
  display_mode TEXT NOT NULL,
  background_video_name TEXT,
  background_video_url TEXT,
  logo_file_name TEXT
);

CREATE TABLE IF NOT EXISTS contacts_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  body_text TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS works_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_image TEXT,
  hero_image_position TEXT NOT NULL,
  hero_heading TEXT NOT NULL,
  hero_description TEXT NOT NULL
);

-- process_cards ((title, description) pairs) is stored as jsonb — it's a
-- small, fixed-shape array with no query/filter need of its own, so a
-- relational table would be overhead without benefit.
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_image TEXT,
  hero_image_position TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  story_image TEXT,
  story_image_position TEXT NOT NULL,
  story_text TEXT NOT NULL,
  founder_photo TEXT,
  founder_photo_position TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_title TEXT NOT NULL,
  bio TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  process_cards JSONB NOT NULL,
  trusted_by_logos TEXT[] NOT NULL DEFAULT '{}',
  cta_text TEXT NOT NULL,
  cta_background_image TEXT,
  cta_background_image_position TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  credits TEXT NOT NULL,
  thumbnail_image TEXT,
  thumbnail_image_position TEXT NOT NULL,
  thumbnail_label TEXT,
  video_name TEXT,
  video_label TEXT,
  video_url TEXT,
  video_preview_image TEXT,
  video_preview_image_position TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrations for databases created before a column existed. Each is
-- idempotent, so `npm run db:setup` is safe to re-run.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
