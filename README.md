# Sirion Sonar

Sirion Sonar is a push-based list of things that need a person's attention on supplier contracts. It builds a ledger of the company's supplier contracts by finding the contracts itself, then watches that ledger and tells the right person when something needs them.

This repository is a static prototype with sample data. There is no backend, no real API call and no login. The sample company is Tamarind Home Goods, and every supplier, person, contract, payment and email in it is fictional.

Live demo: https://sirion-sonar.vercel.app

## Run it

You need Node 22 or later.

```
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript, no emit
npm test           # Vitest
npm run build      # type check, then a static build in dist/
npm run preview    # serve the build
```

The app uses hash routes, so any static host works. On Vercel, import the repo and accept the Vite defaults: build `npm run build`, output `dist`.

## Walking through the demo

Opening the site lands on a mock sign-in at `/login`. It asks for no password and checks nothing. Then comes the onboarding wizard at `/welcome`, where each source can connect more than one product, such as Google Drive and SharePoint. Watch the demo plays the whole story by itself in about 80 seconds. Walk through it yourself opens the Demo guide, which takes you through the nine moments of the user journey: setup, first read, confirm, a deadline gets close, decide, an invoice differs, an amendment arrives, nobody acts, and handoff. Do this next moves the clock and switches the viewer where a moment needs it. Skip to demo jumps straight to the list with the first read done.

In the top bar, Tour replays the tour for the current screen, Show the thinking adds Under the hood badges to each part of a screen, View as shows the demo as another person, the clock moves the date forward, and Reset demo starts again.

The Case section in the nav holds the reasoning: why intake, the problem, the stakeholders and the assumptions. How it works shows the eight step pipeline, the five agents, and where data lives.

## What is real and what is simulated

| Part | In the prototype |
| --- | --- |
| Date arithmetic, labels, ordering of the list, confirm and accept actions | Real, computed live, with a clock you can move forward |
| Sorting payments into supplier, not a supplier and not sure | Real, rules run on the sample payments list |
| Masking of names before the model | Real on the sample text, shown as before and after |
| Version history and amendment comparison on one contract | Real on the sample: an accepted amendment shows as a tracked change and moves the date |
| Searching a drive and mail, and reading the 12 sample contracts | Precomputed, with the source sentence highlighted |
| Connecting to a real drive or mailbox | A mock consent screen that lists what would be read |
| The 5 sample emails | Precomputed matching and classification, each step shown |

The 12 sample contracts were written for this case with fictional parties. Adapting them from public Law Insider samples is planned and not done yet.

## Not built

Real connections to any drive, mail or payables system. Real model calls. User login. Redlining and contract creation, which stay in the Sirion pitch.

## Where things live

- `docs/spec.md`: the case, the solution architecture and the build plan.
- `CLAUDE.md` and `docs/design.md`: the rules and the design system the code follows.
- `src/logic`: every business rule as a pure function with Vitest tests: dates, labels, alerts, escalation, ordering and payment classification.
- `src/data`: the sample company, plus the words for tours, the Under the hood drawer, the architecture page and the case pages.
- `src/screens` and `src/components`: the screens, one component per file, styled with plain CSS and the tokens in `src/styles/tokens.css`.

Onboarding progress, the access log, tours already seen and the Show the thinking switch are kept in the browser's local storage. Everything else, such as the clock and the decisions made, lives in memory and starts fresh on reload.
