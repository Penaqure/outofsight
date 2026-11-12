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
  logo_file_name TEXT,
  clients_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  clients_heading TEXT NOT NULL DEFAULT 'Trusted International Clients',
  clients_description TEXT NOT NULL DEFAULT 'From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.',
  clients_logos TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS contacts_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  body_text TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS footer_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  media_links JSONB NOT NULL DEFAULT '[]'
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sort_order INTEGER
);

-- Migrations for databases created before a column existed. Each is
-- idempotent, so `npm run db:setup` is safe to re-run.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
-- Admin drag-and-drop order. NULL until the grid is first reordered.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER;
ALTER TABLE works_content ADD COLUMN IF NOT EXISTS trusted_by_heading TEXT NOT NULL DEFAULT 'Trusted International Clients';
ALTER TABLE works_content ADD COLUMN IF NOT EXISTS trusted_by_description TEXT NOT NULL DEFAULT 'From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS team_members JSONB NOT NULL DEFAULT '[]';

-- Design v2: Founder's Message block + team intro blurb. The first run on an
-- existing database fills in the v2 copy for the new text fields. Images,
-- team members and client logos are never seeded — they all come from
-- admin uploads. Keyed on the new column not existing yet, so it runs
-- exactly once.
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
      founder_message_text = E'Outofsight began as an extension of my own curiosity for film, photography, and the world around me.\n\nOver the years, working across different places, people, and creative disciplines has shaped the way I see and approach visual storytelling. Today, that perspective continues to guide OUTOFSIGHT bringing together people and ideas to create work that feels considered, honest, and distinct and immersive.',
      founder_message_signature = 'Nihal Muhammed',
      team_intro = 'I believe the best stories aren’t just seen, they’re felt. As a filmmaker and creative director, I’m committed to turning ideas into visuals that spark imagination, emotion, and meaning.';
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

-- Home's clients section got its own content, separate from the Works/About
-- logos. Keyed on the new column not existing yet, so the first run on an
-- existing database copies what Home was already showing (so the page doesn't
-- change) and later runs never overwrite what the admin has set.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'home_content' AND column_name = 'clients_enabled'
  ) THEN
    ALTER TABLE home_content
      ADD COLUMN clients_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN clients_heading TEXT NOT NULL DEFAULT 'Trusted International Clients',
      ADD COLUMN clients_description TEXT NOT NULL DEFAULT 'From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.',
      ADD COLUMN clients_logos TEXT[] NOT NULL DEFAULT '{}';

    UPDATE home_content SET
      clients_heading = COALESCE(
        (SELECT trusted_by_heading FROM works_content WHERE id = 1), clients_heading
      ),
      clients_description = COALESCE(
        (SELECT trusted_by_description FROM works_content WHERE id = 1), clients_description
      ),
      clients_logos = COALESCE(
        (SELECT trusted_by_logos FROM about_content WHERE id = 1), clients_logos
      );
  END IF;
END $$;
