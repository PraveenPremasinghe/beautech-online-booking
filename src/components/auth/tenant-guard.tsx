"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BookingRouteSkeleton } from "@/components/booking/booking-route-skeleton";
import { BOOKING_ROUTES } from "@/lib/constants";
import { getClientId, initClientIdFromSearchParams } from "@/lib/tenant";

export function TenantGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = getClientId();

  useEffect(() => {
    initClientIdFromSearchParams(searchParams);
  }, [searchParams]);

  useEffect(() => {
    if (!getClientId() && !searchParams.get("client")) {
      router.replace(BOOKING_ROUTES.home());
    }
  }, [searchParams, router]);

  if (!clientId && !searchParams.get("client")) {
    return <BookingRouteSkeleton />;
  }

  return <>{children}</>;
}
