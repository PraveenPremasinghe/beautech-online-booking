import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { BOOKING_ROUTES } from "@/lib/constants";
import { formatBranchAddress } from "@/lib/salon-utils";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/booking";

interface SalonBranchesSectionProps {
  branches: Branch[];
  salonSlug: string;
}

export function SalonBranchesSection({
  branches,
  salonSlug,
}: SalonBranchesSectionProps) {
  const otherBranches = branches.filter((branch) => !branch.isPrimary);

  if (otherBranches.length === 0) {
    return null;
  }

  return (
    <section id="branches" className="scroll-mt-20 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Other locations
        </h2>
        <p className="text-sm text-muted-foreground">
          Book at any of our studio locations
        </p>
      </div>

      <ul className="space-y-3">
        {otherBranches.map((branch) => (
          <li key={branch.id}>
            <div className="flex overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
              <div
                className={cn(
                  "w-24 shrink-0 bg-linear-to-br sm:w-28",
                  branch.imageGradient ?? "from-brand-100 via-primary/15 to-slate-100",
                )}
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">
                      {branch.name}
                    </h3>
                  </div>
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    <MapPinIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    <span className="line-clamp-2">
                      {formatBranchAddress(branch.address)}
                    </span>
                  </p>
                </div>
                <Button
                  render={
                    <Link
                      href={`${BOOKING_ROUTES.bookWithWelcome(salonSlug)}&branch=${branch.id}`}
                    />
                  }
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 rounded-xl"
                >
                  Book here
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
