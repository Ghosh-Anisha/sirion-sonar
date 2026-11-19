import { PILOT_SIZE, sources, type Source } from "../data/sources";
import { approveEntry, connectEntry, readEntries } from "./accessText";
import type { FirstRead } from "./firstRead";
import type { Onboarding, OnboardingEvent, SourceScope } from "./onboarding";

/** The scope a source gets when nobody picked one: the first product, every folder, the shared inboxes only. */
export function defaultScope(source: Source): SourceScope {
  return { product: source.products[0], folders: "all", chosen: [], mail: "shared" };
}

/**
 * Skip to demo: whatever the wizard has not done yet is done with the defaults, and logged
 * as if it had happened, so the access log still lists every connect and every file opened.
 */
export function skipEvent(state: Onboarding, plan: FirstRead, actor: { on: string; by: string; seq: number }, adminName: string): OnboardingEvent {
  const scopes = Object.fromEntries(sources.map((s) => [s.id, state.sources[s.id].scope ?? defaultScope(s)])) as Record<Source["id"], SourceScope>;
  let seq = actor.seq;
  const connects = sources
    .filter((s) => state.sources[s.id].status !== "connected")
    .map((s) => connectEntry(s.id, scopes[s.id], { on: actor.on, by: actor.by, seq: seq++ }));
  const approvedInFull = state.approval.status === "approved" && state.approval.scope === "full";
  const approval = approvedInFull ? [] : [approveEntry("full", PILOT_SIZE, { on: actor.on, by: adminName, seq: seq++ })];
  return { type: "skip", scopes, entries: [...connects, ...approval, ...readEntries(plan.access, actor.on)], on: actor.on, by: adminName };
}
