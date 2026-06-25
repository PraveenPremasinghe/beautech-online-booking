"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BookingConfirmedSkeleton } from "@/components/booking/booking-skeletons";
import { Container } from "@/components/layout/container";
import { BOOKING_ROUTES } from "@/lib/constants";
import { useBookingStore } from "@/store";

interface ConfirmationRedirectClientProps {
  salonSlug: string;
}

/** Legacy route — redirects to /confirmed/[bookingId] */
export function ConfirmationRedirectClient({
  salonSlug,
}: ConfirmationRedirectClientProps) {
  const router = useRouter();
  const confirmation = useBookingStore((s) => s.confirmation);

  useEffect(() => {
    if (confirmation) {
      router.replace(BOOKING_ROUTES.confirmed(salonSlug, confirmation.appointmentId));
      return;
    }

    router.replace(BOOKING_ROUTES.summary(salonSlug));
  }, [confirmation, salonSlug, router]);

  return (
    <Container as="div" className="px-4">
      <BookingConfirmedSkeleton />
    </Container>
  );
}
