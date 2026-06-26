import { Suspense } from "react";
import type { Metadata } from "next";

import { ServicesStepClient } from "@/app/book/[salonSlug]/services/services-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface ServicesPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Select services",
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ServicesStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
