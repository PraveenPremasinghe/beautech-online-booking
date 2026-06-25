import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicesStepClient } from "@/app/book/[salonSlug]/services/services-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface ServicesPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Select services · ${profile.salon.name}`,
    description: `Choose services at ${profile.salon.name}.`,
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ServicesStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
