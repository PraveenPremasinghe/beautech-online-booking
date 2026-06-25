import { TimeSlotsSkeleton } from "@/components/booking/time-slots-skeleton";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookingStepLabel } from "@/features/booking/constants";
import { bookingLayout } from "@/lib/booking-ui";
import { cn } from "@/lib/utils";
import type { BookingStep } from "@/types/booking";

export type BookingSkeletonVariant = BookingStep | "default";

function BookingSidebarSkeleton({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        bookingLayout.stickySummary,
        "flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md",
        className,
      )}
      aria-hidden
    >
      <div className="space-y-4 p-5">
        <div className="flex gap-3">
          <Skeleton className="size-14 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <div className="space-y-2 border-t border-border/60 pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-3 border-t border-border/60 pt-4">
          <Skeleton className="h-3 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="mt-auto border-t border-border/60 p-5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </aside>
  );
}

function BookingMobileFooterSkeleton() {
  return (
    <footer
      className={cn(
        bookingLayout.actionBar,
        bookingLayout.safeAreaBottom,
        bookingLayout.mobileBarShadow,
        "lg:hidden",
      )}
      aria-hidden
    >
      <Container as="div" className="max-lg:px-3 sm:max-lg:px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </Container>
    </footer>
  );
}

function BranchCardsSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4" aria-busy="true" aria-label="Loading branches">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
        >
          <Skeleton className="h-28 w-28 shrink-0 rounded-none sm:h-[7.5rem] sm:w-36" />
          <div className="flex flex-1 flex-col justify-center gap-2 p-4">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesStepSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading services">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-20 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-3"
          >
            <Skeleton className="size-5 shrink-0 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-12 shrink-0" />
            <Skeleton className="h-4 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfessionalStepSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading professionals">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-3"
        >
          <Skeleton className="size-5 shrink-0 rounded-md" />
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DatetimeStepSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading date and time">
      <div className="flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-[4.5rem] shrink-0 rounded-xl" />
        ))}
      </div>
      <TimeSlotsSkeleton />
    </div>
  );
}

function DetailsStepSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading form">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

function SummaryStepSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading summary">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border/70 bg-card p-4"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}

function BookingStepContentSkeleton({ variant }: { variant: BookingSkeletonVariant }) {
  switch (variant) {
    case "branch":
      return <BranchCardsSkeleton />;
    case "services":
      return <ServicesStepSkeleton />;
    case "professional":
      return <ProfessionalStepSkeleton />;
    case "datetime":
      return <DatetimeStepSkeleton />;
    case "details":
      return <DetailsStepSkeleton />;
    case "summary":
      return <SummaryStepSkeleton />;
    default:
      return <BranchCardsSkeleton />;
  }
}

export interface BookingShellSkeletonProps {
  variant?: BookingSkeletonVariant;
  showFooter?: boolean;
  className?: string;
}

export function BookingShellSkeleton({
  variant = "default",
  showFooter = true,
  className,
}: BookingShellSkeletonProps) {
  const step = variant === "default" ? "branch" : variant;
  const sectionLabel = getBookingStepLabel(step);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      aria-busy="true"
      aria-label={`Loading ${sectionLabel}`}
    >
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <Container as="div" className="max-lg:px-3 sm:max-lg:px-4">
          <div className="flex h-14 items-center gap-2">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <Skeleton className="h-5 w-36 max-w-[60%] sm:w-44" />
          </div>
        </Container>
      </header>

      <Container
        as="div"
        className={cn(
          "grid flex-1 gap-6 py-4 sm:gap-8 sm:py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start",
          "max-lg:px-3 sm:max-lg:px-4",
          showFooter && "max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
          className,
        )}
      >
        <div className="min-w-0">
          <BookingStepContentSkeleton variant={variant} />
        </div>
        <BookingSidebarSkeleton className="hidden lg:flex" />
      </Container>

      {showFooter ? <BookingMobileFooterSkeleton /> : null}
    </div>
  );
}

export function BookingConfirmedSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col gap-4 py-12"
      aria-busy="true"
      aria-label="Loading confirmation"
    >
      <Skeleton className="mx-auto size-16 rounded-full" />
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-11 rounded-xl" />
    </div>
  );
}
