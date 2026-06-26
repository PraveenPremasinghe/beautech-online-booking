"use client";

import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCurrentCustomer } from "@/lib/api/customers";
import { fetchCustomerAppointments } from "@/lib/api/profile";
import { logout, loginWithGoogle } from "@/lib/booking-auth";
import { BOOKING_ROUTES } from "@/lib/constants";
import { isLoggedIn } from "@/lib/keycloak";
import { getClientId } from "@/lib/tenant";
import type { ApiOnlineAppointment } from "@/types/api";

function formatAppointmentWhen(appointment: ApiOnlineAppointment): string {
  const raw = appointment.startTime ?? appointment.date;
  if (!raw) return "—";
  try {
    return format(parseISO(raw), "EEE d MMM yyyy · h:mm a");
  } catch {
    return raw;
  }
}

function filterByStatus(
  appointments: ApiOnlineAppointment[],
  status: "pending" | "completed",
): ApiOnlineAppointment[] {
  return appointments.filter((item) => {
    const value = (item.status ?? "").toUpperCase();
    if (status === "pending") {
      return value === "PENDING" || value === "CONFIRMED";
    }
    return value === "COMPLETED" || value === "CANCELLED";
  });
}

export function ProfileClient() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function guard() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        await loginWithGoogle(getClientId() ?? undefined);
        return;
      }
      setAuthChecked(true);
    }
    void guard();
  }, []);

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ["customer-me", getClientId()],
    queryFn: fetchCurrentCustomer,
    enabled: authChecked,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["profile-appointments", customer?.id, getClientId()],
    queryFn: () => fetchCustomerAppointments(customer!.id!),
    enabled: authChecked && customer?.id != null,
  });

  const pending = useMemo(
    () => filterByStatus(appointments, "pending"),
    [appointments],
  );
  const completed = useMemo(
    () => filterByStatus(appointments, "completed"),
    [appointments],
  );

  if (!authChecked || customerLoading) {
    return (
      <Container as="div" className="py-16 text-center text-sm text-muted-foreground">
        Loading your profile…
      </Container>
    );
  }

  return (
    <Container as="div" className="max-w-3xl space-y-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer?.name ?? customer?.email ?? "Signed in"}
            {customer?.mobile ? ` · ${customer.mobile}` : null}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(BOOKING_ROUTES.book("beautech-studio"))}
          >
            Book again
          </Button>
          <Button variant="ghost" onClick={() => logout(BOOKING_ROUTES.home())}>
            Sign out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Upcoming ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {appointmentsLoading ? (
            <p className="text-sm text-muted-foreground">Loading appointments…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
          ) : (
            pending.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-xl border border-border/70 bg-card p-4"
              >
                <p className="font-medium">
                  {item.treatments?.map((t) => t.name).join(", ") || "Appointment"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatAppointmentWhen(item)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {item.status}
                </p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {appointmentsLoading ? (
            <p className="text-sm text-muted-foreground">Loading appointments…</p>
          ) : completed.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past appointments.</p>
          ) : (
            completed.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-xl border border-border/70 bg-card p-4"
              >
                <p className="font-medium">
                  {item.treatments?.map((t) => t.name).join(", ") || "Appointment"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatAppointmentWhen(item)}
                </p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
}
