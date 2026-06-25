import { ChevronDownIcon } from "@heroicons/react/24/outline";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatHoursRange } from "@/lib/salon-utils";
import { cn } from "@/lib/utils";
import type { OpeningHoursDay } from "@/types/salon-profile";

interface SalonOpeningHoursProps {
  hours: OpeningHoursDay[];
  className?: string;
}

export function SalonOpeningHours({ hours, className }: SalonOpeningHoursProps) {
  const todayIndex = new Date().getDay();

  return (
    <Card className={cn("rounded-xl border-border/70 py-0 shadow-sm", className)}>
      <CardHeader className="border-b border-border/70 bg-muted/20 px-5 py-4">
        <CardTitle className="text-base font-semibold">Opening hours</CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <ul className="space-y-2">
          {hours.map((day) => {
            const isToday = day.dayOfWeek === todayIndex;
            return (
              <li
                key={day.label}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                  isToday && "bg-primary/5 font-medium",
                )}
              >
                <span className={isToday ? "text-primary" : "text-foreground"}>
                  {day.label}
                  {isToday ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      Today
                    </span>
                  ) : null}
                </span>
                <span className="text-muted-foreground">{formatHoursRange(day)}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/** Collapsible variant for mobile — uses native details */
export function SalonOpeningHoursCollapsible({
  hours,
  className,
}: SalonOpeningHoursProps) {
  const todayIndex = new Date().getDay();
  const today = hours.find((d) => d.dayOfWeek === todayIndex);

  return (
    <details
      className={cn(
        "group rounded-xl border border-border/70 bg-card shadow-sm lg:hidden",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="text-sm font-semibold text-foreground">Opening hours</p>
          {today ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Today: {formatHoursRange(today)}
            </p>
          ) : null}
        </div>
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/70 px-5 py-4">
        <ul className="space-y-2">
          {hours.map((day) => (
            <li
              key={day.label}
              className="flex justify-between text-sm"
            >
              <span>{day.label}</span>
              <span className="text-muted-foreground">{formatHoursRange(day)}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
