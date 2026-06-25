"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { formatCurrency, formatDuration } from "@/lib/format";
import { sortCategories } from "@/lib/service-utils";
import { cn } from "@/lib/utils";
import type { Service, ServiceCategory } from "@/types/booking";

interface SalonServicesByCategoryProps {
  services: Service[];
  categories: ServiceCategory[];
}

export function SalonServicesByCategory({
  services,
  categories,
}: SalonServicesByCategoryProps) {
  const grouped = useMemo(() => {
    const sorted = sortCategories(categories);
    return sorted
      .map((category) => ({
        category,
        services: services.filter((s) => s.categoryId === category.id),
      }))
      .filter((group) => group.services.length > 0);
  }, [categories, services]);

  const categoryTabs = useMemo(
    () =>
      grouped.map(({ category }) => ({
        title: category.name,
        value: category.id,
      })),
    [grouped],
  );

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!categoryTabs.length) return;
    if (!categoryTabs.some((tab) => tab.value === activeTab)) {
      setActiveTab(categoryTabs[0].value);
    }
  }, [categoryTabs, activeTab]);

  const activeServices = useMemo(
    () => grouped.find((group) => group.category.id === activeTab)?.services ?? [],
    [grouped, activeTab],
  );

  if (services.length === 0) {
    return (
      <section id="services" className="scroll-mt-20">
        <SectionHeading title="Services" />
        <p className="text-sm text-muted-foreground">No services listed yet.</p>
      </section>
    );
  }

  return (
    <section id="services" className="scroll-mt-20 space-y-5">
      <SectionHeading
        title="Services"
        description={`${services.length} treatments across ${grouped.length} categories`}
      />

      <AnimatedTabs
        tabs={categoryTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        layoutId="salon-profile-service-tab-pill"
        aria-label="Service categories"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="outline-none"
        >
          <ul className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/70 bg-card">
            {activeServices.map((service) => (
              <li key={service.id}>
                <div className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                    {service.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatDuration(service.durationMinutes)}
                  </span>
                  <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
                    {formatCurrency(service.price, service.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {description ? (
        <p className={cn("text-sm text-muted-foreground")}>{description}</p>
      ) : null}
    </div>
  );
}
