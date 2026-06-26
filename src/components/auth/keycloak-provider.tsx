"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { initKeycloak } from "@/lib/keycloak";

interface KeycloakContextValue {
  ready: boolean;
  authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextValue>({
  ready: false,
  authenticated: false,
});

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    initKeycloak()
      .then((kc) => {
        if (cancelled) return;
        setAuthenticated(Boolean(kc.authenticated));
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <KeycloakContext.Provider value={{ ready, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloakAuth() {
  return useContext(KeycloakContext);
}
