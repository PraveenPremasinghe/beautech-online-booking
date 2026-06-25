"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

import { BookingFlowSidebar } from "@/components/booking/booking-flow-sidebar";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getBookingStepLabel } from "@/features/booking/constants";
import { bookingLayout } from "@/lib/booking-ui";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingStep, BookingSummary } from "@/types/booking";

export interface BookingShellProps {
  currentStep: BookingStep;
  stepTitle?: string;
  summary: BookingSummary | null;
  children: ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function BookingShell({
  currentStep,
  stepTitle,
  summary,
  children,
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  showBack = true,
  isLoading = false,
  className,
}: BookingShellProps) {
  const sectionName = stepTitle ?? getBookingStepLabel(currentStep);
  const showTopBack = showBack && Boolean(onBack);
  const showFooter = Boolean(onContinue);
  const total = summary?.total ?? 0;
  const currency = summary?.currency ?? "USD";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <Container as="div" className="max-lg:px-3 sm:max-lg:px-4">
          <div className="flex h-14 items-center gap-2">
            {showTopBack ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-9 shrink-0 rounded-lg"
                onClick={onBack}
                disabled={isLoading}
                aria-label="Go back"
              >
                <ArrowLeftIcon className="size-5" aria-hidden />
              </Button>
            ) : (
              <div className="size-9 shrink-0" aria-hidden />
            )}
            <h1 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {sectionName}
            </h1>
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
        <div className="min-w-0">{children}</div>

        <BookingFlowSidebar
          summary={summary}
          onContinue={onContinue}
          continueLabel={continueLabel}
          continueDisabled={continueDisabled}
          isLoading={isLoading}
          className="hidden lg:flex"
        />
      </Container>

      {showFooter ? (
        <footer
          className={cn(
            bookingLayout.actionBar,
            bookingLayout.safeAreaBottom,
            bookingLayout.mobileBarShadow,
            "lg:hidden",
          )}
        >
          <Container as="div" className="max-lg:px-3 sm:max-lg:px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Total</p>
                <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
                  {formatCurrency(total, currency)}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="h-11 shrink-0 rounded-full px-6 shadow-sm"
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
          </Container>
        </footer>
      ) : null}
    </div>
  );
}
