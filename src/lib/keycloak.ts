"use client";

import Keycloak from "keycloak-js";

import { env } from "@/lib/env";

let keycloak: Keycloak | null = null;
let initPromise: Promise<Keycloak> | null = null;

export function initKeycloak(): Promise<Keycloak> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Keycloak is client-only"));
  }

  if (keycloak?.authenticated) {
    return Promise.resolve(keycloak);
  }

  if (initPromise) return initPromise;

  keycloak = new Keycloak({
    url: env.NEXT_PUBLIC_KEYCLOAK_URL,
    realm: env.NEXT_PUBLIC_KEYCLOAK_REALM,
    clientId: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  });

  initPromise = keycloak
    .init({
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
    .then(() => keycloak!);

  return initPromise;
}

export function getKeycloak(): Keycloak | null {
  return keycloak;
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const kc = await initKeycloak();
    return Boolean(kc.authenticated);
  } catch {
    return false;
  }
}

export async function getEmailFromToken(): Promise<string | null> {
  try {
    const kc = await initKeycloak();
    const tokenParsed = kc.tokenParsed as { email?: string } | undefined;
    return tokenParsed?.email ?? null;
  } catch {
    return null;
  }
}
