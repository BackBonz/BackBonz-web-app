// ── Default site settings & FAQ content ───────────────────────────────────────
// These are the fallbacks used before anything is saved to Firestore, and the
// seed data for the admin "Restore defaults" actions. Public components merge
// the saved siteConfig/main doc over DEFAULT_SETTINGS, and fall back to
// DEFAULT_FAQS when the `faqs` collection is empty.

export const DEFAULT_SETTINGS = {
  launchDate: '2026-06-30T00:00:00',
  supportEmail: 'support.backbonz@gmail.com',
  showAppStore: false,
  appStoreUrl: '',
  showPlayStore: false,
  playStoreUrl: '',
  showBeta: true,
}

// Answers are Markdown strings rendered via MarkdownRenderer.
// {{email}} is replaced with the live support email at render time.
export const DEFAULT_FAQS = [
  {
    question: 'How do I use the brace timer?',
    answer: `Using the brace timer is simple! Here's how:

1. Open BackBonz and tap the big **Start Timer** button on your dashboard.
2. Put on your brace. The timer runs in the background — you don't need to keep the app open.
3. When you take your brace off, open the app and tap **Stop Timer**.
4. Your session is automatically saved and added to your daily progress.

Forgot to start the timer? No problem — you can also add sessions manually from the **Sessions** tab by entering the start and end times.`,
  },
  {
    question: 'How does parental consent work?',
    answer: `BackBonz is designed for teens with scoliosis, and we take children's privacy seriously. Here's how parental consent works:

- When a user under 13 signs up, they enter their parent or guardian's email address.
- A consent email is automatically sent to that address with a verification link.
- The account is only activated after the parent or guardian clicks **Confirm Consent**.
- Parents can review, update, or revoke consent at any time by emailing us.

This process complies with the Children's Online Privacy Protection Act (COPPA). For more details, see our [Privacy Policy](/privacy).`,
  },
  {
    question: 'How do I request account deletion?',
    answer: `You can delete your account at any time. Here's how:

- **In the app:** Go to Settings → Account → Delete Account and follow the prompts.
- **By email:** Send "Delete My Account" to [{{email}}](mailto:{{email}}) from the email associated with your account.

For accounts belonging to children under 13, the parent or guardian must submit the deletion request. All personal data is deleted within **30 days**. This action is permanent and cannot be undone.`,
  },
  {
    question: 'How do I request a copy of my data?',
    answer: `You have the right to a copy of all data we hold about you ("data portability").

To request your data export:

1. Email [{{email}}](mailto:{{email}})
2. Use the subject line: **"Data Export Request"**
3. Include the email address associated with your account

We will send a downloadable copy of your data in a common format within **30 days**. The export includes: account information, brace session logs, journal entries, and activity history.`,
  },
  {
    question: 'What are your privacy and data practices?',
    answer: `We built BackBonz with privacy as a priority, especially because our users are mostly teens and young people.

- We **never sell** your data to advertisers or third parties.
- The contact form **does not store** your message — it's delivered directly to our email and then discarded.
- Brace session and journal data is stored securely and only accessible to you (and a parent/guardian for accounts under 13).
- We use Firebase (Google) for secure data storage, subject to their privacy policies.

For full details, read our [Privacy Policy](/privacy) and [User Agreement](/user-agreement).`,
  },
]
