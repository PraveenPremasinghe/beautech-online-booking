import { redirect } from "next/navigation";

interface DatetimeRedirectPageProps {
  params: Promise<{ salonSlug: string }>;
}

/** Legacy route — redirects to /time */
export default async function DatetimeRedirectPage({
  params,
}: DatetimeRedirectPageProps) {
  const { salonSlug } = await params;
  redirect(`/book/${salonSlug}/time`);
}
