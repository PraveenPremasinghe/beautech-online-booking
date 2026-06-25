import { MapPinIcon } from "@heroicons/react/24/outline";

import { BranchCard } from "@/components/booking/branch-card";
import { sortBranchesForDisplay } from "@/lib/branch-utils";
import { isOpenNow } from "@/lib/salon-utils";
import { mockOpeningHours } from "@/lib/mock-booking-data";
import type { Branch } from "@/types/booking";

interface BranchStepProps {
  branches: Branch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string) => void;
}

export function BranchStep({
  branches,
  selectedBranchId,
  onSelectBranch,
}: BranchStepProps) {
  const sorted = sortBranchesForDisplay(branches);
  const salonOpen = isOpenNow(mockOpeningHours);

  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <MapPinIcon className="size-6 opacity-40" aria-hidden />
        </span>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No branches available
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This salon does not have any bookable locations right now. Please
          check back later or contact the salon directly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4" role="listbox" aria-label="Select a branch">
      {sorted.map((branch) => (
        <div key={branch.id} role="option" aria-selected={selectedBranchId === branch.id}>
          <BranchCard
            branch={branch}
            selected={selectedBranchId === branch.id}
            isOpen={salonOpen}
            onSelect={onSelectBranch}
          />
        </div>
      ))}
    </div>
  );
}
