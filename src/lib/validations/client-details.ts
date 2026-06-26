import type { ClientDetails } from "@/types/booking";
import { z } from "zod";

export const CLIENT_NOTES_MAX_LENGTH = 500;

export const bookingEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
});

export type BookingEmailFormValues = z.infer<typeof bookingEmailSchema>;

export const clientDetailsSchema = z.object({
  firstName: z.string().trim().max(50, "First name is too long"),
  lastName: z.string().trim().max(50, "Last name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  phone: z.string().trim().max(20, "Mobile number is too long"),
  notes: z
    .string()
    .max(
      CLIENT_NOTES_MAX_LENGTH,
      `Notes must be ${CLIENT_NOTES_MAX_LENGTH} characters or less`,
    )
    .optional(),
  marketingOptIn: z.boolean().optional(),
}) satisfies z.ZodType<ClientDetails>;

export type ClientDetailsFormValues = z.infer<typeof clientDetailsSchema>;

export const clientDetailsDefaultValues: ClientDetailsFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  marketingOptIn: false,
};

export function clientDetailsFromEmail(email: string): ClientDetails {
  const trimmed = email.trim();
  const localPart = trimmed.split("@")[0] ?? "Guest";
  const firstName =
    localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[._-]/g, " ");

  return {
    firstName,
    lastName: "",
    email: trimmed,
    phone: "",
  };
}

export function toClientDetails(values: ClientDetailsFormValues): ClientDetails {
  const notes = values.notes?.trim();

  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    notes: notes ? notes : undefined,
    marketingOptIn: values.marketingOptIn,
  };
}

export function toClientDetailsFormValues(
  details?: ClientDetails | null,
): ClientDetailsFormValues {
  if (!details) {
    return clientDetailsDefaultValues;
  }

  return {
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    phone: details.phone,
    notes: details.notes ?? "",
    marketingOptIn: details.marketingOptIn ?? false,
  };
}
