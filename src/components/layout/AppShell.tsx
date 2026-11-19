import { Outlet } from "react-router-dom";
import { SampleBanner } from "./SampleBanner";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import "./AppShell.css";

/** The page frame. The onboarding wizard has no side nav, so it reads as one flow. */
export function AppShell({ nav = true }: { nav?: boolean }) {
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <TopBar />
      <SampleBanner />
      <div className={nav ? "shell" : "shell shell--single"}>
        {nav && <SideNav />}
        <main id="main" className="shell__main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
