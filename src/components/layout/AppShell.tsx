import { Outlet } from "react-router-dom";
import { SampleBanner } from "./SampleBanner";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import "./AppShell.css";

export function AppShell() {
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <TopBar />
      <SampleBanner />
      <div className="shell">
        <SideNav />
        <main id="main" className="shell__main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
