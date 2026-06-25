import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import { DateStrip } from "@/components/booking/date-strip";
import { SlotHoldBanner } from "@/components/booking/slot-hold-banner";
import { TimeSlotGroup } from "@/components/booking/time-slot-group";
import { TimeSlotsSkeleton } from "@/components/booking/time-slots-skeleton";
import {
  groupTimeSlotsByPeriod,
  type DateStripOption,
} from "@/lib/time-slot-utils";
import type { TimeSlot } from "@/types/booking";

interface DatetimeStepProps {
  dates: DateStripOption[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoadingSlots: boolean;
  slotHoldExpiresAt: Date | null;
}

export function DatetimeStep({
  dates,
  selectedDate,
  onSelectDate,
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoadingSlots,
  slotHoldExpiresAt,
}: DatetimeStepProps) {
  const grouped = groupTimeSlotsByPeriod(slots);
  const hasSlots =
    grouped.morning.length > 0 ||
    grouped.afternoon.length > 0 ||
    grouped.evening.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Choose a date</h2>
        <DateStrip
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      </div>

      {selectedDate ? (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Available times</h2>

          {slotHoldExpiresAt && selectedSlotId ? (
            <SlotHoldBanner expiresAt={slotHoldExpiresAt} />
          ) : null}

          {isLoadingSlots ? (
            <TimeSlotsSkeleton />
          ) : !hasSlots ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <CalendarDaysIcon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                No availability
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                There are no open slots on this date. Try another day or adjust
                your services or professional.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <TimeSlotGroup
                group="morning"
                slots={grouped.morning}
                selectedSlotId={selectedSlotId}
                onSelectSlot={onSelectSlot}
              />
              <TimeSlotGroup
                group="afternoon"
                slots={grouped.afternoon}
                selectedSlotId={selectedSlotId}
                onSelectSlot={onSelectSlot}
              />
              <TimeSlotGroup
                group="evening"
                slots={grouped.evening}
                selectedSlotId={selectedSlotId}
                onSelectSlot={onSelectSlot}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select a date to see available appointment times.
        </p>
      )}
    </div>
  );
}
