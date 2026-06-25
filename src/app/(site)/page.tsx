import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SalonProfilePage } from "@/components/salon";
import { getSalonProfile } from "@/lib/api/salons";
import { SALON_SLUG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getSalonProfile(SALON_SLUG);
  if (!profile) return { title: "Salon not found" };

  return {
    title: profile.salon.name,
    description: profile.salon.description,
    openGraph: {
      title: profile.salon.name,
      description: profile.salon.tagline,
    },
  };
}

export default async function HomePage() {
  const profile = await getSalonProfile(SALON_SLUG);
  if (!profile) notFound();

  return (
    <div className="pb-20 lg:pb-0">
      <SalonProfilePage profile={profile} />
    </div>
  );
}
