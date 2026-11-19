import { Outlet } from "react-router-dom";
import { DemoDock } from "../guide/DemoDock";
import { IdleHint } from "../guide/IdleHint";
import { FocusRing } from "../guide/FocusRing";
import { TourHost } from "../guide/TourHost";
import { UnderTheHood } from "../thinking/UnderTheHood";
import { RoleNotice } from "./RoleNotice";
import { SampleBanner } from "./SampleBanner";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import "./AppShell.css";

/**
 * The page frame. The onboarding wizard has no side nav, so it reads as one flow.
 * Sign-in has no top bar either, the way a product looks before anyone is signed in.
 */
export function AppShell({ nav = true, topBar = true }: { nav?: boolean; topBar?: boolean }) {
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      {topBar && <TopBar />}
      <SampleBanner />
      <div className={nav ? "shell" : "shell shell--single"}>
        {nav && <SideNav />}
        <main id="main" className="shell__main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <DemoDock />
      <UnderTheHood />
      <RoleNotice />
      <TourHost />
      <FocusRing />
      <IdleHint />
    </>
  );
}
