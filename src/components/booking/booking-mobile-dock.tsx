"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
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
import { formatCurrency, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingSummary } from "@/types/booking";

const footerInnerClass =
  "mx-auto w-full max-w-lg px-4 sm:max-w-2xl sm:px-6 lg:max-w-6xl lg:px-8";

interface BookingMobileDockProps {
  summary: BookingSummary | null;
  showSummary?: boolean;
  hideSummaryOnDesktop?: boolean;
  showBack: boolean;
  backLabel: string;
  continueLabel: string;
  continueDisabled: boolean;
  isLoading: boolean;
  onBack?: () => void;
  onContinue?: () => void;
}

export function BookingMobileDock({
  summary,
  showSummary = true,
  hideSummaryOnDesktop = true,
  showBack,
  backLabel,
  continueLabel,
  continueDisabled,
  isLoading,
  onBack,
  onContinue,
}: BookingMobileDockProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  const hasItems = Boolean(summary && summary.lineItems.length > 0);
  const itemCount = summary?.lineItems.length ?? 0;
  const total = summary?.total ?? 0;
  const currency = summary?.currency ?? "USD";
  const duration = summary?.totalDurationMinutes ?? 0;

  if (!onContinue && !showBack) {
    return null;
  }

  const hasBack = showBack && Boolean(onBack);
  const hasContinue = Boolean(onContinue);
  const hasBothActions = hasBack && hasContinue;

  return (
    <>
      <motion.footer
        className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl backdrop-saturate-150"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
      >
        {showSummary ? (
          <div
            className={cn(
              footerInnerClass,
              hideSummaryOnDesktop && "lg:hidden",
            )}
          >
            <button
              type="button"
              onClick={() => hasItems && setSummaryOpen(true)}
              disabled={!hasItems}
              className={cn(
                "flex w-full items-center gap-3 border-b border-border/60 py-3 text-left transition-colors duration-200",
                hasItems
                  ? "cursor-pointer hover:bg-muted/30 active:bg-muted/40"
                  : "cursor-not-allowed opacity-70",
              )}
              aria-expanded={summaryOpen}
              aria-controls="mobile-booking-summary-sheet"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-primary/10 text-primary">
                <ReceiptPercentIcon className="size-4" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                {hasItems ? (
                  <>
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                      {itemCount} service{itemCount === 1 ? "" : "s"} ·{" "}
                      {formatDuration(duration)}
                    </p>
                    <p className="text-base font-semibold tracking-tight text-foreground">
                      {formatCurrency(total, currency)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      Booking summary
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select services to see totals
                    </p>
                  </>
                )}
              </div>

              {hasItems ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Details
                  <ChevronUpIcon className="size-3.5" aria-hidden />
                </span>
              ) : null}
            </button>
          </div>
        ) : null}

        <div className={cn(footerInnerClass, "py-3")}>
          <div
            className={cn(
              "flex items-center gap-2.5 sm:justify-end sm:gap-3",
              hasBothActions ? "justify-stretch" : "justify-center sm:justify-end",
            )}
          >
            {hasBack && onBack ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isLoading}
                onClick={onBack}
                className={cn(
                  "h-11 rounded-xl px-5 transition-transform active:scale-[0.98]",
                  hasBothActions
                    ? "min-w-[6.75rem] flex-1 sm:flex-none sm:min-w-[8.5rem]"
                    : "hidden",
                )}
              >
                <ArrowLeftIcon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{backLabel}</span>
              </Button>
            ) : null}

            {onContinue ? (
              <Button
                type="button"
                size="lg"
                disabled={continueDisabled || isLoading}
                onClick={onContinue}
                className={cn(
                  "h-11 rounded-xl px-5 transition-transform active:scale-[0.98]",
                  hasBothActions
                    ? "min-w-[8.5rem] flex-[1.2] sm:flex-none sm:min-w-[10rem] sm:max-w-[11.5rem]"
                    : "w-full max-w-xs sm:w-auto sm:min-w-[11rem] sm:max-w-[13rem]",
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ArrowPathIcon className="size-4 animate-spin" aria-hidden />
                      <span className="truncate">{continueLabel}</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="truncate">{continueLabel}</span>
                      <ArrowRightIcon className="size-4 shrink-0" aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            ) : null}
          </div>
        </div>
      </motion.footer>

      {showSummary ? (
        <Sheet open={summaryOpen} onOpenChange={setSummaryOpen}>
          <SheetContent
            id="mobile-booking-summary-sheet"
            side="bottom"
            className={cn(
              "max-h-[85dvh] rounded-t-2xl border-border/70 px-0 lg:hidden",
              "pb-[env(safe-area-inset-bottom)]",
            )}
            showCloseButton
          >
            <SheetHeader className="border-b border-border/70 px-5 pb-4 text-left">
              <SheetTitle className="text-base font-semibold">
                Booking summary
              </SheetTitle>
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
                className="h-11 w-full max-w-xs rounded-xl"
                onClick={() => setSummaryOpen(false)}
              >
                Close
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
}
