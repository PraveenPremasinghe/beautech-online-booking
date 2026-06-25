import { redirect, notFound } from "next/navigation";

import { getSalonProfile } from "@/lib/api/salons";

interface SalonPageProps {
  params: Promise<{ slug: string }>;
}

/** Legacy /salons/[slug] → home salon profile */
export default async function LegacySalonPage({ params }: SalonPageProps) {
  const { slug } = await params;
  const profile = await getSalonProfile(slug);
  if (!profile) notFound();

  redirect("/");
}
