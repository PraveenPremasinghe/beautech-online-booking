"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { BOOKING_STEPS, getBookingStepIndex } from "@/features/booking/constants";
import type {
  AppointmentConfirmation,
  BookingCatalog,
  BookingStep,
  ClientDetails,
  ProfessionalSelection,
} from "@/types/booking";

import {
  type InitBookingOptions,
  type BookingStoreState,
} from "./booking-selectors";
import {
  canProceedFromStep,
  validateBookingStep,
  type BookingValidationState,
  type StepValidationResult,
} from "./booking-validation";

// ─── Store types ─────────────────────────────────────────────────────────────

interface BookingStoreActions {
  /** Load catalog and start/resume a booking session */
  initBooking: (
    salonSlug: string,
    catalog: BookingCatalog,
    options?: InitBookingOptions,
  ) => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => StepValidationResult;
  prevStep: () => void;
  setBranch: (branchId: string) => void;
  toggleService: (serviceId: string) => void;
  setServices: (serviceIds: string[]) => void;
  setProfessional: (professionalId: ProfessionalSelection) => void;
  setDate: (date: string) => void;
  setTimeSlot: (timeSlotId: string) => void;
  setClientDetails: (details: ClientDetails) => void;
  setConfirmation: (confirmation: AppointmentConfirmation | null) => void;
  /** Clear all selections and return to branch step */
  resetBooking: () => void;
  /** Clear selections from a step onward (e.g. changing branch clears downstream) */
  resetFromStep: (step: BookingStep) => void;
  validateCurrentStep: () => StepValidationResult;
  canProceed: (step?: BookingStep) => boolean;
}

export type BookingStore = BookingStoreState & BookingStoreActions;

const initialState: BookingStoreState = {
  catalog: null,
  currentStep: "branch",
  salonSlug: null,
  branchId: null,
  serviceIds: [],
  professionalId: null,
  date: null,
  timeSlotId: null,
  clientDetails: null,
  confirmation: null,
  taxRate: 0,
};

function toValidationState(state: BookingStoreState): BookingValidationState {
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

function resolveServiceIdsFromOptions(
  catalog: BookingCatalog,
  options: InitBookingOptions,
): string[] {
  if (!options.serviceIds?.length) return [];

  return options.serviceIds
    .map((ref) => {
      const byId = catalog.services.find((s) => s.id === ref);
      if (byId) return byId.id;
      const bySlug = catalog.services.find((s) => s.slug === ref);
      return bySlug?.id;
    })
    .filter((id): id is string => Boolean(id));
}

function cascadeAfterBranchChange(
  state: BookingStoreState,
  branchId: string,
): Partial<BookingStoreState> {
  const patch: Partial<BookingStoreState> = { branchId };

  if (state.professionalId && state.professionalId !== "any") {
    const pro = state.catalog?.professionals.find(
      (p) => p.id === state.professionalId,
    );
    if (!pro?.branchIds.includes(branchId)) {
      patch.professionalId = null;
      patch.date = null;
      patch.timeSlotId = null;
    }
  }

  return patch;
}

function cascadeAfterServicesChange(
  state: BookingStoreState,
  serviceIds: string[],
): Partial<BookingStoreState> {
  const patch: Partial<BookingStoreState> = { serviceIds };

  if (state.professionalId && state.professionalId !== "any") {
    const pro = state.catalog?.professionals.find(
      (p) => p.id === state.professionalId,
    );
    const canPerform = pro?.serviceIds.every((id) => serviceIds.includes(id));
    if (!canPerform) {
      patch.professionalId = null;
      patch.date = null;
      patch.timeSlotId = null;
    }
  }

  return patch;
}

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      initBooking: (salonSlug, catalog, options = {}) => {
        const serviceIds = resolveServiceIdsFromOptions(catalog, options);
        const branchId = options.branchId ?? null;

        set(
          {
            catalog,
            salonSlug,
            branchId,
            serviceIds,
            professionalId: options.professionalId ?? null,
            currentStep: options.step ?? inferInitialStep({
              branchId,
              serviceIds,
              professionalId: options.professionalId ?? null,
            }),
            date: null,
            timeSlotId: null,
            clientDetails: null,
            confirmation: null,
          },
          false,
          "initBooking",
        );
      },

      setStep: (step) => set({ currentStep: step }, false, "setStep"),

      nextStep: () => {
        const state = get();
        const validation = validateBookingStep(
          state.currentStep,
          toValidationState(state),
        );
        if (!validation.valid) return validation;

        const index = getBookingStepIndex(state.currentStep);
        if (index < BOOKING_STEPS.length - 1) {
          set(
            { currentStep: BOOKING_STEPS[index + 1].id },
            false,
            "nextStep",
          );
        }
        return validation;
      },

      prevStep: () => {
        const index = getBookingStepIndex(get().currentStep);
        if (index > 0) {
          set({ currentStep: BOOKING_STEPS[index - 1].id }, false, "prevStep");
        }
      },

      setBranch: (branchId) => {
        set(
          (state) => cascadeAfterBranchChange(state, branchId),
          false,
          "setBranch",
        );
      },

      toggleService: (serviceId) => {
        const state = get();
        const next = state.serviceIds.includes(serviceId)
          ? state.serviceIds.filter((id) => id !== serviceId)
          : [...state.serviceIds, serviceId];
        set(
          (s) => cascadeAfterServicesChange(s, next),
          false,
          "toggleService",
        );
      },

      setServices: (serviceIds) => {
        set(
          (state) => cascadeAfterServicesChange(state, serviceIds),
          false,
          "setServices",
        );
      },

      setProfessional: (professionalId) => {
        set(
          { professionalId, date: null, timeSlotId: null },
          false,
          "setProfessional",
        );
      },

      setDate: (date) => {
        set({ date, timeSlotId: null }, false, "setDate");
      },

      setTimeSlot: (timeSlotId) => {
        const slot = get().catalog?.timeSlots.find((t) => t.id === timeSlotId);
        set(
          {
            timeSlotId,
            date: slot?.date ?? get().date,
          },
          false,
          "setTimeSlot",
        );
      },

      setClientDetails: (details) => {
        set({ clientDetails: details }, false, "setClientDetails");
      },

      setConfirmation: (confirmation) => {
        set({ confirmation }, false, "setConfirmation");
      },

      resetBooking: () => {
        const { catalog, salonSlug } = get();
        if (!catalog || !salonSlug) {
          set(initialState, false, "resetBooking");
          return;
        }
        get().initBooking(salonSlug, catalog);
      },

      resetFromStep: (step) => {
        const patch: Partial<BookingStoreState> = {};
        const stepIndex = getBookingStepIndex(step);

        if (stepIndex <= getBookingStepIndex("branch")) patch.branchId = null;
        if (stepIndex <= getBookingStepIndex("services")) patch.serviceIds = [];
        if (stepIndex <= getBookingStepIndex("professional")) {
          patch.professionalId = null;
        }
        if (stepIndex <= getBookingStepIndex("datetime")) {
          patch.date = null;
          patch.timeSlotId = null;
        }
        if (stepIndex <= getBookingStepIndex("details")) {
          patch.clientDetails = null;
        }

        set(patch, false, "resetFromStep");
      },

      validateCurrentStep: () => {
        const state = get();
        return validateBookingStep(state.currentStep, toValidationState(state));
      },

      canProceed: (step) => {
        const state = get();
        const target = step ?? state.currentStep;
        return canProceedFromStep(target, toValidationState(state));
      },
    }),
    { name: "booking-store" },
  ),
);

function inferInitialStep(selections: {
  branchId: string | null;
  serviceIds: string[];
  professionalId: ProfessionalSelection | null;
}): BookingStep {
  if (!selections.branchId) return "branch";
  if (selections.serviceIds.length === 0) return "services";
  if (!selections.professionalId) return "professional";
  return "professional";
}
