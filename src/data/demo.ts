/** The date the demo opens on. The clock starts here and resets to it. */
export const DEMO_START = "2026-11-19";

/** The day the Orbis First Amendment arrives by email: after day one, before the 1 Dec alert the demo moves to. */
export const ORBIS_AMENDMENT_ARRIVES = "2026-11-25";

/** Clock shortcuts in the demo guide. */
export const CLOUDMETRIC_90_DAY_ALERT = "2026-12-01";
export const CLOUDMETRIC_ESCALATION = "2027-01-29";

/** Contracts their owner had already confirmed and sent to Sirion before the demo opens, so the viewer sees each state. */
export const SENT_TO_SIRION_BEFORE_DEMO: Record<string, { by: string; on: string }> = {
  "talentbridge-staffing": { by: "rohan", on: "2026-11-12" },
};
