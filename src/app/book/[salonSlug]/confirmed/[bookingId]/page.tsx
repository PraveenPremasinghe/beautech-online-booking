import { Suspense } from "react";
import type { Metadata } from "next";

import { ConfirmedClient } from "@/app/book/[salonSlug]/confirmed/[bookingId]/confirmed-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface ConfirmedPageProps {
  params: Promise<{ salonSlug: string; bookingId: string }>;
}

export const metadata: Metadata = {
  title: "Booking confirmed",
};

export default async function ConfirmedPage({ params }: ConfirmedPageProps) {
  const { salonSlug, bookingId } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ConfirmedClient salonSlug={salonSlug} bookingId={bookingId} />
    </Suspense>
  );
}
