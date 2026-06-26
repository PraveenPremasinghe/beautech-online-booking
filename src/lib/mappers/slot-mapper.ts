import { format, parseISO } from "date-fns";

import type { ApiTimeSlot } from "@/types/api";
import type { TimeSlot } from "@/types/booking";

function toHHmm(value: string): string {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  try {
    return format(parseISO(value), "HH:mm");
  } catch {
    const match = value.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : value;
  }
}

export function mapApiTimeSlot(
  api: ApiTimeSlot,
  branchId: string,
  professionalId: string,
  date: string,
  index: number,
): TimeSlot {
  const startTime = toHHmm(api.startTime);
  const endTime = toHHmm(api.endTime);
  const id =
    api.id != null
      ? String(api.id)
      : `${date}-${professionalId}-${startTime}-${index}`;

  return {
    id,
    branchId,
    professionalId,
    date,
    startTime,
    endTime,
    isAvailable: true,
  };
}

export function mapApiTimeSlots(
  apiSlots: ApiTimeSlot[],
  branchId: string,
  professionalId: string,
  date: string,
): TimeSlot[] {
  return apiSlots.map((slot, index) =>
    mapApiTimeSlot(slot, branchId, professionalId, date, index),
  );
}
