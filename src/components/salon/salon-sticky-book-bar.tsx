"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { bookingLayout } from "@/lib/booking-ui";
import { BOOKING_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SalonStickyBookBarProps {
  salonSlug: string;
  salonName: string;
}

export function SalonStickyBookBar({
  salonSlug,
  salonName,
}: SalonStickyBookBarProps) {
  return (
    <>
      {/* Mobile + tablet sticky bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur-md lg:hidden",
          bookingLayout.safeAreaBottom,
          bookingLayout.mobileBarShadow,
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {salonName}
            </p>
            <p className="text-xs text-muted-foreground">Ready to book?</p>
          </div>
          <Button
            render={<Link href={BOOKING_ROUTES.bookWithWelcome(salonSlug)} />}
            nativeButton={false}
            size="lg"
            className="h-11 shrink-0 rounded-xl px-6 shadow-sm"
          >
            Book now
          </Button>
        </div>
      </div>

      {/* Desktop floating CTA */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-50 hidden lg:block">
        <Button
          render={<Link href={BOOKING_ROUTES.bookWithWelcome(salonSlug)} />}
          nativeButton={false}
          size="lg"
          className="pointer-events-auto h-12 rounded-xl px-8 shadow-lg"
        >
          Book now
        </Button>
      </div>
    </>
  );
}
