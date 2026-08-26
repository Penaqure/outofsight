import type {
  AboutContent,
  ContactsContent,
  HomeContent,
  ProcessCard,
  WorksContent,
} from "@/types/content";
import { prisma } from "@/lib/prisma";

// Postgres-backed now (see prisma/schema.prisma). Each *Content table is a
// singleton — exactly one row, fixed at id: 1 — seeded with these defaults
// on first read. update* upserts, so it works even before that first read
// has happened.

const homeDefaults = {
  heroText: "Pineers in brand Storytelling",
  displayMode: "body-text",
  backgroundVideoName: null,
  backgroundVideoUrl: null,
  logoFileName: "outofsight_logo_only.png",
};

// displayMode is a free-form String column (no native Postgres enum), so
// Prisma returns it as `string` — narrow it back to HomeContent's literal
// union on the way out.
function toHomeContent(row: {
  id: number;
  heroText: string;
  displayMode: string;
  backgroundVideoName: string | null;
  backgroundVideoUrl: string | null;
  logoFileName: string | null;
}): HomeContent {
  return {
    heroText: row.heroText,
    displayMode: row.displayMode as HomeContent["displayMode"],
    backgroundVideoName: row.backgroundVideoName,
    backgroundVideoUrl: row.backgroundVideoUrl,
    logoFileName: row.logoFileName,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const existing = await prisma.homeContent.findUnique({ where: { id: 1 } });
  if (existing) return toHomeContent(existing);
  const created = await prisma.homeContent.create({
    data: { id: 1, ...homeDefaults },
  });
  return toHomeContent(created);
}

export async function updateHomeContent(
  input: Partial<HomeContent>
): Promise<HomeContent> {
  const updated = await prisma.homeContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...homeDefaults, ...input },
    update: input,
  });
  return toHomeContent(updated);
}

const contactsDefaults = {
  bodyText: "Get in touch.",
  email: "hello@outofsight.com",
  countryCode: "+971",
  phoneNumber: "0000 0000",
  location: "Dubai, UAE",
};

export async function getContactsContent(): Promise<ContactsContent> {
  const existing = await prisma.contactsContent.findUnique({
    where: { id: 1 },
  });
  if (existing) return existing;
  return prisma.contactsContent.create({
    data: { id: 1, ...contactsDefaults },
  });
}

export async function updateContactsContent(
  input: Partial<ContactsContent>
): Promise<ContactsContent> {
  return prisma.contactsContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...contactsDefaults, ...input },
    update: input,
  });
}

const aboutDefaults = {
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

// processCards is stored as Json — cast it back to ProcessCard[] on the way
// out so callers keep the same typed shape they always had.
function toAboutContent(row: {
  id: number;
  heroImage: string | null;
  heroImagePosition: string;
  heroHeadline: string;
  introText: string;
  storyImage: string | null;
  storyImagePosition: string;
  storyText: string;
  founderPhoto: string | null;
  founderPhotoPosition: string;
  founderName: string;
  founderTitle: string;
  bio: string;
  linkedinUrl: string;
  instagramUrl: string;
  processCards: unknown;
  trustedByLogos: string[];
  ctaText: string;
  ctaBackgroundImage: string | null;
  ctaBackgroundImagePosition: string;
}): AboutContent {
  return {
    heroImage: row.heroImage,
    heroImagePosition: row.heroImagePosition,
    heroHeadline: row.heroHeadline,
    introText: row.introText,
    storyImage: row.storyImage,
    storyImagePosition: row.storyImagePosition,
    storyText: row.storyText,
    founderPhoto: row.founderPhoto,
    founderPhotoPosition: row.founderPhotoPosition,
    founderName: row.founderName,
    founderTitle: row.founderTitle,
    bio: row.bio,
    linkedinUrl: row.linkedinUrl,
    instagramUrl: row.instagramUrl,
    processCards: row.processCards as ProcessCard[],
    trustedByLogos: row.trustedByLogos,
    ctaText: row.ctaText,
    ctaBackgroundImage: row.ctaBackgroundImage,
    ctaBackgroundImagePosition: row.ctaBackgroundImagePosition,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const existing = await prisma.aboutContent.findUnique({ where: { id: 1 } });
  if (existing) return toAboutContent(existing);
  const created = await prisma.aboutContent.create({
    data: { id: 1, ...aboutDefaults },
  });
  return toAboutContent(created);
}

export async function updateAboutContent(
  input: Partial<AboutContent>
): Promise<AboutContent> {
  const updated = await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...aboutDefaults, ...input },
    update: input,
  });
  return toAboutContent(updated);
}

const worksDefaults = {
  // Seeded from the Figma mock's hero photo — swap via the admin Works
  // editor once a real hero image is available.
  heroImage: "/images/works-hero.jpg",
  heroImagePosition: "50% 50%",
  heroHeading: "For Moments That Stay",
  heroDescription:
    "From the vastness of its enchanting desert to the vibrancy of its dazzling cities, discover cultural treasures that tell stories of the past, and surprise yourself on a journey filled with excitement and wonder.",
};

export async function getWorksContent(): Promise<WorksContent> {
  const existing = await prisma.worksContent.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.worksContent.create({ data: { id: 1, ...worksDefaults } });
}

export async function updateWorksContent(
  input: Partial<WorksContent>
): Promise<WorksContent> {
  return prisma.worksContent.upsert({
    where: { id: 1 },
    create: { id: 1, ...worksDefaults, ...input },
    update: input,
  });
}
