import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SummarySectionProps {
  title: string;
  editHref?: string;
  editLabel?: string;
  children: ReactNode;
  className?: string;
}

export function SummarySection({
  title,
  editHref,
  editLabel = "Edit",
  children,
  className,
}: SummarySectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-card px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {editHref ? (
          <Button
            render={<Link href={editHref} />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 rounded-lg px-2 text-xs text-primary"
          >
            <PencilSquareIcon className="size-3.5" aria-hidden />
            {editLabel}
          </Button>
        ) : null}
      </div>
      <div className="text-sm text-foreground">{children}</div>
    </section>
  );
}
