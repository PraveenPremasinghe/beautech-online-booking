import type { BookingStep } from "@/types/booking";

export const BOOKING_STEPS: { id: BookingStep; label: string }[] = [
  { id: "branch", label: "Branch" },
  { id: "services", label: "Services" },
  { id: "professional", label: "Professional" },
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "summary", label: "Confirm" },
];

export function getBookingStepIndex(step: BookingStep): number {
  return BOOKING_STEPS.findIndex((item) => item.id === step);
}

export function getBookingStepLabel(step: BookingStep): string {
  return BOOKING_STEPS.find((item) => item.id === step)?.label ?? step;
}
