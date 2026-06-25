interface SalonAboutSectionProps {
  description: string;
}

export function SalonAboutSection({ description }: SalonAboutSectionProps) {
  return (
    <section id="about" className="scroll-mt-20 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">About</h2>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </section>
  );
}
