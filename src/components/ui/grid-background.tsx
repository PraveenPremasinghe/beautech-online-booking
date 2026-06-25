import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

/** Dot grid background inspired by Aceternity UI */
export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40",
        className,
      )}
      aria-hidden
    />
  );
}
