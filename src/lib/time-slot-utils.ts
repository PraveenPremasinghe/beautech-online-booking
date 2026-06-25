import {
  addDays,
  format,
  isSameDay,
  isToday,
  parse,
  startOfDay,
} from "date-fns";

import type { Professional, ProfessionalSelection, TimeSlot } from "@/types/booking";

export const SLOT_HOLD_MINUTES = 5;

export type TimeOfDayGroup = "morning" | "afternoon" | "evening";

export interface DateStripOption {
  date: string;
  weekday: string;
  dayLabel: string;
  monthLabel: string;
  isToday: boolean;
}

export interface GroupedTimeSlots {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
}

const TIME_OF_DAY_LABELS: Record<TimeOfDayGroup, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function getTimeOfDayLabel(group: TimeOfDayGroup): string {
  return TIME_OF_DAY_LABELS[group];
}

export function getDateStripOptions(days = 14): DateStripOption[] {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_, index) => {
    const dateObj = addDays(today, index);

    return {
      date: format(dateObj, "yyyy-MM-dd"),
      weekday: format(dateObj, "EEE"),
      dayLabel: format(dateObj, "d"),
      monthLabel: format(dateObj, "MMM"),
      isToday: isToday(dateObj),
    };
  });
}

export function parseSlotTime(time: string): Date {
  return parse(time, "HH:mm", new Date());
}

export function formatSlotTime(time: string): string {
  return format(parseSlotTime(time), "h:mm a");
}

export function getTimeOfDayGroup(startTime: string): TimeOfDayGroup {
  const hour = parseInt(startTime.split(":")[0] ?? "0", 10);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function sortTimeSlots(slots: TimeSlot[]): TimeSlot[] {
  return [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function dedupeSlotsForAnyProfessional(slots: TimeSlot[]): TimeSlot[] {
  const byStartTime = new Map<string, TimeSlot>();

  for (const slot of sortTimeSlots(slots)) {
    if (!byStartTime.has(slot.startTime)) {
      byStartTime.set(slot.startTime, slot);
    }
  }

  return Array.from(byStartTime.values());
}

export function groupTimeSlotsByPeriod(slots: TimeSlot[]): GroupedTimeSlots {
  const grouped: GroupedTimeSlots = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  for (const slot of sortTimeSlots(slots)) {
    grouped[getTimeOfDayGroup(slot.startTime)].push(slot);
  }

  return grouped;
}

export function filterSlotsForBooking(
  slots: TimeSlot[],
  branchId: string,
  date: string,
  professionalIds: string[],
): TimeSlot[] {
  const allowed = new Set(professionalIds);

  return sortTimeSlots(
    slots.filter(
      (slot) =>
        slot.branchId === branchId &&
        slot.date === date &&
        slot.isAvailable &&
        allowed.has(slot.professionalId),
    ),
  );
}

export function resolveProfessionalIdsForSlots(
  professionals: Professional[],
  branchId: string,
  serviceIds: string[],
  professionalId: ProfessionalSelection,
): string[] {
  const atBranch = professionals.filter(
    (pro) => pro.isAvailable && pro.branchIds.includes(branchId),
  );

  if (professionalId !== "any") {
    const pro = atBranch.find((item) => item.id === professionalId);
    return pro ? [pro.id] : [];
  }

  return atBranch
    .filter((pro) => serviceIds.every((id) => pro.serviceIds.includes(id)))
    .map((pro) => pro.id);
}

export function isSelectedDate(date: string, selectedDate: string | null): boolean {
  if (!selectedDate) return false;
  return isSameDay(
    parse(date, "yyyy-MM-dd", new Date()),
    parse(selectedDate, "yyyy-MM-dd", new Date()),
  );
}
