import type { Branch, Professional, Salon, Service, ServiceCategory } from "./booking";
import type { CustomerReview } from "@/types/review";

export interface OpeningHoursDay {
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: number;
  label: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface GalleryImage {
  id: string;
  alt: string;
  /** CSS gradient placeholder until real images are wired */
  gradient: string;
}

export interface SalonProfile {
  salon: Salon;
  primaryBranch: Branch;
  branches: Branch[];
  openingHours: OpeningHoursDay[];
  categories: ServiceCategory[];
  services: Service[];
  professionals: Professional[];
  gallery: GalleryImage[];
  reviews: CustomerReview[];
}
