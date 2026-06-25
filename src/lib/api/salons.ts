import { getSalonProfileBySlug } from "@/lib/mock-booking-data";
import type { SalonProfile } from "@/types/salon-profile";

export async function getSalonProfile(slug: string): Promise<SalonProfile | null> {
  return getSalonProfileBySlug(slug) ?? null;
}

export async function getSalonEntity(slug: string) {
  const profile = await getSalonProfile(slug);
  return profile?.salon ?? null;
}

/** @deprecated Use getSalonProfile — kept for legacy callers */
export async function getSalonBySlug(slug: string) {
  const profile = await getSalonProfile(slug);
  if (!profile) return null;
  return {
    name: profile.salon.name,
    slug: profile.salon.slug,
    tagline: profile.salon.tagline,
    rating: profile.salon.rating,
    reviewCount: profile.salon.reviewCount,
  };
}

export async function getBookingCatalog(slug: string) {
  const { getBookingCatalogBySlug } = await import("@/lib/mock-booking-data");
  return getBookingCatalogBySlug(slug) ?? null;
}

export async function getSignatureServices() {
  const { mockSignatureServices } = await import("@/lib/mock-booking-data");
  return mockSignatureServices;
}
