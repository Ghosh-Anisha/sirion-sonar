/** The pages a viewer has opened, kept as top level paths such as "/story". */

/** The top level part of a path: "/item/x" becomes "/item". */
export function topPath(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  return first ? `/${first}` : "/";
}

/** Adds a page to the list once, keeping the order of first visit. */
export function withVisit(visited: string[], pathname: string): string[] {
  const top = topPath(pathname);
  return visited.includes(top) ? visited : [...visited, top];
}

/** Reads a stored list, ignoring anything that is not a list of paths. */
export function parseVisits(raw: string | null): string[] {
  try {
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}
