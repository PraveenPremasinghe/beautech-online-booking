import type {
  AppointmentConfirmation,
  BookingDraft,
  BookingSummary,
} from "@/types/booking";

const CONFIRM_DELAY_MS = 1_200;
const LOOKUP_DELAY_MS = 250;

/** In-memory mock store — persists for the dev server session */
const mockBookingStore = new Map<string, AppointmentConfirmation>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateConfirmationCode(): string {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BT-${segment}`;
}

export interface ConfirmBookingParams {
  draft: BookingDraft;
  summary: BookingSummary;
  cancellationPolicy: string;
}

export async function confirmBooking({
  draft,
  summary,
  cancellationPolicy,
}: ConfirmBookingParams): Promise<AppointmentConfirmation> {
  if (!draft.clientDetails) {
    throw new Error("Client details are required to confirm a booking");
  }

  await delay(CONFIRM_DELAY_MS);

  const confirmation: AppointmentConfirmation = {
    appointmentId: `appt-${Date.now()}`,
    confirmationCode: generateConfirmationCode(),
    status: "confirmed",
    summary,
    client: draft.clientDetails,
    bookedAt: new Date().toISOString(),
    cancellationPolicy,
  };

  mockBookingStore.set(confirmation.appointmentId, confirmation);
  return confirmation;
}

export async function getBookingConfirmation(
  salonSlug: string,
  bookingId: string,
): Promise<AppointmentConfirmation | null> {
  await delay(LOOKUP_DELAY_MS);

  const booking = mockBookingStore.get(bookingId);
  if (!booking || booking.summary.salon.slug !== salonSlug) {
    return null;
  }

  return booking;
}

/** @internal Test / seed helper */
export function registerMockBooking(confirmation: AppointmentConfirmation): void {
  mockBookingStore.set(confirmation.appointmentId, confirmation);
}
