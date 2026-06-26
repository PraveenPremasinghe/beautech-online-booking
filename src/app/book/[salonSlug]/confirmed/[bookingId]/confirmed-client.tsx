"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BookingConfirmedView } from "@/components/booking/booking-confirmed-view";
import { BookingConfirmedSkeleton } from "@/components/booking/booking-skeletons";
import { Container } from "@/components/layout/container";
import { getBookingConfirmation } from "@/lib/api/bookings";
import { getTenantCancellationPolicy } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import { BOOKING_ROUTES } from "@/lib/constants";
import { useBookingStore } from "@/store";

interface ConfirmedClientProps {
  salonSlug: string;
  bookingId: string;
}


export function ConfirmedClient({ salonSlug, bookingId }: ConfirmedClientProps) {
  const router = useRouter();

  const storeConfirmation = useBookingStore((s) => {
    if (
      s.confirmation?.appointmentId === bookingId &&
      s.confirmation.summary.salon.slug === salonSlug
    ) {
      return s.confirmation;
    }
    return null;
  });

  const { data: fetchedConfirmation, isLoading } = useQuery({
    queryKey: ["booking-confirmation", salonSlug, bookingId, getClientId()],
    queryFn: () =>
      getBookingConfirmation(
        getClientId() ?? "demo",
        bookingId,
        getTenantCancellationPolicy(getClientId() ?? "demo"),
      ),
    enabled: !storeConfirmation,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const confirmation = storeConfirmation ?? fetchedConfirmation ?? null;

  useEffect(() => {
    if (storeConfirmation || isLoading) return;
    if (!fetchedConfirmation) {
      router.replace(BOOKING_ROUTES.salon(salonSlug));
    }
  }, [storeConfirmation, fetchedConfirmation, isLoading, salonSlug, router]);

  if (!storeConfirmation && isLoading) {
    return (
      <Container as="div" className="px-4">
        <BookingConfirmedSkeleton />
      </Container>
    );
  }

  if (!confirmation) {
    return (
      <Container as="div" className="px-4">
        <BookingConfirmedSkeleton />
      </Container>
    );
  }

  return (
    <Container as="div" className="px-4">
      <BookingConfirmedView confirmation={confirmation} salonSlug={salonSlug} />
    </Container>
  );
}
