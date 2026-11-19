import type { Person } from "../../data/types";

/** A person's initials in a circle, colored by their role so roles are easy to tell apart. */
export function Avatar({ person, size = 32 }: { person: Person; size?: number }) {
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <span className={`avatar avatar--${person.role}`} style={{ width: size, height: size }} aria-hidden="true">
      {initials}
    </span>
  );
}
