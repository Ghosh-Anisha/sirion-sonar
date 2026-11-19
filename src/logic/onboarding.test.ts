import { describe, expect, it } from "vitest";
import { accessRequest, approveEntry, connectEntry, readEntries, revokeEntry, scopeText } from "./accessText";
import { allConnected, appendLog, INITIAL_ONBOARDING, needsApproval, parseOnboarding, reduceOnboarding, type SourceScope } from "./onboarding";

const actor = (seq: number) => ({ on: "2026-11-19", by: "Kavya Raman", seq });
const drive: SourceScope = { product: "Google Drive", folders: "chosen", chosen: ["Contracts", "Finance"], mail: "shared" };
const mail: SourceScope = { product: "Gmail", folders: "all", chosen: [], mail: "domains" };
const payables: SourceScope = { product: "Zoho Books", folders: "all", chosen: [], mail: "shared" };

function connected() {
  let state = reduceOnboarding(INITIAL_ONBOARDING, { type: "role", role: "procurement-lead" });
  for (const [source, scope] of [["payables", payables], ["drive", drive], ["mail", mail]] as const) {
    state = reduceOnboarding(state, { type: "connect", source, scope, entry: connectEntry(source, scope, actor(state.log.length)) });
  }
  return state;
}

describe("scopeText", () => {
  it("says exactly what each source may read", () => {
    expect(scopeText("drive", drive)).toBe("Google Drive, read-only, on the Contracts and Finance folders");
    expect(scopeText("drive", { ...drive, folders: "all" })).toBe("Google Drive, read-only, on all folders");
    expect(scopeText("mail", { ...mail, mail: "shared" })).toBe("Gmail, read-only, on the shared inboxes ap@ and procurement@");
    expect(scopeText("mail", mail)).toMatch(/limited to the supplier domains/);
  });
});

describe("reduceOnboarding", () => {
  it("connects each source and logs every connect", () => {
    const state = connected();
    expect(allConnected(state)).toBe(true);
    expect(state.log.map((e) => e.kind)).toEqual(["connect", "connect", "connect"]);
    expect(state.log[1].text).toBe("Connected Google Drive, read-only, on the Contracts and Finance folders.");
  });

  it("asks the IT admin to approve unless the IT admin is setting it up", () => {
    expect(needsApproval(connected())).toBe(true);
    expect(needsApproval(reduceOnboarding(connected(), { type: "role", role: "it-admin" }))).toBe(false);
  });

  it("starts with a pilot when IT narrows the access, and widens it later", () => {
    const narrowed = reduceOnboarding(connected(), { type: "approve", scope: "pilot", entry: approveEntry("pilot", 10, actor(3)) });
    expect(narrowed).toMatchObject({ start: "pilot", approval: { status: "approved", scope: "pilot" } });
    expect(narrowed.log[3].text).toBe("Approved read-only access for a pilot, limited to the top 10 suppliers by spend.");
    const widened = reduceOnboarding({ ...narrowed, readStage: 8 }, { type: "widen", entry: null });
    expect(widened).toMatchObject({ readAll: true, readStage: 2, approval: { scope: "full" } });
  });

  it("only ever adds to the access log", () => {
    let state = connected();
    const before = state.log;
    state = reduceOnboarding(state, { type: "revoke", source: "mail", entry: revokeEntry("mail", "Gmail", actor(state.log.length)) });
    expect(state.sources.mail).toMatchObject({ status: "revoked", revoked: { by: "Kavya Raman" } });
    expect(state.log.slice(0, before.length)).toEqual(before);
    expect(state.log.at(-1)!.text).toBe("Revoked access to Gmail. Sonar no longer reads it.");
    state = reduceOnboarding(state, { type: "go", step: 3 });
    expect(state.log).toHaveLength(before.length + 1);
  });

  it("does not log the same first read entry twice", () => {
    const entries = readEntries([{ source: "drive", kind: "open", vendorId: "orbis", text: "Opened a.pdf" }], "2026-11-19");
    const once = appendLog([], entries);
    expect(appendLog(once, entries)).toBe(once);
  });

  it("keeps the read where it was when the same start is picked again", () => {
    const state = { ...INITIAL_ONBOARDING, start: "all" as const, readStage: 5 };
    expect(reduceOnboarding(state, { type: "start", start: "all" }).readStage).toBe(5);
    expect(reduceOnboarding(state, { type: "start", start: "pilot" }).readStage).toBe(0);
  });

  it("keeps the step inside the wizard", () => {
    expect(reduceOnboarding(INITIAL_ONBOARDING, { type: "go", step: 99 }).step).toBe(7);
    expect(reduceOnboarding(INITIAL_ONBOARDING, { type: "go", step: -1 }).step).toBe(0);
  });
});

describe("accessRequest", () => {
  it("writes the request from what was chosen", () => {
    const text = accessRequest(connected(), { name: "Kavya Raman", title: "Procurement lead" }, { name: "Vikram Nair", title: "IT admin" });
    expect(text[0]).toBe("To: Vikram Nair, IT admin");
    expect(text).toContain("Drive: Google Drive, read-only, on the Contracts and Finance folders.");
    expect(text.at(-1)).toMatch(/never holds bank credentials/);
  });
});

describe("parseOnboarding", () => {
  it("starts fresh on missing or broken saved state", () => {
    expect(parseOnboarding(null)).toBe(INITIAL_ONBOARDING);
    expect(parseOnboarding("{not json")).toBe(INITIAL_ONBOARDING);
    expect(parseOnboarding('{"step":"x"}')).toBe(INITIAL_ONBOARDING);
  });

  it("reads back what was saved", () => {
    const state = connected();
    expect(parseOnboarding(JSON.stringify(state))).toEqual(state);
  });
});
