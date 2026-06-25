/** Shared Tailwind utility strings for the booking flow. */
export const bookingLayout = {
  stickySummary: "sticky top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto",
  hideScrollbar:
    "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
  safeAreaBottom: "pb-[env(safe-area-inset-bottom)]",
  mobileBarShadow: "shadow-[0_-4px_24px_0_rgb(15_23_42/0.08)]",
  /** Reserve space above the fixed booking action bar */
  actionBarOffset: "pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
  actionBar:
    "fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-md",
} as const;
