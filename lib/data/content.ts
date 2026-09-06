import type {
  AboutContent,
  ContactsContent,
  HomeContent,
  ProcessCard,
  WorksContent,
} from "@/types/content";
import { pool } from "@/lib/db";

// Postgres-backed via raw SQL (see db/schema.sql). Each *_content table is a
// singleton — exactly one row, fixed at id: 1 — seeded with these defaults
// on first read. update* upserts, so it works even before that first read
// has happened.

const homeDefaults: HomeContent = {
  heroText: "Pineers in brand Storytelling",
  displayMode: "body-text",
  backgroundVideoName: null,
  backgroundVideoUrl: null,
  logoFileName: "outofsight_logo_only.png",
};

type HomeRow = {
  hero_text: string;
  display_mode: string;
  background_video_name: string | null;
  background_video_url: string | null;
  logo_file_name: string | null;
};

function toHomeContent(row: HomeRow): HomeContent {
  return {
    heroText: row.hero_text,
    displayMode: row.display_mode as HomeContent["displayMode"],
    backgroundVideoName: row.background_video_name,
    backgroundVideoUrl: row.background_video_url,
    logoFileName: row.logo_file_name,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const { rows } = await pool.query<HomeRow>(
    "SELECT * FROM home_content WHERE id = 1"
  );
  if (rows[0]) return toHomeContent(rows[0]);

  const { rows: created } = await pool.query<HomeRow>(
    `INSERT INTO home_content
       (id, hero_text, display_mode, background_video_name, background_video_url, logo_file_name)
     VALUES (1, $1, $2, $3, $4, $5)
     RETURNING *`,
    [
      homeDefaults.heroText,
      homeDefaults.displayMode,
      homeDefaults.backgroundVideoName,
      homeDefaults.backgroundVideoUrl,
      homeDefaults.logoFileName,
    ]
  );
  return toHomeContent(created[0]);
}

export async function updateHomeContent(
  input: Partial<HomeContent>
): Promise<HomeContent> {
  const merged = { ...(await getHomeContent()), ...input };
  const { rows } = await pool.query<HomeRow>(
    `UPDATE home_content SET
       hero_text = $1, display_mode = $2, background_video_name = $3,
       background_video_url = $4, logo_file_name = $5
     WHERE id = 1
     RETURNING *`,
    [
      merged.heroText,
      merged.displayMode,
      merged.backgroundVideoName,
      merged.backgroundVideoUrl,
      merged.logoFileName,
    ]
  );
  return toHomeContent(rows[0]);
}

const contactsDefaults: ContactsContent = {
  bodyText: "Get in touch.",
  email: "hello@outofsight.com",
  countryCode: "+971",
  phoneNumber: "0000 0000",
  location: "Dubai, UAE",
};

type ContactsRow = {
  body_text: string;
  email: string;
  country_code: string;
  phone_number: string;
  location: string;
};

function toContactsContent(row: ContactsRow): ContactsContent {
  return {
    bodyText: row.body_text,
    email: row.email,
    countryCode: row.country_code,
    phoneNumber: row.phone_number,
    location: row.location,
  };
}

export async function getContactsContent(): Promise<ContactsContent> {
  const { rows } = await pool.query<ContactsRow>(
    "SELECT * FROM contacts_content WHERE id = 1"
  );
  if (rows[0]) return toContactsContent(rows[0]);

  const { rows: created } = await pool.query<ContactsRow>(
    `INSERT INTO contacts_content
       (id, body_text, email, country_code, phone_number, location)
     VALUES (1, $1, $2, $3, $4, $5)
     RETURNING *`,
    [
      contactsDefaults.bodyText,
      contactsDefaults.email,
      contactsDefaults.countryCode,
      contactsDefaults.phoneNumber,
      contactsDefaults.location,
    ]
  );
  return toContactsContent(created[0]);
}

export async function updateContactsContent(
  input: Partial<ContactsContent>
): Promise<ContactsContent> {
  const merged = { ...(await getContactsContent()), ...input };
  const { rows } = await pool.query<ContactsRow>(
    `UPDATE contacts_content SET
       body_text = $1, email = $2, country_code = $3,
       phone_number = $4, location = $5
     WHERE id = 1
     RETURNING *`,
    [
      merged.bodyText,
      merged.email,
      merged.countryCode,
      merged.phoneNumber,
      merged.location,
    ]
  );
  return toContactsContent(rows[0]);
}

const worksDefaults: WorksContent = {
  // Seeded from the Figma mock's hero photo — swap via the admin Works
  // editor once a real hero image is available.
  heroImage: "/images/works-hero.jpg",
  heroImagePosition: "50% 50%",
  heroHeading: "For Moments That Stay",
  heroDescription:
    "From the vastness of its enchanting desert to the vibrancy of its dazzling cities, discover cultural treasures that tell stories of the past, and surprise yourself on a journey filled with excitement and wonder.",
};

type WorksRow = {
  hero_image: string | null;
  hero_image_position: string;
  hero_heading: string;
  hero_description: string;
};

function toWorksContent(row: WorksRow): WorksContent {
  return {
    heroImage: row.hero_image,
    heroImagePosition: row.hero_image_position,
    heroHeading: row.hero_heading,
    heroDescription: row.hero_description,
  };
}

export async function getWorksContent(): Promise<WorksContent> {
  const { rows } = await pool.query<WorksRow>(
    "SELECT * FROM works_content WHERE id = 1"
  );
  if (rows[0]) return toWorksContent(rows[0]);

  const { rows: created } = await pool.query<WorksRow>(
    `INSERT INTO works_content
       (id, hero_image, hero_image_position, hero_heading, hero_description)
     VALUES (1, $1, $2, $3, $4)
     RETURNING *`,
    [
      worksDefaults.heroImage,
      worksDefaults.heroImagePosition,
      worksDefaults.heroHeading,
      worksDefaults.heroDescription,
    ]
  );
  return toWorksContent(created[0]);
}

export async function updateWorksContent(
  input: Partial<WorksContent>
): Promise<WorksContent> {
  const merged = { ...(await getWorksContent()), ...input };
  const { rows } = await pool.query<WorksRow>(
    `UPDATE works_content SET
       hero_image = $1, hero_image_position = $2,
       hero_heading = $3, hero_description = $4
     WHERE id = 1
     RETURNING *`,
    [
      merged.heroImage,
      merged.heroImagePosition,
      merged.heroHeading,
      merged.heroDescription,
    ]
  );
  return toWorksContent(rows[0]);
}

const aboutDefaults: AboutContent = {
  heroImage: null,
  heroImagePosition: "50% 50%",
  heroHeadline: "Pineers in brand Storytelling",
  introText:
    "I believe the best stories aren't just seen, they're felt. As a filmmaker and creative director, I'm committed to turning ideas into visuals that spark imagination, emotion, and meaning. For over seven years I've been immersed in filmmaking, working with brands, businesses, and individuals to craft compelling films that connect, inspire, and leave a lasting impact.",
  storyImage: null,
  storyImagePosition: "50% 50%",
  storyText:
    "I believe the best stories aren't just seen, they're felt. As a filmmaker and creative director, I'm committed to turning ideas into visuals that spark imagination, emotion, and meaning. For over seven years I've been immersed in filmmaking, working with brands, businesses, and individuals to craft compelling films that connect, inspire, and leave a lasting impact.",
  founderPhoto: null,
  founderPhotoPosition: "50% 50%",
  founderName: "Nihal Muhammed",
  founderTitle: "Founder & Creative Director",
  bio: "I believe the best stories aren't just seen, they're felt. As a filmmaker and creative director, I'm committed to turning ideas into visuals that spark imagination, emotion, and meaning. For over seven years I've been immersed in filmmaking, working with brands, businesses, and individuals to craft compelling films that connect, inspire, and leave a lasting impact.",
  linkedinUrl: "",
  instagramUrl: "",
  processCards: [
    {
      title: "Vision & Strategy",
      description:
        "Every great story starts with a bold idea. We collaborate closely to refine your vision, crafting compelling concepts that resonate with your audience. Through meticulous planning, storyboarding, and strategic direction, we lay the foundation for impactful storytelling.",
    },
    {
      title: "Creation & Execution",
      description:
        "From script to screen, we bring your vision to life. Our team blends artistry and precision, capturing stunning visuals, dynamic pacing, and authentic moments that engage and inspire. Every frame is crafted to tell a story that connects.",
    },
    {
      title: "Refinement & Impact",
      description:
        "We refine every frame through expert editing, dynamic pacing, and seamless transitions to craft a compelling narrative. Every cut, color, and sound is refined to ensure your story leaves a lasting impression.",
    },
  ] satisfies ProcessCard[],
  // Left empty rather than seeded with real company logos from the
  // Figma mock — showing brand marks like DJI/Mercedes/Ferrari would
  // imply a client relationship that doesn't actually exist yet.
  // Add real client logos here once there are real clients.
  trustedByLogos: [] as string[],
  ctaText: "Have a project in mind?",
  ctaBackgroundImage: null,
  ctaBackgroundImagePosition: "50% 50%",
};

type AboutRow = {
  hero_image: string | null;
  hero_image_position: string;
  hero_headline: string;
  intro_text: string;
  story_image: string | null;
  story_image_position: string;
  story_text: string;
  founder_photo: string | null;
  founder_photo_position: string;
  founder_name: string;
  founder_title: string;
  bio: string;
  linkedin_url: string;
  instagram_url: string;
  process_cards: ProcessCard[];
  trusted_by_logos: string[];
  cta_text: string;
  cta_background_image: string | null;
  cta_background_image_position: string;
};

// process_cards comes back already parsed from jsonb (node-postgres parses
// json/jsonb columns automatically), so it's cast rather than JSON.parsed.
function toAboutContent(row: AboutRow): AboutContent {
  return {
    heroImage: row.hero_image,
    heroImagePosition: row.hero_image_position,
    heroHeadline: row.hero_headline,
    introText: row.intro_text,
    storyImage: row.story_image,
    storyImagePosition: row.story_image_position,
    storyText: row.story_text,
    founderPhoto: row.founder_photo,
    founderPhotoPosition: row.founder_photo_position,
    founderName: row.founder_name,
    founderTitle: row.founder_title,
    bio: row.bio,
    linkedinUrl: row.linkedin_url,
    instagramUrl: row.instagram_url,
    processCards: row.process_cards,
    trustedByLogos: row.trusted_by_logos,
    ctaText: row.cta_text,
    ctaBackgroundImage: row.cta_background_image,
    ctaBackgroundImagePosition: row.cta_background_image_position,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const { rows } = await pool.query<AboutRow>(
    "SELECT * FROM about_content WHERE id = 1"
  );
  if (rows[0]) return toAboutContent(rows[0]);

  const { rows: created } = await pool.query<AboutRow>(
    `INSERT INTO about_content
       (id, hero_image, hero_image_position, hero_headline, intro_text,
        story_image, story_image_position, story_text, founder_photo,
        founder_photo_position, founder_name, founder_title, bio,
        linkedin_url, instagram_url, process_cards, trusted_by_logos,
        cta_text, cta_background_image, cta_background_image_position)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
     RETURNING *`,
    [
      aboutDefaults.heroImage,
      aboutDefaults.heroImagePosition,
      aboutDefaults.heroHeadline,
      aboutDefaults.introText,
      aboutDefaults.storyImage,
      aboutDefaults.storyImagePosition,
      aboutDefaults.storyText,
      aboutDefaults.founderPhoto,
      aboutDefaults.founderPhotoPosition,
      aboutDefaults.founderName,
      aboutDefaults.founderTitle,
      aboutDefaults.bio,
      aboutDefaults.linkedinUrl,
      aboutDefaults.instagramUrl,
      JSON.stringify(aboutDefaults.processCards),
      aboutDefaults.trustedByLogos,
      aboutDefaults.ctaText,
      aboutDefaults.ctaBackgroundImage,
      aboutDefaults.ctaBackgroundImagePosition,
    ]
  );
  return toAboutContent(created[0]);
}

export async function updateAboutContent(
  input: Partial<AboutContent>
): Promise<AboutContent> {
  const merged = { ...(await getAboutContent()), ...input };
  const { rows } = await pool.query<AboutRow>(
    `UPDATE about_content SET
       hero_image = $1, hero_image_position = $2, hero_headline = $3,
       intro_text = $4, story_image = $5, story_image_position = $6,
       story_text = $7, founder_photo = $8, founder_photo_position = $9,
       founder_name = $10, founder_title = $11, bio = $12,
       linkedin_url = $13, instagram_url = $14, process_cards = $15,
       trusted_by_logos = $16, cta_text = $17, cta_background_image = $18,
       cta_background_image_position = $19
     WHERE id = 1
     RETURNING *`,
    [
      merged.heroImage,
      merged.heroImagePosition,
      merged.heroHeadline,
      merged.introText,
      merged.storyImage,
      merged.storyImagePosition,
      merged.storyText,
      merged.founderPhoto,
      merged.founderPhotoPosition,
      merged.founderName,
      merged.founderTitle,
      merged.bio,
      merged.linkedinUrl,
      merged.instagramUrl,
      JSON.stringify(merged.processCards),
      merged.trustedByLogos,
      merged.ctaText,
      merged.ctaBackgroundImage,
      merged.ctaBackgroundImagePosition,
    ]
  );
  return toAboutContent(rows[0]);
}
