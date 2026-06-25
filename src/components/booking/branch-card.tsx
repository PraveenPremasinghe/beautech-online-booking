import {
  ClockIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

import { Badge } from "@/components/ui/badge";
import { getBranchDistancePlaceholder } from "@/lib/branch-utils";
import { formatBranchAddress } from "@/lib/salon-utils";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/booking";

interface BranchCardProps {
  branch: Branch;
  selected: boolean;
  isOpen: boolean;
  onSelect: (branchId: string) => void;
}

export function BranchCard({
  branch,
  selected,
  isOpen,
  onSelect,
}: BranchCardProps) {
  const distance = getBranchDistancePlaceholder(branch.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(branch.id)}
      aria-pressed={selected}
      className="w-full cursor-pointer text-left"
    >
      <div
        className={cn(
          "flex overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all active:scale-[0.99]",
          "hover:border-primary/30 hover:shadow-md",
          selected && "border-primary ring-2 ring-primary/20 shadow-md",
        )}
      >
        <div className="relative w-28 shrink-0 sm:w-32">
          {branch.imageUrl ? (
            <img
              src={branch.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "size-full min-h-[7.5rem] bg-linear-to-br sm:min-h-32",
                branch.imageGradient ?? "from-brand-100 via-primary/15 to-slate-100",
              )}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
          {selected ? (
            <CheckCircleSolidIcon
              className="absolute top-2 left-2 size-6 text-primary drop-shadow-sm"
              aria-hidden
            />
          ) : (
            <span
              className="absolute top-2 left-2 size-5 rounded-full border-2 border-white/80 bg-black/10"
              aria-hidden
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                    {branch.name}
                  </h3>
                  {branch.isPrimary ? (
                    <Badge variant="secondary" className="rounded-full text-[10px] sm:text-xs">
                      Primary
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  <MapPinIcon
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden
                  />
                  <span className="line-clamp-2">
                    {formatBranchAddress(branch.address)}
                  </span>
                </p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 rounded-full text-[10px] sm:text-xs",
                  isOpen
                    ? "bg-success/12 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <MapIcon className="size-3.5 text-primary" aria-hidden />
              {distance}
            </span>
            <span className="text-border" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3.5" aria-hidden />
              Salon hours apply
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
