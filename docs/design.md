# Sirion Sonar design system

DESIGN SYSTEM
Feel: a calm work tool a finance lead trusts. Plain, dense enough to scan, never decorative. Not a dashboard of charts, a list of things to do.

Color tokens (define as CSS variables in src/styles/tokens.css and use only these):
  --bg: #F6F7F9
  --surface: #FFFFFF
  --ink: #0F1B2D
  --ink-2: #4A5668
  --line: #E1E5EB
  --brand: #0E7C86 (sonar teal, used for primary buttons, links, focus ring)
  --brand-soft: #E3F3F4
  Item types: Decide #1D4ED8 on #E8EFFD, Check #B45309 on #FDF1E1, Fix #B42318 on #FDE9E7, Find #6D28D9 on #EFE9FB
  Confidence labels: Confirmed #15803D on #E4F4E9, Derived #1D4ED8 on #E8EFFD, Bounded #B45309 on #FDF1E1, Unknown #4A5668 on #EDEFF3 with a dashed border
  (In the build, Confirmed text is #166534, because #15803D on #E4F4E9 is 4.40:1 and the accessibility rule asks for 4.5:1.)
  Urgent: #B42318

Type: system font stack (Inter if available, then system-ui). Sizes 12, 14, 16, 20, 28 only. Body 14. Line height 1.5. Page titles 28 semibold, section titles 20 semibold, labels 12 medium uppercase letter spacing 0.04em. Numbers use tabular figures.

Space and shape: 4px base unit, use 4, 8, 12, 16, 24, 32, 48 only. Radius 8 on cards, 999 on badges, 6 on buttons. One shadow only, for popovers. Borders are 1px var(--line). Content width max 1120px, centered. Cards are white on the grey page.

Components to reuse everywhere: Badge (type and label variants, always text plus a small icon, never color alone), Button (primary, secondary, quiet), Card, Table, Field (label, value, source link, confidence badge), EmptyState, Toast.

Layout: top bar with the product name Sirion Sonar on the left, the demo clock control on the right, and a thin banner under it saying Sample company, sample data. Left nav with Home, Contracts, Weekly email, Measures, Privacy, Sirion. Setup is reached from a link on Home until it has been run once.

Copy: write like a person talking to a colleague. One sentence per item. Say what happened, what it costs, what to do. No em dashes, no long dashes, no marketing words, no exclamation marks. Never write the words leverage, seamless, robust, powerful, unlock, empower. Dates show as 14 Mar 2027. Money shows as Rs 1,20,000 with Indian grouping.

Motion: only fades under 150ms and one gentle progress animation on the first read screen. Respect prefers-reduced-motion.

Accessibility: text contrast at least 4.5:1, visible focus ring in --brand, every interactive element reachable by keyboard, badges carry an aria-label, tables have header cells.
