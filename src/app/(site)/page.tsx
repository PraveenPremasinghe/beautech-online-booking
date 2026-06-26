import type { Metadata } from "next";

import { SalonProfileLoader } from "@/components/salon/salon-profile-loader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return <SalonProfileLoader />;
}
