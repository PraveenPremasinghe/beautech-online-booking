"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getBookingCatalogBySlug } from "@/lib/mock-booking-data";
import type { BookingStep } from "@/types/booking";
import { parseInitOptionsFromSearchParams, useBookingStore } from "@/store";

const SEGMENT_TO_STEP: Record<string, BookingStep> = {
  branch: "branch",
  services: "services",
  professional: "professional",
  time: "datetime",
  datetime: "datetime",
  details: "details",
  summary: "summary",
};

interface BookingInitProps {
  salonSlug: string;
}

export function BookingInit({ salonSlug }: BookingInitProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const segment = pathname.split("/").pop() ?? "branch";
  const step = SEGMENT_TO_STEP[segment] ?? "branch";

  useEffect(() => {
    const catalog = getBookingCatalogBySlug(salonSlug);
    if (!catalog) return;

    const options = parseInitOptionsFromSearchParams(
      new URLSearchParams(searchParamsKey),
    );

    const state = useBookingStore.getState();

    if (!state.catalog || state.salonSlug !== salonSlug) {
      state.initBooking(salonSlug, catalog, { ...options, step });
      return;
    }

    if (state.currentStep !== step) {
      state.setStep(step);
    }
  }, [salonSlug, step, searchParamsKey]);

  return null;
}
