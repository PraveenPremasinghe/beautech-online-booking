import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container as="main" className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The salon or booking page you are looking for does not exist.
      </p>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        className="mt-6"
      >
        Back to home
      </Button>
    </Container>
  );
}
