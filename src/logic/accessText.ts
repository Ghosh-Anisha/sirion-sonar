import { SHARED_INBOXES, type SourceId } from "../data/sources";
import type { AccessEntry } from "./firstRead";
import type { AccessLogEntry, Onboarding, SourceScope } from "./onboarding";

/*
 * The words for the access request and the access log, built from what was actually chosen.
 * Each entry gets a key. Entries a person causes carry the log's length, so doing the same
 * thing twice logs twice. Entries from the first read carry their text, so a replay does not.
 */

const SOURCE_NAME: Record<SourceId, string> = { payables: "Payables", drive: "Drive", mail: "Mail" };

/** "A", "A and B", "A, B and C". */
export function andList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** What one source is allowed to read, in a few words. */
export function scopeText(source: SourceId, scope: SourceScope): string {
  switch (source) {
    case "payables":
      return `${andList(scope.products)}, a read-only export of the vendor list, payment dates and amounts`;
    case "drive":
      return `${andList(scope.products)}, read-only, on ${scope.folders === "all" ? "all folders" : `the ${andList(scope.chosen)} ${scope.chosen.length === 1 ? "folder" : "folders"}`}`;
    case "mail":
      return scope.mail === "shared"
        ? `${andList(scope.products)}, read-only, on the shared inboxes ${andList(SHARED_INBOXES)}`
        : `${andList(scope.products)}, read-only, a search across the company limited to the supplier domains on the vendor list`;
  }
}

export interface Requester {
  name: string;
  title: string;
}

/** The exact request the IT admin receives. */
export function accessRequest(state: Onboarding, from: Requester, to: Requester): string[] {
  const lines = (["payables", "drive", "mail"] as const).flatMap((id) => {
    const scope = state.sources[id].scope;
    return scope ? [`${SOURCE_NAME[id]}: ${scopeText(id, scope)}.`] : [];
  });
  return [
    `To: ${to.name}, ${to.title}`,
    `From: ${from.name}, ${from.title}`,
    "Subject: Read-only access for Sirion Sonar",
    "Please approve read-only access for Sirion Sonar, so it can find and read our supplier contracts.",
    ...lines,
    "Sonar never holds bank credentials, moves money, changes or deletes files, or sends anything on its own. Every file and message it opens goes into an access log you can read, and you can revoke any source there.",
  ];
}

interface Actor {
  on: string;
  by: string;
  seq: number;
}

export function connectEntry(source: SourceId, scope: SourceScope, { on, by, seq }: Actor): AccessLogEntry {
  return { key: `connect:${source}:${seq}`, on, by, source, kind: "connect", text: `Connected ${scopeText(source, scope)}.` };
}

export function revokeEntry(source: SourceId, products: string[], { on, by, seq }: Actor): AccessLogEntry {
  const them = products.length === 1 ? "it" : "them";
  return { key: `revoke:${source}:${seq}`, on, by, source, kind: "revoke", text: `Revoked access to ${andList(products)}. Sonar no longer reads ${them}.` };
}

export function requestEntry(to: Requester, { on, by, seq }: Actor): AccessLogEntry {
  return { key: `request:${seq}`, on, by, source: "access", kind: "request", text: `Asked ${to.name}, ${to.title}, to approve read-only access.` };
}

export function approveEntry(scope: "full" | "pilot", pilotSize: number, { on, by, seq }: Actor): AccessLogEntry {
  const text =
    scope === "full"
      ? "Approved read-only access as asked."
      : `Approved read-only access for a pilot, limited to the top ${pilotSize} suppliers by spend.`;
  return { key: `approve:${seq}`, on, by, source: "access", kind: "approve", text };
}

export function widenEntry(total: number, { on, by, seq }: Actor): AccessLogEntry {
  return { key: `widen:${seq}`, on, by, source: "access", kind: "approve", text: `Widened access from the pilot to all ${total} suppliers.` };
}

/** First read entries as access log lines. */
export function readEntries(entries: AccessEntry[], on: string): AccessLogEntry[] {
  return entries.map((e) => ({ key: `read:${e.text}`, on, by: "Sonar", source: e.source, kind: e.kind, text: e.text }));
}
