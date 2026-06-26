"use client";

import { APPOINTMENT_API_BASE, env } from "@/lib/env";
import { getKeycloak } from "@/lib/keycloak";
import { getClientId } from "@/lib/tenant";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isLogoutInProgress(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("keycloak_logout_complete") === "true";
}

function isKeycloakUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes("keycloak") ||
    u.includes("auth.beautech.biz") ||
    u.includes("/protocol/openid-connect/") ||
    u.includes("/realms/") ||
    u.includes("/token") ||
    u.includes("/logout")
  );
}

export interface FetchApiOptions extends RequestInit {
  base?: "appointment" | "gateway";
  skipAuth?: boolean;
}

export async function fetchApi<T>(
  path: string,
  options: FetchApiOptions = {},
): Promise<T> {
  const base =
    options.base === "gateway"
      ? env.NEXT_PUBLIC_BOOKING_GATEWAY_URL
      : APPOINTMENT_API_BASE;

  const url = path.startsWith("http") ? path : `${base}${path}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const clientId = getClientId();
  if (clientId) headers.set("X-Client-Id", clientId);

  if (!options.skipAuth && !isLogoutInProgress() && !isKeycloakUrl(url)) {
    const kc = getKeycloak();
    if (kc?.authenticated && kc.token) {
      try {
        await kc.updateToken(30);
        if (kc.token) headers.set("Authorization", `Bearer ${kc.token}`);
      } catch {
        // Token refresh failed — proceed without auth header
      }
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let message = `API ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
