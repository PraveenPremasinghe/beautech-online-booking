import { cn } from "@/lib/utils";
import { dsStatus, dsStatusDot } from "@/lib/design-system/patterns";
import type { BookingStatus } from "@/lib/design-system/tokens";

const statusLabels: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
  "in-progress": "In progress",
  "no-show": "No show",
};

interface StatusBadgeProps {
  status: BookingStatus;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(dsStatus({ status }), className)}>
      {showDot ? (
        <span className={dsStatusDot({ status })} aria-hidden />
      ) : null}
      {label ?? statusLabels[status]}
    </span>
  );
}
