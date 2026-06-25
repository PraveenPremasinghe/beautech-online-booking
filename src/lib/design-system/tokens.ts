/**
 * Design system token map — mirrors CSS variables in globals.css.
 * Use for runtime logic (charts, inline styles). Prefer Tailwind classes in UI.
 */
export const dsTokens = {
  radius: {
    card: "0.75rem", // rounded-xl
    button: "0.75rem",
    badge: "9999px",
  },
  layout: {
    headerHeight: "3.5rem",
    summaryWidth: "20rem",
    pagePaddingX: "1rem", // mobile
    pagePaddingXSm: "1.5rem",
    pagePaddingXLg: "2rem",
  },
  typography: {
    display: "text-3xl font-semibold tracking-tight sm:text-4xl",
    title: "text-xl font-semibold tracking-tight sm:text-2xl",
    subtitle: "text-base font-medium text-foreground",
    body: "text-sm leading-relaxed text-muted-foreground",
    caption: "text-xs text-muted-foreground",
    label: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
    price: "text-lg font-semibold tracking-tight text-foreground",
  },
} as const;

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "no-show"
  | "in-progress";
