import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SummaryStepClient } from "@/app/book/[salonSlug]/summary/summary-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface SummaryPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: SummaryPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Confirm booking · ${profile.salon.name}`,
    description: `Review and confirm your appointment at ${profile.salon.name}.`,
  };
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <SummaryStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
