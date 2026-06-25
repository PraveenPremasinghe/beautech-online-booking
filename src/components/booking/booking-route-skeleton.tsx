"use client";

import { usePathname } from "next/navigation";

import {
  BookingConfirmedSkeleton,
  BookingShellSkeleton,
  type BookingSkeletonVariant,
} from "@/components/booking/booking-skeletons";
import { Container } from "@/components/layout/container";
const SEGMENT_TO_VARIANT: Record<string, BookingSkeletonVariant> = {
  branch: "branch",
  services: "services",
  professional: "professional",
  time: "datetime",
  datetime: "datetime",
  details: "details",
  summary: "summary",
};

function segmentToVariant(segment: string): BookingSkeletonVariant {
  return SEGMENT_TO_VARIANT[segment] ?? "branch";
}

function isConfirmedRoute(pathname: string): boolean {
  return pathname.includes("/confirmed/");
}

export function BookingRouteSkeleton() {
  const pathname = usePathname();

  if (isConfirmedRoute(pathname)) {
    return (
      <Container as="div" className="px-4">
        <BookingConfirmedSkeleton />
      </Container>
    );
  }

  const segment = pathname.split("/").pop() ?? "branch";
  const variant = segmentToVariant(segment);

  return <BookingShellSkeleton variant={variant} />;
}
