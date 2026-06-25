import type { Professional, Service } from "@/types/booking";

export function getProfessionalInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function canPerformServices(
  professional: Professional,
  serviceIds: string[],
): boolean {
  if (serviceIds.length === 0) return false;
  return serviceIds.every((id) => professional.serviceIds.includes(id));
}

export function getPerformableSelectedServices(
  professional: Professional,
  selectedServices: Service[],
): Service[] {
  return selectedServices.filter((service) =>
    professional.serviceIds.includes(service.id),
  );
}

export function getUnperformableSelectedServices(
  professional: Professional,
  selectedServices: Service[],
): Service[] {
  return selectedServices.filter(
    (service) => !professional.serviceIds.includes(service.id),
  );
}

/** Service names this professional offers — used as specialty chips */
export function getProfessionalSpecialties(
  professional: Professional,
  allServices: Service[],
  max = 3,
): string[] {
  return professional.serviceIds
    .map((id) => allServices.find((service) => service.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, max);
}

export function sortProfessionalsForDisplay(
  professionals: Professional[],
  selectedServiceIds: string[],
): Professional[] {
  return [...professionals].sort((a, b) => {
    const aCan = canPerformServices(a, selectedServiceIds);
    const bCan = canPerformServices(b, selectedServiceIds);
    if (aCan !== bCan) return aCan ? -1 : 1;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.displayName.localeCompare(b.displayName);
  });
}
