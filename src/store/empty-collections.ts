import type {
  Branch,
  Professional,
  Service,
  ServiceCategory,
  TimeSlot,
} from "@/types/booking";

/** Stable empty collections — avoid new [] references in selectors */
export const EMPTY_BRANCHES: Branch[] = [];
export const EMPTY_SERVICES: Service[] = [];
export const EMPTY_CATEGORIES: ServiceCategory[] = [];
export const EMPTY_PROFESSIONALS: Professional[] = [];
export const EMPTY_TIME_SLOTS: TimeSlot[] = [];
