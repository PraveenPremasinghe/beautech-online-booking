import { UsersIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { cn } from "@/lib/utils";

interface AnyProfessionalCardProps {
  selected: boolean;
  availableCount: number;
  disabled?: boolean;
  onSelect: () => void;
}

export function AnyProfessionalCard({
  selected,
  availableCount,
  disabled = false,
  onSelect,
}: AnyProfessionalCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left shadow-sm transition-all active:scale-[0.99]",
        !disabled && "hover:border-primary/30 hover:bg-muted/30",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/20",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden>
        {selected ? (
          <CheckCircleIcon className="size-5 text-primary" />
        ) : (
          <span className="size-[18px] rounded-full border-2 border-muted-foreground/35" />
        )}
      </span>

      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
          selected && "bg-primary text-primary-foreground",
        )}
        aria-hidden
      >
        <UsersIcon className="size-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          Any professional
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {availableCount > 0
            ? `${availableCount} available specialist${availableCount === 1 ? "" : "s"}`
            : "No matching specialists"}
        </span>
      </span>
    </button>
  );
}
