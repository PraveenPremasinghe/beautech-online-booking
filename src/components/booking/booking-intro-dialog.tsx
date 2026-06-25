"use client";

import {
  BellAlertIcon,
  CalendarDaysIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BOOKING_INTRO_AUTO_DISMISS_MS,
  BOOKING_INTRO_CONTENT,
} from "@/features/booking/booking-intro";
import { cn } from "@/lib/utils";

const introIcons = [CalendarDaysIcon, BellAlertIcon] as const;

interface BookingIntroDialogProps {
  open: boolean;
  onDismiss: () => void;
}

export function BookingIntroDialog({ open, onDismiss }: BookingIntroDialogProps) {
  const [countdownKey, setCountdownKey] = useState(0);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      setCountdownKey((key) => key + 1);
    }
  }, [open]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && wasOpenRef.current) {
      onDismiss();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden border-border/70 p-0 sm:max-w-md"
      >
        <BorderBeam
          size={100}
          duration={8}
          colorFrom="var(--primary)"
          colorTo="var(--brand-200)"
          borderWidth={2}
        />

        <div className="relative space-y-5 p-6 pb-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 size-8 rounded-lg"
            onClick={onDismiss}
            aria-label="Close"
          >
            <XMarkIcon className="size-4" aria-hidden />
          </Button>

          <BlurFade delay={0.05}>
            <Badge
              variant="secondary"
              className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-0.5 text-xs font-medium"
            >
              {BOOKING_INTRO_CONTENT.eyebrow}
            </Badge>
          </BlurFade>

          <DialogHeader className="gap-2 text-left">
            <BlurFade delay={0.1}>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {BOOKING_INTRO_CONTENT.title}
              </DialogTitle>
            </BlurFade>
            <BlurFade delay={0.15}>
              <DialogDescription className="text-sm leading-relaxed">
                {BOOKING_INTRO_CONTENT.lead}
              </DialogDescription>
            </BlurFade>
          </DialogHeader>

          <ul className="space-y-4">
            {BOOKING_INTRO_CONTENT.items.map((item, index) => {
              const Icon = introIcons[index] ?? CalendarDaysIcon;
              return (
                <BlurFade key={item.title} delay={0.2 + index * 0.08}>
                  <li className="flex gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </li>
                </BlurFade>
              );
            })}
          </ul>

          <BlurFade delay={0.36}>
            <Button
              type="button"
              className="h-11 w-full rounded-xl"
              onClick={onDismiss}
            >
              Got it
            </Button>
          </BlurFade>
        </div>

        <div
          className="h-1 w-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Closing automatically"
        >
          <div
            key={countdownKey}
            className={cn(
              "h-full origin-left bg-primary",
              open && "animate-[booking-intro-countdown_linear_forwards]",
            )}
            style={{
              animationDuration: `${BOOKING_INTRO_AUTO_DISMISS_MS}ms`,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
