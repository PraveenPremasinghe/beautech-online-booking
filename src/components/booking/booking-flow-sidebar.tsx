"use client";

import { format, parse } from "date-fns";
import {
  ArrowRightIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { bookingLayout } from "@/lib/booking-ui";
import { formatCurrency, formatDuration, formatRating } from "@/lib/format";
import { formatBranchAddress } from "@/lib/salon-utils";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import type { BookingSummary } from "@/types/booking";

function formatSummaryDateLong(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEEE d MMMM");
}

function formatSummaryTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a").toLowerCase();
}

export interface BookingFlowSidebarProps {
  summary: BookingSummary | null;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function BookingFlowSidebar({
  summary,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  isLoading = false,
  className,
}: BookingFlowSidebarProps) {
  const salon = useBookingStore((s) => s.catalog?.salon);
  const displayName = summary?.branch?.name ?? salon?.name ?? summary?.salon.name ?? "Your appointment";

  const address = summary?.branch
    ? formatBranchAddress(summary.branch.address)
    : null;

  const hasDateTime = Boolean(summary?.date && summary?.startTime);
  const hasServices = Boolean(summary && summary.lineItems.length > 0);
  const professionalName = summary?.anyProfessional
    ? null
    : summary?.professional?.displayName;

  return (
    <aside
      className={cn(
        bookingLayout.stickySummary,
        "flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md",
        className,
      )}
    >
      <div className="p-5">
        <div className="flex gap-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-brand-100 via-primary/15 to-slate-100">
            {salon?.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={salon.coverImageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold leading-snug text-foreground">
              {displayName}
            </h2>
            {salon ? (
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="font-medium text-foreground">
                  {formatRating(salon.rating)}
                </span>
                <StarIcon className="size-3.5 text-amber-400" aria-hidden />
                <span className="text-muted-foreground">
                  ({salon.reviewCount.toLocaleString()})
                </span>
              </div>
            ) : null}
            {address ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {address}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {hasDateTime ? (
        <>
          <Separator />
          <div className="space-y-2 px-5 py-4 text-sm">
            <div className="flex items-center gap-2.5">
              <CalendarDaysIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="font-medium text-foreground">
                {formatSummaryDateLong(summary!.date!)}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="text-foreground">
                {formatSummaryTime(summary!.startTime!)}
                {summary!.endTime
                  ? `–${formatSummaryTime(summary!.endTime)}`
                  : null}
                {summary!.totalDurationMinutes > 0 ? (
                  <span className="text-muted-foreground">
                    {" "}
                    ({formatDuration(summary!.totalDurationMinutes)} duration)
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        </>
      ) : null}

      {hasServices ? (
        <>
          <Separator />
          <div className="space-y-4 px-5 py-4">
            {summary!.lineItems.map((item) => (
              <div key={item.serviceId} className="space-y-1">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="shrink-0 font-medium tabular-nums text-foreground">
                    {formatCurrency(item.price, summary!.currency)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(item.durationMinutes)}
                  {professionalName ? (
                    <>
                      {" "}
                      with{" "}
                      <span className="font-medium text-primary">
                        {professionalName}
                      </span>
                    </>
                  ) : summary?.anyProfessional ? (
                    <> with first available specialist</>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <Separator />

      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-foreground">Total</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatCurrency(summary?.total ?? 0, summary?.currency ?? "USD")}
        </span>
      </div>

      {onContinue ? (
        <div className="border-t border-border/70 p-5 pt-0">
          <Button
            type="button"
            size="lg"
            className="mt-4 h-12 w-full rounded-full text-base shadow-sm"
            onClick={onContinue}
            disabled={continueDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="size-4 animate-spin" aria-hidden />
                {continueLabel}
              </>
            ) : (
              <>
                {continueLabel}
                <ArrowRightIcon className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
