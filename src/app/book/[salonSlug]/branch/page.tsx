import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BranchStepClient } from "@/app/book/[salonSlug]/branch/branch-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { getSalonProfile } from "@/lib/api/salons";

interface BranchPageProps {
  params: Promise<{ salonSlug: string }>;
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) return { title: "Book appointment" };

  return {
    title: `Select branch · ${profile.salon.name}`,
    description: `Choose a ${profile.salon.name} location for your appointment.`,
  };
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { salonSlug } = await params;
  const profile = await getSalonProfile(salonSlug);
  if (!profile) notFound();

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <BranchStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
