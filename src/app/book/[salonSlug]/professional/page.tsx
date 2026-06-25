import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfessionalStepClient } from "@/app/book/[salonSlug]/professional/professional-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface ProfessionalPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: ProfessionalPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Select professional · ${profile.salon.name}`,
    description: `Choose a professional at ${profile.salon.name}.`,
  };
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ProfessionalStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
