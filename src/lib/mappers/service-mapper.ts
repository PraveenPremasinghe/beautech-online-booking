import type { ApiCategory, ApiTreatment } from "@/types/api";
import type { CurrencyCode, Service, ServiceCategory } from "@/types/booking";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mapApiCategory(
  api: ApiCategory,
  index: number,
): ServiceCategory {
  return {
    id: String(api.id),
    slug: slugify(api.name) || `category-${api.id}`,
    name: api.name,
    description: api.description ?? undefined,
    sortOrder: api.sortOrder ?? index,
  };
}

export function mapApiTreatment(
  api: ApiTreatment,
  salonId: string,
  currency: CurrencyCode,
): Service {
  return {
    id: String(api.id),
    slug: slugify(api.name) || `service-${api.id}`,
    salonId,
    categoryId: String(api.categoryId),
    name: api.name,
    description: api.description ?? "",
    durationMinutes: api.duration ?? 0,
    price: api.price ?? 0,
    currency,
    imageUrl: api.imageUrl ?? undefined,
    professionalIds: [],
  };
}

export function mapApiCategories(apiCategories: ApiCategory[]): ServiceCategory[] {
  return apiCategories.map((category, index) => mapApiCategory(category, index));
}

export function mapApiTreatments(
  apiTreatments: ApiTreatment[],
  salonId: string,
  currency: CurrencyCode,
): Service[] {
  return apiTreatments.map((treatment) =>
    mapApiTreatment(treatment, salonId, currency),
  );
}
