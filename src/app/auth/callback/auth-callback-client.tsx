"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrLinkCustomer, fetchCurrentCustomer } from "@/lib/api/customers";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveEncryptedAppointment,
} from "@/lib/booking-state";
import { initKeycloak } from "@/lib/keycloak";
import { resetLogoutState } from "@/lib/logout-state";
import { BOOKING_ROUTES } from "@/lib/constants";
import { validateAndSetClientId, withClientQuery } from "@/lib/tenant";
import { useBookingStore } from "@/store";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCustomerId = useBookingStore((s) => s.setCustomerId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handlePostAuth = useCallback(async () => {
    const customer = await fetchCurrentCustomer();
    if (customer.id == null) {
      setShowPhoneForm(true);
      setLoading(false);
      return;
    }

    setCustomerId(customer.id);

    const draft = loadBookingDraft();
    if (draft?.returnTo === "summary") {
      clearBookingDraft();
      const salonSlug = useBookingStore.getState().salonSlug ?? "beautech-studio";
      router.replace(withClientQuery(BOOKING_ROUTES.summary(salonSlug)));
      return;
    }

    setLoading(false);
    router.replace(withClientQuery("/"));
  }, [router, setCustomerId]);

  useEffect(() => {
    async function run() {
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (errorParam) {
        setError(errorDescription ?? "Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      const client = searchParams.get("client");
      if (!client) {
        setError("Missing tenant parameter. Please try again.");
        setLoading(false);
        return;
      }

      try {
        validateAndSetClientId(client);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid tenant");
        setLoading(false);
        return;
      }

      resetLogoutState();

      let authenticated = false;
      for (let i = 0; i < 10; i++) {
        try {
          const kc = await initKeycloak();
          authenticated = Boolean(kc.authenticated);
          if (authenticated) break;
        } catch {
          // retry
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (!authenticated) {
        setError("Authentication did not complete. Please try again.");
        setLoading(false);
        return;
      }

      await handlePostAuth();
    }

    void run();
  }, [searchParams, handlePostAuth]);

  async function handlePhoneSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPhoneError(null);

    if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const customer = await createOrLinkCustomer(phone);
      if (customer.id == null) {
        setPhoneError("Unable to link your phone number. Please try again.");
        setLoading(false);
        return;
      }

      setCustomerId(customer.id);
      const draft = loadBookingDraft();
      if (draft) {
        saveEncryptedAppointment(draft);
        clearBookingDraft();
      }

      const salonSlug = useBookingStore.getState().salonSlug ?? "beautech-studio";
      router.replace(withClientQuery(BOOKING_ROUTES.summary(salonSlug)));
    } catch (err) {
      setPhoneError(
        err instanceof Error ? err.message : "Failed to link phone number",
      );
      setLoading(false);
    }
  }

  if (loading && !showPhoneForm) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Completing sign in…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Sign in failed</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => router.replace(withClientQuery("/"))}>
          Go home
        </Button>
      </div>
    );
  }

  if (showPhoneForm) {
    return (
      <div className="mx-auto max-w-md space-y-6 px-4 py-16">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Add your mobile number</h1>
          <p className="text-sm text-muted-foreground">
            We need your phone number to complete your booking.
          </p>
        </div>
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="0761234567"
              className="h-11"
            />
            {phoneError ? (
              <p className="text-xs text-destructive">{phoneError}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Continue
          </Button>
        </form>
      </div>
    );
  }

  return null;
}
