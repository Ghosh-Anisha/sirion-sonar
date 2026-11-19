import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { planFirstRead } from "./firstRead";
import { allConnected, INITIAL_ONBOARDING, reduceOnboarding } from "./onboarding";
import { skipEvent } from "./skip";

const plan = planFirstRead(vendors, contracts, payments, emails);
const actor = { on: "2026-11-19", by: "Kavya Raman", seq: 0 };

describe("skipEvent", () => {
  it("connects everything, approves it and finishes the read", () => {
    const state = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, plan, actor, "Vikram Nair"));
    expect(allConnected(state)).toBe(true);
    expect(state).toMatchObject({ firstReadDone: true, readAll: true, start: "all", approval: { status: "approved", scope: "full", by: "Vikram Nair" } });
    expect(state.sources.drive.scope).toMatchObject({ product: "Google Drive", folders: "all" });
  });

  it("logs every connect and every file the read opened", () => {
    const state = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, plan, actor, "Vikram Nair"));
    expect(state.log.filter((e) => e.kind === "connect")).toHaveLength(3);
    expect(state.log.filter((e) => e.kind === "open")).toHaveLength(contracts.length);
    expect(state.log).toHaveLength(3 + 1 + plan.access.length);
  });

  it("keeps what the wizard already did", () => {
    const once = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, plan, actor, "Vikram Nair"));
    const twice = reduceOnboarding(once, skipEvent(once, plan, { ...actor, seq: once.log.length }, "Vikram Nair"));
    expect(twice.log).toEqual(once.log);
  });
});
