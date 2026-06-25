export const APP_NAME = "Beautech";

export const SALON_SLUG = "beautech-studio";

export const BOOKING_ROUTES = {
  /** Salon profile (home) */
  home: () => "/",
  salon: (_slug?: string) => "/",
  /** Booking entry — branch selection */
  book: (slug: string) => `/book/${slug}/branch`,
  /** Booking entry with welcome intro modal */
  bookWithWelcome: (slug: string) => `/book/${slug}/branch?welcome=1`,
  branch: (slug: string) => `/book/${slug}/branch`,
  services: (slug: string) => `/book/${slug}/services`,
  professional: (slug: string) => `/book/${slug}/professional`,
  datetime: (slug: string) => `/book/${slug}/time`,
  details: (slug: string) => `/book/${slug}/details`,
  summary: (slug: string) => `/book/${slug}/summary`,
  confirmed: (slug: string, bookingId: string) =>
    `/book/${slug}/confirmed/${bookingId}`,
} as const;
