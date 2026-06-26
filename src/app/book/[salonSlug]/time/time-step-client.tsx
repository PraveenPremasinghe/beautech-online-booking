"use client";

import { useQuery } from "@tanstack/react-query";
import { addMinutes } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookingShell, BookingRouteSkeleton } from "@/components/booking";
import { DatetimeStep } from "@/components/booking/steps/datetime-step";
import { fetchAvailableTimeSlots } from "@/lib/api/time-slots";
import { calculateTotalDuration } from "@/lib/booking-utils";
import {
  getDateStripOptions,
  SLOT_HOLD_MINUTES,
} from "@/lib/time-slot-utils";
import {
  getBookingStepRoute,
  getNextStepRoute,
  getPrevStepRoute,
} from "@/features/booking/routes";
import { getClientId } from "@/lib/tenant";
import {
  useBookingNavigation,
  useBookingStore,
  useBookingSummary,
} from "@/store";

interface TimeStepClientProps {
  salonSlug: string;
}

export function TimeStepClient({ salonSlug }: TimeStepClientProps) {
  const router = useRouter();
  const summary = useBookingSummary();
  const dates = getDateStripOptions();

  const branchId = useBookingStore((s) => s.branchId);
  const serviceIds = useBookingStore((s) => s.serviceIds);
  const services = useBookingStore((s) => s.services);
  const professionalId = useBookingStore((s) => s.professionalId);
  const date = useBookingStore((s) => s.date);
  const timeSlotId = useBookingStore((s) => s.timeSlotId);
  const setDate = useBookingStore((s) => s.setDate);
  const setTimeSlot = useBookingStore((s) => s.setTimeSlot);

  const { canProceed, validateCurrentStep } = useBookingNavigation();
  const [slotHoldExpiresAt, setSlotHoldExpiresAt] = useState<Date | null>(null);

  const timeDurationMinutes = useMemo(() => {
    const selected = services.filter((s) => serviceIds.includes(s.id));
    return calculateTotalDuration(selected);
  }, [services, serviceIds]);

  useEffect(() => {
    if (!branchId) {
      router.replace(getBookingStepRoute("branch", salonSlug));
      return;
    }
    if (serviceIds.length === 0) {
      router.replace(getBookingStepRoute("services", salonSlug));
      return;
    }
    if (!professionalId) {
      router.replace(getBookingStepRoute("professional", salonSlug));
    }
  }, [branchId, serviceIds.length, professionalId, salonSlug, router]);

  useEffect(() => {
    if (!date && dates[0]) {
      setDate(dates[0].date);
    }
  }, [date, dates, setDate]);

  const { data: slots = [], isLoading } = useQuery({
    queryKey: [
      "booking-time-slots",
      getClientId(),
      branchId,
      date,
      professionalId,
      timeDurationMinutes,
    ],
    queryFn: () =>
      fetchAvailableTimeSlots({
        branchId: branchId!,
        date: date!,
        professionalId: professionalId!,
        timeDurationMinutes,
      }),
    enabled: Boolean(
      getClientId() &&
        branchId &&
        date &&
        professionalId &&
        professionalId !== "any" &&
        timeDurationMinutes > 0,
    ),
    staleTime: 30_000,
  });

  const isSelectedSlotAvailable =
    !timeSlotId ||
    slots.length === 0 ||
    slots.some((slot) => slot.id === timeSlotId);

  const activeSlotHoldExpiresAt =
    timeSlotId && slotHoldExpiresAt && isSelectedSlotAvailable
      ? slotHoldExpiresAt
      : null;

  useEffect(() => {
    if (!timeSlotId || isLoading || slots.length === 0) return;

    if (!slots.some((slot) => slot.id === timeSlotId) && date) {
      setDate(date);
    }
  }, [slots, timeSlotId, date, setDate, isLoading]);

  function handleSelectDate(nextDate: string) {
    setDate(nextDate);
    setSlotHoldExpiresAt(null);
  }

  function handleSelectSlot(slotId: string) {
    const slot = slots.find((item) => item.id === slotId);
    if (slot) {
      setTimeSlot(slot);
      setSlotHoldExpiresAt(addMinutes(new Date(), SLOT_HOLD_MINUTES));
    }
  }

  function handleBack() {
    const prevRoute = getPrevStepRoute("datetime", salonSlug);
    if (prevRoute) router.push(prevRoute);
  }

  function handleContinue() {
    const result = validateCurrentStep();
    if (!result.valid) {
      toast.error(result.errors[0] ?? "Select a date and time to continue");
      return;
    }

    const nextRoute = getNextStepRoute("datetime", salonSlug);
    if (nextRoute) router.push(nextRoute);
  }

  if (!branchId || serviceIds.length === 0 || !professionalId) {
    return <BookingRouteSkeleton />;
  }

  return (
    <BookingShell
      currentStep="datetime"
      stepTitle="Select date & time"
      summary={summary}
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={!canProceed()}
    >
      <DatetimeStep
        dates={dates}
        selectedDate={date}
        onSelectDate={handleSelectDate}
        slots={slots}
        selectedSlotId={timeSlotId}
        onSelectSlot={handleSelectSlot}
        isLoadingSlots={isLoading}
        slotHoldExpiresAt={activeSlotHoldExpiresAt}
      />
    </BookingShell>
  );
}
