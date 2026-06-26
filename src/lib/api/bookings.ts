import { fetchApi } from "@/lib/api-client";
import { mapApiAppointmentToConfirmation } from "@/lib/mappers/appointment-mapper";
import {
  clientDetailsToCustomerDto,
  transformAppointmentData,
} from "@/lib/transform-appointment";
import { getTenantCancellationPolicy } from "@/lib/tenant-config";
import { getClientId } from "@/lib/tenant";
import type {
  ApiOnlineAppointment,
  CreateAppointmentResponse,
} from "@/types/api";
import type {
  AppointmentConfirmation,
  BookingDraft,
  BookingSummary,
  Branch,
  ClientDetails,
  Professional,
  Service,
} from "@/types/booking";

export interface ConfirmBookingParams {
  draft: BookingDraft;
  summary: BookingSummary;
  branch: Branch;
  services: Service[];
  professional: Professional;
  startTime: string;
  customerId: number;
  clientDetails: ClientDetails;
  cancellationPolicy?: string;
}

function extractAppointmentId(response: CreateAppointmentResponse): string {
  if (response.id != null) return String(response.id);
  if (response.data?.id != null) return String(response.data.id);
  throw new Error("Appointment created but no id returned");
}

export async function confirmBooking(
  params: ConfirmBookingParams,
): Promise<AppointmentConfirmation> {
  const clientId = getClientId() ?? "demo";
  const cancellationPolicy =
    params.cancellationPolicy ?? getTenantCancellationPolicy(clientId);

  if (!params.draft.date) {
    throw new Error("Appointment date is required");
  }

  const customer = clientDetailsToCustomerDto(
    params.clientDetails,
    params.customerId,
  );

  const requestBody = transformAppointmentData({
    branch: params.branch,
    services: params.services,
    professional: params.professional,
    date: params.draft.date,
    startTime: params.startTime,
    customerId: params.customerId,
    customer,
  });

  const createResponse = await fetchApi<CreateAppointmentResponse>(
    "/appointments",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
  );

  const appointmentId = extractAppointmentId(createResponse);
  const confirmation = await getBookingConfirmation(
    clientId,
    appointmentId,
    cancellationPolicy,
  );
  if (!confirmation) {
    throw new Error("Appointment created but confirmation could not be loaded");
  }
  return confirmation;
}

export async function getBookingConfirmation(
  clientId: string,
  bookingId: string,
  cancellationPolicy?: string,
): Promise<AppointmentConfirmation | null> {
  try {
    const apiAppointment = await fetchApi<ApiOnlineAppointment>(
      `/appointments/online/${encodeURIComponent(bookingId)}`,
    );
    return mapApiAppointmentToConfirmation(
      apiAppointment,
      clientId,
      cancellationPolicy ?? getTenantCancellationPolicy(clientId),
    );
  } catch {
    return null;
  }
}
