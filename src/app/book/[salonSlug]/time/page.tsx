import { Suspense } from "react";
import type { Metadata } from "next";

import { TimeStepClient } from "@/app/book/[salonSlug]/time/time-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface TimePageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Select date & time",
};

export default async function TimePage({ params }: TimePageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <TimeStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
