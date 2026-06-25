"use client";

import { motion } from "motion/react";

import { bookingLayout } from "@/lib/booking-ui";
import { cn } from "@/lib/utils";

export interface AnimatedTabItem {
  title: string;
  value: string;
}

interface AnimatedTabsProps {
  tabs: AnimatedTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  listClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  /** Unique id for the sliding pill — use different values per page instance */
  layoutId?: string;
  "aria-label"?: string;
}

/** Aceternity-style animated pill tabs — https://ui.aceternity.com/components/tabs */
export function AnimatedTabs({
  tabs,
  value,
  onValueChange,
  className,
  listClassName,
  activeTabClassName,
  tabClassName,
  layoutId = "animated-tab-pill",
  "aria-label": ariaLabel = "Tabs",
}: AnimatedTabsProps) {
  return (
    <div
      className={cn(
        bookingLayout.hideScrollbar,
        "flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-1",
        listClassName,
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "relative shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
              tabClassName,
            )}
          >
            {isActive ? (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className={cn(
                  "absolute inset-0 rounded-lg bg-primary shadow-sm",
                  activeTabClassName,
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 block whitespace-nowrap",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
