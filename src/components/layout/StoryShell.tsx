import { Outlet, useLocation } from "react-router-dom";
import { TourHost } from "../guide/TourHost";
import { UnderTheHood } from "../thinking/UnderTheHood";
import { SiteHeader } from "./SiteHeader";
import "./AppShell.css";

/** The frame for the story pages: the site steps on top, then a wide tinted page with no product chrome. */
export function StoryShell() {
  const { pathname } = useLocation();
  const wide = pathname.startsWith("/solution");
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <SiteHeader />
      <div className="story-shell">
        <main id="main" className={`story-shell__main${wide ? " story-shell__main--wide" : ""}`} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <UnderTheHood />
      <TourHost />
    </>
  );
}
