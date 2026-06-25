import { addMinutes, parse } from "date-fns";

import { formatCurrency, formatDuration } from "@/lib/format";
import type {
  BookingCatalog,
  BookingDraft,
  BookingSummary,
  BookingSummaryLineItem,
  ClientDetails,
  CurrencyCode,
  Professional,
  Service,
  TimeSlot,
} from "@/types/booking";

const TIME_FORMAT = "HH:mm";
const REFERENCE_DATE = new Date(2000, 0, 1);

// ─── Duration ────────────────────────────────────────────────────────────────

/** Sum duration in minutes for a list of services */
export function calculateTotalDuration(services: Pick<Service, "durationMinutes">[]): number {
  return services.reduce((sum, service) => sum + service.durationMinutes, 0);
}

/** Add service durations to a start time → end time (HH:mm) */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = parse(startTime, TIME_FORMAT, REFERENCE_DATE);
  return formatTime(addMinutes(start, durationMinutes));
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Human-readable total duration label */
export function formatTotalDuration(services: Pick<Service, "durationMinutes">[]): string {
  return formatDuration(calculateTotalDuration(services));
}

// ─── Price ───────────────────────────────────────────────────────────────────

/** Sum prices for a list of services */
export function calculateSubtotal(services: Pick<Service, "price">[]): number {
  return services.reduce((sum, service) => sum + service.price, 0);
}

/** Apply tax rate (decimal, e.g. 0.08 = 8%) — returns tax amount rounded to 2dp */
export function calculateTax(subtotal: number, taxRate = 0): number {
  if (taxRate <= 0) return 0;
  return Math.round(subtotal * taxRate * 100) / 100;
}

/** Subtotal + tax */
export function calculateTotal(subtotal: number, tax = 0): number {
  return Math.round((subtotal + tax) * 100) / 100;
}

/** Formatted price total label */
export function formatTotalPrice(
  services: Pick<Service, "price">[],
  currency: CurrencyCode = "USD",
): string {
  return formatCurrency(calculateSubtotal(services), currency);
}

// ─── Summary builders ────────────────────────────────────────────────────────

export function buildSummaryLineItems(services: Service[]): BookingSummaryLineItem[] {
  return services.map((service) => ({
    serviceId: service.id,
    name: service.name,
    durationMinutes: service.durationMinutes,
    price: service.price,
  }));
}

export interface BuildBookingSummaryOptions {
  draft: BookingDraft;
  catalog: BookingCatalog;
  taxRate?: number;
}

/** Resolve a full `BookingSummary` from an in-progress draft + catalog */
export function buildBookingSummary({
  draft,
  catalog,
  taxRate = 0,
}: BuildBookingSummaryOptions): BookingSummary {
  const { salon, branches, services, professionals, timeSlots } = catalog;

  const selectedServices = draft.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));

  const branch = draft.branchId
    ? branches.find((b) => b.id === draft.branchId)
    : undefined;

  const anyProfessional = draft.professionalId === "any";
  const professional = anyProfessional
    ? undefined
    : resolveProfessional(draft, professionals);
  const timeSlot = draft.timeSlotId
    ? timeSlots.find((t) => t.id === draft.timeSlotId)
    : undefined;

  const lineItems = buildSummaryLineItems(selectedServices);
  const totalDurationMinutes = calculateTotalDuration(selectedServices);
  const subtotal = calculateSubtotal(selectedServices);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax);

  const startTime = timeSlot?.startTime;
  const endTime =
    startTime && totalDurationMinutes > 0
      ? calculateEndTime(startTime, totalDurationMinutes)
      : timeSlot?.endTime;

  return {
    salon: {
      id: salon.id,
      slug: salon.slug,
      name: salon.name,
      currency: salon.currency,
    },
    branch: branch
      ? {
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
        }
      : undefined,
    lineItems,
    professional: professional
      ? {
          id: professional.id,
          displayName: professional.displayName,
          title: professional.title,
          avatarUrl: professional.avatarUrl,
        }
      : undefined,
    anyProfessional: anyProfessional || undefined,
    date: draft.date ?? timeSlot?.date,
    startTime,
    endTime,
    totalDurationMinutes,
    subtotal,
    tax,
    total,
    currency: salon.currency,
  };
}

function resolveProfessional(
  draft: BookingDraft,
  professionals: Professional[],
): Professional | undefined {
  if (!draft.professionalId || draft.professionalId === "any") return undefined;
  return professionals.find((p) => p.id === draft.professionalId);
}

// ─── Draft helpers ─────────────────────────────────────────────────────────────

export function getSelectedServices(draft: BookingDraft, services: Service[]): Service[] {
  return draft.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));
}

export function isDraftComplete(draft: BookingDraft): boolean {
  return Boolean(
    draft.branchId &&
      draft.serviceIds.length > 0 &&
      draft.professionalId &&
      draft.date &&
      draft.timeSlotId &&
      draft.clientDetails,
  );
}

export function formatClientName(client: ClientDetails): string {
  return `${client.firstName} ${client.lastName}`.trim();
}

export function findTimeSlotById(
  timeSlots: TimeSlot[],
  timeSlotId: string,
): TimeSlot | undefined {
  return timeSlots.find((slot) => slot.id === timeSlotId);
}

/** Check whether a draft has enough data to show a meaningful summary panel */
export function hasPartialSummary(draft: BookingDraft): boolean {
  return draft.serviceIds.length > 0;
}
