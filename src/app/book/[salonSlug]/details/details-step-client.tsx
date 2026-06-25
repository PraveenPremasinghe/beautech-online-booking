"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import {
  CLIENT_DETAILS_FORM_ID,
  DetailsStep,
} from "@/components/booking/steps/details-step";
import {
  getBookingStepRoute,
  getNextStepRoute,
  getPrevStepRoute,
} from "@/features/booking/routes";
import {
  toClientDetails,
  type ClientDetailsFormValues,
} from "@/lib/validations/client-details";
import {
  useBookingNavigation,
  useBookingStore,
  useBookingSummary,
} from "@/store";

interface DetailsStepClientProps {
  salonSlug: string;
}

export function DetailsStepClient({ salonSlug }: DetailsStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();
  const [isFormValid, setIsFormValid] = useState(false);

  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const professionalId = useBookingStore((s) => s.professionalId);
  const date = useBookingStore((s) => s.date);
  const timeSlotId = useBookingStore((s) => s.timeSlotId);
  const clientDetails = useBookingStore((s) => s.clientDetails);
  const setClientDetails = useBookingStore((s) => s.setClientDetails);

  const { validateCurrentStep } = useBookingNavigation();

  const handleValidChange = useCallback((valid: boolean) => {
    setIsFormValid(valid);
  }, []);

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
    }
  }, [
    branchId,
    serviceIds.length,
    professionalId,
    date,
    timeSlotId,
    salonSlug,
    router,
  ]);

  function handleFormSubmit(values: ClientDetailsFormValues) {
    setClientDetails(toClientDetails(values));

    const result = validateCurrentStep();
    if (!result.valid) {
      toast.error(result.errors[0] ?? "Complete your contact details");
      return;
    }

    const nextRoute = getNextStepRoute("details", salonSlug);
    if (nextRoute) router.push(nextRoute);
  }

  function handleBack() {
    const prevRoute = getPrevStepRoute("details", salonSlug);
    if (prevRoute) router.push(prevRoute);
  }

  function handleContinue() {
    const form = document.getElementById(CLIENT_DETAILS_FORM_ID) as
      | HTMLFormElement
      | null;
    form?.requestSubmit();
  }

  if (!branchId || serviceIds.length === 0 || !professionalId || !date || !timeSlotId) {
    return <BookingRouteSkeleton />;
  }

  return (
    <BookingShell
      currentStep="details"
      stepTitle="Your details"
      summary={summary}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!isFormValid}
    >
      <DetailsStep
        defaultValues={clientDetails}
        onSubmit={handleFormSubmit}
        onValidChange={handleValidChange}
      />
    </BookingShell>
  );
}
