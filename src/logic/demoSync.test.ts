import { describe, expect, it } from "vitest";
import { DEMO_START } from "../data/demo";
import { demoSteps, type DemoSnapshot } from "../data/demoSteps";
import { syncedStep } from "./demoSync";
import { INITIAL_ONBOARDING, reduceOnboarding } from "./onboarding";
import { skipEvent } from "./skip";
import { firstReadPlan } from "../state/firstReadPlan";

const fresh: DemoSnapshot = { path: "/login", onboarding: INITIAL_ONBOARDING, actions: {}, sent: {}, factEdits: {}, viewerId: "kavya", today: DEMO_START };
const skipped = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, firstReadPlan, { on: DEMO_START, by: "Kavya Raman", seq: 0 }, "Vikram Nair", "kavya.raman@tamarindhome.example"));
const caption = (s: DemoSnapshot) => demoSteps[syncedStep(demoSteps, s)].caption;
const cloudmetric = "decide:cloudmetric-subscription:2027-03-01";

describe("syncedStep", () => {
  it("starts at sign-in", () => {
    expect(syncedStep(demoSteps, { ...fresh, path: "/story" })).toBe(0);
  });

  it("moves on once signed in, without a click on the bar", () => {
    const signedIn = reduceOnboarding(INITIAL_ONBOARDING, { type: "sign-in", email: "a@b.c", on: DEMO_START });
    expect(caption({ ...fresh, path: "/welcome", onboarding: signedIn })).toMatch(/^Sonar finds the contracts/);
  });

  it("catches up when the viewer skips to the demo", () => {
    expect(caption({ ...fresh, path: "/home", onboarding: skipped })).toMatch(/^As procurement lead, Kavya sees every item/);
  });

  it("follows the clock and the viewer when they are changed by hand", () => {
    const asNeha = { ...fresh, path: "/home", onboarding: skipped, viewerId: "neha" };
    expect(caption(asNeha)).toMatch(/Open Contracts/);
    expect(caption({ ...asNeha, today: "2026-12-01", path: "/contract/cloudmetric-subscription" })).toBe("Back to her list.");
    expect(caption({ ...asNeha, today: "2026-12-01" })).toBe("A Decide item has arrived for Cloudmetric. Open it.");
    expect(caption({ ...asNeha, today: "2026-12-01", path: `/item/${cloudmetric}` })).toBe("The dates come with the clauses they were read from.");
  });

  it("follows the viewer back when they leave a page", () => {
    const onItem = { ...fresh, onboarding: skipped, viewerId: "neha", today: "2026-12-01", path: `/item/${cloudmetric}` };
    const back = { ...onItem, path: "/home" };
    expect(syncedStep(demoSteps, back)).toBeLessThan(syncedStep(demoSteps, onItem));
  });

  it("ends on the summary", () => {
    const done = {
      ...fresh,
      onboarding: skipped,
      path: "/summary",
      viewerId: "kavya",
      today: "2026-12-19",
      actions: { [cloudmetric]: { kind: "renegotiate" as const, on: "2026-12-01", by: "neha" }, "change:orbis-amendment": { kind: "accepted" as const, on: "2026-12-01", by: "farah" } },
      sent: { [cloudmetric]: {} },
      factEdits: { "cloudmetric-subscription": { startDate: { kind: "confirmed" as const, value: "2024-05-01", by: "neha", on: DEMO_START } } },
    };
    expect(syncedStep(demoSteps, done)).toBe(demoSteps.length - 1);
  });
});
