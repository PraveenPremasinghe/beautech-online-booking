import { Suspense } from "react";

import { BookingInit } from "@/components/booking/booking-init";

interface BookSalonLayoutProps {
  children: React.ReactNode;
  params: Promise<{ salonSlug: string }>;
}

export default async function BookSalonLayout({
  children,
  params,
}: BookSalonLayoutProps) {
  const { salonSlug } = await params;

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-muted/30">
      <Suspense fallback={null}>
        <BookingInit salonSlug={salonSlug} />
      </Suspense>
      {children}
    </main>
  );
}
