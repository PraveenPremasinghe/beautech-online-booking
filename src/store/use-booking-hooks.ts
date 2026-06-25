"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  selectAvailableProfessionals,
  selectAvailableTimeSlots,
  selectBookingSummary,
  selectDraft,
  selectHasPartialSummary,
  selectSelectedBranch,
  selectSelectedProfessional,
  selectSelectedServices,
  selectSelectedTimeSlot,
  selectServiceCount,
} from "./booking-selectors";
import { useBookingStore } from "./use-booking-store";

/** Full booking summary derived from store + catalog */
export function useBookingSummary() {
  const summaryDeps = useBookingStore(
    useShallow((state) => ({
      catalog: state.catalog,
      branchId: state.branchId,
      serviceIds: state.serviceIds,
      professionalId: state.professionalId,
      date: state.date,
      timeSlotId: state.timeSlotId,
      taxRate: state.taxRate,
    })),
  );

  return useMemo(() => selectBookingSummary(useBookingStore.getState()), [
    summaryDeps.catalog,
    summaryDeps.branchId,
    summaryDeps.serviceIds,
    summaryDeps.professionalId,
    summaryDeps.date,
    summaryDeps.timeSlotId,
    summaryDeps.taxRate,
  ]);
}

/** Current draft snapshot */
export function useBookingDraft() {
  return useBookingStore(selectDraft);
}

/** Resolved selections */
export function useBookingSelections() {
  return useBookingStore(
    useShallow((state) => ({
      branch: selectSelectedBranch(state),
      services: selectSelectedServices(state),
      professional: selectSelectedProfessional(state),
      timeSlot: selectSelectedTimeSlot(state),
    })),
  );
}

/** Filtered lists for step UIs */
export function useBookingOptions() {
  return useBookingStore(
    useShallow((state) => ({
      professionals: selectAvailableProfessionals(state),
      timeSlots: selectAvailableTimeSlots(state),
    })),
  );
}

/** Step navigation + validation */
export function useBookingNavigation() {
  return useBookingStore(
    useShallow((state) => ({
      currentStep: state.currentStep,
      setStep: state.setStep,
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      canProceed: state.canProceed,
      validateCurrentStep: state.validateCurrentStep,
    })),
  );
}

/** Service selection helpers */
export function useServiceSelection() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const toggleService = useBookingStore((s) => s.toggleService);
  const setServices = useBookingStore((s) => s.setServices);
  const count = useBookingStore(selectServiceCount);

  return useMemo(
    () => ({
      serviceIds,
      count,
      toggleService,
      setServices,
      isSelected: (id: string) => serviceIds.includes(id),
    }),
    [serviceIds, count, toggleService, setServices],
  );
}

export function useHasPartialSummary() {
  return useBookingStore(selectHasPartialSummary);
}
