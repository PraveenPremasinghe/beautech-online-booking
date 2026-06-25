import type { SignatureService } from "@/types/service";
import type { Service, ServiceCategory } from "@/types/booking";

export function toSignatureService(
  service: Service,
  categories: ServiceCategory[],
): SignatureService {
  const category = categories.find((item) => item.id === service.categoryId);

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    description: service.description,
    category: (category?.slug ?? "hair") as SignatureService["category"],
    durationMinutes: service.durationMinutes,
    priceFrom: service.price,
    currency: service.currency,
    isPopular: service.isPopular,
    imageGradient: service.imageGradient ?? "from-brand-100 to-slate-50",
  };
}
