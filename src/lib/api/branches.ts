import { fetchApi } from "@/lib/api-client";
import { mapApiBranches } from "@/lib/mappers/branch-mapper";
import { getTenantSalon } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import type { ApiBranch } from "@/types/api";
import type { Branch } from "@/types/booking";

export async function fetchBranches(): Promise<Branch[]> {
  const clientId = getClientId();
  if (!clientId) throw new Error("Tenant client id is required");

  const salon = getTenantSalon(clientId);
  const apiBranches = await fetchApi<ApiBranch[]>("/branches");
  return mapApiBranches(apiBranches, salon.id);
}
