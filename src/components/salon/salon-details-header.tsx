import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import { Badge } from "@/components/ui/badge";
import { formatRating } from "@/lib/format";
import {
  formatBranchAddressShort,
  getOpenStatusText,
} from "@/lib/salon-utils";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/booking";
import type { OpeningHoursDay, SalonProfile } from "@/types/salon-profile";

interface SalonDetailsHeaderProps {
  salon: SalonProfile["salon"];
  primaryBranch: Branch;
  openingHours: OpeningHoursDay[];
}

export function SalonDetailsHeader({
  salon,
  primaryBranch,
  openingHours,
}: SalonDetailsHeaderProps) {
  const status = getOpenStatusText(openingHours);

  return (
    <header className="space-y-4 border-b border-border/70 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full text-xs font-medium",
            status.isOpen
              ? "bg-success/12 text-success"
              : "bg-muted text-muted-foreground",
          )}
        >
          {status.primary}
        </Badge>
        {status.secondary ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" aria-hidden />
            {status.secondary}
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {salon.name}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {salon.tagline}
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <StarIcon className="size-4 text-amber-400" aria-hidden />
          {formatRating(salon.rating)}
          <span className="font-normal text-muted-foreground">
            ({salon.reviewCount.toLocaleString()} reviews)
          </span>
        </span>
        <span className="hidden text-border sm:inline" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <MapPinIcon className="size-4 shrink-0 text-primary" aria-hidden />
          {formatBranchAddressShort(primaryBranch.address)}
        </span>
      </div>
    </header>
  );
}
