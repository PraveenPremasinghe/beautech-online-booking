import { fetchApi } from "@/lib/api-client";
import { mapApiEmployees } from "@/lib/mappers/professional-mapper";
import { getTenantSalon } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import type { ApiEmployee } from "@/types/api";
import type { Professional } from "@/types/booking";

export async function fetchProfessionals(
  branchId: string,
): Promise<Professional[]> {
  const clientId = getClientId() ?? "demo";
  const salon = getTenantSalon(clientId);
  const apiEmployees = await fetchApi<ApiEmployee[]>(
    `/employees/list?branchId=${encodeURIComponent(branchId)}`,
  );
  return mapApiEmployees(apiEmployees, salon.id, branchId);
}
