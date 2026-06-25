import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConfirmationRedirectClient } from "@/app/book/[salonSlug]/confirmation/confirmation-redirect-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface ConfirmationPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: ConfirmationPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Booking confirmed" };

  return {
    title: `Booking confirmed · ${profile.salon.name}`,
    description: `Your appointment at ${profile.salon.name} is confirmed.`,
  };
}

/** Legacy route — redirects to /confirmed/[bookingId] */
export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ConfirmationRedirectClient salonSlug={salonSlug} />
    </Suspense>
  );
}
