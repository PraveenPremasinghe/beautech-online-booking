import { clientDetailsSchema } from "@/lib/validations/client-details";
import type { BookingStep, ClientDetails } from "@/types/booking";

/** Slice of booking state used for validation */
export interface BookingValidationState {
  salonSlug: string | null;
  branchId: string | null;
  serviceIds: string[];
  professionalId: string | null;
  date: string | null;
  timeSlotId: string | null;
  clientDetails: ClientDetails | null;
  customerId: number | null;
}

export interface StepValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBookingStep(
  step: BookingStep,
  state: BookingValidationState,
): StepValidationResult {
  switch (step) {
    case "branch":
      return state.branchId
        ? { valid: true, errors: [] }
        : { valid: false, errors: ["Select a branch to continue"] };

    case "services":
      return state.serviceIds.length > 0
        ? { valid: true, errors: [] }
        : { valid: false, errors: ["Select at least one service"] };

    case "professional":
      return state.professionalId
        ? { valid: true, errors: [] }
        : { valid: false, errors: ["Select a professional or choose any available"] };

    case "datetime":
      if (!state.date) {
        return { valid: false, errors: ["Select a date"] };
      }
      if (!state.timeSlotId) {
        return { valid: false, errors: ["Select a time slot"] };
      }
      return { valid: true, errors: [] };

    case "details": {
      if (!state.clientDetails) {
        return { valid: false, errors: ["Sign in to continue"] };
      }
      const parsed = clientDetailsSchema.safeParse(state.clientDetails);
      if (!parsed.success) {
        return {
          valid: false,
          errors: parsed.error.issues.map((issue) => issue.message),
        };
      }
      return { valid: true, errors: [] };
    }

    case "summary": {
      const branch = validateBookingStep("branch", state);
      const services = validateBookingStep("services", state);
      const professional = validateBookingStep("professional", state);
      const datetime = validateBookingStep("datetime", state);
      const details = validateBookingStep("details", state);
      const errors = [
        ...branch.errors,
        ...services.errors,
        ...professional.errors,
        ...datetime.errors,
        ...details.errors,
      ];
      if (!state.customerId) {
        errors.push("Sign in to confirm your booking");
      }
      return { valid: errors.length === 0, errors };
    }

    default:
      return { valid: false, errors: ["Unknown step"] };
  }
}

export function canProceedFromStep(
  step: BookingStep,
  state: BookingValidationState,
): boolean {
  return validateBookingStep(step, state).valid;
}
