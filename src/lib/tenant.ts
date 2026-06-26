const STORAGE_KEY = "booking_client_id";

const ALLOWED_TENANTS_DEV = [
  "demo",
  "test",
  "dev",
  "salon1",
  "salon2",
  "demo.beautech.biz",
];

const ALLOWED_TENANTS_PROD = ["demo", "salon1", "salon2", "demo.beautech.biz"];

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function isTenantAllowed(sanitized: string): boolean {
  const allowed = isProduction() ? ALLOWED_TENANTS_PROD : ALLOWED_TENANTS_DEV;

  if (sanitized.includes(".")) {
    return (
      allowed.includes(sanitized) ||
      allowed.some(
        (entry) => sanitized.startsWith(`${entry}.`) || entry.includes("."),
      ) ||
      (!isProduction() && sanitized.endsWith(".beautech.biz"))
    );
  }

  return allowed.includes(sanitized);
}

export function validateAndSetClientId(raw: string | null): string {
  if (!raw?.trim()) {
    throw new Error("Missing tenant parameter. Expected ?client=<tenant-id>");
  }

  const trimmed = raw.trim();
  const sanitized = trimmed.replace(/[^a-zA-Z0-9\-_.]/g, "");

  if (sanitized !== trimmed) {
    throw new Error(`Invalid tenant format: ${trimmed}`);
  }

  if (
    sanitized.includes("..") ||
    sanitized.startsWith(".") ||
    sanitized.endsWith(".")
  ) {
    throw new Error("Invalid tenant format");
  }

  if (sanitized.length < 2 || sanitized.length > 100) {
    throw new Error("Tenant identifier must be between 2 and 100 characters");
  }

  if (!isTenantAllowed(sanitized)) {
    throw new Error(`Invalid tenant: ${sanitized}`);
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, sanitized);
  }

  return sanitized;
}

export function getClientId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY)?.trim() || null;
}

export function initClientIdFromSearchParams(
  params: URLSearchParams,
): string | null {
  const client = params.get("client");
  if (!client) return getClientId();
  try {
    return validateAndSetClientId(client);
  } catch {
    return null;
  }
}

export function withClientQuery(path: string, clientId?: string | null): string {
  const client = clientId ?? getClientId();
  if (!client) return path;

  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.set("client", client);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function appendClientToUrl(url: string, clientId?: string | null): string {
  const client = clientId ?? getClientId();
  if (!client) return url;

  const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  parsed.searchParams.set("client", client);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
