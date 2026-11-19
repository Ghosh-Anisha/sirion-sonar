import { createContext, useContext } from "react";

/** Which parts of the solution diagram the Play example is lighting up right now. */
export const LitContext = createContext<Set<string>>(new Set());

export function useLit(id: string): boolean {
  return useContext(LitContext).has(id);
}
