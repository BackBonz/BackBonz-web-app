export const SITE = {
  name: "BackBonz",
  tagline: "Helping teens with scoliosis build confidence and healthy brace-wear habits.",
  description:
    "BackBonz helps teens with scoliosis build healthy brace-wear habits through tracking, motivation, and companion-based engagement.",
  url: "https://backbonz.com",
  // Fallback only — the live contact/support email is editable from the admin
  // panel (see settingsRepo / useSettings).
  contactEmail: "support.backbonz@gmail.com",
  // Fallback only — the live launch date is editable from the admin panel.
  launchDate: "2026-06-30T00:00:00",
  // Primary navigation (navbar). "Contact Us" jumps to the home contact form.
  nav: [
    { label: "Home", to: "/" },
    { label: "Support", to: "/support" },
    { label: "Contact Us", to: "/#contact" },
  ],
  // Footer navigation — legal links live here.
  footerNav: [
    { label: "Home", to: "/" },
    { label: "Support", to: "/support" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "User Agreement", to: "/user-agreement" },
  ],
};
