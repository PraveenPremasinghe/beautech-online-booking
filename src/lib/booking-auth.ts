"use client";

import { fetchApi } from "@/lib/api-client";
import { clearAllBookingStorage } from "@/lib/booking-state";
import { getKeycloak, initKeycloak } from "@/lib/keycloak";
import { setLoggedOut, setLoggingOut } from "@/lib/logout-state";
import { getClientId } from "@/lib/tenant";
import type { BookingAuthStateResponse } from "@/types/api";

export async function loginWithGoogle(tenant?: string): Promise<void> {
  const clientId = tenant ?? getClientId();
  if (!clientId) {
    throw new Error('Tenant parameter is required. Use ?client=<tenant-id>');
  }

  const stateResp = await fetchApi<BookingAuthStateResponse>(
    `/public/booking-auth/state?client=${encodeURIComponent(clientId)}`,
    { base: "gateway", skipAuth: true },
  );

  if (!stateResp?.state) {
    throw new Error("Gateway did not return state");
  }

  const kc = await initKeycloak();
  const redirectUri = `${window.location.origin}/auth/callback?client=${encodeURIComponent(clientId)}`;
  const loginUrl = await kc.createLoginUrl({
    redirectUri,
    idpHint: "google",
  });

  const url = new URL(loginUrl);
  url.searchParams.set("booking_state", stateResp.state);
  url.searchParams.set("prompt", "select_account");

  window.location.href = url.toString();
}

export async function logout(redirectUri?: string): Promise<void> {
  setLoggingOut();

  const kc = getKeycloak();
  if (kc) {
    try {
      kc.clearToken();
      kc.authenticated = false;
    } catch {
      // ignore
    }
  }

  if (typeof window !== "undefined") {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("kc-") || key.includes("keycloak"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    clearAllBookingStorage();
  }

  setLoggedOut();

  if (kc) {
    await kc.logout({
      redirectUri: redirectUri ?? window.location.origin,
    });
  } else if (typeof window !== "undefined") {
    window.location.href = redirectUri ?? "/";
  }
}
