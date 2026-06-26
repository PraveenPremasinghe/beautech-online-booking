import type { ApiEmployee } from "@/types/api";
import type { Professional } from "@/types/booking";

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "Professional", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function mapApiEmployee(
  api: ApiEmployee,
  salonId: string,
  branchId: string,
): Professional {
  const { firstName, lastName } = splitName(api.name);

  return {
    id: String(api.id),
    salonId,
    branchIds: [api.branchId ? String(api.branchId) : branchId],
    firstName,
    lastName,
    displayName: api.name,
    title: api.town ?? "Specialist",
    bio: api.note ?? undefined,
    avatarUrl: api.imageUrl ?? undefined,
    rating: 0,
    reviewCount: 0,
    serviceIds: [],
    isAvailable: true,
  };
}

export function mapApiEmployees(
  apiEmployees: ApiEmployee[],
  salonId: string,
  branchId: string,
): Professional[] {
  return apiEmployees.map((employee) =>
    mapApiEmployee(employee, salonId, branchId),
  );
}
