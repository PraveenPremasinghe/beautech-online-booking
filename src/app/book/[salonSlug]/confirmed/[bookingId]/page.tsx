import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConfirmedClient } from "@/app/book/[salonSlug]/confirmed/[bookingId]/confirmed-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface ConfirmedPageProps {
  params: Promise<{ salonSlug: string; bookingId: string }>;
}

export async function generateMetadata({
  params,
}: ConfirmedPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Booking confirmed" };

  return {
    title: `Booking confirmed · ${profile.salon.name}`,
    description: `Your appointment at ${profile.salon.name} is confirmed.`,
  };
}

export default async function ConfirmedPage({ params }: ConfirmedPageProps) {
  const { salonSlug, bookingId } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ConfirmedClient salonSlug={salonSlug} bookingId={bookingId} />
    </Suspense>
  );
}
