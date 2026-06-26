import { format, parseISO } from "date-fns";

import type { ApiOnlineAppointment } from "@/types/api";
import type {
  AppointmentConfirmation,
  AppointmentStatus,
  BookingSummary,
  ClientDetails,
  CurrencyCode,
} from "@/types/booking";
import { getTenantSalon } from "@/lib/tenant-config";

function mapStatus(status?: string): AppointmentStatus {
  if (!status) return "pending";
  const normalized = status.toUpperCase();
  if (normalized === "COMPLETED" || normalized === "CONFIRMED") {
    return "confirmed";
  }
  return "pending";
}

function toHHmm(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  try {
    return format(parseISO(value), "HH:mm");
  } catch {
    const match = value.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : undefined;
  }
}

function mapClient(customer?: ApiOnlineAppointment["customer"]): ClientDetails {
  const name = customer?.name?.trim() ?? "";
  const [firstName = "Guest", ...rest] = name.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
    email: customer?.email ?? "",
    phone: customer?.mobile ?? "",
  };
}

export function mapApiAppointmentToConfirmation(
  api: ApiOnlineAppointment,
  clientId: string,
  cancellationPolicy: string,
): AppointmentConfirmation {
  const salon = getTenantSalon(clientId);
  const currency = salon.currency;
  const treatments = api.treatments ?? [];
  const lineItems = treatments.map((t) => ({
    serviceId: String(t.id),
    name: t.name,
    durationMinutes: t.duration ?? 0,
    price: t.price ?? 0,
  }));

  const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0);
  const total = api.total ?? api.amount ?? subtotal;
  const startTime = toHHmm(api.startTime ?? treatments[0]?.startTime);
  const endTime = toHHmm(api.endTime ?? treatments.at(-1)?.endTime);

  const summary: BookingSummary = {
    salon: {
      id: salon.id,
      slug: salon.slug,
      name: salon.name,
      currency,
    },
    branch: api.branch?.name
      ? {
          id: String(api.branch.id ?? ""),
          name: api.branch.name,
          address: { line1: "", city: "", postalCode: "", country: "" },
          phone: "",
        }
      : undefined,
    lineItems,
    date: api.date,
    startTime,
    endTime,
    totalDurationMinutes: lineItems.reduce(
      (sum, item) => sum + item.durationMinutes,
      0,
    ),
    subtotal,
    tax: 0,
    total,
    currency: currency as CurrencyCode,
  };

  return {
    appointmentId: String(api.id),
    confirmationCode: String(api.id),
    status: mapStatus(api.status),
    summary,
    client: mapClient(api.customer),
    bookedAt: new Date().toISOString(),
    cancellationPolicy,
  };
}
