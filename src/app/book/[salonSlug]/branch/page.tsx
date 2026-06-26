import { Suspense } from "react";
import type { Metadata } from "next";

import { BranchStepClient } from "@/app/book/[salonSlug]/branch/branch-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface BranchPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Select branch",
  description: "Choose a location for your appointment.",
};

export default async function BranchPage({ params }: BranchPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <BranchStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
