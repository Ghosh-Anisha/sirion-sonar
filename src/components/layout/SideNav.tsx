import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NavIcon, type NavIconName } from "./NavIcon";

/** The product's own nav, inside Try it. The story pages and the case are reached from the steps at the top. */
const SECTIONS: { title: string; links: { to: string; text: string; icon: NavIconName }[] }[] = [
  {
    title: "Try it",
    links: [
      { to: "/home", text: "Home", icon: "home" },
      { to: "/contracts", text: "Contracts", icon: "contracts" },
      { to: "/email", text: "Weekly email", icon: "mail" },
      { to: "/access", text: "Access log", icon: "access" },
      { to: "/architecture", text: "How it works", icon: "how" },
      { to: "/privacy", text: "Privacy", icon: "privacy" },
      { to: "/sirion", text: "Sirion handoff", icon: "sirion" },
    ],
  },
];

/** The main nav. On narrow screens it folds behind a Menu button, so the page starts near the top. */
export function SideNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={open ? "sidenav sidenav--open" : "sidenav"} aria-label="Product">
      <button type="button" className="sidenav__menu" aria-expanded={open} aria-controls="sidenav-sections" onClick={() => setOpen(!open)}>
        {open ? "Close menu" : "Menu"}
      </button>
      <div id="sidenav-sections" className="sidenav__sections">
        {SECTIONS.map((section) => (
          <div key={section.title} className="sidenav__section">
            <h2 className="sidenav__title label" id={`nav-${section.title}`}>
              {section.title}
            </h2>
            <ul aria-labelledby={`nav-${section.title}`}>
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="sidenav__link">
                    <NavIcon name={link.icon} />
                    {link.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
