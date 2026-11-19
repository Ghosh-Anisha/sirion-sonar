import { useEffect, useRef, useState } from "react";
import { solutionSections } from "../../data/architecture";
import "./Sections.css";

/** The sticky anchor nav for /solution. It marks the section on screen and jumps to a section when pressed. */
export function SolutionNav() {
  const [current, setCurrent] = useState<string>(solutionSections[0].id);
  const nav = useRef<HTMLElement>(null);

  // Marks the last section whose top has passed under the sticky bars.
  useEffect(() => {
    const update = () => {
      const line = (nav.current?.getBoundingClientRect().bottom ?? 0) + 32;
      let id: string = solutionSections[0].id;
      for (const sec of solutionSections) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= line) id = sec.id;
      }
      setCurrent(id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Keeps the marked section's link in view when the bar scrolls sideways on a narrow screen.
  useEffect(() => {
    nav.current?.querySelector(".sol-nav__link--on")?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [current]);

  const jump = (id: string) => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav ref={nav} className="sol-nav" aria-label="On this page" data-tour="solution-nav">
      <ul>
        {solutionSections.map((s) => (
          <li key={s.id}>
            <a
              href={`#/solution`}
              className={s.id === current ? "sol-nav__link sol-nav__link--on" : "sol-nav__link"}
              aria-current={s.id === current ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                jump(s.id);
              }}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
