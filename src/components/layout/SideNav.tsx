import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const SECTIONS = [
  {
    title: "Product",
    links: [
      { to: "/home", text: "Home" },
      { to: "/contracts", text: "Contracts" },
      { to: "/email", text: "Weekly email" },
      { to: "/measures", text: "Measures" },
      { to: "/privacy", text: "Privacy" },
      { to: "/sirion", text: "Sirion" },
      { to: "/access", text: "Access log" },
      { to: "/architecture", text: "How it works" },
    ],
  },
  {
    title: "Case",
    links: [
      { to: "/why", text: "Why intake" },
      { to: "/problem", text: "The problem" },
      { to: "/stakeholders", text: "Stakeholders" },
      { to: "/assumptions", text: "Assumptions" },
    ],
  },
];

/** The main nav. On narrow screens it folds behind a Menu button, so the page starts near the top. */
export function SideNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={open ? "sidenav sidenav--open" : "sidenav"} aria-label="Main">
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
