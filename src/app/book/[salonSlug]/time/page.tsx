import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TimeStepClient } from "@/app/book/[salonSlug]/time/time-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface TimePageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: TimePageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Select date & time · ${profile.salon.name}`,
    description: `Choose an appointment time at ${profile.salon.name}.`,
  };
}

export default async function TimePage({ params }: TimePageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <TimeStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
