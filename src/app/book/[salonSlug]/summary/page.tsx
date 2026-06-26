import { Suspense } from "react";
import type { Metadata } from "next";

import { SummaryStepClient } from "@/app/book/[salonSlug]/summary/summary-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface SummaryPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Confirm booking",
};

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <SummaryStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
