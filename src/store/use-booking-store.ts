"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { BOOKING_STEPS, getBookingStepIndex } from "@/features/booking/constants";
import { getTenantSalon } from "@/lib/tenant-config";
import type {
  AppointmentConfirmation,
  BookingStep,
  Branch,
  ClientDetails,
  Professional,
  ProfessionalSelection,
  Salon,
  Service,
  ServiceCategory,
  TimeSlot,
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

interface BookingStoreActions {
  initBooking: (
    salonSlug: string,
    clientId: string,
    options?: InitBookingOptions,
  ) => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => StepValidationResult;
  prevStep: () => void;
  setBranches: (branches: Branch[]) => void;
  setCategories: (categories: ServiceCategory[]) => void;
  setCatalogServices: (services: Service[]) => void;
  setProfessionals: (professionals: Professional[]) => void;
  setBranch: (branchId: string) => void;
  toggleService: (serviceId: string) => void;
  setServiceIds: (serviceIds: string[]) => void;
  setProfessional: (professionalId: ProfessionalSelection) => void;
  setDate: (date: string) => void;
  setTimeSlot: (slot: TimeSlot) => void;
  setClientDetails: (details: ClientDetails) => void;
  setCustomerId: (customerId: number | null) => void;
  setConfirmation: (confirmation: AppointmentConfirmation | null) => void;
  resetBooking: () => void;
  resetFromStep: (step: BookingStep) => void;
  validateCurrentStep: () => StepValidationResult;
  canProceed: (step?: BookingStep) => boolean;
}

export type BookingStore = BookingStoreState & BookingStoreActions;

const initialState: BookingStoreState = {
  salon: null,
  branches: [],
  categories: [],
  services: [],
  professionals: [],
  selectedTimeSlot: null,
  customerId: null,
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
    customerId: state.customerId,
  };
}

function cascadeAfterBranchChange(
  state: BookingStoreState,
  branchId: string,
): Partial<BookingStoreState> {
  const patch: Partial<BookingStoreState> = { branchId };

  if (state.professionalId && state.professionalId !== "any") {
    const pro = state.professionals.find((p) => p.id === state.professionalId);
    if (!pro?.branchIds.includes(branchId)) {
      patch.professionalId = null;
      patch.date = null;
      patch.timeSlotId = null;
      patch.selectedTimeSlot = null;
    }
  }

  return patch;
}

function cascadeAfterServicesChange(
  state: BookingStoreState,
  serviceIds: string[],
): Partial<BookingStoreState> {
  return {
    serviceIds,
    date: null,
    timeSlotId: null,
    selectedTimeSlot: null,
  };
}

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      initBooking: (salonSlug, clientId, options = {}) => {
        const salon: Salon = getTenantSalon(clientId);

        set(
          {
            salon,
            salonSlug,
            branchId: options.branchId ?? null,
            serviceIds: options.serviceIds ?? [],
            professionalId: options.professionalId ?? null,
            currentStep:
              options.step ??
              inferInitialStep({
                branchId: options.branchId ?? null,
                serviceIds: options.serviceIds ?? [],
                professionalId: options.professionalId ?? null,
              }),
            date: null,
            timeSlotId: null,
            selectedTimeSlot: null,
            clientDetails: null,
            customerId: null,
            confirmation: null,
            branches: [],
            categories: [],
            services: [],
            professionals: [],
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

      setBranches: (branches) => set({ branches }, false, "setBranches"),

      setCategories: (categories) =>
        set({ categories }, false, "setCategories"),

      setCatalogServices: (services) =>
        set({ services }, false, "setCatalogServices"),

      setProfessionals: (professionals) =>
        set({ professionals }, false, "setProfessionals"),

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

      setServiceIds: (serviceIds) => {
        set(
          (state) => cascadeAfterServicesChange(state, serviceIds),
          false,
          "setServiceIds",
        );
      },

      setProfessional: (professionalId) => {
        set(
          {
            professionalId,
            date: null,
            timeSlotId: null,
            selectedTimeSlot: null,
          },
          false,
          "setProfessional",
        );
      },

      setDate: (date) => {
        set(
          { date, timeSlotId: null, selectedTimeSlot: null },
          false,
          "setDate",
        );
      },

      setTimeSlot: (slot) => {
        set(
          {
            timeSlotId: slot.id,
            date: slot.date,
            selectedTimeSlot: slot,
          },
          false,
          "setTimeSlot",
        );
      },

      setClientDetails: (details) => {
        set({ clientDetails: details }, false, "setClientDetails");
      },

      setCustomerId: (customerId) => {
        set({ customerId }, false, "setCustomerId");
      },

      setConfirmation: (confirmation) => {
        set({ confirmation }, false, "setConfirmation");
      },

      resetBooking: () => {
        const { salonSlug } = get();
        const clientId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("booking_client_id")
            : null;
        if (!salonSlug || !clientId) {
          set(initialState, false, "resetBooking");
          return;
        }
        get().initBooking(salonSlug, clientId);
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
          patch.selectedTimeSlot = null;
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
