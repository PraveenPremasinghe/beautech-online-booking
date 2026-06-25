export const BOOKING_INTRO_AUTO_DISMISS_MS = 7000;

export const BOOKING_INTRO_WELCOME_PARAM = "welcome";

export const BOOKING_INTRO_CONTENT = {
  eyebrow: "Online booking",
  title: "Before you continue",
  lead: "A couple of things to know as you secure your salon visit:",
  items: [
    {
      title: "Service, date & time",
      body: "You'll pick your treatment, then choose a date and slot that match how long your service needs so your stylist can be booked correctly.",
    },
    {
      title: "Confirmations & reminders",
      body: "After you book, you'll get a confirmation with your visit details.",
    },
  ],
} as const;
