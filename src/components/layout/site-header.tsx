import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { APP_NAME, BOOKING_ROUTES, SALON_SLUG } from "@/lib/constants";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#team", label: "Team" },
  { href: "#reviews", label: "Reviews" },
  { href: "#about", label: "About" },
  { href: "#hours", label: "Hours" },
  { href: "#branches", label: "Locations" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container as="div" className="flex h-14 items-center justify-between sm:h-16">
        <Link
          href={BOOKING_ROUTES.home()}
          className="flex cursor-pointer items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SparklesIcon className="size-4" aria-hidden />
          </span>
          <span>{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          render={<Link href={BOOKING_ROUTES.bookWithWelcome(SALON_SLUG)} />}
          nativeButton={false}
          size="sm"
          className="rounded-xl"
        >
          Book now
        </Button>
      </Container>
    </header>
  );
}
