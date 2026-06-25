"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  BOOKING_INTRO_AUTO_DISMISS_MS,
  BOOKING_INTRO_WELCOME_PARAM,
} from "@/features/booking/booking-intro";

export function useBookingWelcomeIntro() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasWelcome = searchParams.get(BOOKING_INTRO_WELCOME_PARAM) === "1";

  const [open, setOpen] = useState(false);
  const dismissingRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;

    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    if (!params.has(BOOKING_INTRO_WELCOME_PARAM)) return;

    params.delete(BOOKING_INTRO_WELCOME_PARAM);
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!hasWelcome) {
      setOpen(false);
      dismissingRef.current = false;
      return;
    }

    dismissingRef.current = false;
    setOpen(true);
  }, [hasWelcome]);

  useEffect(() => {
    if (!open || !hasWelcome) return;

    const timeoutId = window.setTimeout(dismiss, BOOKING_INTRO_AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [open, hasWelcome, dismiss]);

  return { open, dismiss };
}
