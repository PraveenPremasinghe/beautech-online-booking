import type { BookingStep } from "@/types/booking";
import { withClientQuery } from "@/lib/tenant";

/** Per-step booking URLs: /book/[salonSlug]/[step] */
export const bookingStepRoutes = {
  branch: (salonSlug: string) => `/book/${salonSlug}/branch`,
  services: (salonSlug: string) => `/book/${salonSlug}/services`,
  professional: (salonSlug: string) => `/book/${salonSlug}/professional`,
  datetime: (salonSlug: string) => `/book/${salonSlug}/time`,
  details: (salonSlug: string) => `/book/${salonSlug}/details`,
  summary: (salonSlug: string) => `/book/${salonSlug}/summary`,
} as const satisfies Record<BookingStep, (salonSlug: string) => string>;

export function getBookingStepRoute(step: BookingStep, salonSlug: string): string {
  return withClientQuery(bookingStepRoutes[step](salonSlug));
}

export function getNextStepRoute(
  currentStep: BookingStep,
  salonSlug: string,
): string | null {
  const order: BookingStep[] = [
    "branch",
    "services",
    "professional",
    "datetime",
    "details",
    "summary",
  ];
  const index = order.indexOf(currentStep);
  if (index < 0 || index >= order.length - 1) return null;
  return getBookingStepRoute(order[index + 1], salonSlug);
}

export function getPrevStepRoute(
  currentStep: BookingStep,
  salonSlug: string,
): string | null {
  const order: BookingStep[] = [
    "branch",
    "services",
    "professional",
    "datetime",
    "details",
    "summary",
  ];
  const index = order.indexOf(currentStep);
  if (index <= 0) return null;
  return getBookingStepRoute(order[index - 1], salonSlug);
}
