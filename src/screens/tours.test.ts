import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { App } from "../App";
import { DEMO_START } from "../data/demo";
import { tours, tourScreenFor, type TourScreen } from "../data/tours";
import { INITIAL_ONBOARDING, reduceOnboarding } from "../logic/onboarding";
import { skipEvent } from "../logic/skip";
import { firstReadPlan } from "../state/firstReadPlan";

/*
 * Every tour step must point at something that is really on its screen. This renders each
 * screen the way a first-time viewer sees it after Skip to demo, and the welcome screen fresh.
 */

/*
 * The Orbis amendment arrives by email after day one, and the demo reaches Versions after it has.
 * Render every screen as it looks once the amendment is in, so the Versions tour has its amendment to point at.
 */
vi.mock("../data/demo", async (importOriginal) => {
  const real = await importOriginal<typeof import("../data/demo")>();
  return { ...real, ORBIS_AMENDMENT_ARRIVES: real.DEMO_START };
});

const skipped = reduceOnboarding(INITIAL_ONBOARDING, skipEvent(INITIAL_ONBOARDING, firstReadPlan, { on: DEMO_START, by: "Kavya Raman", seq: 0 }, "Vikram Nair", "kavya.raman@tamarindhome.example"));

const PATHS: Record<TourScreen, string> = {
  story: "/story",
  solution: "/solution",
  login: "/login",
  welcome: "/welcome",
  home: "/home",
  contracts: "/contracts",
  item: "/item/decide%3Aledgerline-payroll%3A2026-12-01",
  contract: "/contract/cloudmetric-subscription",
  versions: "/versions/orbis-facilities",
  email: "/email",
  measures: "/measures",
  privacy: "/privacy",
  sirion: "/sirion",
  access: "/access",
  architecture: "/architecture",
  why: "/why",
  problem: "/problem",
  stakeholders: "/stakeholders",
  assumptions: "/assumptions",
};

function render(path: string, onboarding: object) {
  const store: Record<string, string> = { "sirion-sonar.onboarding.v2": JSON.stringify(onboarding) };
  (globalThis as { window?: unknown }).window = {
    localStorage: { getItem: (k: string) => store[k] ?? null, setItem() {} },
    matchMedia: () => ({ matches: false }),
  };
  return renderToString(createElement(MemoryRouter, { initialEntries: [path] }, createElement(App)));
}

function targetsOn(html: string): Set<string> {
  return new Set([...html.matchAll(/data-tour="([^"]+)"/g)].map((m) => m[1]));
}

describe("tours", () => {
  for (const screen of Object.keys(tours) as TourScreen[]) {
    it(`${screen}: every step points at something on the screen`, () => {
      const path = PATHS[screen];
      expect(tourScreenFor(path.split("?")[0])).toBe(screen);
      const fresh = screen === "login" ? INITIAL_ONBOARDING : { ...INITIAL_ONBOARDING, signedIn: { email: "kavya.raman@tamarindhome.example", on: DEMO_START } };
      const found = targetsOn(render(path, screen === "welcome" || screen === "login" ? fresh : skipped));
      const steps = tours[screen];
      expect(steps.length).toBeGreaterThanOrEqual(3);
      expect(steps.length).toBeLessThanOrEqual(5);
      for (const step of steps) expect(found.has(step.target), `${screen}: ${step.target}`).toBe(true);
    });
  }

  it("gives Home the four first-time steps: the list, the badges, the clock and the sample banner", () => {
    expect(tours.home.map((s) => s.target)).toEqual(["needs-you-list", "item-badges", "clock", "sample-banner"]);
  });

  it("follows the copy rules", () => {
    expect(JSON.stringify(tours)).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
