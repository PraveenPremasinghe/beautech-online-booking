import CryptoJS from "crypto-js";

import { env } from "@/lib/env";

const APPOINTMENT_KEY = "_a";
const BOOKING_DRAFT_KEY = "booking_draft";
const LAST_APPOINTMENT_KEY = "last_appointment";

export interface BookingDraftStorage {
  branch?: unknown;
  services?: unknown[];
  professional?: unknown;
  schedule?: {
    date?: string;
    selectedTime?: { selectedTime?: string };
    employeeId?: number | string;
  };
  tenant?: string;
  returnTo?: string;
  [key: string]: unknown;
}

function getEncryptionKey(): string {
  return env.ENCRYPTION_KEY;
}

export function saveEncryptedAppointment(data: unknown): void {
  if (typeof window === "undefined") return;
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    getEncryptionKey(),
  ).toString();
  localStorage.setItem(APPOINTMENT_KEY, encrypted);
}

export function loadEncryptedAppointment<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(APPOINTMENT_KEY);
  if (!raw) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(raw, getEncryptionKey());
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

export function clearEncryptedAppointment(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(APPOINTMENT_KEY);
}

export function saveBookingDraft(draft: BookingDraftStorage): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
}

export function loadBookingDraft<T = BookingDraftStorage>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(BOOKING_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(BOOKING_DRAFT_KEY);
}

export function saveLastAppointment(data: unknown): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_APPOINTMENT_KEY, JSON.stringify(data));
}

export function consumeLastAppointment<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(LAST_APPOINTMENT_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(LAST_APPOINTMENT_KEY);
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearAllBookingStorage(): void {
  clearEncryptedAppointment();
  clearBookingDraft();
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LAST_APPOINTMENT_KEY);
}
