"use client";

import { useQuery } from "@tanstack/react-query";

import { SalonProfilePage } from "@/components/salon";
import { SalonProfileSkeleton } from "@/components/salon/salon-profile-skeleton";
import { getSalonProfile } from "@/lib/api/salons";
import { SALON_SLUG } from "@/lib/constants";
import { getClientId } from "@/lib/tenant";

export function SalonProfileLoader() {
  const clientId = getClientId();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["salon-profile", SALON_SLUG, clientId],
    queryFn: () => getSalonProfile(SALON_SLUG),
    enabled: Boolean(clientId),
    staleTime: 60_000,
  });

  if (!clientId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Select a salon</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add <code className="rounded bg-muted px-1.5 py-0.5">?client=demo</code> to
          the URL to load this booking site.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pb-20 lg:pb-0">
        <SalonProfileSkeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Salon unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load this salon. Check your tenant and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-0">
      <SalonProfilePage profile={profile} />
    </div>
  );
}
