import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { moments } from "../data/journey";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { cloudmetricAlert, momentsDone, nextAction, type JourneyInput } from "./journey";
import { INITIAL_ONBOARDING, reduceOnboarding } from "./onboarding";
import { skipEvent } from "./skip";
import { planFirstRead } from "./firstRead";

const plan = planFirstRead(vendors, contracts, payments, emails);
const skipped = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, plan, { on: DEMO_START, by: "Kavya Raman", seq: 0 }, "Vikram Nair", "kavya.raman@tamarindhome.example"));
const itemsOn = (today: string, actions = {}) => buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions });

function input(change: Partial<JourneyInput> = {}): JourneyInput {
  return { onboarding: INITIAL_ONBOARDING, factEdits: {}, actions: {}, opened: {}, items: itemsOn(DEMO_START), contracts, visited: [], today: DEMO_START, demoStart: DEMO_START, ...change };
}

describe("cloudmetricAlert", () => {
  it("fires 90 days before the 1 Mar 2027 notice deadline", () => {
    expect(cloudmetricAlert(contracts, DEMO_START)).toEqual({ deadline: "2027-03-01", alertOn: "2026-12-01", itemId: "decide:cloudmetric-subscription:2027-03-01" });
  });
});

describe("momentsDone", () => {
  it("starts with nothing done", () => {
    expect(Object.values(momentsDone(input())).some(Boolean)).toBe(false);
  });

  it("ticks setup and the first read from onboarding", () => {
    expect(momentsDone(input({ onboarding: skipped }))).toMatchObject({ setup: true, "first-read": true, confirm: false });
  });

  it("ticks the rest from what the viewer did and where the clock is", () => {
    const actions = {
      "decide:cloudmetric-subscription:2027-03-01": { kind: "renew" as const, on: "2026-12-01", by: "neha" },
      "change:orbis-amendment": { kind: "accepted" as const, on: "2026-12-01", by: "farah" },
    };
    const done = momentsDone(
      input({
        onboarding: skipped,
        factEdits: { "cloudmetric-subscription": { endDate: { kind: "confirmed", value: "2025-04-30", by: "neha", on: DEMO_START } } },
        actions,
        opened: { "check:brightline-invoice": DEMO_START },
        items: itemsOn("2026-12-19", actions),
        visited: ["/sirion"],
        today: "2026-12-19",
      }),
    );
    expect(Object.values(done).every(Boolean)).toBe(true);
  });

  it("does not count the deadline before the 90 day alert", () => {
    expect(momentsDone(input({ today: "2026-11-30" })).deadline).toBe(false);
    expect(momentsDone(input({ today: "2026-12-01" })).deadline).toBe(true);
  });
});

describe("nextAction", () => {
  const base = { onboarding: skipped, contracts, today: DEMO_START, demoStart: DEMO_START };

  it("moves the clock to the Cloudmetric alert for the deadline and the decision", () => {
    expect(nextAction("deadline", base)).toEqual({ to: "/home", clock: "2026-12-01", nudge: "item:decide:cloudmetric-subscription:2027-03-01" });
    expect(nextAction("decide", base).to).toBe("/item/decide%3Acloudmetric-subscription%3A2027-03-01");
    expect(nextAction("decide", { ...base, today: "2026-12-05" }).clock).toBeNull();
  });

  it("moves the clock 30 days on for Nobody acts, and only forward", () => {
    expect(nextAction("nobody-acts", base).clock).toBe("2026-12-19");
    expect(nextAction("nobody-acts", { ...base, today: "2027-01-10" }).clock).toBeNull();
  });

  it("has a place to go for every moment", () => {
    for (const m of moments) expect(nextAction(m.id, base).to).toMatch(/^\//);
  });
});
