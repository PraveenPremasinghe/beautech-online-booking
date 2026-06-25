"use client";

import { motion } from "motion/react";
import { CheckIcon } from "@heroicons/react/24/outline";

import { bookingLayout } from "@/lib/booking-ui";
import { cn } from "@/lib/utils";

export type StepperStepState = "complete" | "current" | "upcoming";

export interface BookingStepperStep {
  id: string;
  label: string;
}

interface BookingStepperProps {
  steps: BookingStepperStep[];
  currentStepId: string;
  className?: string;
  compact?: boolean;
}

function getStepState(index: number, currentIndex: number): StepperStepState {
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "current";
  return "upcoming";
}

function getConnectorState(
  index: number,
  currentIndex: number,
): "complete" | "partial" | "upcoming" {
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "partial";
  return "upcoming";
}

const stepperDotClass: Record<StepperStepState, string> = {
  complete: "bg-primary text-primary-foreground",
  current: "bg-primary text-primary-foreground ring-4 ring-primary/20",
  upcoming: "bg-muted text-muted-foreground",
};

const stepperLabelClass: Record<StepperStepState, string> = {
  complete: "text-foreground",
  current: "text-primary",
  upcoming: "text-muted-foreground",
};

const stepperConnectorClass = {
  complete: "bg-primary",
  partial: "bg-gradient-to-r from-primary to-muted",
  upcoming: "bg-muted",
} as const;

export function BookingStepper({
  steps,
  currentStepId,
  className,
  compact = true,
}: BookingStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  const currentStep = steps[currentIndex];

  return (
    <div className="flex flex-col gap-2">
      <nav
        aria-label="Booking progress"
        className={cn(
          "flex w-full snap-x snap-mandatory items-center gap-1 overflow-x-auto scroll-smooth sm:gap-2",
          bookingLayout.hideScrollbar,
          className,
        )}
      >
        {steps.map((step, index) => {
          const state = getStepState(index, currentIndex);

          return (
            <div
              key={step.id}
              className="flex min-w-[2.75rem] flex-1 snap-center items-center gap-1 sm:min-w-0 sm:gap-2"
            >
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1.5",
                  state === "upcoming" && "opacity-50",
                )}
              >
                <motion.span
                  layout
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-8",
                    stepperDotClass[state],
                  )}
                  aria-current={state === "current" ? "step" : undefined}
                  animate={
                    state === "current" ? { scale: [1, 1.06, 1] } : { scale: 1 }
                  }
                  transition={
                    state === "current"
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                >
                  {state === "complete" ? (
                    <CheckIcon className="size-3.5 sm:size-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </motion.span>
                <span
                  className={cn(
                    "hidden truncate text-center text-[10px] font-medium sm:block sm:text-xs",
                    stepperLabelClass[state],
                    compact && "max-[420px]:hidden",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    stepperConnectorClass[getConnectorState(index, currentIndex)],
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </nav>

      {compact && currentStep ? (
        <p className="text-center text-xs font-medium text-primary min-[421px]:hidden">
          Step {currentIndex + 1} of {steps.length}: {currentStep.label}
        </p>
      ) : null}
    </div>
  );
}
