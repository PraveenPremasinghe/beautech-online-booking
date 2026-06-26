import { fetchApi } from "@/lib/api-client";
import type { CustomerDto } from "@/types/api";

export async function fetchCurrentCustomer(): Promise<CustomerDto> {
  return fetchApi<CustomerDto>("/customers/me", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function createOrLinkCustomer(
  phoneNumber: string,
): Promise<CustomerDto> {
  return fetchApi<CustomerDto>("/customers/create-link", {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
  });
}
