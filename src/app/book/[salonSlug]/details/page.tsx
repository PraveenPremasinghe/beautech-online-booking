import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailsStepClient } from "@/app/book/[salonSlug]/details/details-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface DetailsPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: DetailsPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Your details · ${profile.salon.name}`,
    description: `Enter your contact details to complete your booking at ${profile.salon.name}.`,
  };
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <DetailsStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
