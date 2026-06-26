"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";

import { KeycloakProvider } from "@/components/auth/keycloak-provider";
import { TenantBootstrap } from "@/components/auth/tenant-bootstrap";
import { Toaster } from "@/components/ui/sonner";
import { getQueryClient } from "@/lib/query/get-query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider>
        <Suspense fallback={null}>
          <TenantBootstrap />
        </Suspense>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </KeycloakProvider>
    </QueryClientProvider>
  );
}
