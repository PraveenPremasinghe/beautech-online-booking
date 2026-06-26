import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().default("https://devbooking.beautech.biz"),
  NEXT_PUBLIC_BOOKING_GATEWAY_URL: z
    .string()
    .url()
    .default("https://devbooking.beautech.biz/api/v1/booking-gateway-service"),
  NEXT_PUBLIC_KEYCLOAK_URL: z.string().url().default("https://auth.beautech.biz/"),
  NEXT_PUBLIC_KEYCLOAK_REALM: z.string().default("beautech"),
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string().default("booking-client"),
  ENCRYPTION_KEY: z.string().default("dev-key-change-in-release"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_BOOKING_GATEWAY_URL: process.env.NEXT_PUBLIC_BOOKING_GATEWAY_URL,
  NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
});

export const APPOINTMENT_API_BASE = `${env.NEXT_PUBLIC_BASE_URL}/api/v1/appointment-service`;
