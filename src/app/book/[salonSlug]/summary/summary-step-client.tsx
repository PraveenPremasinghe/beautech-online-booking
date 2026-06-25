"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { SummaryStep } from "@/components/booking/steps/summary-step";
import { confirmBooking } from "@/lib/api/bookings";
import { BOOKING_ROUTES } from "@/lib/constants";
import {
  getBookingStepRoute,
  getPrevStepRoute,
} from "@/features/booking/routes";
import {
  selectDraft,
  selectValidationState,
  useBookingStore,
  useBookingSummary,
} from "@/store";
import { validateBookingStep } from "@/store/booking-validation";

interface SummaryStepClientProps {
  salonSlug: string;
}

export function SummaryStepClient({ salonSlug }: SummaryStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();
  const [isConfirming, setIsConfirming] = useState(false);

  const catalog = useBookingStore((s) => s.catalog);
  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const professionalId = useBookingStore((s) => s.professionalId);
  const date = useBookingStore((s) => s.date);
  const timeSlotId = useBookingStore((s) => s.timeSlotId);
  const clientDetails = useBookingStore((s) => s.clientDetails);
  const setConfirmation = useBookingStore((s) => s.setConfirmation);

  useEffect(() => {
    if (!branchId) {
      router.replace(getBookingStepRoute("branch", salonSlug));
      return;
    }
    if (serviceIds.length === 0) {
      router.replace(getBookingStepRoute("services", salonSlug));
      return;
    }
    if (!professionalId) {
      router.replace(getBookingStepRoute("professional", salonSlug));
      return;
    }
    if (!date || !timeSlotId) {
      router.replace(getBookingStepRoute("datetime", salonSlug));
      return;
    }
    if (!clientDetails) {
      router.replace(getBookingStepRoute("details", salonSlug));
    }
  }, [
    branchId,
    serviceIds.length,
    professionalId,
    date,
    timeSlotId,
    clientDetails,
    salonSlug,
    router,
  ]);

  function handleBack() {
    const prevRoute = getPrevStepRoute("summary", salonSlug);
    if (prevRoute) router.push(prevRoute);
  }

  async function handleConfirm() {
    const validation = validateBookingStep(
      "summary",
      selectValidationState(useBookingStore.getState()),
    );
    if (!validation.valid) {
      toast.error(validation.errors[0] ?? "Complete all booking steps first");
      return;
    }

    const draft = selectDraft(useBookingStore.getState());
    if (!draft || !summary || !catalog || !clientDetails) {
      toast.error("Unable to confirm booking. Please try again.");
      return;
    }

    setIsConfirming(true);

    try {
      const confirmation = await confirmBooking({
        draft,
        summary,
        cancellationPolicy: catalog.salon.cancellationPolicy,
      });

      setConfirmation(confirmation);
      router.push(BOOKING_ROUTES.confirmed(salonSlug, confirmation.appointmentId));
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsConfirming(false);
    }
  }

  if (
    !catalog ||
    !branchId ||
    serviceIds.length === 0 ||
    !professionalId ||
    !date ||
    !timeSlotId ||
    !clientDetails ||
    !summary
  ) {
    return <BookingRouteSkeleton />;
  }

  return (
    <BookingShell
      currentStep="summary"
      stepTitle="Review & confirm"
      summary={summary}
      onBack={handleBack}
      onContinue={handleConfirm}
      continueLabel={isConfirming ? "Confirming…" : "Confirm booking"}
      continueDisabled={isConfirming}
      isLoading={isConfirming}
    >
      <SummaryStep
        salon={{
          name: catalog.salon.name,
          tagline: catalog.salon.tagline,
        }}
        summary={summary}
        clientDetails={clientDetails}
        cancellationPolicy={catalog.salon.cancellationPolicy}
        salonSlug={salonSlug}
      />
    </BookingShell>
  );
}
