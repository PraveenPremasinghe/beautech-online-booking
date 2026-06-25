/**
 * Button usage rules — one primary action per viewport region.
 *
 * | Variant      | When to use                                      | Example                          |
 * |--------------|--------------------------------------------------|----------------------------------|
 * | default      | Primary CTA — one per screen/section             | "Confirm booking", "Book now"    |
 * | secondary    | Secondary action alongside primary               | "Add another service"            |
 * | outline      | Tertiary / selectable cards / back navigation    | "Book this service", "Back"      |
 * | ghost        | Inline toolbar, icon-adjacent, low emphasis      | Header nav, close, filter chips  |
 * | destructive  | Irreversible actions only                        | "Cancel appointment"             |
 * | link         | Inline text navigation within copy               | "View policy" in paragraph       |
 *
 * Size rules (mobile-first):
 * - `lg` (h-11): Primary CTAs on mobile booking screens
 * - `default` (h-10): Desktop primary, secondary actions
 * - `sm`: Dense UI — cards, tables, inline actions
 * - `icon` / `icon-sm`: Icon-only controls
 *
 * Layout rules:
 * - Full-width primary on mobile: `className="w-full sm:w-auto"`
 * - Sticky bottom bar: single `default` lg button, full width
 * - Never place two `default` buttons side by side — use default + outline
 */
export const buttonRules = {
  primary: {
    variant: "default" as const,
    size: "lg" as const,
    className: "h-11 w-full rounded-xl px-6 shadow-sm sm:w-auto",
  },
  secondary: {
    variant: "outline" as const,
    size: "lg" as const,
    className: "h-11 w-full rounded-xl px-6 sm:w-auto",
  },
  cardAction: {
    variant: "outline" as const,
    size: "default" as const,
    className: "h-10 w-full rounded-xl",
  },
  ghostNav: {
    variant: "ghost" as const,
    size: "sm" as const,
    className: "rounded-xl",
  },
} as const;
