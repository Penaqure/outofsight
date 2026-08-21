export type HomeContent = {
  heroText: string;
  displayMode: "body-text" | "logo-only";
  backgroundVideoName: string | null;
  backgroundVideoUrl: string | null;
  logoFileName: string | null;
};

export type ContactsContent = {
  bodyText: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  location: string;
};

export type ProcessCard = {
  title: string;
  description: string;
};

export type AboutContent = {
  heroImage: string | null;
  heroHeadline: string;
  introText: string;
  storyImage: string | null;
  storyText: string;
  founderPhoto: string | null;
  founderName: string;
  founderTitle: string;
  bio: string;
  linkedinUrl: string;
  instagramUrl: string;
  processCards: ProcessCard[];
  trustedByLogos: string[];
  ctaText: string;
  ctaBackgroundImage: string | null;
};

export type WorksContent = {
  heroImage: string | null;
  heroHeading: string;
  heroDescription: string;
};
