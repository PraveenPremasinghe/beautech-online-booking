export const siteConfig = {
  name: "Beautech",
  description:
    "Book salon services online in minutes. Browse treatments, pick your pro, and confirm instantly.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    privacy: "/privacy",
    terms: "/terms",
    contact: "/contact",
  },
} as const;
