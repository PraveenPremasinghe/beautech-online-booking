import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SectionHeadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64 max-w-full" />
    </div>
  );
}

export function SalonProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading salon profile">
      <Skeleton className="h-48 w-full rounded-none sm:h-64" />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-12">
        <div className="relative z-10 -mt-6 space-y-8 sm:-mt-8 sm:space-y-10">
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <Skeleton className="h-8 w-2/3 max-w-sm" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:hidden">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_288px] lg:gap-10 xl:gap-12">
            <div className="min-w-0 space-y-10 sm:space-y-12">
              <section className="space-y-4">
                <SectionHeadingSkeleton />
                <div className="flex gap-2 overflow-hidden">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3"
                    >
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-14" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeadingSkeleton />
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl border border-border/70 p-4"
                    >
                      <Skeleton className="size-14 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeadingSkeleton />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-xl border border-border/70 p-4",
                        index === 0 && "space-y-2",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-md">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-11 w-full rounded-full" />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border/70 bg-background/95 p-4 lg:hidden">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
