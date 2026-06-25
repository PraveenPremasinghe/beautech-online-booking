import { buildBookingSummary } from "@/lib/booking-utils";
import type {
  AppointmentConfirmation,
  BookingCatalog,
  BookingDraft,
  BookingStep,
  BookingSummary,
  Branch,
  Professional,
  ProfessionalSelection,
  Service,
  TimeSlot,
} from "@/types/booking";

import type { BookingValidationState } from "./booking-validation";
import {
  EMPTY_PROFESSIONALS,
  EMPTY_SERVICES,
  EMPTY_TIME_SLOTS,
} from "./empty-collections";

/** Booking store state shape (for selectors) */
export interface BookingStoreState extends BookingValidationState {
  catalog: BookingCatalog | null;
  currentStep: BookingStep;
  confirmation: AppointmentConfirmation | null;
  taxRate: number;
}

// ─── Draft ───────────────────────────────────────────────────────────────────

export function selectDraft(state: BookingStoreState): BookingDraft | null {
  if (!state.salonSlug) return null;

  return {
    salonSlug: state.salonSlug,
    branchId: state.branchId ?? undefined,
    serviceIds: state.serviceIds,
    professionalId: state.professionalId ?? undefined,
    date: state.date ?? undefined,
    timeSlotId: state.timeSlotId ?? undefined,
    clientDetails: state.clientDetails ?? undefined,
    updatedAt: new Date().toISOString(),
  };
}

// ─── Resolved entities ───────────────────────────────────────────────────────

export function selectSalon(state: BookingStoreState) {
  return state.catalog?.salon ?? null;
}

export function selectSelectedBranch(state: BookingStoreState): Branch | null {
  if (!state.catalog || !state.branchId) return null;
  return state.catalog.branches.find((b) => b.id === state.branchId) ?? null;
}

export function selectSelectedServices(state: BookingStoreState): Service[] {
  if (!state.catalog || state.serviceIds.length === 0) return EMPTY_SERVICES;
  return state.serviceIds
    .map((id) => state.catalog!.services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));
}

export function selectSelectedProfessional(
  state: BookingStoreState,
): Professional | null {
  if (!state.catalog || !state.professionalId || state.professionalId === "any") {
    return null;
  }
  return (
    state.catalog.professionals.find((p) => p.id === state.professionalId) ??
    null
  );
}

export function selectSelectedTimeSlot(state: BookingStoreState): TimeSlot | null {
  if (!state.catalog || !state.timeSlotId) return null;
  return (
    state.catalog.timeSlots.find((t) => t.id === state.timeSlotId) ?? null
  );
}

export function selectIsAnyProfessional(state: BookingStoreState): boolean {
  return state.professionalId === "any";
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export function selectBookingSummary(state: BookingStoreState): BookingSummary | null {
  const draft = selectDraft(state);
  if (!draft || !state.catalog) return null;

  return buildBookingSummary({
    draft,
    catalog: state.catalog,
    taxRate: state.taxRate,
  });
}

export function selectHasPartialSummary(state: BookingStoreState): boolean {
  return state.serviceIds.length > 0;
}

// ─── Available options (filtered by prior selections) ────────────────────────

/** All available professionals at the selected branch */
export function selectBranchProfessionals(
  state: BookingStoreState,
): Professional[] {
  if (!state.catalog || !state.branchId) return EMPTY_PROFESSIONALS;

  return state.catalog.professionals.filter(
    (pro) => pro.isAvailable && pro.branchIds.includes(state.branchId!),
  );
}

/** Professionals who can perform every selected service */
export function selectAvailableProfessionals(
  state: BookingStoreState,
): Professional[] {
  if (!state.catalog || !state.branchId || state.serviceIds.length === 0) {
    return EMPTY_PROFESSIONALS;
  }

  return selectBranchProfessionals(state).filter((pro) =>
    state.serviceIds.every((id) => pro.serviceIds.includes(id)),
  );
}

export function selectAvailableTimeSlots(state: BookingStoreState): TimeSlot[] {
  if (!state.catalog || !state.branchId || !state.date) return EMPTY_TIME_SLOTS;

  const professionalId =
    state.professionalId === "any" ? undefined : state.professionalId;

  return state.catalog.timeSlots.filter((slot) => {
    if (slot.branchId !== state.branchId) return false;
    if (slot.date !== state.date) return false;
    if (!slot.isAvailable) return false;
    if (professionalId && slot.professionalId !== professionalId) return false;
    return true;
  });
}

// ─── Validation slice ────────────────────────────────────────────────────────

export function selectValidationState(
  state: BookingStoreState,
): BookingValidationState {
  return {
    salonSlug: state.salonSlug,
    branchId: state.branchId,
    serviceIds: state.serviceIds,
    professionalId: state.professionalId,
    date: state.date,
    timeSlotId: state.timeSlotId,
    clientDetails: state.clientDetails,
  };
}

// ─── Step helpers ────────────────────────────────────────────────────────────

export function selectServiceCount(state: BookingStoreState): number {
  return state.serviceIds.length;
}

export function selectIsServiceSelected(
  state: BookingStoreState,
  serviceId: string,
): boolean {
  return state.serviceIds.includes(serviceId);
}

export interface InitBookingOptions {
  branchId?: string;
  serviceIds?: string[];
  professionalId?: ProfessionalSelection;
  step?: BookingStep;
}

export function parseInitOptionsFromSearchParams(
  params: URLSearchParams,
): InitBookingOptions {
  const options: InitBookingOptions = {};

  const branch = params.get("branch");
  if (branch) options.branchId = branch;

  const service = params.get("service");
  if (service) options.serviceIds = [service];

  const services = params.get("services");
  if (services) {
    options.serviceIds = services.split(",").filter(Boolean);
  }

  const professional = params.get("professional");
  if (professional) options.professionalId = professional;

  const step = params.get("step");
  if (step) options.step = step as BookingStep;

  return options;
}
