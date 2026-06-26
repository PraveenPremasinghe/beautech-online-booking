import type { ApiBranch } from "@/types/api";
import type { Branch, BranchAddress } from "@/types/booking";

function parseAddress(raw?: string | null): BranchAddress {
  if (!raw?.trim()) {
    return {
      line1: "",
      city: "",
      postalCode: "",
      country: "",
    };
  }

  return {
    line1: raw.trim(),
    city: "",
    postalCode: "",
    country: "",
  };
}

export function mapApiBranch(api: ApiBranch, salonId: string): Branch {
  return {
    id: String(api.id),
    salonId,
    name: api.name,
    address: parseAddress(api.address),
    phone: api.phone ?? "",
    isPrimary: false,
    imageUrl: api.imageUrl ?? undefined,
  };
}

export function mapApiBranches(apiBranches: ApiBranch[], salonId: string): Branch[] {
  const branches = apiBranches.map((b) => mapApiBranch(b, salonId));
  if (branches.length > 0) {
    branches[0] = { ...branches[0], isPrimary: true };
  }
  return branches;
}
