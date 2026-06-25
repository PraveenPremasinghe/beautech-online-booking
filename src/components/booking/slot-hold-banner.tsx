import { ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";

interface SlotHoldBannerProps {
  expiresAt: Date;
}

export function SlotHoldBanner({ expiresAt }: SlotHoldBannerProps) {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    function updateRemaining() {
      const now = new Date();
      if (expiresAt <= now) {
        setRemaining(null);
        return;
      }

      setRemaining(
        formatDistanceStrict(expiresAt, now, {
          unit: "minute",
          roundingMethod: "ceil",
        }),
      );
    }

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 15_000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  if (!remaining) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
      <ClockIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div>
        <p className="font-medium text-foreground">
          We&apos;ll hold this time for 5 minutes
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {remaining} remaining to complete your booking
        </p>
      </div>
    </div>
  );
}
