import { Suspense } from "react";
import type { Metadata } from "next";

import { DetailsStepClient } from "@/app/book/[salonSlug]/details/details-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface DetailsPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Sign in to book",
};

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <DetailsStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
