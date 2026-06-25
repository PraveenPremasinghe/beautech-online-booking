"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CLIENT_NOTES_MAX_LENGTH,
  clientDetailsDefaultValues,
  clientDetailsSchema,
  type ClientDetailsFormValues,
  toClientDetailsFormValues,
} from "@/lib/validations/client-details";
import { cn } from "@/lib/utils";
import type { ClientDetails } from "@/types/booking";

export const CLIENT_DETAILS_FORM_ID = "booking-client-details-form";

interface DetailsStepProps {
  defaultValues?: ClientDetails | null;
  onSubmit: (values: ClientDetailsFormValues) => void;
  onValidChange: (valid: boolean) => void;
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
  defaultValues,
  onSubmit,
  onValidChange,
}: DetailsStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<ClientDetailsFormValues>({
    resolver: zodResolver(clientDetailsSchema),
    mode: "onChange",
    defaultValues: defaultValues
      ? toClientDetailsFormValues(defaultValues)
      : clientDetailsDefaultValues,
  });

  const notesValue = useWatch({ control, name: "notes" }) ?? "";
  const notesLength = notesValue.length;

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <form
      id={CLIENT_DETAILS_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserIcon className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Guest booking</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            No account needed — enter your contact details and we&apos;ll send
            your confirmation by SMS or email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="Jamie"
            aria-invalid={Boolean(errors.firstName)}
            className="h-11 rounded-xl border-border/70 bg-card"
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Taylor"
            aria-invalid={Boolean(errors.lastName)}
            className="h-11 rounded-xl border-border/70 bg-card"
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Mobile number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+1 (555) 123-4567"
          aria-invalid={Boolean(errors.phone)}
          className="h-11 rounded-xl border-border/70 bg-card"
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          className="h-11 rounded-xl border-border/70 bg-card"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
        <p className="text-xs text-muted-foreground">Optional — for email confirmation</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="notes">Notes</Label>
          <span
            className={cn(
              "text-xs text-muted-foreground",
              notesLength > CLIENT_NOTES_MAX_LENGTH && "text-destructive",
            )}
          >
            {notesLength}/{CLIENT_NOTES_MAX_LENGTH}
          </span>
        </div>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Allergies, preferences, or anything we should know before your visit…"
          aria-invalid={Boolean(errors.notes)}
          className="min-h-28 rounded-xl border-border/70 bg-card"
          {...register("notes")}
        />
        <FieldError message={errors.notes?.message} />
        <p className="text-xs text-muted-foreground">Optional</p>
      </div>
    </form>
  );
}
