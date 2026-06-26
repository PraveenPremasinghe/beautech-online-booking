"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { SummaryStep } from "@/components/booking/steps/summary-step";
import { confirmBooking } from "@/lib/api/bookings";
import { loginWithGoogle } from "@/lib/booking-auth";
import { saveBookingDraft } from "@/lib/booking-state";
import { BOOKING_ROUTES } from "@/lib/constants";
import { getTenantCancellationPolicy } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import {
  getBookingStepRoute,
  getPrevStepRoute,
} from "@/features/booking/routes";
import {
  selectDraft,
  selectSelectedBranch,
  selectSelectedProfessional,
  selectSelectedServices,
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

  const salon = useBookingStore((s) => s.salon);
  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const professionalId = useBookingStore((s) => s.professionalId);
  const date = useBookingStore((s) => s.date);
  const timeSlotId = useBookingStore((s) => s.timeSlotId);
  const clientDetails = useBookingStore((s) => s.clientDetails);
  const customerId = useBookingStore((s) => s.customerId);
  const selectedTimeSlot = useBookingStore((s) => s.selectedTimeSlot);
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
    const state = useBookingStore.getState();
    const validation = validateBookingStep(
      "summary",
      selectValidationState(state),
    );
    if (!validation.valid) {
      if (!state.customerId) {
        saveBookingDraft({ returnTo: "summary", tenant: getClientId() ?? undefined });
        try {
          await loginWithGoogle(getClientId() ?? undefined);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Sign in required");
        }
        return;
      }
      toast.error(validation.errors[0] ?? "Complete all booking steps first");
      return;
    }

    const draft = selectDraft(state);
    const branch = selectSelectedBranch(state);
    const services = selectSelectedServices(state);
    const professional = selectSelectedProfessional(state);
    const slot = state.selectedTimeSlot;

    if (
      !draft ||
      !summary ||
      !salon ||
      !branch ||
      !clientDetails ||
      !professional ||
      !slot ||
      !customerId
    ) {
      toast.error("Unable to confirm booking. Please try again.");
      return;
    }

    setIsConfirming(true);

    try {
      const clientId = getClientId() ?? "demo";
      const confirmation = await confirmBooking({
        draft,
        summary,
        branch,
        services,
        professional,
        startTime: slot.startTime,
        customerId,
        clientDetails,
        cancellationPolicy: getTenantCancellationPolicy(clientId),
      });

      setConfirmation(confirmation);
      router.push(BOOKING_ROUTES.confirmed(salonSlug, confirmation.appointmentId));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setIsConfirming(false);
    }
  }

  if (
    !salon ||
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

  const clientId = getClientId() ?? "demo";

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
          name: salon.name,
          tagline: salon.tagline,
        }}
        summary={summary}
        clientDetails={clientDetails}
        cancellationPolicy={getTenantCancellationPolicy(clientId)}
        salonSlug={salonSlug}
      />
    </BookingShell>
  );
}
