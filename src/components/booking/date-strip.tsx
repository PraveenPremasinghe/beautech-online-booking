import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DateStripOption } from "@/lib/time-slot-utils";

interface DateStripProps {
  dates: DateStripOption[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DateStrip({ dates, selectedDate, onSelectDate }: DateStripProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div
        className="flex w-max min-w-full gap-2"
        role="listbox"
        aria-label="Select a date"
      >
        {dates.map((option) => {
          const selected = selectedDate === option.date;

          return (
            <Button
              key={option.date}
              type="button"
              variant={selected ? "default" : "outline"}
              role="option"
              aria-selected={selected}
              onClick={() => onSelectDate(option.date)}
              className={cn(
                "h-auto min-w-[4.5rem] shrink-0 flex-col gap-0.5 rounded-xl px-3 py-2.5",
                !selected && "border-border/70 bg-card",
              )}
            >
              <span className="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">
                {option.isToday ? "Today" : option.weekday}
              </span>
              <span className="text-lg font-semibold leading-none">
                {option.dayLabel}
              </span>
              <span className="text-[0.65rem] opacity-80">{option.monthLabel}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
