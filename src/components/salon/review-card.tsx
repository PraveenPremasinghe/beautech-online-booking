import { format, parseISO } from "date-fns";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { CustomerReview } from "@/types/review";

function formatReviewDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy");
}

interface ReviewCardProps {
  review: CustomerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="h-full rounded-xl border-border/70 py-0 shadow-sm">
      <CardHeader className="gap-3 px-5 pt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) =>
              index < review.rating ? (
                <StarIcon
                  key={index}
                  className="size-3.5 text-amber-400"
                  aria-hidden
                />
              ) : (
                <StarOutlineIcon
                  key={index}
                  className="size-3.5 text-muted-foreground/30"
                  aria-hidden
                />
              ),
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatReviewDate(review.date)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{review.authorName}</p>
          {review.serviceName ? (
            <CardDescription className="mt-0.5 text-xs">
              {review.serviceName}
              {review.professionalName ? ` · ${review.professionalName}` : ""}
            </CardDescription>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          &ldquo;{review.comment}&rdquo;
        </p>
        {review.serviceName ? (
          <Badge variant="secondary" className="mt-3 rounded-full text-xs">
            Verified visit
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
