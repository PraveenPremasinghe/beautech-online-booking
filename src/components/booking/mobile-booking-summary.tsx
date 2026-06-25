"use client";

import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { BookingSummaryContent } from "@/components/booking/booking-summary-card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { bookingLayout } from "@/lib/booking-ui";
import { formatCurrency, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingSummary } from "@/types/booking";

interface MobileBookingSummaryProps {
  summary: BookingSummary | null;
  className?: string;
}

export function MobileBookingSummary({
  summary,
  className,
}: MobileBookingSummaryProps) {
  const [open, setOpen] = useState(false);

  const hasItems = Boolean(summary && summary.lineItems.length > 0);
  const itemCount = summary?.lineItems.length ?? 0;
  const total = summary?.total ?? 0;
  const currency = summary?.currency ?? "USD";
  const duration = summary?.totalDurationMinutes ?? 0;

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-md lg:hidden",
          bookingLayout.safeAreaBottom,
          bookingLayout.mobileBarShadow,
          className,
        )}
      >
        <button
          type="button"
          onClick={() => hasItems && setOpen(true)}
          disabled={!hasItems}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 text-left",
            hasItems && "active:bg-muted/50",
          )}
          aria-expanded={open}
          aria-controls="mobile-booking-summary-sheet"
        >
          <div className="min-w-0 flex-1">
            {hasItems ? (
              <>
                <p className="text-xs font-medium text-muted-foreground">
                  {itemCount} service{itemCount === 1 ? "" : "s"} ·{" "}
                  {formatDuration(duration)}
                </p>
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {formatCurrency(total, currency)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Booking summary</p>
                <p className="text-xs text-muted-foreground">No services selected</p>
              </>
            )}
          </div>
          {hasItems ? (
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              Details
              <ChevronUpIcon className="size-4" aria-hidden />
            </span>
          ) : null}
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          id="mobile-booking-summary-sheet"
          side="bottom"
          className={cn(
            "max-h-[85dvh] rounded-t-2xl border-border/70 px-0",
            bookingLayout.safeAreaBottom,
          )}
          showCloseButton
        >
          <SheetHeader className="border-b border-border/70 px-5 pb-4 text-left">
            <SheetTitle className="text-base font-semibold">Booking summary</SheetTitle>
            <SheetDescription>
              {summary?.salon.name ?? "Review your selections"}
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-5 py-4">
            <BookingSummaryContent summary={summary} />
          </div>
          <div className="border-t border-border/70 px-5 py-4">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
