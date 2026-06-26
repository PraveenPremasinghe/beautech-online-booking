# Beautech Online Booking

Next.js booking app wired to the Beautech appointment-service APIs (same backend as the Angular `beautech-appointment-v2-frontend` project).

## Getting started

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Open with a tenant query param (required for API calls):

```
http://localhost:3000/?client=demo
```

Booking flow:

```
http://localhost:3000/book/beautech-studio/branch?client=demo
```

## Environment variables

See [`.env.local.example`](.env.local.example). Key values:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BASE_URL` | Appointment API host |
| `NEXT_PUBLIC_BOOKING_GATEWAY_URL` | Booking gateway (Google auth state) |
| `NEXT_PUBLIC_KEYCLOAK_*` | Keycloak Google login |
| `ENCRYPTION_KEY` | Encrypted booking draft (`_a`) |

## API integration

- All booking data is fetched per step from `appointment-service` (branches, treatments, employees, slots, appointments).
- Tenant is passed as `?client=` and sent as `X-Client-Id` on every request.
- Google sign-in uses Keycloak + booking-gateway (`/public/booking-auth/state`).
- Profile page: `/profile?client=demo` lists customer appointments.

See [`src/doc/NEXTJS_MIGRATION.md`](src/doc/NEXTJS_MIGRATION.md) for the full API reference.

## Scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # production server
npm run lint   # ESLint
```
