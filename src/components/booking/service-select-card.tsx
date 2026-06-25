import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { formatCurrency, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/booking";

interface ServiceSelectCardProps {
  service: Service;
  selected: boolean;
  onToggle: (serviceId: string) => void;
}

export function ServiceSelectCard({
  service,
  selected,
  onToggle,
}: ServiceSelectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(service.id)}
      aria-pressed={selected}
      className={cn(
        "flex w-full justify-between cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left  transition-all active:scale-[0.99]",
        "hover:border-primary/30 hover:bg-muted/30",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/20",
      )}
    >

      <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center" aria-hidden>
        {selected ? (
          <CheckCircleIcon className="size-8 text-primary" />
        ) : (
          <span className="size-[18px] rounded-full border-2 border-muted-foreground/35" />
        )}
      </span>
      <div className="flex flex-col gap-1">

      <span className=" truncate text-md font-medium text-foreground">
        {service.name}
      </span>

      <span className=" text-sm tabular-nums text-muted-foreground">
        {formatDuration(service.durationMinutes)}
      </span>
      </div>
      </div>

      <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
        {formatCurrency(service.price, service.currency)}
      </span>
    </button>
  );
}
