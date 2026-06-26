"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
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

export function useBookingSummary() {
  const summaryDeps = useBookingStore(
    useShallow((state) => ({
      salon: state.salon,
      branches: state.branches,
      services: state.services,
      professionals: state.professionals,
      selectedTimeSlot: state.selectedTimeSlot,
      branchId: state.branchId,
      serviceIds: state.serviceIds,
      professionalId: state.professionalId,
      date: state.date,
      timeSlotId: state.timeSlotId,
      taxRate: state.taxRate,
    })),
  );

  return useMemo(() => selectBookingSummary(useBookingStore.getState()), [
    summaryDeps.salon,
    summaryDeps.branches,
    summaryDeps.services,
    summaryDeps.professionals,
    summaryDeps.selectedTimeSlot,
    summaryDeps.branchId,
    summaryDeps.serviceIds,
    summaryDeps.professionalId,
    summaryDeps.date,
    summaryDeps.timeSlotId,
    summaryDeps.taxRate,
  ]);
}

export function useBookingDraft() {
  return useBookingStore(selectDraft);
}

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

export function useServiceSelection() {
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const toggleService = useBookingStore((s) => s.toggleService);
  const setServiceIds = useBookingStore((s) => s.setServiceIds);
  const count = useBookingStore(selectServiceCount);

  return useMemo(
    () => ({
      serviceIds,
      count,
      toggleService,
      setServices: setServiceIds,
      isSelected: (id: string) => serviceIds.includes(id),
    }),
    [serviceIds, count, toggleService, setServiceIds],
  );
}

export function useHasPartialSummary() {
  return useBookingStore(selectHasPartialSummary);
}
