import { Button } from "@/components/ui/button";
import {
  formatSlotTime,
  getTimeOfDayLabel,
  type TimeOfDayGroup,
} from "@/lib/time-slot-utils";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/types/booking";

interface TimeSlotGroupProps {
  group: TimeOfDayGroup;
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export function TimeSlotGroup({
  group,
  slots,
  selectedSlotId,
  onSelectSlot,
}: TimeSlotGroupProps) {
  if (slots.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        {getTimeOfDayLabel(group)}
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const selected = selectedSlotId === slot.id;

          return (
            <Button
              key={slot.id}
              type="button"
              variant={selected ? "default" : "outline"}
              aria-pressed={selected}
              onClick={() => onSelectSlot(slot.id)}
              className={cn(
                "h-10 rounded-xl px-2 text-sm font-medium",
                !selected && "border-border/70 bg-card",
              )}
            >
              {formatSlotTime(slot.startTime)}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
