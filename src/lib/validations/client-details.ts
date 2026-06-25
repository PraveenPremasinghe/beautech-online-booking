import type { ClientDetails } from "@/types/booking";
import { z } from "zod";

export const CLIENT_NOTES_MAX_LENGTH = 500;

export const clientDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z.string().trim().max(50, "Last name is too long"),
  email: z.union([z.literal(""), z.string().email("Enter a valid email")]),
  phone: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .min(8, "Enter a valid mobile number")
    .max(20, "Mobile number is too long"),
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
