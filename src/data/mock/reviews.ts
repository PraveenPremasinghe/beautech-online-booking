import type { CustomerReview } from "@/types/review";

export const mockCustomerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    authorName: "Sarah Mitchell",
    rating: 5,
    date: "2026-06-10",
    serviceName: "Signature Blowout",
    professionalName: "Alex Rivera",
    comment:
      "Flawless blowout that lasted three days. Booking online took less than a minute — I'll never call ahead again.",
  },
  {
    id: "rev-2",
    authorName: "Daniel Kim",
    rating: 5,
    date: "2026-06-05",
    serviceName: "Gel Manicure",
    professionalName: "Sam Nguyen",
    comment:
      "Clean studio, on-time appointment, and the gel still looks fresh two weeks later. Premium experience top to bottom.",
  },
  {
    id: "rev-3",
    authorName: "Elena Vasquez",
    rating: 5,
    date: "2026-05-28",
    serviceName: "Event Makeup",
    professionalName: "Morgan Chen",
    comment:
      "Morgan understood exactly the look I wanted for my event. The whole process felt effortless from booking to checkout.",
  },
  {
    id: "rev-4",
    authorName: "Priya Sharma",
    rating: 4,
    date: "2026-05-20",
    serviceName: "Hydrating Facial",
    professionalName: "Riley Patel",
    comment:
      "My skin has never looked this glowy. Riley was knowledgeable and the downtown location is gorgeous.",
  },
  {
    id: "rev-5",
    authorName: "James O'Connor",
    rating: 5,
    date: "2026-05-14",
    serviceName: "Scalp Spa Ritual",
    professionalName: "Taylor Brooks",
    comment:
      "Incredibly relaxing and my scalp feels healthier already. Easy to book, easy to reschedule — exactly what I needed.",
  },
  {
    id: "rev-6",
    authorName: "Amara Johnson",
    rating: 5,
    date: "2026-05-08",
    serviceName: "Brow Lamination",
    professionalName: "Morgan Chen",
    comment:
      "Best brows I've ever had. The summary panel during booking made it clear what I was paying for. No surprises.",
  },
];
