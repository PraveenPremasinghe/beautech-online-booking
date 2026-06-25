import { UserMinusIcon } from "@heroicons/react/24/outline";

import { AnyProfessionalCard } from "@/components/booking/any-professional-card";
import { ProfessionalSelectCard } from "@/components/booking/professional-select-card";
import {
  canPerformServices,
  sortProfessionalsForDisplay,
} from "@/lib/professional-utils";
import type { Professional, ProfessionalSelection, Service } from "@/types/booking";

interface ProfessionalStepProps {
  professionals: Professional[];
  selectedServices: Service[];
  selectedProfessionalId: ProfessionalSelection | null;
  availableCount: number;
  onSelectProfessional: (professionalId: ProfessionalSelection) => void;
}

export function ProfessionalStep({
  professionals,
  selectedServices,
  selectedProfessionalId,
  availableCount,
  onSelectProfessional,
}: ProfessionalStepProps) {
  const sorted = sortProfessionalsForDisplay(
    professionals,
    selectedServices.map((s) => s.id),
  );

  if (professionals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <UserMinusIcon className="size-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No team members at this location
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          There are no bookable professionals at your selected branch right now.
          Try another location or contact the salon.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2"
      role="listbox"
      aria-label="Select a professional"
    >
      <div role="option" aria-selected={selectedProfessionalId === "any"}>
        <AnyProfessionalCard
          selected={selectedProfessionalId === "any"}
          availableCount={availableCount}
          disabled={availableCount === 0}
          onSelect={() => onSelectProfessional("any")}
        />
      </div>

      {sorted.map((professional) => {
        const canPerform = canPerformServices(
          professional,
          selectedServices.map((s) => s.id),
        );

        return (
          <div
            key={professional.id}
            role="option"
            aria-selected={selectedProfessionalId === professional.id}
            aria-disabled={!canPerform}
          >
            <ProfessionalSelectCard
              professional={professional}
              selected={selectedProfessionalId === professional.id}
              disabled={!canPerform}
              onSelect={onSelectProfessional}
            />
          </div>
        );
      })}
    </div>
  );
}
