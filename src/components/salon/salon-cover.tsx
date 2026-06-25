import { cn } from "@/lib/utils";
import type { Salon } from "@/types/booking";

interface SalonCoverProps {
  salon: Pick<Salon, "name" | "coverImageUrl" | "tagline">;
  className?: string;
}

export function SalonCover({ salon, className }: SalonCoverProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {salon.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={salon.coverImageUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand-100 via-primary/20 to-slate-200" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
      </div>
    </div>
  );
}
