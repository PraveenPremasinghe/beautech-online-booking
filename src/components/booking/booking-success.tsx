"use client";

import Link from "next/link";
import { format, parse } from "date-fns";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BOOKING_ROUTES } from "@/lib/constants";
import { formatCurrency, formatDuration } from "@/lib/format";
import { formatBranchAddress } from "@/lib/salon-utils";
import type { AppointmentConfirmation } from "@/types/booking";

function formatSummaryDate(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEE, MMM d, yyyy");
}

function formatSummaryTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
}

interface BookingSuccessProps {
  confirmation: AppointmentConfirmation;
  salonSlug: string;
  onBookAnother: () => void;
}

export function BookingSuccess({
  confirmation,
  salonSlug,
  onBookAnother,
}: BookingSuccessProps) {
  const { summary } = confirmation;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-8 text-center sm:py-12">
      <span className="flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
        <CheckCircleIcon className="size-9" aria-hidden />
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Booking confirmed
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Your appointment at {summary.salon.name} is confirmed. Save your
          confirmation code below.
        </p>
      </div>

      <Card className="w-full gap-0 overflow-hidden rounded-xl border-primary/20 py-0 shadow-md">
        <CardHeader className="border-b border-border/70 bg-primary/5 px-5 py-4">
          <CardDescription>Confirmation code</CardDescription>
          <CardTitle className="font-mono text-2xl tracking-widest text-primary">
            {confirmation.confirmationCode}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5 text-left text-sm">
          {summary.branch ? (
            <div className="flex gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-medium text-foreground">{summary.branch.name}</p>
                <p className="text-muted-foreground">
                  {formatBranchAddress(summary.branch.address)}
                </p>
              </div>
            </div>
          ) : null}

          {summary.date && summary.startTime ? (
            <div className="flex gap-2.5">
              <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <p className="font-medium text-foreground">
                  {formatSummaryDate(summary.date)}
                </p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <ClockIcon className="size-3.5" aria-hidden />
                  {formatSummaryTime(summary.startTime)}
                  {summary.endTime
                    ? ` – ${formatSummaryTime(summary.endTime)}`
                    : null}
                  {" · "}
                  {formatDuration(summary.totalDurationMinutes)}
                </p>
              </div>
            </div>
          ) : null}

          <Separator className="bg-border/70" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Total paid</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(summary.total, summary.currency)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          render={<Link href={BOOKING_ROUTES.salon(salonSlug)} />}
          nativeButton={false}
          variant="outline"
          className="h-11 w-full rounded-xl sm:w-auto"
        >
          Back to salon
        </Button>
        <Button
          type="button"
          className="h-11 w-full rounded-xl sm:w-auto"
          onClick={onBookAnother}
        >
          Book another appointment
        </Button>
      </div>
    </div>
  );
}
