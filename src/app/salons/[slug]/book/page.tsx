import { redirect } from "next/navigation";

import { BOOKING_ROUTES } from "@/lib/constants";
import { getSalonProfile } from "@/lib/api/salons";

interface LegacyBookPageProps {
  params: Promise<{ slug: string }>;
}

/** Redirect legacy /salons/[slug]/book → /book/[slug]/branch */
export default async function LegacyBookPage({ params }: LegacyBookPageProps) {
  const { slug } = await params;
  const profile = await getSalonProfile(slug);
  if (!profile) {
    redirect("/");
  }
  redirect(BOOKING_ROUTES.branch(slug));
}
