import { Suspense } from "react";
import type { Metadata } from "next";

import { ConfirmationRedirectClient } from "@/app/book/[salonSlug]/confirmation/confirmation-redirect-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface ConfirmationPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Booking confirmed",
};

/** Legacy route — redirects to /confirmed/[bookingId] */
export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ConfirmationRedirectClient salonSlug={salonSlug} />
    </Suspense>
  );
}
