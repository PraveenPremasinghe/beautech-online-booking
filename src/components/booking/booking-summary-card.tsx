import { format, parse } from "date-fns";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/format";
import { bookingLayout } from "@/lib/booking-ui";
import {
  dsSummaryLabel,
  dsSummaryRow,
  dsSummaryTotal,
  dsSummaryTotalPrice,
  dsSummaryValue,
} from "@/lib/design-system/patterns";
import { cn } from "@/lib/utils";
import type { BookingSummary } from "@/types/booking";

function formatSummaryDate(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEE, MMM d");
}

function formatSummaryTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
}

export interface BookingSummaryContentProps {
  summary: BookingSummary | null;
  className?: string;
}

function SummaryMeta({ summary }: { summary: BookingSummary }) {
  return (
    <dl className="space-y-2.5 text-sm">
      {summary.branch ? (
        <div className="flex gap-2.5">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="sr-only">Branch</dt>
            <dd className="font-medium text-foreground">{summary.branch.name}</dd>
          </div>
        </div>
      ) : null}
      {summary.anyProfessional ? (
        <div className="flex gap-2.5">
          <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="sr-only">Professional</dt>
            <dd className="font-medium text-foreground">Any professional</dd>
            <dd className="text-xs text-muted-foreground">
              First available specialist
            </dd>
          </div>
        </div>
      ) : summary.professional ? (
        <div className="flex gap-2.5">
          <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="sr-only">Professional</dt>
            <dd className="font-medium text-foreground">
              {summary.professional.displayName}
            </dd>
            <dd className="text-xs text-muted-foreground">
              {summary.professional.title}
            </dd>
          </div>
        </div>
      ) : null}
      {summary.date && summary.startTime ? (
        <div className="flex gap-2.5">
          <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <dt className="sr-only">Date and time</dt>
            <dd className="font-medium text-foreground">
              {formatSummaryDate(summary.date)}
            </dd>
            <dd className="flex items-center gap-1 text-xs text-muted-foreground">
              <ClockIcon className="size-3" aria-hidden />
              {formatSummaryTime(summary.startTime)}
              {summary.endTime ? ` – ${formatSummaryTime(summary.endTime)}` : null}
            </dd>
          </div>
        </div>
      ) : null}
    </dl>
  );
}

export function BookingSummaryContent({
  summary,
  className,
}: BookingSummaryContentProps) {
  const hasLineItems = Boolean(summary && summary.lineItems.length > 0);
  const hasMeta = Boolean(
    summary?.branch || summary?.professional || summary?.anyProfessional || summary?.date,
  );

  if (!summary || (!hasLineItems && !hasMeta)) {
    return (
      <div className={cn("space-y-2 py-2 text-center", className)}>
        <p className="text-sm font-medium text-foreground">No services yet</p>
        <p className="text-xs text-muted-foreground">
          Select a branch and services to see your booking summary.
        </p>
      </div>
    );
  }

  if (!hasLineItems && hasMeta) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-sm text-muted-foreground">
          Add services to see pricing. Your selections so far:
        </p>
        <SummaryMeta summary={summary} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        {summary.lineItems.map((item) => (
          <div key={item.serviceId} className={dsSummaryRow()}>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{item.name}</p>
              <p className={dsSummaryLabel()}>{formatDuration(item.durationMinutes)}</p>
            </div>
            <span className={dsSummaryValue()}>
              {formatCurrency(item.price, summary.currency)}
            </span>
          </div>
        ))}
      </div>

      {(summary.branch || summary.professional || summary.anyProfessional || summary.date) && (
        <>
          <Separator className="bg-border/70" />
          <SummaryMeta summary={summary} />
        </>
      )}

      <Separator className="bg-border/70" />

      <div className="space-y-2 text-sm">
        <div className={dsSummaryRow()}>
          <span className={dsSummaryLabel()}>Duration</span>
          <span className={dsSummaryValue()}>
            {formatDuration(summary.totalDurationMinutes)}
          </span>
        </div>
        {summary.tax > 0 ? (
          <div className={dsSummaryRow()}>
            <span className={dsSummaryLabel()}>Tax</span>
            <span className={dsSummaryValue()}>
              {formatCurrency(summary.tax, summary.currency)}
            </span>
          </div>
        ) : null}
      </div>

      <div className={dsSummaryTotal()}>
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className={dsSummaryTotalPrice()}>
          {formatCurrency(summary.total, summary.currency)}
        </span>
      </div>
    </div>
  );
}

interface BookingSummaryCardProps {
  summary: BookingSummary | null;
  salonName?: string;
  className?: string;
}

export function BookingSummaryCard({
  summary,
  salonName,
  className,
}: BookingSummaryCardProps) {
  return (
    <Card
      className={cn(
        bookingLayout.stickySummary,
        "gap-0 overflow-hidden rounded-xl border-border/70 py-0 shadow-md",
        className,
      )}
    >
      <CardHeader className="border-b border-border/70 bg-muted/20 px-5 py-4">
        <CardTitle className="text-base font-semibold">Booking summary</CardTitle>
        <CardDescription>
          {salonName ?? summary?.salon.name ?? "Your appointment"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <BookingSummaryContent summary={summary} />
      </CardContent>
    </Card>
  );
}
