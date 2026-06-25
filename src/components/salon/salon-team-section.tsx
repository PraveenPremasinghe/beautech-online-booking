import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfessionalInitials } from "@/lib/professional-utils";
import type { Professional } from "@/types/booking";

interface SalonTeamSectionProps {
  professionals: Professional[];
  limit?: number;
}

export function SalonTeamSection({
  professionals,
  limit = 8,
}: SalonTeamSectionProps) {
  const preview = professionals.slice(0, limit);

  if (preview.length === 0) {
    return null;
  }

  return (
    <section id="team" className="scroll-mt-20 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Team</h2>
        <p className="text-sm text-muted-foreground">
          Specialists at this location
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {preview.map((professional) => (
          <li
            key={professional.id}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5"
          >
            <Avatar size="sm" className="size-10 shrink-0 rounded-full">
              {professional.avatarUrl ? (
                <AvatarImage
                  src={professional.avatarUrl}
                  alt={professional.displayName}
                  className="rounded-full"
                />
              ) : null}
              <AvatarFallback className="rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getProfessionalInitials(professional.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {professional.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {professional.title}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
