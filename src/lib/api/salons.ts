import { fetchBranches } from "@/lib/api/branches";
import { fetchServicesAndCategories } from "@/lib/api/services";
import { fetchProfessionals } from "@/lib/api/professionals";
import { mockCustomerReviews } from "@/data/mock/reviews";
import { mockGalleryImages } from "@/lib/mock-booking-data";
import {
  getTenantOpeningHours,
  getTenantSalon,
} from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import type { SalonProfile } from "@/types/salon-profile";

export async function getSalonProfile(_slug: string): Promise<SalonProfile | null> {
  const clientId = getClientId();
  if (!clientId) return null;

  try {
    const salon = getTenantSalon(clientId);
    const branches = await fetchBranches();

    if (branches.length === 0) return null;

    const primaryBranch = branches.find((b) => b.isPrimary) ?? branches[0];
    const { services, categories } = await fetchServicesAndCategories(
      primaryBranch.id,
    );
    const professionals = await fetchProfessionals(primaryBranch.id);

    return {
      salon,
      primaryBranch,
      branches,
      openingHours: getTenantOpeningHours(),
      services,
      categories,
      professionals,
      reviews: mockCustomerReviews,
      gallery: mockGalleryImages,
    };
  } catch {
    return null;
  }
}

export async function getSalonEntity(_slug: string) {
  const clientId = getClientId();
  if (!clientId) return null;
  return getTenantSalon(clientId);
}

/** @deprecated Use getSalonProfile */
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
