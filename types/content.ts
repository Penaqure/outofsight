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
  // CSS object-position (e.g. "62% 30%") — where the image is focused
  // within its object-cover box, set via the admin's focal-point picker.
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
  processCards: ProcessCard[];
  trustedByLogos: string[];
  ctaText: string;
  ctaBackgroundImage: string | null;
  ctaBackgroundImagePosition: string;
};

export type WorksContent = {
  heroImage: string | null;
  heroImagePosition: string;
  heroHeading: string;
  heroDescription: string;
};
