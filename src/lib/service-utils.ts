import type { Service, ServiceCategory } from "@/types/booking";

export const ALL_SERVICES_TAB = "all";

export function getCategoryName(
  categories: ServiceCategory[],
  categoryId: string,
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Service";
}

export function filterServices(
  services: Service[],
  categoryId: string,
  query: string,
): Service[] {
  const normalizedQuery = query.trim().toLowerCase();

  return services.filter((service) => {
    if (categoryId !== ALL_SERVICES_TAB && service.categoryId !== categoryId) {
      return false;
    }

    if (!normalizedQuery) return true;

    return (
      service.name.toLowerCase().includes(normalizedQuery) ||
      service.description.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function sortCategories(categories: ServiceCategory[]): ServiceCategory[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}
