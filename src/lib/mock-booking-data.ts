import { addDays, format, startOfDay } from "date-fns";

import { toSignatureService } from "@/lib/booking-mappers";
import { mockCustomerReviews } from "@/data/mock/reviews";
import type {
  AppointmentConfirmation,
  BookingCatalog,
  BookingDraft,
  Branch,
  ClientDetails,
  Professional,
  Salon,
  Service,
  ServiceCategory,
  TimeSlot,
} from "@/types/booking";
import type {
  GalleryImage,
  OpeningHoursDay,
  SalonProfile,
} from "@/types/salon-profile";

// ─── IDs ─────────────────────────────────────────────────────────────────────

export const MOCK_SALON_ID = "salon-1";
export const MOCK_SALON_SLUG = "beautech-studio";

// ─── Salon ───────────────────────────────────────────────────────────────────

export const mockSalon: Salon = {
  id: MOCK_SALON_ID,
  slug: MOCK_SALON_SLUG,
  name: "Beautech Studio",
  tagline: "Where confidence meets craft.",
  description:
    "A premium beauty destination offering hair, skin, nails, and wellness services. Book online and enjoy a seamless, luxury experience from arrival to finish.",
  rating: 4.9,
  reviewCount: 1284,
  coverImageUrl: "/images/salon-cover.jpg",
  logoUrl: "/images/salon-logo.svg",
  currency: "USD",
  timezone: "America/New_York",
  cancellationPolicy:
    "Free cancellation up to 24 hours before your appointment. Late cancellations may incur a 50% fee.",
};

// ─── Branches ────────────────────────────────────────────────────────────────

export const mockBranches: Branch[] = [
  {
    id: "branch-1",
    salonId: MOCK_SALON_ID,
    name: "Beautech Studio — Downtown",
    address: {
      line1: "120 Madison Avenue",
      line2: "Suite 4B",
      city: "New York",
      state: "NY",
      postalCode: "10016",
      country: "US",
    },
    phone: "+1 (212) 555-0142",
    isPrimary: true,
    latitude: 40.7484,
    longitude: -73.9857,
    imageGradient: "from-violet-300 via-primary/30 to-brand-100",
  },
  {
    id: "branch-2",
    salonId: MOCK_SALON_ID,
    name: "Beautech Studio — West Village",
    address: {
      line1: "48 Bleecker Street",
      city: "New York",
      state: "NY",
      postalCode: "10012",
      country: "US",
    },
    phone: "+1 (212) 555-0198",
    isPrimary: false,
    latitude: 40.7259,
    longitude: -73.9944,
    imageGradient: "from-rose-200 via-brand-100 to-slate-100",
  },
  {
    id: "branch-3",
    salonId: MOCK_SALON_ID,
    name: "Beautech Studio — Brooklyn Heights",
    address: {
      line1: "85 Montague Street",
      city: "Brooklyn",
      state: "NY",
      postalCode: "11201",
      country: "US",
    },
    phone: "+1 (718) 555-0176",
    isPrimary: false,
    latitude: 40.696,
    longitude: -73.9936,
    imageGradient: "from-sky-200 via-primary/15 to-slate-100",
  },
];

// ─── Service categories ───────────────────────────────────────────────────────

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: "cat-hair",
    slug: "hair",
    name: "Hair",
    description: "Cuts, colour, styling, and treatments",
    sortOrder: 1,
    icon: "scissors",
  },
  {
    id: "cat-nails",
    slug: "nails",
    name: "Nails",
    description: "Manicures, pedicures, and nail art",
    sortOrder: 2,
    icon: "sparkles",
  },
  {
    id: "cat-skin",
    slug: "skin",
    name: "Skin",
    description: "Facials and skin rejuvenation",
    sortOrder: 3,
    icon: "droplets",
  },
  {
    id: "cat-brows",
    slug: "brows",
    name: "Brows",
    description: "Brow shaping and lamination",
    sortOrder: 4,
    icon: "eye",
  },
  {
    id: "cat-makeup",
    slug: "makeup",
    name: "Makeup",
    description: "Event and editorial makeup",
    sortOrder: 5,
    icon: "palette",
  },
  {
    id: "cat-spa",
    slug: "spa",
    name: "Spa",
    description: "Massage and wellness rituals",
    sortOrder: 6,
    icon: "leaf",
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const mockServices: Service[] = [
  {
    id: "svc-1",
    slug: "signature-blowout",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-hair",
    name: "Signature Blowout",
    description:
      "Wash, blow-dry, and finish with a glossy, long-lasting style tailored to your hair type.",
    durationMinutes: 45,
    price: 55,
    currency: "USD",
    isPopular: true,
    imageGradient: "from-brand-100 via-brand-50 to-slate-50",
    professionalIds: ["pro-1", "pro-2", "pro-4"],
  },
  {
    id: "svc-2",
    slug: "gel-manicure",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-nails",
    name: "Gel Manicure",
    description:
      "Chip-resistant gel polish with cuticle care and a flawless, salon-grade finish.",
    durationMinutes: 50,
    price: 42,
    currency: "USD",
    isPopular: true,
    imageGradient: "from-fuchsia-100 via-pink-50 to-brand-50",
    professionalIds: ["pro-3", "pro-5"],
  },
  {
    id: "svc-3",
    slug: "hydrating-facial",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-skin",
    name: "Hydrating Facial",
    description:
      "Deep cleanse, exfoliation, and hydration boost for instantly refreshed, radiant skin.",
    durationMinutes: 60,
    price: 85,
    currency: "USD",
    imageGradient: "from-sky-100 via-blue-50 to-indigo-50",
    professionalIds: ["pro-6"],
  },
  {
    id: "svc-4",
    slug: "brow-lamination",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-brows",
    name: "Brow Lamination",
    description:
      "Lifted, fuller brows with a brushed-up look that lasts for weeks.",
    durationMinutes: 40,
    price: 65,
    currency: "USD",
    imageGradient: "from-amber-100 via-orange-50 to-yellow-50",
    professionalIds: ["pro-5", "pro-6"],
  },
  {
    id: "svc-5",
    slug: "event-makeup",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-makeup",
    name: "Event Makeup",
    description:
      "Camera-ready glam with skin prep and a personalized look for any occasion.",
    durationMinutes: 75,
    price: 95,
    currency: "USD",
    imageGradient: "from-violet-100 via-purple-50 to-brand-50",
    professionalIds: ["pro-5"],
  },
  {
    id: "svc-6",
    slug: "scalp-spa-ritual",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-spa",
    name: "Scalp Spa Ritual",
    description:
      "Therapeutic scalp massage and treatment to relieve tension and restore balance.",
    durationMinutes: 55,
    price: 72,
    currency: "USD",
    imageGradient: "from-emerald-100 via-teal-50 to-cyan-50",
    professionalIds: ["pro-1", "pro-4"],
  },
  {
    id: "svc-7",
    slug: "womens-haircut",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-hair",
    name: "Women's Haircut",
    description: "Consultation, precision cut, and styled finish.",
    durationMinutes: 60,
    price: 78,
    currency: "USD",
    professionalIds: ["pro-1", "pro-2"],
  },
  {
    id: "svc-8",
    slug: "classic-pedicure",
    salonId: MOCK_SALON_ID,
    categoryId: "cat-nails",
    name: "Classic Pedicure",
    description: "Soak, exfoliation, nail care, and polish application.",
    durationMinutes: 45,
    price: 48,
    currency: "USD",
    professionalIds: ["pro-3"],
  },
];

// ─── Professionals ────────────────────────────────────────────────────────────

export const mockProfessionals: Professional[] = [
  {
    id: "pro-1",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-1", "branch-2"],
    firstName: "Alex",
    lastName: "Rivera",
    displayName: "Alex Rivera",
    title: "Senior Stylist",
    bio: "Specialist in blowouts and colour corrections with 10+ years of experience.",
    avatarUrl: undefined,
    rating: 4.9,
    reviewCount: 312,
    serviceIds: ["svc-1", "svc-6", "svc-7"],
    isAvailable: true,
  },
  {
    id: "pro-2",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-1"],
    firstName: "Jordan",
    lastName: "Lee",
    displayName: "Jordan Lee",
    title: "Hair Stylist",
    bio: "Precision cuts and modern styling for all hair textures.",
    rating: 4.8,
    reviewCount: 198,
    serviceIds: ["svc-1", "svc-7"],
    isAvailable: true,
  },
  {
    id: "pro-3",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-1", "branch-3"],
    firstName: "Sam",
    lastName: "Nguyen",
    displayName: "Sam Nguyen",
    title: "Nail Technician",
    bio: "Gel specialist known for long-lasting, chip-free finishes.",
    rating: 4.9,
    reviewCount: 256,
    serviceIds: ["svc-2", "svc-8"],
    isAvailable: true,
  },
  {
    id: "pro-4",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-2"],
    firstName: "Taylor",
    lastName: "Brooks",
    displayName: "Taylor Brooks",
    title: "Stylist & Spa Therapist",
    rating: 4.7,
    reviewCount: 143,
    serviceIds: ["svc-1", "svc-6"],
    isAvailable: true,
  },
  {
    id: "pro-5",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-1", "branch-2", "branch-3"],
    firstName: "Morgan",
    lastName: "Chen",
    displayName: "Morgan Chen",
    title: "Beauty Specialist",
    bio: "Brows, nails, and event makeup — your all-in-one glam expert.",
    rating: 5.0,
    reviewCount: 421,
    serviceIds: ["svc-2", "svc-4", "svc-5"],
    isAvailable: true,
  },
  {
    id: "pro-6",
    salonId: MOCK_SALON_ID,
    branchIds: ["branch-1"],
    firstName: "Riley",
    lastName: "Patel",
    displayName: "Riley Patel",
    title: "Esthetician",
    bio: "Skin health focused facials and brow artistry.",
    rating: 4.9,
    reviewCount: 187,
    serviceIds: ["svc-3", "svc-4"],
    isAvailable: true,
  },
];

const TIME_SLOT_BRANCH_PRO_CONFIGS: Array<{
  branchId: string;
  professionalId: string;
}> = [
  { branchId: "branch-1", professionalId: "pro-1" },
  { branchId: "branch-1", professionalId: "pro-2" },
  { branchId: "branch-1", professionalId: "pro-5" },
  { branchId: "branch-1", professionalId: "pro-6" },
  { branchId: "branch-2", professionalId: "pro-1" },
  { branchId: "branch-2", professionalId: "pro-4" },
  { branchId: "branch-3", professionalId: "pro-3" },
  { branchId: "branch-3", professionalId: "pro-5" },
];

function generateTimeSlots(
  branchId: string,
  professionalId: string,
  date: string,
  slots: Array<{ start: string; end: string; available?: boolean }>,
): TimeSlot[] {
  return slots.map((slot, index) => ({
    id: `slot-${branchId}-${professionalId}-${date}-${index}`,
    branchId,
    professionalId,
    date,
    startTime: slot.start,
    endTime: slot.end,
    isAvailable: slot.available ?? true,
  }));
}

const sampleDaySlots = [
  { start: "09:00", end: "09:45" },
  { start: "09:45", end: "10:30" },
  { start: "10:30", end: "11:15", available: false },
  { start: "11:15", end: "12:00" },
  { start: "13:00", end: "13:45" },
  { start: "13:45", end: "14:30" },
  { start: "14:30", end: "15:15" },
  { start: "15:15", end: "16:00" },
  { start: "16:00", end: "16:45" },
  { start: "16:45", end: "17:30" },
];

function buildMockTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = startOfDay(new Date());

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = format(addDays(today, dayOffset), "yyyy-MM-dd");
    const isLimitedDay = dayOffset === 13;

    for (const config of TIME_SLOT_BRANCH_PRO_CONFIGS) {
      const daySlots = sampleDaySlots.map((slot, index) => ({
        ...slot,
        available: isLimitedDay ? index % 2 === 0 : slot.available ?? true,
      }));

      slots.push(
        ...generateTimeSlots(
          config.branchId,
          config.professionalId,
          date,
          daySlots,
        ),
      );
    }
  }

  return slots;
}

export const mockTimeSlots: TimeSlot[] = buildMockTimeSlots();

// ─── Catalog bundle ───────────────────────────────────────────────────────────

export const mockBookingCatalog: BookingCatalog = {
  salon: mockSalon,
  branches: mockBranches,
  categories: mockServiceCategories,
  services: mockServices,
  professionals: mockProfessionals,
  timeSlots: mockTimeSlots,
};

// ─── Sample draft & confirmation ─────────────────────────────────────────────

export const mockClientDetails: ClientDetails = {
  firstName: "Jamie",
  lastName: "Taylor",
  email: "jamie.taylor@example.com",
  phone: "+1 (555) 123-4567",
  notes: "First visit — sensitive scalp.",
  marketingOptIn: true,
};

export const mockBookingDraft: BookingDraft = {
  salonSlug: MOCK_SALON_SLUG,
  branchId: "branch-1",
  serviceIds: ["svc-1", "svc-4"],
  professionalId: "pro-1",
  date: "2026-06-23",
  timeSlotId: "slot-branch-1-pro-1-2026-06-23-0",
  clientDetails: mockClientDetails,
  updatedAt: "2026-06-22T10:00:00.000Z",
};

export const mockAppointmentConfirmation: AppointmentConfirmation = {
  appointmentId: "appt-20260623-001",
  confirmationCode: "BT-X7K9M2",
  status: "confirmed",
  summary: {
    salon: {
      id: mockSalon.id,
      slug: mockSalon.slug,
      name: mockSalon.name,
      currency: mockSalon.currency,
    },
    branch: {
      id: mockBranches[0].id,
      name: mockBranches[0].name,
      address: mockBranches[0].address,
      phone: mockBranches[0].phone,
    },
    lineItems: [
      {
        serviceId: "svc-1",
        name: "Signature Blowout",
        durationMinutes: 45,
        price: 55,
      },
      {
        serviceId: "svc-4",
        name: "Brow Lamination",
        durationMinutes: 40,
        price: 65,
      },
    ],
    professional: {
      id: "pro-1",
      displayName: "Alex Rivera",
      title: "Senior Stylist",
    },
    date: "2026-06-23",
    startTime: "09:00",
    endTime: "10:25",
    totalDurationMinutes: 85,
    subtotal: 120,
    tax: 0,
    total: 120,
    currency: "USD",
  },
  client: mockClientDetails,
  bookedAt: "2026-06-22T10:05:00.000Z",
  cancellationPolicy: mockSalon.cancellationPolicy,
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getSalonBySlug(slug: string): Salon | undefined {
  return slug === mockSalon.slug ? mockSalon : undefined;
}

export function getBranchesBySalonId(salonId: string): Branch[] {
  return mockBranches.filter((branch) => branch.salonId === salonId);
}

export function getServicesBySalonId(salonId: string): Service[] {
  return mockServices.filter((service) => service.salonId === salonId);
}

export function getServicesByCategoryId(categoryId: string): Service[] {
  return mockServices.filter((service) => service.categoryId === categoryId);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return mockServices.find((service) => service.slug === slug);
}

export function getProfessionalsByBranchId(branchId: string): Professional[] {
  return mockProfessionals.filter(
    (pro) => pro.branchIds.includes(branchId) && pro.isAvailable,
  );
}

export function getProfessionalsForServices(
  branchId: string,
  serviceIds: string[],
): Professional[] {
  return mockProfessionals.filter(
    (pro) =>
      pro.branchIds.includes(branchId) &&
      pro.isAvailable &&
      serviceIds.every((id) => pro.serviceIds.includes(id)),
  );
}

export function getTimeSlotsForProfessional(
  branchId: string,
  professionalId: string,
  date: string,
): TimeSlot[] {
  return mockTimeSlots.filter(
    (slot) =>
      slot.branchId === branchId &&
      slot.professionalId === professionalId &&
      slot.date === date &&
      slot.isAvailable,
  );
}

export function getBookingCatalogBySlug(slug: string): BookingCatalog | undefined {
  if (slug !== mockSalon.slug) return undefined;
  return mockBookingCatalog;
}

/** Landing-page compatible subset — popular signature services */
export const mockSignatureServices = mockServices
  .filter((service) => service.isPopular)
  .map((service) => toSignatureService(service, mockServiceCategories));

/** Landing-page compatible salon brand pick */
export const mockSalonBrand = {
  name: mockSalon.name,
  slug: mockSalon.slug,
  tagline: mockSalon.tagline,
  rating: mockSalon.rating,
  reviewCount: mockSalon.reviewCount,
};

// ─── Salon profile extras ─────────────────────────────────────────────────────

export const mockOpeningHours: OpeningHoursDay[] = [
  { dayOfWeek: 1, label: "Monday", open: "09:00", close: "20:00" },
  { dayOfWeek: 2, label: "Tuesday", open: "09:00", close: "20:00" },
  { dayOfWeek: 3, label: "Wednesday", open: "09:00", close: "20:00" },
  { dayOfWeek: 4, label: "Thursday", open: "09:00", close: "21:00" },
  { dayOfWeek: 5, label: "Friday", open: "09:00", close: "21:00" },
  { dayOfWeek: 6, label: "Saturday", open: "08:00", close: "19:00" },
  { dayOfWeek: 0, label: "Sunday", open: "10:00", close: "18:00" },
];

export const mockGalleryImages: GalleryImage[] = [
  {
    id: "gal-1",
    alt: "Salon interior with styling chairs",
    gradient: "from-slate-200 via-brand-50 to-primary/10",
  },
  {
    id: "gal-2",
    alt: "Nail bar station",
    gradient: "from-fuchsia-100 via-pink-50 to-brand-50",
  },
  {
    id: "gal-3",
    alt: "Treatment room",
    gradient: "from-sky-100 via-blue-50 to-indigo-50",
  },
  {
    id: "gal-4",
    alt: "Reception and retail area",
    gradient: "from-amber-100 via-orange-50 to-yellow-50",
  },
  {
    id: "gal-5",
    alt: "Hair colour studio",
    gradient: "from-violet-100 via-purple-50 to-brand-100",
  },
  {
    id: "gal-6",
    alt: "Relaxation lounge",
    gradient: "from-emerald-100 via-teal-50 to-cyan-50",
  },
];

export function getSalonProfileBySlug(slug: string): SalonProfile | undefined {
  if (slug !== mockSalon.slug) return undefined;

  const primaryBranch =
    mockBranches.find((branch) => branch.isPrimary) ?? mockBranches[0];

  return {
    salon: mockSalon,
    primaryBranch,
    branches: mockBranches,
    openingHours: mockOpeningHours,
    categories: mockServiceCategories,
    services: mockServices,
    professionals: mockProfessionals.filter((pro) => pro.isAvailable),
    gallery: mockGalleryImages,
    reviews: mockCustomerReviews,
  };
}
