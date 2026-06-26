import { APPOINTMENT_API_BASE, env } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchAppointmentApiServer<T>(
  path: string,
  clientId: string,
  options: RequestInit = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${APPOINTMENT_API_BASE}${path}`;
  const headers = new Headers(options.headers);
  headers.set("X-Client-Id", clientId);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(`API ${res.status}: ${res.statusText}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function fetchGatewayApiServer<T>(
  path: string,
  clientId: string,
  options: RequestInit = {},
): Promise<T> {
  const base = env.NEXT_PUBLIC_BOOKING_GATEWAY_URL;
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const headers = new Headers(options.headers);
  headers.set("X-Client-Id", clientId);
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(`API ${res.status}: ${res.statusText}`, res.status);
  }
  return res.json() as Promise<T>;
}
