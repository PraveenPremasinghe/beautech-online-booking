import { Skeleton } from "@/components/ui/skeleton";

function SlotGroupSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-24 rounded-md" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className="h-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TimeSlotsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading time slots">
      <SlotGroupSkeleton count={4} />
      <SlotGroupSkeleton count={4} />
      <SlotGroupSkeleton count={2} />
    </div>
  );
}
