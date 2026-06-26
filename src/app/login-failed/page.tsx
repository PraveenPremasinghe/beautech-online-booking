import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LoginFailedPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Login failed</h1>
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t sign you in. Please try again.
      </p>
      <Button render={<Link href="/?client=demo" />} nativeButton={false}>
        Try again
      </Button>
    </div>
  );
}
