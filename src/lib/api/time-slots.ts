import {
  dedupeSlotsForAnyProfessional,
  filterSlotsForBooking,
  resolveProfessionalIdsForSlots,
} from "@/lib/time-slot-utils";
import type {
  BookingCatalog,
  ProfessionalSelection,
  TimeSlot,
} from "@/types/booking";

export interface FetchTimeSlotsParams {
  branchId: string;
  date: string;
  professionalId: ProfessionalSelection;
  serviceIds: string[];
}

const FETCH_DELAY_MS = 650;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchAvailableTimeSlots(
  catalog: BookingCatalog,
  params: FetchTimeSlotsParams,
): Promise<TimeSlot[]> {
  await delay(FETCH_DELAY_MS);

  const professionalIds = resolveProfessionalIdsForSlots(
    catalog.professionals,
    params.branchId,
    params.serviceIds,
    params.professionalId,
  );

  if (professionalIds.length === 0) {
    return [];
  }

  const slots = filterSlotsForBooking(
    catalog.timeSlots,
    params.branchId,
    params.date,
    professionalIds,
  );

  if (params.professionalId === "any") {
    return dedupeSlotsForAnyProfessional(slots);
  }

  return slots;
}
