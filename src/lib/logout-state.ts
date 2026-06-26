const LOGOUT_KEY = "keycloak_logout_complete";

export function isLogoutInProgress(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(LOGOUT_KEY) === "true";
}

export function setLoggingOut(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LOGOUT_KEY);
}

export function setLoggedOut(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGOUT_KEY, "true");
}

export function resetLogoutState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LOGOUT_KEY);
}
