"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { ProfessionalStep } from "@/components/booking/steps/professional-step";
import {
  getBookingStepRoute,
  getNextStepRoute,
  getPrevStepRoute,
} from "@/features/booking/routes";
import {
  useBookingNavigation,
  useBookingStore,
  useBookingSummary,
} from "@/store";
import {
  selectAvailableProfessionals,
  selectBranchProfessionals,
  selectSelectedServices,
} from "@/store/booking-selectors";

interface ProfessionalStepClientProps {
  salonSlug: string;
}

export function ProfessionalStepClient({ salonSlug }: ProfessionalStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();

  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const professionalId = useBookingStore((s) => s.professionalId);
  const professionals = useBookingStore(useShallow(selectBranchProfessionals));
  const selectedServices = useBookingStore(useShallow(selectSelectedServices));
  const availableProfessionals = useBookingStore(
    useShallow(selectAvailableProfessionals),
  );
  const setProfessional = useBookingStore((s) => s.setProfessional);

  const { canProceed, validateCurrentStep } = useBookingNavigation();

  useEffect(() => {
    if (!branchId) {
      router.replace(getBookingStepRoute("branch", salonSlug));
      return;
    }
    if (serviceIds.length === 0) {
      router.replace(getBookingStepRoute("services", salonSlug));
    }
  }, [branchId, serviceIds.length, salonSlug, router]);

  function handleBack() {
    const prevRoute = getPrevStepRoute("professional", salonSlug);
    if (prevRoute) router.push(prevRoute);
  }

  function handleContinue() {
    const result = validateCurrentStep();
    if (!result.valid) {
      toast.error(result.errors[0] ?? "Select a professional to continue");
      return;
    }

    const nextRoute = getNextStepRoute("professional", salonSlug);
    if (nextRoute) router.push(nextRoute);
  }

  if (!branchId || serviceIds.length === 0) {
    return <BookingRouteSkeleton />;
  }

  return (
    <BookingShell
      currentStep="professional"
      stepTitle="Select a professional"
      summary={summary}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!canProceed()}
    >
      <ProfessionalStep
        professionals={professionals}
        selectedServices={selectedServices}
        selectedProfessionalId={professionalId}
        availableCount={availableProfessionals.length}
        onSelectProfessional={setProfessional}
      />
    </BookingShell>
  );
}
