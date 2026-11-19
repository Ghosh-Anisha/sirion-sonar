import { NavLink } from "react-router-dom";

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

export function SideNav() {
  return (
    <nav className="sidenav" aria-label="Main">
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
    </nav>
  );
}
