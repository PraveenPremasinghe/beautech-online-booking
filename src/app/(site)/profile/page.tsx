import type { Metadata } from "next";

import { ProfileClient } from "@/app/(site)/profile/profile-client";

export const metadata: Metadata = {
  title: "My appointments",
  description: "View your upcoming and past salon appointments.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
