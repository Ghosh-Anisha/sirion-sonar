import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/home", text: "Home" },
  { to: "/contracts", text: "Contracts" },
  { to: "/email", text: "Weekly email" },
  { to: "/measures", text: "Measures" },
  { to: "/privacy", text: "Privacy" },
  { to: "/sirion", text: "Sirion" },
];

export function SideNav() {
  return (
    <nav className="sidenav" aria-label="Main">
      <ul>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className="sidenav__link">
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
