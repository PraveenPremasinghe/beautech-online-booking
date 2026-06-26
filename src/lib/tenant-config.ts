import type { Salon } from "@/types/booking";
import type { OpeningHoursDay } from "@/types/salon-profile";

const DEFAULT_OPENING_HOURS: OpeningHoursDay[] = [
  { dayOfWeek: 1, label: "Monday", open: "09:00", close: "19:00" },
  { dayOfWeek: 2, label: "Tuesday", open: "09:00", close: "19:00" },
  { dayOfWeek: 3, label: "Wednesday", open: "09:00", close: "19:00" },
  { dayOfWeek: 4, label: "Thursday", open: "09:00", close: "20:00" },
  { dayOfWeek: 5, label: "Friday", open: "09:00", close: "20:00" },
  { dayOfWeek: 6, label: "Saturday", open: "10:00", close: "18:00" },
  { dayOfWeek: 0, label: "Sunday", open: "10:00", close: "17:00", isClosed: false },
];

const TENANT_SALONS: Record<string, Salon> = {
  demo: {
    id: "demo",
    slug: "beautech-studio",
    name: "Beautech Studio",
    tagline: "Premium beauty & wellness",
    description:
      "Book your next appointment online. Professional stylists, premium products, and a relaxing atmosphere.",
    rating: 4.9,
    reviewCount: 128,
    coverImageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop",
    currency: "USD",
    timezone: "America/New_York",
    cancellationPolicy:
      "Free cancellation up to 24 hours before your appointment. Late cancellations may incur a fee.",
  },
};

export function getTenantSalon(clientId: string): Salon {
  return (
    TENANT_SALONS[clientId] ?? {
      ...TENANT_SALONS.demo,
      id: clientId,
      slug: clientId,
      name: clientId,
    }
  );
}

export function getTenantOpeningHours(): OpeningHoursDay[] {
  return DEFAULT_OPENING_HOURS;
}

export function getTenantCancellationPolicy(clientId: string): string {
  return getTenantSalon(clientId).cancellationPolicy;
}
