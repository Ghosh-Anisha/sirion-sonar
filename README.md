# Sirion Sonar

## What it is

Sirion Sonar is a push-based list of the things that need a person's attention on supplier contracts. Nobody has to go looking: a renewal that is coming up, an invoice above the agreed rate or a supplier with no contract each turns into one item, sent to the one person who has to act.

It was built for the ISB Sirion case assignment and covers stage 1 of the contract lifecycle, contract intake. The company, Halden Foods, is fictional, and so is every supplier, person, contract, payment and email in it.

## Links

- Live prototype: https://sirion-sonar.vercel.app
  - Sign in: https://sirion-sonar.vercel.app/#/login
  - The story: https://sirion-sonar.vercel.app/#/story
  - The solution: https://sirion-sonar.vercel.app/#/solution
  - How we know it works: https://sirion-sonar.vercel.app/#/measures
- Repository: https://github.com/Ghosh-Anisha/sirion-sonar

## How it works

An **orchestrator** chains eight steps in order. It is code, not a model. It keeps state for each supplier, retries a step that fails, logs every step, and owns every date, amount and send.

A **model gateway** is the only route to any model. It masks names first, checks each answer against a schema, logs every call and caps cost.

Every step is one of three kinds of work, split by who decides the next step:

- **Code**: fixed steps, no model. Anything that is a rule or an if-then check.
- **Model call**: our code asks a model one question, once, and checks the answer.
- **Agent**: a model that picks its own next step in a loop, using read-only tools, inside limits the orchestrator sets: a step limit, a log of every step, and read-only access.

A model call and an agent both use a model. The difference is who controls the sequence: in a model call our code sets the steps, while an agent chooses its own.

| Step | What it does | Kind of work |
| --- | --- | --- |
| 1 Connect | Signs in read-only to payables, the drive and the shared inboxes | Code |
| 2 Vendor list | Sorts payment lines into suppliers and merges spellings of one name | Code |
| 3 Find | Looks for each supplier's contract across the drive and mail | Agent |
| 4 Sort files | Tells contracts, amendments and invoices apart | Code, Model call |
| 5 Read | Reads the terms with the exact sentence for each, then checks them | Model call, Agent |
| 6 Record | Writes each fact with its sentence, page and label | Code |
| 7 Watch | Checks the ledger every night for time, arrival, absence and change | Code |
| 8 Tell and draft | Tells each owner what needs them and drafts the reply | Agent |

There are five agents: the Finder (step 3), the Reader and checker and the Reconciler (step 5), and the Email agent and the Drafter (step 8).

## Rules we hold to

- Dates, amounts and anything that sends or pays are never left to a model or an agent. Code works them out, and a person clicks to send.
- Agents are read only, step limited and logged.
- Names, people, contacts and bank details are masked before any model sees the text.

## Try it in four minutes

1. **Story** (`#/story`): the comic, the case, the stage we picked and what the problem costs.
2. **Solution** (`#/solution`): the whole product in one diagram. Press Play to follow one invoice through it.
3. **Sign in** at `#/login`, or press **Skip to demo** to jump straight to the list.
4. **Onboarding** (`#/welcome`): connect the sources, approve access as IT, and run the first read.
5. **Home** (`#/home`): the Needs you list, sorted by what is due first.
6. **Move the clock to 1 Dec 2026** with the date control in the top bar. Cloudmetric's 90 day alert fires, and items escalate.

## Sample data

- The contracts live in `docs/contracts`: 13 files, 12 contracts plus one amendment. They are adapted from Law Insider sample contracts, with the company names changed.
- The rest of the sample data lives in `src/data`: suppliers, payments, emails and people.
- The demo starts on 19 Nov 2026. Every screen reads today's date from the demo clock, not from your computer.

## Run it locally

You need Node 22 or later.

```
npm install
npm run dev        # start the dev server at http://localhost:5173
npm run build      # type check, then a static build in dist/
npm test           # run the Vitest tests
npm run typecheck  # type check only
npm run preview    # serve the build
```

The app uses hash routes, so any static host works. On Vercel, accept the Vite defaults: build `npm run build`, output `dist`.

## Stack and folder map

Vite, React and TypeScript, with React Router in hash mode, plain CSS on design tokens, and Vitest for the logic.

| Folder | What is in it |
| --- | --- |
| `src/components` | Shared parts of the product screens, grouped by screen, plus the base UI kit in `ui` |
| `src/data` | The sample data and every piece of copy and label the site shows |
| `src/logic` | Pure functions for dates, labels, alerts, ordering and classification, each with tests |
| `src/screens` | One file per route |
| `src/solution` | The Solution page diagram and its sections |
| `src/state` | React context for the clock, onboarding, demo state, viewer and the guide |
| `src/story` | The story layer: the comic, the case file, the stage cards and the cost cards |
| `src/styles` | Design tokens and base styles |

## Known limits

- Sample data only. No real database and no live connectors. Every model and agent result is precomputed, with each step shown.
- The connect and consent screens are mock-ups of what would be read.
- Read-only access to the drive, mail and ledger is the assumption we are least sure of. IT may not approve it as asked.
