import { withClientQuery } from "@/lib/tenant";

export const APP_NAME = "Beautech";

export const SALON_SLUG = "beautech-studio";

const routes = {
  home: () => "/",
  salon: (_slug?: string) => "/",
  book: (slug: string) => `/book/${slug}/branch`,
  bookWithWelcome: (slug: string) => `/book/${slug}/branch?welcome=1`,
  branch: (slug: string) => `/book/${slug}/branch`,
  services: (slug: string) => `/book/${slug}/services`,
  professional: (slug: string) => `/book/${slug}/professional`,
  datetime: (slug: string) => `/book/${slug}/time`,
  details: (slug: string) => `/book/${slug}/details`,
  summary: (slug: string) => `/book/${slug}/summary`,
  confirmed: (slug: string, bookingId: string) =>
    `/book/${slug}/confirmed/${bookingId}`,
  profile: () => "/profile",
  authCallback: () => "/auth/callback",
} as const;

export const BOOKING_ROUTES = {
  home: () => withClientQuery(routes.home()),
  salon: (_slug?: string) => withClientQuery(routes.home()),
  book: (slug: string) => withClientQuery(routes.book(slug)),
  bookWithWelcome: (slug: string) =>
    withClientQuery(routes.bookWithWelcome(slug)),
  branch: (slug: string) => withClientQuery(routes.branch(slug)),
  services: (slug: string) => withClientQuery(routes.services(slug)),
  professional: (slug: string) => withClientQuery(routes.professional(slug)),
  datetime: (slug: string) => withClientQuery(routes.datetime(slug)),
  details: (slug: string) => withClientQuery(routes.details(slug)),
  summary: (slug: string) => withClientQuery(routes.summary(slug)),
  confirmed: (slug: string, bookingId: string) =>
    withClientQuery(routes.confirmed(slug, bookingId)),
  profile: () => withClientQuery(routes.profile()),
  authCallback: () => withClientQuery(routes.authCallback()),
} as const;
