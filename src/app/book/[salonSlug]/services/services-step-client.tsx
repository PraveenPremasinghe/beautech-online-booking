"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { ServicesStep } from "@/components/booking/steps/services-step";
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
  EMPTY_CATEGORIES,
  EMPTY_SERVICES,
} from "@/store/empty-collections";

interface ServicesStepClientProps {
  salonSlug: string;
}

export function ServicesStepClient({ salonSlug }: ServicesStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();

  const branchId = useBookingStore((s) => s.branchId);
  const services = useBookingStore((s) => s.catalog?.services ?? EMPTY_SERVICES);
  const categories = useBookingStore((s) => s.catalog?.categories ?? EMPTY_CATEGORIES);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const toggleService = useBookingStore((s) => s.toggleService);

  const { canProceed, validateCurrentStep } = useBookingNavigation();

  useEffect(() => {
    if (!branchId) {
      router.replace(getBookingStepRoute("branch", salonSlug));
    }
  }, [branchId, salonSlug, router]);

  function handleBack() {
    const prevRoute = getPrevStepRoute("services", salonSlug);
    if (prevRoute) router.push(prevRoute);
  }

  function handleContinue() {
    const result = validateCurrentStep();
    if (!result.valid) {
      toast.error(result.errors[0] ?? "Select at least one service");
      return;
    }

    const nextRoute = getNextStepRoute("services", salonSlug);
    if (nextRoute) router.push(nextRoute);
  }

  if (!branchId) {
    return <BookingRouteSkeleton />;
  }

  return (
    <BookingShell
      currentStep="services"
      stepTitle="Select services"
      summary={summary}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!canProceed() || services.length === 0}
    >
      <ServicesStep
        services={services}
        categories={categories}
        selectedServiceIds={serviceIds}
        onToggleService={toggleService}
      />
    </BookingShell>
  );
}
