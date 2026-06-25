import Link from "next/link";

import { Container } from "@/components/layout/container";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container as="div" className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{APP_NAME}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Book beauty services online in minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  );
}
