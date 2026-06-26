"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { BookingIntroDialog } from "@/components/booking/booking-intro-dialog";
import { BranchStep } from "@/components/booking/steps/branch-step";
import { getNextStepRoute } from "@/features/booking/routes";
import { useBookingWelcomeIntro } from "@/hooks/use-booking-welcome-intro";
import { fetchBranches } from "@/lib/api/branches";
import { BOOKING_ROUTES } from "@/lib/constants";
import { getClientId } from "@/lib/tenant";
import {
  useBookingNavigation,
  useBookingStore,
  useBookingSummary,
} from "@/store";
import { EMPTY_BRANCHES } from "@/store/empty-collections";

interface BranchStepClientProps {
  salonSlug: string;
}

export function BranchStepClient({ salonSlug }: BranchStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();
  const { open: introOpen, dismiss: dismissIntro } = useBookingWelcomeIntro();

  const branches = useBookingStore((s) => s.branches);
  const setBranches = useBookingStore((s) => s.setBranches);
  const branchId = useBookingStore((s) => s.branchId);
  const setBranch = useBookingStore((s) => s.setBranch);

  const { canProceed, validateCurrentStep } = useBookingNavigation();

  const { isLoading, isError } = useQuery({
    queryKey: ["branches", getClientId()],
    queryFn: async () => {
      const data = await fetchBranches();
      setBranches(data);
      if (data.length === 1 && !branchId) {
        setBranch(data[0].id);
      }
      return data;
    },
    enabled: Boolean(getClientId()),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!getClientId()) {
      router.replace(BOOKING_ROUTES.home());
    }
  }, [router]);

  function handleBack() {
    router.push(BOOKING_ROUTES.home());
  }

  function handleContinue() {
    const result = validateCurrentStep();
    if (!result.valid) {
      toast.error(result.errors[0] ?? "Select a branch to continue");
      return;
    }

    const nextRoute = getNextStepRoute("branch", salonSlug);
    if (nextRoute) router.push(nextRoute);
  }

  if (!getClientId() || isLoading) {
    return <BookingRouteSkeleton />;
  }

  if (isError) {
    return (
      <BookingShell currentStep="branch" summary={summary} showBack={false}>
        <p className="text-sm text-destructive">
          Unable to load branches. Check your connection and try again.
        </p>
      </BookingShell>
    );
  }

  const displayBranches = branches.length > 0 ? branches : EMPTY_BRANCHES;

  return (
    <>
      <BookingIntroDialog open={introOpen} onDismiss={dismissIntro} />
      <BookingShell
        currentStep="branch"
        summary={summary}
        onBack={handleBack}
        onContinue={handleContinue}
        continueDisabled={!canProceed() || displayBranches.length === 0}
      >
        <BranchStep
          branches={displayBranches}
          selectedBranchId={branchId}
          onSelectBranch={setBranch}
        />
      </BookingShell>
    </>
  );
}
