import { Suspense } from "react";
import type { Metadata } from "next";

import { ProfessionalStepClient } from "@/app/book/[salonSlug]/professional/professional-step-client";
import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";

interface ProfessionalPageProps {
  params: Promise<{ salonSlug: string }>;
}

export const metadata: Metadata = {
  title: "Select professional",
};

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { salonSlug } = await params;

  return (
    <Suspense fallback={<BookingRouteSkeleton />}>
      <ProfessionalStepClient salonSlug={salonSlug} />
    </Suspense>
  );
}
