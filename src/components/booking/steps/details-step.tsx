"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  bookingEmailSchema,
  type BookingEmailFormValues,
} from "@/lib/validations/client-details";
import { cn } from "@/lib/utils";

export const CLIENT_DETAILS_FORM_ID = "booking-client-details-form";

interface DetailsStepProps {
  defaultEmail?: string;
  onEmailContinue: (email: string) => void;
  onGoogleContinue: () => void;
  onClose?: () => void;
  onValidChange: (valid: boolean) => void;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function DetailsStep({
  defaultEmail = "",
  onEmailContinue,
  onGoogleContinue,
  onClose,
  onValidChange,
}: DetailsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookingEmailFormValues>({
    resolver: zodResolver(bookingEmailSchema),
    mode: "onChange",
    defaultValues: { email: defaultEmail },
  });

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <div className="flex justify-center py-2 sm:py-6">
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-lg sm:p-8",
        )}
      >
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3 size-9 rounded-full text-muted-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="size-5" aria-hidden />
          </Button>
        ) : null}

        <div className="space-y-1 pr-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Log in or sign up to book
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ll need to verify it&apos;s you to continue
          </p>
        </div>

        <form
          id={CLIENT_DETAILS_FORM_ID}
          onSubmit={handleSubmit(({ email }) => onEmailContinue(email))}
          className="mt-6 space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              className="h-12 rounded-xl border-border/80 bg-background text-base"
              {...register("email")}
            />
            <p className="text-sm text-muted-foreground">
              We&apos;ll send you a verification code
            </p>
            <FieldError message={errors.email?.message} />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-full bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
          >
            Continue
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs font-medium tracking-wide text-muted-foreground">
            OR
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-full border-border/80 bg-background text-base font-medium text-foreground shadow-none hover:bg-muted/40"
          onClick={onGoogleContinue}
        >
          <GoogleIcon className="size-5" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
