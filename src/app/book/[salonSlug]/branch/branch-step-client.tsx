"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell } from "@/components/booking";
import { BookingIntroDialog } from "@/components/booking/booking-intro-dialog";
import { BranchStep } from "@/components/booking/steps/branch-step";
import { getNextStepRoute } from "@/features/booking/routes";
import { useBookingWelcomeIntro } from "@/hooks/use-booking-welcome-intro";
import { BOOKING_ROUTES } from "@/lib/constants";
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

  const branches = useBookingStore((s) => s.catalog?.branches ?? EMPTY_BRANCHES);
  const branchId = useBookingStore((s) => s.branchId);
  const setBranch = useBookingStore((s) => s.setBranch);

  const { canProceed, validateCurrentStep } = useBookingNavigation();

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
    if (nextRoute) {
      router.push(nextRoute);
    }
  }

  return (
    <>
      <BookingIntroDialog open={introOpen} onDismiss={dismissIntro} />
      <BookingShell
        currentStep="branch"
        summary={summary}
        onBack={handleBack}
        onContinue={handleContinue}
        continueDisabled={!canProceed() || branches.length === 0}
      >
        <BranchStep
          branches={branches}
          selectedBranchId={branchId}
          onSelectBranch={setBranch}
        />
      </BookingShell>
    </>
  );
}
