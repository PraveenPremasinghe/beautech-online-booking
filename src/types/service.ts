import type { CurrencyCode } from "./booking";

/** Category slug used in UI labels and filters */
export type ServiceCategorySlug =
  | "hair"
  | "nails"
  | "skin"
  | "makeup"
  | "spa"
  | "brows";

/** Landing-page service card view model */
export interface SignatureService {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategorySlug;
  durationMinutes: number;
  priceFrom: number;
  currency: CurrencyCode;
  isPopular?: boolean;
  imageGradient: string;
}

export type { Service, ServiceCategory } from "./booking";
