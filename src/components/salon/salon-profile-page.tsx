import { SalonAboutSection } from "@/components/salon/salon-about-section";
import { SalonBookingCard } from "@/components/salon/salon-booking-card";
import { SalonBranchesSection } from "@/components/salon/salon-branches-section";
import { SalonCover } from "@/components/salon/salon-cover";
import { SalonDetailsHeader } from "@/components/salon/salon-details-header";
import { SalonOpeningHoursSection } from "@/components/salon/salon-opening-hours-section";
import { SalonReviewsSection } from "@/components/salon/salon-reviews-section";
import { SalonServicesByCategory } from "@/components/salon/salon-services-by-category";
import { SalonStickyBookBar } from "@/components/salon/salon-sticky-book-bar";
import { SalonTeamSection } from "@/components/salon/salon-team-section";
import type { SalonProfile } from "@/types/salon-profile";

interface SalonProfilePageProps {
  profile: SalonProfile;
}

export function SalonProfilePage({ profile }: SalonProfilePageProps) {
  const {
    salon,
    primaryBranch,
    branches,
    openingHours,
    services,
    categories,
    professionals,
    reviews,
  } = profile;

  return (
    <>
      <SalonCover salon={salon} />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-12">
        <div className="relative z-10 -mt-6 space-y-8 sm:-mt-8 sm:space-y-10">
          <SalonDetailsHeader
            salon={salon}
            primaryBranch={primaryBranch}
            openingHours={openingHours}
          />

          {/* Mobile booking card */}
          <div className="lg:hidden">
            <SalonBookingCard
              salon={salon}
              primaryBranch={primaryBranch}
              openingHours={openingHours}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_288px] lg:gap-10 xl:gap-12">
            <div className="min-w-0 space-y-10 sm:space-y-12">
              <SalonServicesByCategory
                services={services}
                categories={categories}
              />
              <SalonTeamSection professionals={professionals} />
              <SalonReviewsSection reviews={reviews} salon={salon} />
              <SalonAboutSection description={salon.description} />
              <SalonOpeningHoursSection hours={openingHours} />
              <SalonBranchesSection branches={branches} salonSlug={salon.slug} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <SalonBookingCard
                  salon={salon}
                  primaryBranch={primaryBranch}
                  openingHours={openingHours}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <SalonStickyBookBar salonSlug={salon.slug} salonName={salon.name} />
    </>
  );
}
