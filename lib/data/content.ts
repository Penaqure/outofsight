import type { ContactsContent, HomeContent } from "@/types/content";

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
      bodyText:
        "From the vastness of its enchanting desert to the vibrancy of its dazzling cities",
      email: "",
      countryCode: "",
      phoneNumber: "",
      location: "",
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
