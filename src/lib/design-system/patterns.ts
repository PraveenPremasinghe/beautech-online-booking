import { cva } from "class-variance-authority";

/* ─── Surfaces ───────────────────────────────────────────────────────────── */

/** Base soft card — white surface, slate border, subtle shadow */
export const dsCard = cva(
  "rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
      },
      interactive: {
        false: "",
        true: "cursor-pointer transition-all hover:border-primary/25 hover:shadow-md",
      },
      selected: {
        false: "",
        true: "border-primary ring-2 ring-primary/20 shadow-md",
      },
    },
    defaultVariants: {
      padding: "md",
      interactive: false,
      selected: false,
    },
  },
);

/** Elevated panel — booking summary, modals */
export const dsPanel = cva(
  "rounded-xl border border-border/70 bg-card shadow-md",
  {
    variants: {
      tone: {
        default: "",
        muted: "bg-muted/40",
        brand: "border-primary/20 bg-primary/5",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

/* ─── Service card ───────────────────────────────────────────────────────── */

export const dsServiceCard = cva(
  [
    "group flex h-full flex-col overflow-hidden rounded-xl",
    "border border-border/70 bg-card shadow-sm",
    "transition-all",
  ],
  {
    variants: {
      state: {
        default: "hover:border-primary/25 hover:shadow-md",
        selected: "border-primary ring-2 ring-primary/20 shadow-md",
        disabled: "pointer-events-none opacity-50",
      },
    },
    defaultVariants: { state: "default" },
  },
);

export const dsServiceCardMedia = cva(
  "relative h-32 w-full shrink-0 bg-gradient-to-br sm:h-36",
);

export const dsServiceCardBody = cva("flex flex-1 flex-col gap-3 p-4");

export const dsServiceCardMeta = cva(
  "flex items-center justify-between gap-2 text-xs text-muted-foreground",
);

export const dsServiceCardPrice = cva(
  "text-lg font-semibold tracking-tight text-foreground",
);

/* ─── Professional card ──────────────────────────────────────────────────── */

export const dsProfessionalCard = cva(
  [
    "flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm",
    "transition-all",
  ],
  {
    variants: {
      state: {
        default: "hover:border-primary/25 hover:shadow-md",
        selected: "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md",
        unavailable: "opacity-50 grayscale",
      },
      layout: {
        row: "flex-row",
        column: "flex-col text-center",
      },
    },
    defaultVariants: {
      state: "default",
      layout: "row",
    },
  },
);

export const dsProfessionalAvatar = cva(
  "size-12 shrink-0 rounded-xl bg-primary/10 text-primary ring-2 ring-background",
  {
    variants: {
      size: {
        sm: "size-10 rounded-lg",
        md: "size-12 rounded-xl",
        lg: "size-16 rounded-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/* ─── Booking summary ────────────────────────────────────────────────────── */

export const dsBookingSummary = cva(
  [
    "rounded-xl border border-border/70 bg-card p-5 shadow-md",
    "sm:p-6",
  ],
  {
    variants: {
      position: {
        inline: "",
        sticky:
          "sticky top-[calc(3.5rem+1rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto",
        mobile: "rounded-t-2xl border-x-0 border-b-0 shadow-[0_-4px_24px_rgba(15,23,42,0.08)]",
      },
    },
    defaultVariants: { position: "inline" },
  },
);

export const dsSummaryRow = cva(
  "flex items-start justify-between gap-3 py-2.5 text-sm",
);

export const dsSummaryLabel = cva("text-muted-foreground");

export const dsSummaryValue = cva("text-right font-medium text-foreground");

export const dsSummaryTotal = cva(
  "flex items-center justify-between border-t border-border/70 pt-4 mt-2",
);

export const dsSummaryTotalPrice = cva(
  "text-xl font-semibold tracking-tight text-foreground",
);

/* ─── Stepper ────────────────────────────────────────────────────────────── */

export const dsStepper = cva("flex w-full items-center gap-1 sm:gap-2");

export const dsStepperItem = cva("flex min-w-0 flex-1 flex-col items-center gap-1.5", {
  variants: {
    state: {
      complete: "",
      current: "",
      upcoming: "opacity-50",
    },
  },
  defaultVariants: { state: "upcoming" },
});

export const dsStepperDot = cva(
  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8",
  {
    variants: {
      state: {
        complete: "bg-primary text-primary-foreground",
        current: "bg-primary text-primary-foreground ring-4 ring-primary/20",
        upcoming: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { state: "upcoming" },
  },
);

export const dsStepperLabel = cva(
  "hidden truncate text-center text-[10px] font-medium sm:block sm:text-xs",
  {
    variants: {
      state: {
        complete: "text-foreground",
        current: "text-primary",
        upcoming: "text-muted-foreground",
      },
    },
    defaultVariants: { state: "upcoming" },
  },
);

export const dsStepperConnector = cva("h-0.5 flex-1 rounded-full", {
  variants: {
    state: {
      complete: "bg-primary",
      partial: "bg-gradient-to-r from-primary to-muted",
      upcoming: "bg-muted",
    },
  },
  defaultVariants: { state: "upcoming" },
});

/* ─── Status ─────────────────────────────────────────────────────────────── */

export const dsStatus = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        confirmed:
          "bg-success/12 text-success ring-1 ring-inset ring-success/25",
        pending:
          "bg-warning/12 text-warning-foreground ring-1 ring-inset ring-warning/30",
        cancelled:
          "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20",
        completed:
          "bg-info/12 text-info ring-1 ring-inset ring-info/25",
        "in-progress":
          "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
        "no-show":
          "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
      },
    },
    defaultVariants: { status: "pending" },
  },
);

export const dsStatusDot = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    status: {
      confirmed: "bg-success",
      pending: "bg-warning",
      cancelled: "bg-destructive",
      completed: "bg-info",
      "in-progress": "bg-primary",
      "no-show": "bg-muted-foreground",
    },
  },
  defaultVariants: { status: "pending" },
});

/* ─── Typography helpers ─────────────────────────────────────────────────── */

export const dsText = {
  display: "text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
  title: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
  subtitle: "text-base font-medium text-foreground",
  body: "text-sm leading-relaxed text-muted-foreground",
  caption: "text-xs text-muted-foreground",
  label: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
  price: "text-lg font-semibold tracking-tight text-foreground",
  priceLg: "text-xl font-semibold tracking-tight text-foreground",
} as const;

/* ─── Layout helpers ───────────────────────────────────────────────────────── */

export const dsLayout = {
  page: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
  section: "py-8 sm:py-12",
  stack: "flex flex-col gap-4 sm:gap-6",
  gridServices: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3",
  gridProfessionals: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
} as const;
