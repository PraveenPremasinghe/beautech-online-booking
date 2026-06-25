"use client";

import { AnimatePresence, motion } from "motion/react";
import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

import { ServiceSelectCard } from "@/components/booking/service-select-card";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ALL_SERVICES_TAB,
  filterServices,
  sortCategories,
} from "@/lib/service-utils";
import { formatCurrency, formatDuration } from "@/lib/format";
import { calculateSubtotal, calculateTotalDuration } from "@/lib/booking-utils";
import type { Service, ServiceCategory } from "@/types/booking";

interface ServicesStepProps {
  services: Service[];
  categories: ServiceCategory[];
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
}

export function ServicesStep({
  services,
  categories,
  selectedServiceIds,
  onToggleService,
}: ServicesStepProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(ALL_SERVICES_TAB);

  const sortedCategories = useMemo(
    () => sortCategories(categories),
    [categories],
  );

  const categoryTabs = useMemo(
    () => [
      { title: "All", value: ALL_SERVICES_TAB },
      ...sortedCategories.map((category) => ({
        title: category.name,
        value: category.id,
      })),
    ],
    [sortedCategories],
  );

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => services.find((s) => s.id === id))
        .filter((s): s is Service => Boolean(s)),
    [selectedServiceIds, services],
  );

  const filteredServices = useMemo(
    () => filterServices(services, activeTab, query),
    [services, activeTab, query],
  );

  const selectionTotal = calculateSubtotal(selectedServices);
  const selectionDuration = calculateTotalDuration(selectedServices);
  const currency = selectedServices[0]?.currency ?? services[0]?.currency ?? "USD";

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-12 text-center">
        <p className="text-base font-semibold text-foreground">No services available</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This location has no bookable services right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {selectedServiceIds.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              {selectedServiceIds.length} selected
            </Badge>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {formatDuration(selectionDuration)} ·{" "}
              {formatCurrency(selectionTotal, currency)}
            </span>
          </div>
          <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
            <SparklesIcon className="size-3.5 text-primary" aria-hidden />
            Summary updates as you add services
          </span>
        </div>
      ) : null}

      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          className="h-11 rounded-xl border-border/70 bg-card pl-9 text-base sm:text-sm"
          aria-label="Search services"
        />
      </div>

      <AnimatedTabs
        tabs={categoryTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        layoutId="booking-service-tab-pill"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${query}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="outline-none"
        >
          {filteredServices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center">
              <p className="text-sm font-medium text-foreground">No matching services</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {filteredServices.map((service) => (
                <li key={service.id}>
                  <ServiceSelectCard
                    service={service}
                    selected={selectedServiceIds.includes(service.id)}
                    onToggle={onToggleService}
                  />
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
