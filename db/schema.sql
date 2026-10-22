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
  hero_description TEXT NOT NULL,
  trusted_by_heading TEXT NOT NULL,
  trusted_by_description TEXT NOT NULL
);

-- process_cards ((title, description) pairs) and team_members (name,
-- position, photo and social links per member) are stored as jsonb — small, fixed-shape
-- arrays with no query/filter need of their own, so a relational table
-- would be overhead without benefit.
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_image TEXT,
  hero_image_position TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  story_image TEXT,
  story_image_position TEXT NOT NULL,
  story_text TEXT NOT NULL,
  founder_message_image TEXT,
  founder_message_image_position TEXT NOT NULL DEFAULT '50% 50%',
  founder_message_heading TEXT NOT NULL DEFAULT 'Founder’s Message',
  founder_message_text TEXT NOT NULL DEFAULT '',
  founder_message_signature TEXT NOT NULL DEFAULT '',
  team_intro TEXT NOT NULL DEFAULT '',
  team_members JSONB NOT NULL DEFAULT '[]',
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
ALTER TABLE works_content ADD COLUMN IF NOT EXISTS trusted_by_heading TEXT NOT NULL DEFAULT 'Trusted International Clients';
ALTER TABLE works_content ADD COLUMN IF NOT EXISTS trusted_by_description TEXT NOT NULL DEFAULT 'From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS team_members JSONB NOT NULL DEFAULT '[]';

-- Design v2: Founder's Message block + team intro blurb. The first run on an
-- existing database also fills any still-empty About image slots, team list
-- and client logos with the v2 design assets (public/images/...). It's keyed
-- on the new column not existing yet, so it runs exactly once — anything
-- the admin has uploaded is never overwritten, and an image the admin
-- removes later stays removed on re-runs.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'about_content' AND column_name = 'founder_message_text'
  ) THEN
    ALTER TABLE about_content
      ADD COLUMN founder_message_image TEXT,
      ADD COLUMN founder_message_image_position TEXT NOT NULL DEFAULT '50% 50%',
      ADD COLUMN founder_message_heading TEXT NOT NULL DEFAULT 'Founder’s Message',
      ADD COLUMN founder_message_text TEXT NOT NULL DEFAULT '',
      ADD COLUMN founder_message_signature TEXT NOT NULL DEFAULT '',
      ADD COLUMN team_intro TEXT NOT NULL DEFAULT '';

    UPDATE about_content SET
      founder_message_image = '/images/about/founder.jpg',
      founder_message_text = E'Outofsight began as an extension of my own curiosity for film, photography, and the world around me.\n\nOver the years, working across different places, people, and creative disciplines has shaped the way I see and approach visual storytelling. Today, that perspective continues to guide OUTOFSIGHT bringing together people and ideas to create work that feels considered, honest, and distinct and immersive.',
      founder_message_signature = 'Nihal Muhammed',
      team_intro = 'I believe the best stories aren’t just seen, they’re felt. As a filmmaker and creative director, I’m committed to turning ideas into visuals that spark imagination, emotion, and meaning.',
      hero_image = COALESCE(hero_image, '/images/about/hero.jpg'),
      story_image = COALESCE(story_image, '/images/about/story.jpg'),
      cta_background_image = COALESCE(cta_background_image, '/images/about/cta.jpg'),
      cta_background_image_position = CASE
        WHEN cta_background_image IS NULL THEN '50% 60%'
        ELSE cta_background_image_position
      END,
      trusted_by_logos = CASE
        WHEN cardinality(trusted_by_logos) = 0 THEN ARRAY[
          '/images/clients/01-abu-dhabi.svg', '/images/clients/02-porsche.svg',
          '/images/clients/03-f1.svg', '/images/clients/04-mercedes.svg',
          '/images/clients/05-samsung.svg', '/images/clients/06-lamborghini.svg',
          '/images/clients/07-bentley.svg', '/images/clients/08-volkswagen.svg',
          '/images/clients/09-edition.svg', '/images/clients/10-byd.svg',
          '/images/clients/11-dji.svg', '/images/clients/12-ferrari.svg',
          '/images/clients/13-genesis.svg', '/images/clients/14-fairmont.svg'
        ]
        ELSE trusted_by_logos
      END,
      team_members = CASE
        WHEN jsonb_array_length(team_members) = 0 THEN (
          SELECT jsonb_agg(jsonb_build_object(
            'name', 'Nihal Muhammed',
            'position', 'Co Founder & Creative Director',
            'photo', '/images/about/team-' || n || '.jpg',
            'photoPosition', '50% 100%',
            'instagramUrl', '',
            'linkedinUrl', ''
          ) ORDER BY n)
          FROM generate_series(1, 5) AS n
        )
        ELSE team_members
      END;
  END IF;
END $$;

-- The single founder profile was replaced by the team_members grid. Its old
-- columns are left in place (not dropped, so no data is lost) but made
-- nullable, since lib/data/content.ts no longer writes them.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'about_content' AND column_name = 'founder_name'
  ) THEN
    ALTER TABLE about_content
      ALTER COLUMN founder_photo_position DROP NOT NULL,
      ALTER COLUMN founder_name DROP NOT NULL,
      ALTER COLUMN founder_title DROP NOT NULL,
      ALTER COLUMN bio DROP NOT NULL,
      ALTER COLUMN linkedin_url DROP NOT NULL,
      ALTER COLUMN instagram_url DROP NOT NULL;
  END IF;
END $$;
