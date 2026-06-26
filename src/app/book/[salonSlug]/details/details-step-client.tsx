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
import { fetchCurrentCustomer } from "@/lib/api/customers";
import { loginWithGoogle } from "@/lib/booking-auth";
import { saveBookingDraft } from "@/lib/booking-state";
import { getEmailFromToken, isLoggedIn } from "@/lib/keycloak";
import { getClientId } from "@/lib/tenant";
import { clientDetailsFromEmail } from "@/lib/validations/client-details";
import {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const professionalId = useBookingStore((s) => s.professionalId);
  const date = useBookingStore((s) => s.date);
  const timeSlotId = useBookingStore((s) => s.timeSlotId);
  const clientDetails = useBookingStore((s) => s.clientDetails);
  const setClientDetails = useBookingStore((s) => s.setClientDetails);
  const setCustomerId = useBookingStore((s) => s.setCustomerId);

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

  async function proceedAfterAuth(email: string) {
    setClientDetails(clientDetailsFromEmail(email));

    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      try {
        const customer = await fetchCurrentCustomer();
        if (customer.id != null) {
          setCustomerId(customer.id);
          const nextRoute = getNextStepRoute("details", salonSlug);
          if (nextRoute) router.push(nextRoute);
          return;
        }
      } catch {
        // fall through to Google login
      }
    }

    saveBookingDraft({ returnTo: "summary", tenant: getClientId() ?? undefined });
    await loginWithGoogle(getClientId() ?? undefined);
  }

  async function handleEmailContinue(email: string) {
    setIsSubmitting(true);
    try {
      await proceedAfterAuth(email);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to continue");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleContinue() {
    setIsSubmitting(true);
    try {
      const email = (await getEmailFromToken()) ?? "guest@gmail.com";
      setClientDetails(clientDetailsFromEmail(email));
      saveBookingDraft({ returnTo: "summary", tenant: getClientId() ?? undefined });
      await loginWithGoogle(getClientId() ?? undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to start Google sign in");
      setIsSubmitting(false);
    }
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
      stepTitle="Log in or sign up to book"
      summary={summary}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!isFormValid || isSubmitting}
      isLoading={isSubmitting}
    >
      <DetailsStep
        defaultEmail={clientDetails?.email}
        onEmailContinue={handleEmailContinue}
        onGoogleContinue={handleGoogleContinue}
        onClose={handleBack}
        onValidChange={handleValidChange}
      />
    </BookingShell>
  );
}
