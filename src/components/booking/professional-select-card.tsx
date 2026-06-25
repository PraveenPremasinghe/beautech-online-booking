import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfessionalInitials } from "@/lib/professional-utils";
import { cn } from "@/lib/utils";
import type { Professional } from "@/types/booking";

interface ProfessionalSelectCardProps {
  professional: Professional;
  selected: boolean;
  disabled: boolean;
  onSelect: (professionalId: string) => void;
}

export function ProfessionalSelectCard({
  professional,
  selected,
  disabled,
  onSelect,
}: ProfessionalSelectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(professional.id)}
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

      <Avatar size="sm" className="size-9 shrink-0 rounded-full">
        {professional.avatarUrl ? (
          <AvatarImage
            src={professional.avatarUrl}
            alt={professional.displayName}
            className="rounded-full"
          />
        ) : null}
        <AvatarFallback className="rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {getProfessionalInitials(professional.displayName)}
        </AvatarFallback>
      </Avatar>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {professional.displayName}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {professional.title}
        </span>
      </span>
    </button>
  );
}
