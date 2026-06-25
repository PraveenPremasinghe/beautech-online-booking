/** Steps in the public booking wizard */
export type BookingStep =
  | "branch"
  | "services"
  | "professional"
  | "datetime"
  | "details"
  | "summary";

/** ISO 4217 currency code */
export type CurrencyCode = "USD" | "EUR" | "GBP" | "LKR";

/** Use "any" when the guest has no professional preference */
export type ProfessionalSelection = string | "any";

// ─── Salon ───────────────────────────────────────────────────────────────────

export interface Salon {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  coverImageUrl: string;
  logoUrl?: string;
  currency: CurrencyCode;
  timezone: string;
  cancellationPolicy: string;
}

/** @deprecated Use `Salon` — kept for landing-page compatibility */
export type SalonBrand = Pick<
  Salon,
  "name" | "slug" | "tagline" | "rating" | "reviewCount"
>;

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface BranchAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Branch {
  id: string;
  salonId: string;
  name: string;
  address: BranchAddress;
  phone: string;
  isPrimary: boolean;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  /** CSS gradient classes for placeholder branch photo */
  imageGradient?: string;
}

// ─── Service category ───────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
  icon?: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  slug: string;
  salonId: string;
  categoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  /** Listed price — may differ from promotional "from" pricing on landing */
  price: number;
  currency: CurrencyCode;
  isPopular?: boolean;
  imageUrl?: string;
  /** CSS gradient classes for placeholder media */
  imageGradient?: string;
  /** Professionals qualified to perform this service */
  professionalIds: string[];
}

// ─── Professional ────────────────────────────────────────────────────────────

export interface Professional {
  id: string;
  salonId: string;
  branchIds: string[];
  firstName: string;
  lastName: string;
  displayName: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  serviceIds: string[];
  isAvailable: boolean;
}

// ─── Time slot ───────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string;
  branchId: string;
  professionalId: string;
  /** ISO date — YYYY-MM-DD */
  date: string;
  /** 24h — HH:mm */
  startTime: string;
  /** 24h — HH:mm */
  endTime: string;
  isAvailable: boolean;
}

// ─── Client details ──────────────────────────────────────────────────────────

export interface ClientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  marketingOptIn?: boolean;
}

// ─── Booking draft (in-progress state) ───────────────────────────────────────

export interface BookingDraft {
  salonSlug: string;
  branchId?: string;
  serviceIds: string[];
  professionalId?: ProfessionalSelection;
  /** ISO date — YYYY-MM-DD */
  date?: string;
  timeSlotId?: string;
  clientDetails?: ClientDetails;
  /** ISO datetime — set when draft was last updated */
  updatedAt?: string;
}

export const EMPTY_BOOKING_DRAFT = (salonSlug: string): BookingDraft => ({
  salonSlug,
  serviceIds: [],
  updatedAt: new Date().toISOString(),
});

// ─── Booking summary (computed for UI) ───────────────────────────────────────

export interface BookingSummaryLineItem {
  serviceId: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface BookingSummary {
  salon: Pick<Salon, "id" | "slug" | "name" | "currency">;
  branch?: Pick<Branch, "id" | "name" | "address" | "phone">;
  lineItems: BookingSummaryLineItem[];
  professional?: Pick<
    Professional,
    "id" | "displayName" | "title" | "avatarUrl"
  >;
  /** Set when the guest chose "any available professional" */
  anyProfessional?: boolean;
  /** ISO date — YYYY-MM-DD */
  date?: string;
  /** 24h — HH:mm */
  startTime?: string;
  /** 24h — HH:mm */
  endTime?: string;
  totalDurationMinutes: number;
  subtotal: number;
  /** Tax amount — 0 when not applicable */
  tax: number;
  total: number;
  currency: CurrencyCode;
}

// ─── Appointment confirmation ─────────────────────────────────────────────────

export type AppointmentStatus = "confirmed" | "pending";

export interface AppointmentConfirmation {
  appointmentId: string;
  confirmationCode: string;
  status: AppointmentStatus;
  summary: BookingSummary;
  client: ClientDetails;
  /** ISO datetime */
  bookedAt: string;
  cancellationPolicy: string;
}

// ─── Lookup bundle (convenience for utils / mock resolvers) ──────────────────

export interface BookingCatalog {
  salon: Salon;
  branches: Branch[];
  categories: ServiceCategory[];
  services: Service[];
  professionals: Professional[];
  timeSlots: TimeSlot[];
}

/** @deprecated Use `BookingDraft` */
export type BookingState = BookingDraft;
