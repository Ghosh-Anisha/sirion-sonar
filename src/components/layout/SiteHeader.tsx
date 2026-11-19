import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { siteSteps } from "../../data/story";
import { stepFor } from "../../logic/siteMap";
import { BrandMark } from "./BrandMark";
import "./SiteHeader.css";

const CASE_LINKS = [
  { to: "/why", text: "Why intake" },
  { to: "/problem", text: "The problem" },
  { to: "/stakeholders", text: "Stakeholders" },
  { to: "/assumptions", text: "Assumptions" },
];

/** The top of every page: the four steps of the site, from the story to the measures, and a Case menu. */
export function SiteHeader() {
  const { pathname } = useLocation();
  const current = stepFor(pathname);
  const menu = useRef<HTMLDetailsElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  // Share the header's real height, so sticky bars under it sit right on narrow screens where it wraps.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--site-header-height", `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={header} className="site-header">
      <Link to="/story" className="site-header__brand">
        <BrandMark />
        Sirion Sonar
      </Link>
      <nav aria-label="Steps" className="stepper">
        <ol>
          {siteSteps.map((s) => (
            <li key={s.id}>
              <Link to={s.to} className={`stepper__step${s.id === current ? " stepper__step--on" : ""}`} aria-current={s.id === current ? "step" : undefined}>
                <span className="stepper__number num">{s.number}</span>
                <span className="stepper__label">{s.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <details ref={menu} className="case-menu">
        <summary>Case</summary>
        <ul>
          {CASE_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.text}</NavLink>
            </li>
          ))}
        </ul>
      </details>
    </header>
  );
}
