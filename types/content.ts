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
