import type {
  AboutContent,
  ContactsContent,
  HomeContent,
  WorksContent,
} from "@/types/content";

// In-memory placeholder store, same pattern as lib/data/portfolio.ts —
// anchored on globalThis so it stays shared across Turbopack's separate
// dev-mode module graphs for Route Handlers vs Server Components.
// Swap for a real database + file storage (e.g. S3/Cloudinary for the
// background video) once persistence is wired up.
declare global {
  var __homeContent: HomeContent | undefined;
}

function store(): HomeContent {
  if (!globalThis.__homeContent) {
    globalThis.__homeContent = {
      heroText: "Pineers in brand Storytelling",
      displayMode: "body-text",
      backgroundVideoName: null,
      backgroundVideoUrl: null,
      logoFileName: "outofsight_logo_only.png",
    };
  }
  return globalThis.__homeContent;
}

export async function getHomeContent(): Promise<HomeContent> {
  return store();
}

export async function updateHomeContent(
  input: Partial<HomeContent>
): Promise<HomeContent> {
  globalThis.__homeContent = { ...store(), ...input };
  return globalThis.__homeContent;
}

declare global {
  var __contactsContent: ContactsContent | undefined;
}

function contactsStore(): ContactsContent {
  if (!globalThis.__contactsContent) {
    globalThis.__contactsContent = {
      bodyText: "Get in touch.",
      email: "hello@outofsight.com",
      countryCode: "+971",
      phoneNumber: "0000 0000",
      location: "Dubai, UAE",
    };
  }
  return globalThis.__contactsContent;
}

export async function getContactsContent(): Promise<ContactsContent> {
  return contactsStore();
}

export async function updateContactsContent(
  input: Partial<ContactsContent>
): Promise<ContactsContent> {
  globalThis.__contactsContent = { ...contactsStore(), ...input };
  return globalThis.__contactsContent;
}

declare global {
  var __aboutContent: AboutContent | undefined;
}

function aboutStore(): AboutContent {
  if (!globalThis.__aboutContent) {
    globalThis.__aboutContent = {
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
      ],
      // Left empty rather than seeded with real company logos from the
      // Figma mock — showing brand marks like DJI/Mercedes/Ferrari would
      // imply a client relationship that doesn't actually exist yet.
      // Add real client logos here once there are real clients.
      trustedByLogos: [],
      ctaText: "Have a project in mind?",
      ctaBackgroundImage: null,
      ctaBackgroundImagePosition: "50% 50%",
    };
  }
  return globalThis.__aboutContent;
}

export async function getAboutContent(): Promise<AboutContent> {
  return aboutStore();
}

export async function updateAboutContent(
  input: Partial<AboutContent>
): Promise<AboutContent> {
  globalThis.__aboutContent = { ...aboutStore(), ...input };
  return globalThis.__aboutContent;
}

declare global {
  var __worksContent: WorksContent | undefined;
}

function worksStore(): WorksContent {
  if (!globalThis.__worksContent) {
    globalThis.__worksContent = {
      // Seeded from the Figma mock's hero photo — swap via the admin Works
      // editor once a real hero image is available.
      heroImage: "/images/works-hero.jpg",
      heroImagePosition: "50% 50%",
      heroHeading: "For Moments That Stay",
      heroDescription:
        "From the vastness of its enchanting desert to the vibrancy of its dazzling cities, discover cultural treasures that tell stories of the past, and surprise yourself on a journey filled with excitement and wonder.",
    };
  }
  return globalThis.__worksContent;
}

export async function getWorksContent(): Promise<WorksContent> {
  return worksStore();
}

export async function updateWorksContent(
  input: Partial<WorksContent>
): Promise<WorksContent> {
  globalThis.__worksContent = { ...worksStore(), ...input };
  return globalThis.__worksContent;
}
