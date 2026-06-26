import { fetchApi } from "@/lib/api-client";
import type { ApiOnlineAppointment, AppointmentsListRequest } from "@/types/api";

export interface AppointmentsListResponse {
  result?: ApiOnlineAppointment[];
  data?: ApiOnlineAppointment[];
}

export async function fetchCustomerAppointments(
  customerId: number,
  page = 1,
  perPage = 20,
): Promise<ApiOnlineAppointment[]> {
  const body: AppointmentsListRequest = {
    page,
    perPage,
    filter: { customerId },
  };

  const response = await fetchApi<AppointmentsListResponse>(
    "/appointments/online/list",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  return response.result ?? response.data ?? [];
}
