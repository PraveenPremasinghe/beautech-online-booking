import type { Branch, BranchAddress } from "@/types/booking";
import type { OpeningHoursDay } from "@/types/salon-profile";

export function formatBranchAddress(address: BranchAddress): string {
  const street = address.line2
    ? `${address.line1}, ${address.line2}`
    : address.line1;
  return `${street}, ${address.city}${address.state ? `, ${address.state}` : ""} ${address.postalCode}`;
}

export function formatBranchAddressShort(address: BranchAddress): string {
  return `${address.city}${address.state ? `, ${address.state}` : ""}`;
}

export function getPrimaryBranch(branches: Branch[]): Branch {
  return branches.find((b) => b.isPrimary) ?? branches[0];
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatHoursRange(day: OpeningHoursDay): string {
  if (day.isClosed) return "Closed";
  return `${formatTime12h(day.open)} – ${formatTime12h(day.close)}`;
}

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatTimeLabel(time: string): string {
  return formatTime12h(time);
}

export function getOpenStatusText(
  hours: OpeningHoursDay[],
  now = new Date(),
): { isOpen: boolean; primary: string; secondary?: string } {
  const today = getTodayHours(hours, now);
  const openNow = isOpenNow(hours, now);

  if (!today || today.isClosed) {
    return { isOpen: false, primary: "Closed today" };
  }

  if (openNow) {
    return {
      isOpen: true,
      primary: "Open now",
      secondary: `Closes ${formatTime12h(today.close)}`,
    };
  }

  return {
    isOpen: false,
    primary: "Closed",
    secondary: `Opens ${formatTime12h(today.open)}`,
  };
}

/** Simple open-now check using local time (mock-friendly) */
export function isOpenNow(hours: OpeningHoursDay[], now = new Date()): boolean {
  const today = hours.find((day) => day.dayOfWeek === now.getDay());
  if (!today || today.isClosed) return false;

  const current = now.getHours() * 60 + now.getMinutes();
  const open = parseTimeToMinutes(today.open);
  const close = parseTimeToMinutes(today.close);
  return current >= open && current < close;
}

export function getTodayHours(hours: OpeningHoursDay[], now = new Date()): OpeningHoursDay | undefined {
  return hours.find((day) => day.dayOfWeek === now.getDay());
}
