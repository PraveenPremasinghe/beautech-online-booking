import { format, parse } from "date-fns";
import {
  CalendarDaysIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { SummarySection } from "@/components/booking/summary-section";
import { Separator } from "@/components/ui/separator";
import { getBookingStepRoute } from "@/features/booking/routes";
import { formatClientName } from "@/lib/booking-utils";
import { formatCurrency, formatDuration } from "@/lib/format";
import {
  dsSummaryLabel,
  dsSummaryRow,
  dsSummaryTotal,
  dsSummaryTotalPrice,
  dsSummaryValue,
} from "@/lib/design-system/patterns";
import { formatBranchAddress } from "@/lib/salon-utils";
import type { BookingSummary, ClientDetails, Salon } from "@/types/booking";

function formatSummaryDate(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");
}

function formatSummaryTime(time: string): string {
  return format(parse(time, "HH:mm", new Date()), "h:mm a");
}

interface SummaryStepProps {
  salon: Pick<Salon, "name" | "tagline">;
  summary: BookingSummary;
  clientDetails: ClientDetails;
  cancellationPolicy: string;
  salonSlug: string;
}

export function SummaryStep({
  salon,
  summary,
  clientDetails,
  cancellationPolicy,
  salonSlug,
}: SummaryStepProps) {
  const branchRoute = getBookingStepRoute("branch", salonSlug);
  const servicesRoute = getBookingStepRoute("services", salonSlug);
  const professionalRoute = getBookingStepRoute("professional", salonSlug);
  const timeRoute = getBookingStepRoute("datetime", salonSlug);
  const detailsRoute = getBookingStepRoute("details", salonSlug);

  return (
    <div className="space-y-4">
      <SummarySection title="Salon">
        <p className="font-medium">{salon.name}</p>
        {salon.tagline ? (
          <p className="mt-1 text-muted-foreground">{salon.tagline}</p>
        ) : null}
      </SummarySection>

      <SummarySection title=" Branch" editHref={branchRoute}>
        {summary.branch ? (
          <div className="space-y-2">
            <p className="font-medium">{summary.branch.name}</p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              {formatBranchAddress(summary.branch.address)}
            </p>
            {summary.branch.phone ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="size-4 shrink-0" aria-hidden />
                {summary.branch.phone}
              </p>
            ) : null}
          </div>
        ) : null}
      </SummarySection>

      <SummarySection title="Services" editHref={servicesRoute}>
        <ul className="space-y-3">
          {summary.lineItems.map((item) => (
            <li key={item.serviceId} className={dsSummaryRow()}>
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <SparklesIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className={dsSummaryLabel()}>
                    {formatDuration(item.durationMinutes)}
                  </p>
                </div>
              </div>
              <span className={dsSummaryValue()}>
                {formatCurrency(item.price, summary.currency)}
              </span>
            </li>
          ))}
        </ul>
      </SummarySection>

      <SummarySection title="Professional" editHref={professionalRoute}>
        <div className="flex items-start gap-2">
          <UserIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            {summary.anyProfessional ? (
              <>
                <p className="font-medium">Any professional</p>
                <p className="text-muted-foreground">First available specialist</p>
              </>
            ) : summary.professional ? (
              <>
                <p className="font-medium">{summary.professional.displayName}</p>
                <p className="text-muted-foreground">{summary.professional.title}</p>
              </>
            ) : null}
          </div>
        </div>
      </SummarySection>

      <SummarySection title="Date & time" editHref={timeRoute}>
        {summary.date && summary.startTime ? (
          <div className="space-y-2">
            <p className="flex items-start gap-2 font-medium">
              <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              {formatSummaryDate(summary.date)}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <ClockIcon className="size-4 shrink-0" aria-hidden />
              {formatSummaryTime(summary.startTime)}
              {summary.endTime ? ` – ${formatSummaryTime(summary.endTime)}` : null}
            </p>
          </div>
        ) : null}
      </SummarySection>

      <SummarySection title="Duration">
        <p className="font-medium">{formatDuration(summary.totalDurationMinutes)}</p>
      </SummarySection>

      <SummarySection title="Your details" editHref={detailsRoute}>
        <div className="space-y-2">
          {clientDetails.firstName ? (
            <p className="font-medium">{formatClientName(clientDetails)}</p>
          ) : null}
          <p className="flex items-center gap-2 text-muted-foreground">
            <EnvelopeIcon className="size-4 shrink-0" aria-hidden />
            {clientDetails.email}
          </p>
          {clientDetails.phone ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <PhoneIcon className="size-4 shrink-0" aria-hidden />
              {clientDetails.phone}
            </p>
          ) : null}
          {clientDetails.notes ? (
            <p className="rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground">
              {clientDetails.notes}
            </p>
          ) : null}
        </div>
      </SummarySection>

      <section className="rounded-xl border border-border/70 bg-card px-4 py-4 sm:px-5">
        <div className="space-y-2 text-sm">
          <div className={dsSummaryRow()}>
            <span className={dsSummaryLabel()}>Subtotal</span>
            <span className={dsSummaryValue()}>
              {formatCurrency(summary.subtotal, summary.currency)}
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
      </section>

      <section className="rounded-xl border border-border/70 bg-muted/20 px-4 py-4 sm:px-5">
        <h3 className="text-sm font-semibold text-foreground">Cancellation policy</h3>
        <Separator className="my-3 bg-border/70" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          {cancellationPolicy}
        </p>
      </section>
    </div>
  );
}
