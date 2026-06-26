"use client";

import { useQuery } from "@tanstack/react-query";
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
import { fetchServicesAndCategories } from "@/lib/api/services";
import { getClientId } from "@/lib/tenant";
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
  const services = useBookingStore((s) => s.services);
  const categories = useBookingStore((s) => s.categories);
  const setCatalogServices = useBookingStore((s) => s.setCatalogServices);
  const setCategories = useBookingStore((s) => s.setCategories);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const toggleService = useBookingStore((s) => s.toggleService);

  const { canProceed, validateCurrentStep } = useBookingNavigation();

  const { isLoading } = useQuery({
    queryKey: ["services", branchId, getClientId()],
    queryFn: async () => {
      const data = await fetchServicesAndCategories(branchId!);
      setCategories(data.categories);
      setCatalogServices(data.services);
      return data;
    },
    enabled: Boolean(branchId && getClientId()),
    staleTime: 60_000,
  });

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

  if (!branchId || isLoading) {
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
        services={services.length > 0 ? services : EMPTY_SERVICES}
        categories={categories.length > 0 ? categories : EMPTY_CATEGORIES}
        selectedServiceIds={serviceIds}
        onToggleService={toggleService}
      />
    </BookingShell>
  );
}
