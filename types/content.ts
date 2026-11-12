export type HomeContent = {
  heroText: string;
  displayMode: "body-text" | "logo-only" | "blank";
  backgroundVideoName: string | null;
  backgroundVideoUrl: string | null;
  logoFileName: string | null;
  // "Trusted International Clients" section below the hero. Its own list,
  // separate from the About logos (AboutContent.trustedByLogos).
  clientsEnabled: boolean;
  clientsHeading: string;
  clientsDescription: string;
  clientsLogos: string[];
};

export type ContactsContent = {
  bodyText: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  location: string;
};

export type FooterLink = {
  label: string;
  url: string;
};

export type FooterContent = {
  // Column headings and their contents, left to right. Every field is
  // edited on the admin Footer page; until it's first saved, Navigation
  // mirrors the site menu and Address / Contacts mirror the Contacts page.
  navigationLabel: string;
  navigationLinks: FooterLink[];
  mediaLabel: string;
  mediaLinks: FooterLink[];
  addressLabel: string;
  address: string;
  contactsLabel: string;
  contactLinks: FooterLink[];
};

export type ProcessCard = {
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  position: string;
  photo: string | null;
  photoPosition: string;
  instagramUrl: string;
  linkedinUrl: string;
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
  founderImage: string | null;
  founderImagePosition: string;
  founderHeading: string;
  founderMessage: string;
  founderName: string;
  // Short blurb shown to the left of the team member row.
  teamIntro: string;
  teamMembers: TeamMember[];
  processCards: ProcessCard[];
  // About's "Trusted By" strip. Home has its own list:
  // HomeContent.clientsLogos.
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
  trustedByHeading: string;
  trustedByDescription: string;
};
