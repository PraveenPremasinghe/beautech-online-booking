import { SalonOpeningHours } from "@/components/salon/salon-opening-hours";
import type { OpeningHoursDay } from "@/types/salon-profile";

interface SalonOpeningHoursSectionProps {
  hours: OpeningHoursDay[];
}

export function SalonOpeningHoursSection({ hours }: SalonOpeningHoursSectionProps) {
  return (
    <section id="hours" className="scroll-mt-20 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Opening times
        </h2>
        <p className="text-sm text-muted-foreground">
          When you can visit us
        </p>
      </div>
      <SalonOpeningHours hours={hours} className="max-w-md" />
    </section>
  );
}
