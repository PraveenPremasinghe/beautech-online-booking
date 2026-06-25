import Link from "next/link";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BOOKING_ROUTES } from "@/lib/constants";
import { formatRating } from "@/lib/format";
import {
  formatBranchAddressShort,
  formatHoursRange,
  getOpenStatusText,
  getTodayHours,
} from "@/lib/salon-utils";
import { cn } from "@/lib/utils";
import type { Branch, Salon } from "@/types/booking";
import type { OpeningHoursDay } from "@/types/salon-profile";

interface SalonBookingCardProps {
  salon: Pick<Salon, "name" | "slug" | "rating" | "reviewCount">;
  primaryBranch: Branch;
  openingHours: OpeningHoursDay[];
  className?: string;
}

export function SalonBookingCard({
  salon,
  primaryBranch,
  openingHours,
  className,
}: SalonBookingCardProps) {
  const status = getOpenStatusText(openingHours);
  const today = getTodayHours(openingHours);

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-md",
        className,
      )}
    >
      <CardHeader className="gap-3 border-b border-border/70 bg-muted/20 px-5 py-4">
        <CardTitle className="text-xl font-semibold leading-snug">
          {salon.name}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-sm">
          <StarIcon className="size-4 text-amber-400" aria-hidden />
          <span className="font-medium text-foreground">
            {formatRating(salon.rating)}
          </span>
          <span className="text-muted-foreground">
            ({salon.reviewCount.toLocaleString()} reviews)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-5 py-4">
        <dl className="space-y-3 text-sm">
          <div className="flex gap-3">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </dt>
              <dd className="mt-0.5 leading-snug text-foreground">
                {formatBranchAddressShort(primaryBranch.address)}
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <ClockIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hours
              </dt>
              <dd className="mt-0.5 leading-snug text-foreground">
                <span
                  className={cn(
                    "font-medium",
                    status.isOpen ? "text-success" : "text-foreground",
                  )}
                >
                  {status.primary}
                </span>
                {status.secondary ? (
                  <span className="text-muted-foreground"> · {status.secondary}</span>
                ) : null}
              </dd>
              {today ? (
                <dd className="mt-1 text-xs text-muted-foreground">
                  Today: {formatHoursRange(today)}
                </dd>
              ) : null}
            </div>
          </div>
        </dl>

        <Button
          render={<Link href={BOOKING_ROUTES.bookWithWelcome(salon.slug)} />}
          nativeButton={false}
          size="lg"
          className="h-11 w-full rounded-xl shadow-sm"
        >
          Book appointment
        </Button>
      </CardContent>
    </Card>
  );
}
