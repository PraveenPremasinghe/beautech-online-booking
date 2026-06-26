import { buildBookingSummary } from "@/lib/booking-utils";
import type {
  AppointmentConfirmation,
  BookingDraft,
  BookingStep,
  BookingSummary,
  Branch,
  Professional,
  ProfessionalSelection,
  Salon,
  Service,
  ServiceCategory,
  TimeSlot,
} from "@/types/booking";

import type { BookingValidationState } from "./booking-validation";
import {
  EMPTY_PROFESSIONALS,
  EMPTY_SERVICES,
} from "./empty-collections";

/** Booking store state shape (for selectors) */
export interface BookingStoreState extends BookingValidationState {
  salon: Salon | null;
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  professionals: Professional[];
  selectedTimeSlot: TimeSlot | null;
  customerId: number | null;
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
  return state.salon;
}

export function selectSelectedBranch(state: BookingStoreState): Branch | null {
  if (!state.branchId) return null;
  return state.branches.find((b) => b.id === state.branchId) ?? null;
}

export function selectSelectedServices(state: BookingStoreState): Service[] {
  if (state.serviceIds.length === 0) return EMPTY_SERVICES;
  return state.serviceIds
    .map((id) => state.services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));
}

export function selectSelectedProfessional(
  state: BookingStoreState,
): Professional | null {
  if (!state.professionalId || state.professionalId === "any") {
    return null;
  }
  return (
    state.professionals.find((p) => p.id === state.professionalId) ?? null
  );
}

export function selectSelectedTimeSlot(state: BookingStoreState): TimeSlot | null {
  return state.selectedTimeSlot;
}

export function selectIsAnyProfessional(state: BookingStoreState): boolean {
  return state.professionalId === "any";
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export function selectBookingSummary(state: BookingStoreState): BookingSummary | null {
  const draft = selectDraft(state);
  if (!draft || !state.salon) return null;

  return buildBookingSummary({
    draft,
    salon: state.salon,
    branches: state.branches,
    services: state.services,
    professionals: state.professionals,
    selectedTimeSlot: state.selectedTimeSlot,
    taxRate: state.taxRate,
  });
}

export function selectHasPartialSummary(state: BookingStoreState): boolean {
  return state.serviceIds.length > 0;
}

// ─── Available options (filtered by prior selections) ────────────────────────

export function selectBranchProfessionals(
  state: BookingStoreState,
): Professional[] {
  if (!state.branchId) return EMPTY_PROFESSIONALS;

  return state.professionals.filter(
    (pro) => pro.isAvailable && pro.branchIds.includes(state.branchId!),
  );
}

export function selectAvailableProfessionals(
  state: BookingStoreState,
): Professional[] {
  if (!state.branchId || state.serviceIds.length === 0) {
    return EMPTY_PROFESSIONALS;
  }

  const branchPros = selectBranchProfessionals(state);
  if (branchPros.length === 0) return state.professionals;

  return branchPros;
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
    customerId: state.customerId,
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
