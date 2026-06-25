"use client";

import Link from "next/link";
import { format, parse } from "date-fns";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { StatusBadge } from "@/components/design-system/status-badge";
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
import {
  dsSummaryLabel,
  dsSummaryRow,
  dsSummaryValue,
} from "@/lib/design-system/patterns";
import { formatBranchAddress } from "@/lib/salon-utils";
import type { AppointmentConfirmation } from "@/types/booking";

function formatSummaryDate(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");
}

function formatSummaryTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
}

function showComingSoon(feature: string) {
  toast.message(`${feature} coming soon`, {
    description: "This feature will be available in a future update.",
  });
}

interface BookingConfirmedViewProps {
  confirmation: AppointmentConfirmation;
  salonSlug: string;
}

export function BookingConfirmedView({
  confirmation,
  salonSlug,
}: BookingConfirmedViewProps) {
  const { summary } = confirmation;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-8 sm:py-12">
      {/* Success header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckCircleIcon className="size-9" aria-hidden />
        </span>
        <div className="space-y-2">
          <StatusBadge status="confirmed" className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Booking confirmed
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Your appointment at {summary.salon.name} is booked. We&apos;ve sent
            your confirmation details.
          </p>
        </div>
      </div>

      {/* Booking reference */}
      <Card className="gap-0 overflow-hidden rounded-xl border-primary/20 py-0 shadow-md">
        <CardHeader className="border-b border-border/70 bg-primary/5 px-5 py-4 text-center sm:text-left">
          <CardDescription>Booking reference</CardDescription>
          <CardTitle className="font-mono text-2xl tracking-widest text-primary">
            {confirmation.confirmationCode}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            ID: {confirmation.appointmentId}
          </p>
        </CardHeader>
      </Card>

      {/* Appointment details */}
      <Card className="gap-0 overflow-hidden rounded-xl border-border/70 py-0 shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/20 px-5 py-4">
          <CardTitle className="text-base font-semibold">Appointment details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-5 py-5 text-sm">
          {summary.date && summary.startTime ? (
            <div className="flex gap-3">
              <CalendarDaysIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div>
                <p className="font-medium text-foreground">
                  {formatSummaryDate(summary.date)}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-muted-foreground">
                  <ClockIcon className="size-3.5" aria-hidden />
                  {formatSummaryTime(summary.startTime)}
                  {summary.endTime
                    ? ` – ${formatSummaryTime(summary.endTime)}`
                    : null}
                  <span className="text-border">·</span>
                  {formatDuration(summary.totalDurationMinutes)}
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <SparklesIcon className="size-3.5" aria-hidden />
              Services
            </p>
            <ul className="space-y-2">
              {summary.lineItems.map((item) => (
                <li key={item.serviceId} className={dsSummaryRow()}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className={dsSummaryLabel()}>
                      {formatDuration(item.durationMinutes)}
                    </p>
                  </div>
                  <span className={dsSummaryValue()}>
                    {formatCurrency(item.price, summary.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {summary.branch ? (
            <div className="flex gap-3">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div>
                <p className="font-medium text-foreground">{summary.branch.name}</p>
                <p className="mt-0.5 text-muted-foreground">
                  {formatBranchAddress(summary.branch.address)}
                </p>
                {summary.branch.phone ? (
                  <p className="mt-1 text-muted-foreground">{summary.branch.phone}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3">
            <UserIcon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <div>
              {summary.anyProfessional ? (
                <>
                  <p className="font-medium text-foreground">Any professional</p>
                  <p className="text-muted-foreground">First available specialist</p>
                </>
              ) : summary.professional ? (
                <>
                  <p className="font-medium text-foreground">
                    {summary.professional.displayName}
                  </p>
                  <p className="text-muted-foreground">{summary.professional.title}</p>
                </>
              ) : (
                <p className="text-muted-foreground">Professional to be assigned</p>
              )}
            </div>
          </div>

          <Separator className="bg-border/70" />

          <div className={dsSummaryRow()}>
            <span className="font-medium text-foreground">Total</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(summary.total, summary.currency)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={() => showComingSoon("Add to calendar")}
        >
          <CalendarDaysIcon className="size-4" aria-hidden />
          Add to calendar
        </Button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => showComingSoon("Reschedule")}
          >
            Reschedule
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl text-destructive hover:text-destructive"
            onClick={() => showComingSoon("Cancel appointment")}
          >
            <XCircleIcon className="size-4" aria-hidden />
            Cancel appointment
          </Button>
        </div>

        <Button
          render={<Link href={BOOKING_ROUTES.salon(salonSlug)} />}
          nativeButton={false}
          className="h-11 w-full rounded-xl"
        >
          Back to salon
        </Button>
      </div>
    </div>
  );
}
