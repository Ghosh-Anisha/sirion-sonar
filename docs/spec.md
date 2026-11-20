# Sirion case: problem statement and solution architecture

Nov 19, 2026 · @Annie

## Problem statement

At this company a signed contract is a file in a folder, and it does nothing on its own. Nobody is told when a renewal notice window opens, when a supplier misses a service level, or when an invoice arrives above the agreed price. Each of those depends on someone remembering a document that sits in an inbox, a drive or a spreadsheet.

So contracts renew without anyone deciding to renew them, supplier failures are not on record when the renewal conversation happens, and invoices get paid above the price in the contract. What people complain about is smaller: supplier requests get lost or stall. The expensive part comes after signing.

**Who has it.** Contract owners (the person in the business who bought the service) and Finance leads at companies this size that run on email, Word, shared drives and Excel. Requesters raise the request but are not the ones who pay for it.

**What we assume.** Nobody clearly owns a renewal. The business owner, Procurement, Finance and Legal each think one of the others does.

## Why stage 1, intake

Intake is the one stage where every supplier request, new or old, has to pass through the company's hands. That is why it is the right place to start, and the four tests below are the argument.

| Test | Why intake passes it |
| --- | --- |
| Unworkable | A supplier request today is an email. Nobody can see it, nothing tracks it, and it gets lost or waits on a reply nobody knows is owed. The contract that comes out of it carries no owner, no dates and no link back to what was asked. |
| Unavoidable | Every one of the 2,500 suppliers starts, changes and renews through a request. A repository without intake goes stale, because new contracts and changes keep arriving by email. |
| Urgent | The company is growing, so each new supplier adds a contract nobody tracks. A renewal notice date passes once per term, and missing it commits the company to another full term. |
| Underserved | Sirion, Zip and Coupa all assume a setup or a migration first. Their triggers depend on a repository that is already loaded, and a request's history does not build up against the contract it belongs to. Limits: this rests on vendor claims, the Agiloft free plan and a configured Sirion we have not tested. |

The other two stages lose on these tests. Negotiation improves how a deal gets made, but the costs in the brief all happen after signing. A repository needs contracts loaded before it can do anything, and the company has no loading process. Intake can start from a forwarded email.

## Latent vs blatant

&#91;embedded content: latent vs blatant matrix · 5 problems in 2 quadrants\]

The prototype leads with the top-left quadrant, because that is where the money is. The bottom-right is how people reach the product: they come in to chase a lost request, and the same record is what later warns them about a renewal.

## Solution architecture

Sirion Sonar builds a ledger of the company's supplier contracts by finding the contracts itself, then watches that ledger and tells the right person when something needs them. It runs in our own cloud, uses code for most of the work, and reaches a model in four of eight steps, through a model call or an agent where the path is open ended.

The name comes from sonar, which picks up what sits below the surface. The renewals, missed service levels and overpaid invoices in the problem statement are that kind of problem.

### How this stays stage 1

Intake here means one front door for everything that needs a person's attention on a supplier contract. Today that door only gets what people send. We add what the clock and the payments produce: a renewal coming up, a supplier paid with no contract, an invoice above the agreed rate. Each arrives as an item on one list, matched to its contract and its owner. Finding and reading the existing contracts is the groundwork that makes intake contract-aware. A reviewer could call that stage 3 work, so the prototype leads with the list and treats the ledger as what feeds it.

### The pipeline

&#91;embedded content: pipeline · 8 steps, 4 use AI\]

Read it left to right, then along the second row. Steps 1 to 6 build the ledger. Steps 7 and 8 are what make it push: a nightly check, and a list that reaches people before a date passes.

### What it connects to and what it can see

| Source | Access asked for | What it reads | What it never does |
| --- | --- | --- | --- |
| Accounting or payables system, such as Zoho Books, Tally, QuickBooks or SAP | Read-only export or connector | The vendor list, payment dates and amounts | Hold bank credentials or move money |
| Drive (Google Drive, OneDrive, SharePoint, Zoho WorkDrive) | Read-only, on the folders the company picks or on all of it | The first page of each file, to tell what it is. Full text only for contracts, amendments and invoices | Keep anything from files that are not those. Write, move or delete files |
| Mail | Read-only on shared inboxes such as accounts payable and procurement. Optionally a search across the company, limited to the supplier domains on the vendor list | Messages to and from vendors | Read messages outside those domains. Send from a person's own mailbox |
| Sending | The product's own address, on the owner's click | Nothing | Send anything on its own |

One person approves this once, the IT admin or the finance lead. Every file or message opened goes into an access log the company can read. A company on Zoho uses the same connections: Zoho Books for the vendor list and payments, and Zoho Mail and WorkDrive for mail and files. The vendor list comes from wherever invoices are processed.

### Where AI is used and where it is not

| Step | Done by | Why |
| --- | --- | --- |
| 1 Connect | Code | A standard read-only sign-in |
| 2 Vendor list | Code and name matching | Merging "ACME PVT LTD" and "Acme Private Limited" is string matching. The unsure ones go to a person |
| 3 Find | Search, a small open model that ranks files, and the Finder agent | Ranking candidate files is search work. The agent runs when search finds nothing clear |
| 4 Sort files | Code first, then a model call for files the code cannot place | File names and first-page words settle most files. Scans, odd names and mixed documents need a model to read the page |
| 5 Read | OCR, then the Reader and checker, then the Reconciler | Terms come back with the exact sentence quoted and a second pass checks them. Dates and notice deadlines are computed in code |
| 6 Record | Code | Writes the fact, its source sentence and its label |
| 7 Watch | Code | Nightly rules for time, arrival, absence and change. With no AI here, the same facts always give the same items |
| 8 Tell and draft | The Email agent and the Drafter | They explain what changed and write the reply. The owner reads and sends |

### The agents

An agent here is a model that takes several steps with a small set of read-only tools, where a plain prompt answers once. There are five, and each has one job.

| Agent | Job | Can use | Cannot |
| --- | --- | --- | --- |
| Finder | Looks for one vendor's contract across drive and mail when a plain search finds nothing clear. It tries other spellings, the supplier's email domain, invoice numbers and parent company names | Read-only search of the drive and mail | Open anything unrelated to the vendor's names and domains. Change or send anything |
| Reader and checker | Two passes, not one. The first reads the terms. The second checks each field against its quoted sentence and flags any that do not match | The masked text of one contract | Compute dates. Those come from code |
| Reconciler | Works out the current terms when a contract has amendments or several versions, and flags clashes | The facts for one vendor | Decide which version wins when they clash. A person does |
| Email agent | Reads an incoming email, recognises the supplier, looks up the contract, the rates, past payments and earlier mail, and explains the difference | Read-only search of the ledger and the vendor's mail | Reply on its own |
| Drafter | Writes the reply, query or notice from the facts on the item | The item and its facts | Send. The owner reads and sends |

We split the work this way because a single pass over a long contract or a full inbox makes mistakes, and nobody can see why. Each agent has one job, a few read-only tools and a log. The checker is the main safeguard: a field with no matching sentence never reaches the ledger as confirmed. Steps that follow a fixed sequence stay as code, because an agent would only add cost and variation there.

### What happens when an email arrives

&#91;embedded content: incoming email flow · 6 steps\]

This works the way a mail assistant such as Gemini does inside an inbox. The email is read, the supplier is recognised, and the answer comes from the contract and the payment history. The same path handles a renewal notice with a new price or a supplier chasing a payment. An amendment goes to the contract's version history instead of the list, where the owner accepts it or not.

### How it pushes

The product is built to reach people who never open it, because a company that does not know what to look for cannot ask. Search exists as a small secondary tool, and nothing depends on it.

| What | When | Goes to | What it says |
| --- | --- | --- | --- |
| The Needs you list | Always current | Each owner, and the procurement lead sees all of it | Items sorted by what is due first |
| Weekly email | Once a week | Each owner, with their own items | Each item with its reason and one link to act on it |
| Deadline alerts | 90, 30 and 7 days before a notice deadline | The owner | The renewal, the date to decide by, and what the contract allows |
| New arrivals | When a supplier email, notice or invoice is matched | The owner | The item it creates, with the difference from the contract |
| Escalation | When an item has no action by the 30 day alert, and again at 7 days | The procurement lead, who is also shown the item as urgent at 7 days | The same item, marked untouched |

An item with no owner goes straight to the procurement lead, which covers the case where nobody clearly owns a renewal.

In the prototype, a clock control moves the date forward by a week, a month or two months. Items appear, alerts fire and an untouched item escalates as the date passes each point. A preview of the weekly email sits beside the list.

### Models and hosting

We do not train any models. Every model is off the shelf, and what we build is the glue, the rules and the interface. That is what gets a company with no spare time to a working product quickly.

| Job | What runs it | Where it runs |
| --- | --- | --- |
| Reading scans | An open-source OCR tool | Our servers |
| Ranking candidate files for a vendor | A small open embedding model, which runs without a GPU | Our servers |
| Masking names and people | A dictionary built from the vendor list, plus an open-source name recogniser | Our servers |
| Reading terms and drafting messages | A model call or an agent, on masked text only, reached through a private endpoint inside our own cloud account, under a no-retention and no-training agreement | Our cloud account |

If a company wants nothing to leave at all, an open-weight model hosted in our cloud can take over step 5. It costs more to run, so it is an option for later and is not part of the first version.

Each customer gets an isolated environment: their own database, storage and encryption key. The only thing that goes to a model is masked snippets of contract text.

### What gets stored

| Table | Holds |
| --- | --- |
| vendors | Name, merged spellings, email domains, last payment, payment rhythm, and whether it is a supplier, not a supplier or unsure |
| payments | Date, amount, vendor, and the source line |
| documents | Where the file lives (a link back to the customer's drive, not a copy), what type it is, which vendor, and whether it has been read |
| facts | One row per field read: the value, the exact source sentence and page, the label (confirmed, derived, bounded or unknown), and who confirmed it |
| contracts | The current view per vendor, built from the facts: term, end date, notice days, next deadline, owner, price terms |
| contract\_versions | Each saved version of a confirmed contract: the text by clause, who changed what and when, and which amendment or edit it came from |
| items | What is on the Needs you list: type, reason, due date, status, and who was asked |
| access\_log | Every file or message opened, when and why. Append only |
| token\_vault | Masked name to real name. A separate store with a separate key, which never leaves our cloud |

The main database is a standard relational one with a similarity index for search. Extracted text sits in encrypted storage. Originals stay in the customer's drive. Deleting a customer deletes the database, the storage and the key.

### How onboarding goes

1. **Sign up.** The finance or procurement lead creates the account.
2. **Connect.** IT approves read-only access to the drive, mail and ledger once.
3. **First read.** The system builds the vendor list, then searches and reads, starting with the suppliers that are paid most and that are paid on a regular rhythm. The coverage bar and the first items appear as vendors are read.
4. **Confirm.** Owners confirm the riskiest dates, earliest deadline first. This is the only manual work, and it is a queue of yes or no.
5. **Run.** The list and a weekly email take over.

### What people see

&#91;embedded content: home screen wireframe · sample company\]

Anyone opening the prototype lands here. Each line is one sentence and one action. The badge says what kind of item it is: Decide for renewals, Check for invoices, Fix for missed service, and Find for suppliers paid with no contract. Each item opens to the clause that supports it, the source file and the history.

&#91;embedded content: setup screen wireframe · sample company, 24 vendors\]

The setup screen makes the entry point visible. It shows what is connected and what the system can never touch, then the vendor list and how many contracts were found. The 13 with nothing found are the finding: suppliers the company pays with no contract on file.

| Role | Sees | Does not see |
| --- | --- | --- |
| Contract owner | Items and contracts for the suppliers they own | Other owners' suppliers |
| Procurement lead | Every supplier and every item, including items nobody owns or nobody has acted on | Nothing is hidden from this role |
| Finance lead | Invoice checks, prices and the payments list for every supplier | Renewal and service items for suppliers they do not own |
| IT admin | The connections and the access log | Contract contents |

Nobody sees the masked names or the vault. A source sentence cannot be edited, only confirmed or corrected in the field it supports.

### Edits and versions

Once the owner confirms a contract, it becomes a managed contract in the product. The file in the drive is not touched. The product holds the working copy, split into clauses, and records every change to it: who made it, when, what the text said before and after, and why.

An amendment that arrives by email or in the drive is added as a new version linked to the contract. The product shows what changed as a redline and asks the owner to accept it. If it is accepted, the dates and terms on the ledger are worked out again from the new version. Edits are made in the product, or in Word through an add-on, so people stop emailing new copies around and losing track of which one is current.

Every item on the Needs you list traces back to a version of a contract, so a renewal date always points at the text it came from.

### Where Sirion fits

Sirion is built for enterprises that set up a platform and move their contracts into it. Sirion can take in raw legacy files, but someone has to gather them and hand them over first. The on-ramp is the part before that. It finds the contracts and starts working in days, for a company that cannot run a project to collect them. When the company grows into a full platform, the confirmed ledger is the data Sirion would otherwise spend months building.

| Layer | Where it comes from | What it does for this company |
| --- | --- | --- |
| Finding, reading and the Needs you list | The on-ramp (new) | Takes a company with no systems to a working ledger and a push list |
| Redlining and clause edits | Sirion's Word add-in and contract creation | Tracked edits and negotiation once a contract is being changed |
| Approvals and workflow | Sirion's workflow | Routes renewals and changes to the right approver |
| Supplier portal | Sirion's counterparty portal | Suppliers send notices and invoices straight onto the list |
| E-signature | Sirion's DocuSign and Adobe Sign integrations | Signing without leaving the product |
| Obligations, SLAs and invoice terms at scale | Sirion's contract management | Tracks service levels and invoice terms across thousands of contracts |
| Questions in plain language | AskSirion | "Which contracts renew in March?" asked of the confirmed ledger |

These come from Sirion's published product material. The prototype does not rebuild them. It shows where they connect.

Sirion's demo video shows its assistant waiting for a question, such as which contracts renew this quarter, and then searching. The on-ramp works the other way round. It raises the renewal before anyone asks, and Sirion's assistant can take the questions that follow.

Sirion's own customer stories describe rollouts that take months, for example Zalando at about seven months. A company that has already run the on-ramp arrives with a confirmed, structured ledger, so the move starts from clean data and not from a folder of files. For Sirion, that is a way into companies that could never start an enterprise rollout.

### How the record knows its dates

A renewal date is only useful if people know how far to trust it, so every date carries a label.

| Label | Meaning | Example |
| --- | --- | --- |
| Confirmed | A person checked it against the contract | A marketing retainer whose end date the owner verified |
| Derived | The system worked it out from the file and nobody has checked it yet | A facilities contract that only has a signing date and a 12 month term |
| Bounded | The term is known but the date is not, so the next deadline falls inside a window | A scanned logistics contract with an unreadable date, paid every March |
| Unknown | The file is missing or unreadable | A master agreement whose Order Form, where the term sits, is not on file |

Three rules sit behind the labels. After each term the end date rolls forward, so an autorenewing contract always shows its next deadline and not its first. The notice deadline is the end date minus the notice days, computed in code. The confirmation queue is ordered by the earliest date a deadline could fall, which puts unknown and bounded contracts ahead of tidy ones, because those are the riskiest.

### Privacy

Files are read inside our environment. Before any text goes to the language model, supplier names, people, contact details and bank details are swapped for tokens, and a leak check looks for any known name left behind. The model returns tokens and the exact sentence it relied on, and the real names go back in afterwards. Dates and amounts are never left to the model. The prototype shows the before and after of this step on a sample. It does not run it against a model.

### What is real in the prototype and what is simulated

| Part | In the prototype |
| --- | --- |
| Date arithmetic, labels, ordering of the list, confirm and accept actions | Real, computed live, with a clock you can move forward |
| Sorting payments into supplier, not a supplier and not sure | Real, rules run on the sample payments list |
| Masking of names before the model | Real on the sample text, shown as before and after |
| Version history and amendment comparison on one contract | Real on the sample: an accepted amendment shows as a tracked change and moves the date |
| Searching a drive and mail, and reading the 12 sample contracts | Precomputed, with the source sentence highlighted |
| Connecting to a real drive or mailbox | A mock consent screen that lists what would be read |
| The 5 sample emails | Precomputed matching and classification, each step shown |

The contracts are adapted from the Law Insider independent contractor agreements, with fictional parties, plus a few written for this case: a software subscription that autorenews, a logistics contract with SLAs, a facilities contract, and an amendment.

## Stakeholder map

Eight groups care how a supplier contract is renewed, paid and reviewed. They are placed by how much power they hold over the outcome and how much they care about it.

&#91;embedded content: stakeholder map · power and interest\]

The procurement lead and the finance lead are where most of the conflicts below meet. The contract owner has less power than either but is the person who has to act, so the product is built around them.

### Where they conflict

| Conflict | Between | Why | What Sonar does |
| --- | --- | --- | --- |
| Who decides a renewal | Contract owner and Procurement lead | The owner wants to keep the supplier as it is. Procurement wants to renegotiate. Each assumes the other decides | The item goes to the owner first. If nobody acts by the 30 day alert, it also goes to the procurement lead. An item with no owner goes straight to Procurement |
| Pay or hold an invoice above the agreed rate | Finance lead and Contract owner | Finance wants to hold it. The owner fears the service stops | Raises a Check item with the difference and the clause. Owner and Finance decide together. Sonar never holds a payment |
| Speed or review for a change to terms | Legal and the business | Legal wants to see every change. The business wants a quick yes | Amendments go to the version history for the owner to accept, marked for Legal to see. Nothing waits on Legal unless the company sets that rule |
| How much access | IT admin and the product | Finding contracts needs broad read access. IT wants the least that works | Read-only access, supplier domains only, an access log IT can read, and a pilot that starts with the highest-spend suppliers |
| A price increase | Supplier and the company | The supplier asks for more than the contract cap allows | Flags the gap against the cap and drafts a reply. The owner sends it |
| Proof of value | Executive sponsor and the team | The sponsor wants a savings number. Nobody has tracked renewals, so there is no baseline | Counts decisions made before the deadline from day one. Money is counted only where an invoice or a cap breach proves it |

### What Sonar does alone and what it leaves to people

- **On its own:** finds and reads files, builds the list, opens items, sends reminders and the weekly email, and escalates inside the company.
- **After a person's click:** sends any message to a supplier, applies an accepted amendment to the ledger, and marks a date as confirmed.
- **Never:** pays, holds or approves a payment, signs anything, changes a file in the drive, or contacts a supplier without an owner's click.

The assumption that nobody clearly owns a renewal is tested by the first conflict. In the prototype, an item with no owner lands with the procurement lead, and the Measures screen counts how many items end up there.

## User journey

This is the order the prototype demo follows. Each row is one screen the viewer lands on, so someone with no context can follow what is happening and why.

| # | Moment | Who | What happens | Screen |
| --- | --- | --- | --- | --- |
| 1 | Setup | Procurement lead, with IT | Connects the payables system, the drive and the mailbox with read-only access. Sets who owns which supplier where it is known | Setup |
| 2 | First read | Nobody, it runs alone | Sonar builds the vendor list from payments, hunts for each supplier's files and reads them. Sample result: 24 suppliers, 9 found, 2 partial, 13 not found | Home |
| 3 | Confirm | Contract owner | Opens a contract, sees each fact with its source and label, corrects what is wrong. Confirmed facts turn the date from Derived to Confirmed | Contract |
| 4 | A deadline gets close | Contract owner | Cloudmetric's notice deadline is 90 days away. A Decide item appears at the top of Needs you, and the weekly email carries it | Home, Email |
| 5 | Decide | Contract owner | Chooses renew, renegotiate or end. Sonar drafts the supplier reply. The owner reads it and clicks send | Item |
| 6 | An invoice differs | Finance lead and owner | Brightline bills above the agreed rate. A Check item shows the invoice, the clause and the difference. Sonar does not hold the payment | Item |
| 7 | An amendment arrives | Contract owner | Orbis emails a changed term. Sonar saves it as a new version with a redline. The owner accepts, and the dates recalculate | Versions |
| 8 | Nobody acts | Procurement lead | Move the clock forward 30 days. The unactioned item escalates to the procurement lead and is marked urgent at 7 days | Home |
| 9 | Handoff | Procurement lead | The confirmed ledger is ready as clean data for a contract management platform such as Sirion. Redlining, workflow and obligations pick up from here | Sirion |

Rows 1 to 8 are the intake solution. Row 9 is the pitch, and it is kept short.

## Success metrics

**North star: the share of contract deadlines that got a decision before they passed.** A deadline here is a renewal notice date, a price change date or a service review date. A decision means the owner chose renew, renegotiate or end. Skipping the choice does not count. This is the number that was zero in practice before, because nobody was watching the dates.

### How we know it works

| Metric | What it tells us | Starting target |
| --- | --- | --- |
| Coverage | Of the suppliers we pay, how many have a contract record linked | 70% of spend in the first month |
| Confirmed share | Of the records, how many an owner has checked | Half of the linked records within 30 days |
| Time from alert to decision | Whether people act once they are told | Median under 10 days |
| Items escalated | Where owners do not respond | Falling month on month |
| Flagged invoices that were real | Whether the Check items are worth a person's time | At least 6 in 10 |
| Items with no owner | How big the ownership gap is | Counted from day one, no target |

### Guardrails

- **Wrong dates:** how often an owner corrects a date at confirmation. A high rate means the reading is not good enough to alert on.
- **Alert fatigue:** items opened as a share of items sent. If owners stop opening them, the list is too long.
- **Access complaints:** any complaint from IT about what Sonar can see is counted and read.

### What we do not have yet

There is no baseline. The company has not tracked how many renewals it missed, so the first month sets the starting figures and no saving is claimed from it. Money is counted only where an invoice or a cap breach proves it.

### What would make us rethink

| Signal | Starting threshold | What we would do |
| --- | --- | --- |
| Owners correct too many dates | More than 1 in 4 confirmed dates is changed | Stop alerting on Derived dates. Show them as questions to confirm, and improve the reading before turning alerts back on |
| Alerts go unread | Fewer than 4 in 10 are opened | Cut the list to the items with a deadline inside 30 days and send the rest in the weekly email only |
| Few suppliers are found | Under 40% of spend linked after the first read | The entry point is weak. Ask the finance lead to upload the missing contracts for the top suppliers by spend |
| IT refuses org wide access | Access denied or limited to one mailbox | Switch to owner by owner connection, starting with the top suppliers, and accept slower coverage |
| Procurement ends up with most items | Over half of the items escalate | Ownership is the real problem. Make assigning an owner the first task instead of reading more files |

## Build plan for Claude Code

This part is for building the prototype after the architecture is signed off. The prototype is a static site with sample data. It shows the full flow and does not connect to any real account.

### Stack and deploy

Vite, React and TypeScript. No backend. Hash routing so it works on any static host. Code goes to GitHub and deploys through Vercel. The page title and header say Sirion Sonar.

### Screens

| Route | Screen | What it must show |
| --- | --- | --- |
| /setup | Setup | The three connections with read-only labels, a what we can see list, a short access log, and a button that runs the first read |
| /home | Home | The Needs you list with Decide, Check, Fix and Find items, the reason for each (time, arrival, absence, change), and the coverage count |
| /item/:id | Item | The facts behind the item, a drafted reply where one applies, and the owner's actions |
| /contract/:id | Contract | Each fact with source, confidence label and a confirm or correct control |
| /versions/:id | Versions | Original and amendments side by side with the redline, and an accept button that recalculates dates |
| /email | Weekly email | The email as the owner sees it, with the same items |
| /measures | Measures | The north star, the supporting metrics and the rethink signals, calculated from the sample data |
| /privacy | Privacy | A before and after of one document: the original text, the masked text sent to the model, and the restored result |
| /sirion | Handoff | The confirmed ledger as a table, and a short map of what Sirion adds after intake |

A clock control sits in the header. Moving it forward by days reruns the watch rules, so items appear and escalate on screen.

### Sample data

- **Contracts:** 12 contracts across about 24 suppliers, with some missing, some partial and some with unknown dates. Include Cloudmetric, Brightline and Orbis as the three that drive the demo.
- **Payments:** about 60 lines of supplier payments mixed with payroll, tax, loan and refund lines, so the filter has something to drop.
- **Emails:** 5 sample emails, including the Orbis amendment, a supplier price rise, and one that matches no contract.
- **People:** a procurement lead, a finance lead, three contract owners and one IT admin. At least two suppliers have no owner.

### Rules that must be code and never left to a model

- Roll the end date forward by the renewal term while the end date is on or before today.
- Notice deadline is the end date minus the notice days.
- Alerts fire at 90, 30 and 7 days before the notice deadline.
- An item unactioned at 30 days goes to the procurement lead, and is urgent at 7 days.
- An item with no owner goes to the procurement lead.
- Review queue is ordered by earliest possible deadline, with unknown and bounded dates first.
- Confidence label is Confirmed, Derived, Bounded or Unknown, set by how the date was found.

### Acceptance checks

1. A viewer with no context can run the demo from setup to handoff and say what each screen is for.
2. Moving the clock 90 days before Cloudmetric's notice deadline adds a Decide item. Moving it 30 days more escalates it.
3. Accepting the Orbis amendment changes its end date and its notice deadline, and the change is visible in Versions.
4. The Brightline Check item shows the invoice amount, the agreed amount and the clause.
5. An item with no owner appears under the procurement lead.
6. No screen has a button that pays, holds, signs or sends anything to a supplier without an owner click.
7. Measures numbers come from the sample data and change when items are decided.

### Not built

Real connections to any drive, mail or payables system. Real model calls. User login. Redlining and contract creation, which stay in the Sirion pitch.

## Claude Code prompts, step by step

Run these in order, in one repo. Each prompt ends with a check, and you commit when the check passes. Do not paste two prompts at once.

### Before the first prompt

1. Create an empty GitHub repo called sirion-sonar and clone it.
2. Export this doc as Markdown and save it in the repo as docs/spec.md. Claude Code reads it as the source of truth.
3. Open Claude Code in the repo folder and start with prompt 0.

### Prompt 0: project rules and design system

This goes first because every later prompt inherits it. It creates a CLAUDE.md file that Claude Code reads on every run.

```
Read docs/spec.md fully. It is the spec for a prototype called Sirion Sonar. Do not build anything yet.

Create CLAUDE.md in the repo root containing the rules below, word for word, then create docs/design.md with the same design section. Then stop and tell me what you understood in five lines.

PRODUCT
Sirion Sonar is a push-based list of things that need a person's attention on supplier contracts. It is a static prototype with sample data. No backend, no real API calls, no login. The demo has to make sense to someone with no context in under a minute.

STACK
Vite, React, TypeScript, React Router in hash mode, plain CSS with custom properties (no UI library, no Tailwind). Vitest for logic tests. Deployable as a static site on Vercel.

CODE RULES
- All business logic (dates, labels, alert rules, escalation, ordering, payment classification) lives in src/logic as pure functions with no React imports, and has Vitest tests.
- Dates and amounts are never produced by anything that looks like a model. They are computed in code from sample facts.
- The demo clock is global state. Every screen reads today from it, never from new Date().
- Nothing in the UI pays, holds, signs or sends anything to a supplier without an explicit click by the owner. Buttons that would send show a confirmation and then mark the item as sent in local state.
- Keep files small. One component per file. No dead code.

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
  Urgent: #B42318

Type: system font stack (Inter if available, then system-ui). Sizes 12, 14, 16, 20, 28 only. Body 14. Line height 1.5. Page titles 28 semibold, section titles 20 semibold, labels 12 medium uppercase letter spacing 0.04em. Numbers use tabular figures.

Space and shape: 4px base unit, use 4, 8, 12, 16, 24, 32, 48 only. Radius 8 on cards, 999 on badges, 6 on buttons. One shadow only, for popovers. Borders are 1px var(--line). Content width max 1120px, centered. Cards are white on the grey page.

Components to reuse everywhere: Badge (type and label variants, always text plus a small icon, never color alone), Button (primary, secondary, quiet), Card, Table, Field (label, value, source link, confidence badge), EmptyState, Toast.

Layout: top bar with the product name Sirion Sonar on the left, the demo clock control on the right, and a thin banner under it saying Sample company, sample data. Left nav with Home, Contracts, Weekly email, Measures, Privacy, Sirion. Setup is reached from a link on Home until it has been run once.

Copy: write like a person talking to a colleague. One sentence per item. Say what happened, what it costs, what to do. No em dashes, no long dashes, no marketing words, no exclamation marks. Never write the words leverage, seamless, robust, powerful, unlock, empower. Dates show as 14 Mar 2027. Money shows as Rs 1,20,000 with Indian grouping.

Motion: only fades under 150ms and one gentle progress animation on the first read screen. Respect prefers-reduced-motion.

Accessibility: text contrast at least 4.5:1, visible focus ring in --brand, every interactive element reachable by keyboard, badges carry an aria-label, tables have header cells.

WORKFLOW
After each task, run the type check, the tests and the build. Fix failures before saying done. List what you changed in a few lines.
```

Check: CLAUDE.md and docs/design.md exist and the five line summary matches this doc.

### Prompt 1: scaffold, tokens and shell

```
Scaffold the app per CLAUDE.md: Vite, React, TypeScript, hash router, Vitest. Create src/styles/tokens.css and a base.css from the design system. Build the layout shell: top bar with Sirion Sonar and a placeholder clock control, the sample data banner, the left nav, and empty routes for /setup, /home, /contracts, /item/:id, /contract/:id, /versions/:id, /email, /measures, /privacy, /sirion. Redirect / to /home. Set the page title to Sirion Sonar. Build the shared components Badge, Button, Card, Table, Field, EmptyState and Toast, and add a hidden /styleguide route that renders every component and variant so I can check them.
```

Check: run npm run dev, open /styleguide, and confirm badges, buttons and fonts match the design section.

### Prompt 2: sample data

```
Create typed sample data in src/data following the Sample data section of docs/spec.md.

- people.ts: a procurement lead, a finance lead, three contract owners, one IT admin. Names are fictional.
- vendors.ts: 24 suppliers. 9 have a full contract, 2 partial, 13 none. At least two have no owner. Include Cloudmetric (software subscription, autorenews), Brightline (logistics with SLAs and agreed rates) and Orbis (facilities, receives an amendment).
- contracts.ts: 12 contracts with facts. Each fact has a value, a source sentence, a page, a label (Confirmed, Derived, Bounded or Unknown) and a confirmedBy field. Include one contract with a missing order form so its date is Unknown, and one scan with an unreadable date and a yearly payment rhythm so it is Bounded.
- payments.ts: about 60 lines. Mix supplier payments with payroll, tax, EMI, own transfers and refunds.
- emails.ts: 5 emails, including the Orbis amendment, a supplier price rise above the contract cap, a Brightline invoice above the agreed rate, a routine invoice that matches, and one that matches no contract.
- Set the demo start date to 2026-11-19. Choose Cloudmetric so that its end date is 2027-04-30 with a 60 day notice period, which makes the notice deadline 2027-03-01.

Write the contract text for the sample sentences in plain English, fictional parties, a few lines each. No real company names.
```

Check: types compile, and a quick console log of vendors by status shows 9, 2 and 13.

### Prompt 3: the rules, as tested code

```
Build the logic layer in src/logic with Vitest tests. No React.

1. dates.ts: roll the end date forward by the renewal term while it is on or before today, then notice deadline = end date minus notice days.
2. labels.ts: assign Confirmed, Derived, Bounded or Unknown by how a date was found, per the How the record knows its dates section.
3. classify.ts: sort payments into supplier, not a supplier or not sure using layered rules (payroll, tax, EMI, own transfers, refunds, reimbursements dropped, bias toward including). Return the rule that fired for each line.
4. match.ts: merge vendor name variants, such as ACME PVT LTD and Acme Private Limited, and send unsure matches to a not sure bucket.
5. items.ts: given today, vendors, contracts, payments and emails, return the Needs you list. Types are Decide (renewal), Check (invoice differs), Fix (missed service), Find (paid with no contract). Each item has a reason (time, arrival, absence or change), an owner or none, a due date and a status.
6. alerts.ts: alerts at 90, 30 and 7 days before a notice deadline. An item with no action by the 30 day alert goes to the procurement lead, and is urgent at 7 days. An item with no owner goes to the procurement lead.
7. order.ts: order the review queue by earliest possible deadline, with Unknown and Bounded first.

Write tests for every acceptance check in docs/spec.md that can be tested without a screen, and make them pass.
```

Check: npm test is green. Open one test and read it, because this is the part a reviewer will ask about.

### Prompt 4: the clock and the Home screen

```
Build the global demo clock as a React context. The header control shows today's date, with buttons for plus 1 week, plus 1 month and reset, and a date picker. All screens read today from it.

Build /home per docs/spec.md: a heading that says what needs you today, the Needs you list grouped by urgency (Urgent, This month, Later), each row one sentence plus a type badge, the reason, the due date, the owner and one primary action. A coverage strip at the top shows how many of the suppliers we pay have a contract record. Rows open /item/:id. The procurement lead view has a switcher in the header to view as each person. Contract owners only see their own suppliers, the procurement lead sees everything.

Write the row sentences as plain statements, for example: Cloudmetric renews on 30 Apr 2027 unless you tell them by 1 Mar. That is 102 days away.
```

Check: moving the clock changes the list live, and switching person changes what is visible.

### Prompt 5: Item and Contract screens

```
Build /item/:id and /contract/:id per docs/spec.md.

Item: the facts behind the item, each with source sentence and a link to the contract page, a drafted reply where one applies, and the actions (Decide: renew, renegotiate, end. Check: ask the supplier, accept the invoice, flag for finance). The draft reply is precomputed text from the sample data. Sending is a button that shows a confirmation and then marks the item as sent in local state, and logs it. Nothing is paid or held.

Contract: a table of fields with value, source sentence highlighted in the contract text beside it, label badge, and Confirm or Correct controls. Confirming a date changes its label to Confirmed. Correcting lets the owner type a new value, then recalculates the dates and the Needs you list with the logic layer.
```

Check: confirm Cloudmetric's end date and see its badge change. Correct a date and watch the notice deadline move.

### Prompt 6: Setup and the first read

```
Build /setup per docs/spec.md. Show the three connections (payables, drive, mail) with read-only labels, a list of what Sonar can see and what it never does, and a short access log. A Run first read button plays a precomputed sequence: the vendor list builds from the payments, then each supplier is searched and read, with a coverage bar filling to 9 found, 2 partial, 13 not found out of 24. Show the payment classifier at work, with a few lines dropped and the rule that dropped them. When the read finishes, link to Home. Mark the connections as a mock consent screen so nobody thinks it is live.
```

Check: run the first read and land on a Home screen that has the expected items.

### Prompt 7: Versions and the Orbis amendment

```
Build /versions/:id. Show the original and each amendment side by side, with a clause level redline (additions and deletions marked with text and color). An accept button applies the amendment, recalculates the end date and notice deadline with the logic layer, adds a tracked change entry with who and when, and updates Home. Show the Orbis amendment arriving as a new item of type Check with reason change. Rejecting keeps the original.
```

Check: accepting the Orbis amendment changes its dates, and the change shows in the version history.

### Prompt 8: Weekly email and the incoming email flow

```
Build /email: the weekly email as an owner sees it, rendered like an email, with each item, its reason and one link into the app. Add a second tab, Incoming mail, with the 5 sample emails. Selecting one steps through the six stages from the incoming email flow in docs/spec.md (read, recognise the supplier, look up the contract and payments, compare, explain, route), each step visible with its result, using precomputed output. Amendments route to Versions, everything else becomes an item on Home.
```

Check: the Brightline email ends as a Check item showing the invoice, the agreed rate and the clause.

### Prompt 9: Measures and Privacy

```
Build /measures. Show the north star (share of deadlines that got a decision before they passed), the supporting metrics and the rethink signals from the Success metrics section, all calculated from the sample data and decision state, so they change when items are decided. Show the targets as faint markers. Add a plain note that there is no baseline.

Build /privacy. Show one document in three panes: the original text, the masked text that would go to the model with tokens in place of names, people, contact and bank details, and the restored result. State that dates and amounts are computed in code. Mark it as a sample, not a live model call.
```

Check: deciding an item on Home changes the north star on Measures.

### Prompt 10: Sirion handoff

```
Build /sirion. Keep it short. Top: the confirmed ledger as a table (supplier, owner, end date, notice deadline, label), with an Export CSV button that really downloads. Below: a compact map of where Sirion's platform picks up after intake (redlining and clause edits, approvals and workflow, supplier portal, e-signature, obligations and SLAs, AskSirion), taken from the Where Sirion fits section, each with one line. Add a note that these come from Sirion's published material and are not rebuilt here.
```

Check: export the CSV and open it in a spreadsheet.

### Prompt 11: polish, checks and deploy

```
Go through the Acceptance checks in docs/spec.md one by one, run each in the app and report pass or fail with what you did. Fix every fail. Then:
- run a copy pass across all screens against the Copy rules in CLAUDE.md and remove anything that breaks them
- add an empty state and a loading state where missing
- check keyboard use and contrast on Home, Item and Contract
- check the layout at 1280, 1024 and 390 pixel widths
- add a first-time guided overlay of four steps on Home that explains the list, the badges, the clock and the sample banner, dismissible and shown once
- add a README with what this is, how to run it, what is real and what is simulated, copied from the spec
- set the tab title and header to Sirion Sonar
Run the build and tests and make sure they pass.
```

Check: you can open the built site and run the whole demo from setup to Sirion without help.

### Deploy

Push to GitHub, import the repo in Vercel, accept the Vite defaults (build npm run build, output dist), and deploy. The live link is your submission link. Open it in a private window before you submit.

### If Claude Code goes off track

- If it adds a library or a backend, tell it: CLAUDE.md says no, remove it.
- If a screen looks off, ask for a change against a named token or rule in the design system, not a general feeling.
- If a date is wrong, ask for a failing test in src/logic first, then the fix.
- Commit after every passing prompt so you can go back one step.

## Assumptions and what is not settled

- A vendor list exists in some form, because invoices get processed. A payables system is the first choice and bank lines are the fallback.
- There is no contract tracker. If there were, the problem would not look like this, so Excel is treated as one more place contracts sit.
- Nobody clearly owns a renewal. The stakeholder map has to test this.
- The company will approve read-only access to a drive, shared inboxes and the ledger. This is the least settled assumption, and the one that would take longest in a real company.
- The alert points at 90, 30 and 7 days before a notice deadline, and the metric thresholds, are our numbers and can change.
- Models are off the shelf and reached through our own cloud account. We have not priced running them.
- Sirion's redlining, approvals, supplier portal and e-signature come from its published product material. The prototype does not rebuild them. It shows where they connect.
- Editing a contract inside the product is described, not built, apart from the version history on one sample contract.
- Sirion, Zip and Coupa claims come from vendor material. We have not used a configured Sirion.
- The evidence that this problem is real comes from the brief alone. The prototype has to say so and not dress up sample data as proof.
