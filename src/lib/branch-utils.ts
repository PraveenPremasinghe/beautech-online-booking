import type { Branch } from "@/types/booking";

/** Mock distance labels until geolocation API is wired */
const BRANCH_DISTANCE_PLACEHOLDER: Record<string, string> = {
  "branch-1": "0.8 mi",
  "branch-2": "2.1 mi",
  "branch-3": "4.5 mi",
};

export function getBranchDistancePlaceholder(branchId: string): string {
  return BRANCH_DISTANCE_PLACEHOLDER[branchId] ?? "— mi";
}

export function sortBranchesForDisplay(branches: Branch[]): Branch[] {
  return [...branches].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.name.localeCompare(b.name);
  });
}
