import type {
  AboutContent,
  ContactsContent,
  HomeContent,
  ProcessCard,
  TeamMember,
  WorksContent,
} from "@/types/content";
import { HOME_CLIENT_LOGO_SLOTS } from "@/lib/config";
import { pool } from "@/lib/db";

// Postgres-backed via raw SQL (see db/schema.sql). Each *_content table is a
// singleton — exactly one row, fixed at id: 1 — seeded with these defaults
// on first read. The seed INSERTs are ON CONFLICT no-op updates so two
// requests racing to seed the same empty table both get the one row back
// instead of the loser failing on the primary key. update* upserts, so it works even before that first read
// has happened.

const clientLogos = [
  "01-abu-dhabi",
  "02-porsche",
  "03-f1",
  "04-mercedes",
  "05-samsung",
  "06-lamborghini",
  "07-bentley",
  "08-volkswagen",
  "09-edition",
  "10-byd",
  "11-dji",
  "12-ferrari",
  "13-genesis",
  "14-fairmont",
].map((name) => `/images/clients/${name}.svg`);

const homeDefaults: HomeContent = {
  heroText: "Pineers in brand Storytelling",
  displayMode: "body-text",
  backgroundVideoName: null,
  backgroundVideoUrl: null,
  logoFileName: "outofsight_logo_only.png",
  clientsEnabled: true,
  clientsHeading: "Trusted International Clients",
  clientsDescription:
    "From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.",
  clientsLogos: clientLogos,
};

type HomeRow = {
  hero_text: string;
  display_mode: string;
  background_video_name: string | null;
  background_video_url: string | null;
  logo_file_name: string | null;
  clients_enabled: boolean;
  clients_heading: string;
  clients_description: string;
  clients_logos: string[];
};

function toHomeContent(row: HomeRow): HomeContent {
  return {
    heroText: row.hero_text,
    displayMode: row.display_mode as HomeContent["displayMode"],
    backgroundVideoName: row.background_video_name,
    backgroundVideoUrl: row.background_video_url,
    logoFileName: row.logo_file_name,
    clientsEnabled: row.clients_enabled,
    clientsHeading: row.clients_heading,
    clientsDescription: row.clients_description,
    clientsLogos: row.clients_logos,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const { rows } = await pool.query<HomeRow>(
    "SELECT * FROM home_content WHERE id = 1"
  );
  if (rows[0]) return toHomeContent(rows[0]);

  const { rows: created } = await pool.query<HomeRow>(
    `INSERT INTO home_content
       (id, hero_text, display_mode, background_video_name, background_video_url, logo_file_name,
        clients_enabled, clients_heading, clients_description, clients_logos)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
     RETURNING *`,
    [
      homeDefaults.heroText,
      homeDefaults.displayMode,
      homeDefaults.backgroundVideoName,
      homeDefaults.backgroundVideoUrl,
      homeDefaults.logoFileName,
      homeDefaults.clientsEnabled,
      homeDefaults.clientsHeading,
      homeDefaults.clientsDescription,
      homeDefaults.clientsLogos,
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
       background_video_url = $4, logo_file_name = $5,
       clients_enabled = $6, clients_heading = $7,
       clients_description = $8, clients_logos = $9
     WHERE id = 1
     RETURNING *`,
    [
      merged.heroText,
      merged.displayMode,
      merged.backgroundVideoName,
      merged.backgroundVideoUrl,
      merged.logoFileName,
      merged.clientsEnabled,
      merged.clientsHeading,
      merged.clientsDescription,
      merged.clientsLogos.slice(0, HOME_CLIENT_LOGO_SLOTS),
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
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
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
  trustedByHeading: "Trusted International Clients",
  trustedByDescription:
    "From global brands to local visionaries, we partner with teams who believe in the power of a well-told story.",
};

type WorksRow = {
  hero_image: string | null;
  hero_image_position: string;
  hero_heading: string;
  hero_description: string;
  trusted_by_heading: string;
  trusted_by_description: string;
};

function toWorksContent(row: WorksRow): WorksContent {
  return {
    heroImage: row.hero_image,
    heroImagePosition: row.hero_image_position,
    heroHeading: row.hero_heading,
    heroDescription: row.hero_description,
    trustedByHeading: row.trusted_by_heading,
    trustedByDescription: row.trusted_by_description,
  };
}

export async function getWorksContent(): Promise<WorksContent> {
  const { rows } = await pool.query<WorksRow>(
    "SELECT * FROM works_content WHERE id = 1"
  );
  if (rows[0]) return toWorksContent(rows[0]);

  const { rows: created } = await pool.query<WorksRow>(
    `INSERT INTO works_content
       (id, hero_image, hero_image_position, hero_heading, hero_description,
        trusted_by_heading, trusted_by_description)
     VALUES (1, $1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
     RETURNING *`,
    [
      worksDefaults.heroImage,
      worksDefaults.heroImagePosition,
      worksDefaults.heroHeading,
      worksDefaults.heroDescription,
      worksDefaults.trustedByHeading,
      worksDefaults.trustedByDescription,
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
       hero_heading = $3, hero_description = $4,
       trusted_by_heading = $5, trusted_by_description = $6
     WHERE id = 1
     RETURNING *`,
    [
      merged.heroImage,
      merged.heroImagePosition,
      merged.heroHeading,
      merged.heroDescription,
      merged.trustedByHeading,
      merged.trustedByDescription,
    ]
  );
  return toWorksContent(rows[0]);
}

// Seeded from the Figma "Website Desktop. v2" About frame — images live in
// public/images/about. Swap any of them via the admin About editor. Existing
// databases get the same images once via the v2 migration in db/schema.sql.
const aboutDefaults: AboutContent = {
  heroImage: "/images/about/hero.jpg",
  heroImagePosition: "50% 50%",
  heroHeadline: "Pineers in brand Storytelling",
  introText:
    "Outofsight is an independent creative studio built around film, photography, and visual storytelling.\n\nWorking across automotive, lifestyle, travel, and hospitality, we collaborate with brands and creative partners to develop and produce visual work with a distinct point of view.\n\nOur approach is guided by curiosity, authenticity, and an obsession with detail creating imagery that goes beyond what you see to capture how something feels.",
  storyImage: "/images/about/story.jpg",
  storyImagePosition: "50% 50%",
  storyText:
    "We’re drawn to the details that make a story its own.\nThe way light falls across a surface. The movement of a landscape. The feeling of being somewhere unfamiliar.\nThese are the moments that shape our perspective and inform the way we create — with intention, restraint, and a focus on what matters.",
  founderImage: "/images/about/founder.jpg",
  founderImagePosition: "50% 50%",
  founderHeading: "Founder’s Message",
  founderMessage:
    "Outofsight began as an extension of my own curiosity for film, photography, and the world around me.\n\nOver the years, working across different places, people, and creative disciplines has shaped the way I see and approach visual storytelling. Today, that perspective continues to guide OUTOFSIGHT bringing together people and ideas to create work that feels considered, honest, and distinct and immersive.",
  founderName: "Nihal Muhammed",
  teamIntro:
    "I believe the best stories aren’t just seen, they’re felt. As a filmmaker and creative director, I’m committed to turning ideas into visuals that spark imagination, emotion, and meaning.",
  teamMembers: [1, 2, 3, 4, 5].map((n) => ({
    name: "Nihal Muhammed",
    position: "Co Founder & Creative Director",
    photo: `/images/about/team-${n}.jpg`,
    photoPosition: "50% 100%",
    instagramUrl: "",
    linkedinUrl: "",
  })) satisfies TeamMember[],
  processCards: [
    {
      title: "Vision & Strategy",
      description:
        "Every project begins with understanding the story, finding its perspective, and shaping a creative direction that gives the idea purpose.",
    },
    {
      title: "Creation & Execution",
      description:
        "From concept to production, we bring together creative talent, thoughtful planning, and the right execution to translate ideas into imagery.",
    },
    {
      title: "Refinement & Impact",
      description:
        "The final details matter. Through considered editing, pacing, colour, and sound, we shape every frame into a cohesive visual experience.",
    },
  ] satisfies ProcessCard[],
  trustedByLogos: clientLogos,
  ctaText: "Have a project in mind?",
  ctaBackgroundImage: "/images/about/cta.jpg",
  // The Figma crop shows the light streak a little below centre.
  ctaBackgroundImagePosition: "50% 60%",
};

type AboutRow = {
  hero_image: string | null;
  hero_image_position: string;
  hero_headline: string;
  intro_text: string;
  story_image: string | null;
  story_image_position: string;
  story_text: string;
  founder_message_image: string | null;
  founder_message_image_position: string;
  founder_message_heading: string;
  founder_message_text: string;
  founder_message_signature: string;
  team_intro: string;
  team_members: TeamMember[];
  process_cards: ProcessCard[];
  trusted_by_logos: string[];
  cta_text: string;
  cta_background_image: string | null;
  cta_background_image_position: string;
};

// team_members and process_cards come back already parsed from jsonb
// (node-postgres parses json/jsonb columns automatically), so they're cast
// rather than JSON.parsed. Team members saved before position/social links
// existed lack those keys, so they're filled with "" here.
function toTeamMember(member: Partial<TeamMember>): TeamMember {
  return {
    name: member.name ?? "",
    position: member.position ?? "",
    photo: member.photo ?? null,
    photoPosition: member.photoPosition ?? "50% 50%",
    instagramUrl: member.instagramUrl ?? "",
    linkedinUrl: member.linkedinUrl ?? "",
  };
}

function toAboutContent(row: AboutRow): AboutContent {
  return {
    heroImage: row.hero_image,
    heroImagePosition: row.hero_image_position,
    heroHeadline: row.hero_headline,
    introText: row.intro_text,
    storyImage: row.story_image,
    storyImagePosition: row.story_image_position,
    storyText: row.story_text,
    founderImage: row.founder_message_image,
    founderImagePosition: row.founder_message_image_position,
    founderHeading: row.founder_message_heading,
    founderMessage: row.founder_message_text,
    founderName: row.founder_message_signature,
    teamIntro: row.team_intro,
    teamMembers: row.team_members.map(toTeamMember),
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
        story_image, story_image_position, story_text,
        founder_message_image, founder_message_image_position,
        founder_message_heading, founder_message_text,
        founder_message_signature, team_intro, team_members,
        process_cards, trusted_by_logos, cta_text, cta_background_image,
        cta_background_image_position)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
             $15, $16, $17, $18, $19)
     ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
     RETURNING *`,
    [
      aboutDefaults.heroImage,
      aboutDefaults.heroImagePosition,
      aboutDefaults.heroHeadline,
      aboutDefaults.introText,
      aboutDefaults.storyImage,
      aboutDefaults.storyImagePosition,
      aboutDefaults.storyText,
      aboutDefaults.founderImage,
      aboutDefaults.founderImagePosition,
      aboutDefaults.founderHeading,
      aboutDefaults.founderMessage,
      aboutDefaults.founderName,
      aboutDefaults.teamIntro,
      JSON.stringify(aboutDefaults.teamMembers),
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
       story_text = $7, founder_message_image = $8,
       founder_message_image_position = $9, founder_message_heading = $10,
       founder_message_text = $11, founder_message_signature = $12,
       team_intro = $13, team_members = $14, process_cards = $15,
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
      merged.founderImage,
      merged.founderImagePosition,
      merged.founderHeading,
      merged.founderMessage,
      merged.founderName,
      merged.teamIntro,
      JSON.stringify(merged.teamMembers),
      JSON.stringify(merged.processCards),
      merged.trustedByLogos,
      merged.ctaText,
      merged.ctaBackgroundImage,
      merged.ctaBackgroundImagePosition,
    ]
  );
  return toAboutContent(rows[0]);
}
