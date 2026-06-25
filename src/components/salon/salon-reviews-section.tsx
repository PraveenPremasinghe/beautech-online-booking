import { ReviewCard } from "@/components/salon/review-card";
import type { CustomerReview } from "@/types/review";
import { formatRating } from "@/lib/format";
import type { Salon } from "@/types/booking";

interface SalonReviewsSectionProps {
  reviews: CustomerReview[];
  salon: Pick<Salon, "rating" | "reviewCount">;
  limit?: number;
}

export function SalonReviewsSection({
  reviews,
  salon,
  limit = 6,
}: SalonReviewsSectionProps) {
  const preview = reviews.slice(0, limit);

  return (
    <section id="reviews" className="scroll-mt-20 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          {formatRating(salon.rating)} average ·{" "}
          {salon.reviewCount.toLocaleString()} reviews
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {preview.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}
