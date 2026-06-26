import { fetchApi } from "@/lib/api-client";
import {
  mapApiCategories,
  mapApiTreatments,
} from "@/lib/mappers/service-mapper";
import { getTenantSalon } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import type { ApiCategory, ApiTreatment } from "@/types/api";
import type { Service, ServiceCategory } from "@/types/booking";

export async function fetchCategories(branchId: string): Promise<ServiceCategory[]> {
  const apiCategories = await fetchApi<ApiCategory[]>(
    `/categories?branchId=${encodeURIComponent(branchId)}`,
  );
  return mapApiCategories(apiCategories);
}

export async function fetchServices(branchId: string): Promise<Service[]> {
  const clientId = getClientId() ?? "demo";
  const salon = getTenantSalon(clientId);
  const apiTreatments = await fetchApi<ApiTreatment[]>(
    `/treatments/list-images?branchId=${encodeURIComponent(branchId)}`,
  );
  return mapApiTreatments(apiTreatments, salon.id, salon.currency);
}

export async function fetchServicesAndCategories(branchId: string): Promise<{
  categories: ServiceCategory[];
  services: Service[];
}> {
  const [categories, services] = await Promise.all([
    fetchCategories(branchId),
    fetchServices(branchId),
  ]);
  return { categories, services };
}
