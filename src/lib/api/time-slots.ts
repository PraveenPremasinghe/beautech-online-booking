import { fetchApi } from "@/lib/api-client";
import { mapApiTimeSlots } from "@/lib/mappers/slot-mapper";
import type { ApiTimeSlot } from "@/types/api";
import type { TimeSlot } from "@/types/booking";

export interface FetchTimeSlotsParams {
  branchId: string;
  professionalId: string;
  date: string;
  timeDurationMinutes: number;
}

export async function fetchAvailableTimeSlots(
  params: FetchTimeSlotsParams,
): Promise<TimeSlot[]> {
  const query = new URLSearchParams({
    employeeId: params.professionalId,
    timeDuration: String(params.timeDurationMinutes),
    date: params.date,
  });

  const apiSlots = await fetchApi<ApiTimeSlot[]>(
    `/schedules/get-available-slots-by-date?${query.toString()}`,
  );

  return mapApiTimeSlots(
    apiSlots,
    params.branchId,
    params.professionalId,
    params.date,
  );
}
