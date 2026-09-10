// Tagline is still a placeholder — swap once the Figma design/copy is in.
export const siteConfig = {
  name: "OUTOFSIGHT",
  tagline: "A short tagline describing what the company does.",
  // Default SEO description, used for <meta name="description"> and Open
  // Graph on pages that don't supply their own copy. Swap for the real
  // positioning line once the Figma copy is finalised.
  description:
    "OUTOFSIGHT is a brand storytelling and film production studio, turning ideas into visuals that spark imagination, emotion, and meaning.",
  // Absolute origin of the deployed site — used to build canonical URLs,
  // Open Graph URLs, the sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL
  // in the environment (see .env.example); falls back to localhost in dev.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, ""),
  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/works" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

// Placeholder until real auth/session data is wired up.
export const currentAdminUser = {
  name: "Admin",
};
