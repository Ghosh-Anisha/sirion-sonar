import type { Action } from "../../data/demoSteps";

/** Whether an element is on screen and can be pressed. */
export function showing(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.getClientRects().length > 0 && !(el as HTMLButtonElement).disabled;
}

/** The element a step points at: the control to press, or the box that does it for the clock and the viewer. */
export function findTarget(action: Action): HTMLElement | undefined {
  if ("go" in action) return undefined;
  if ("clock" in action) return document.querySelector<HTMLElement>(".clock__picker input") ?? undefined;
  if ("viewer" in action) {
    const box = document.querySelector<HTMLElement>(".dock .view-as select");
    return box && showing(box) ? box : undefined;
  }
  if ("click" in action) return Array.from(document.querySelectorAll(action.click)).find(showing);
  return Array.from(document.querySelectorAll("main button, main a, main label, dialog button, dialog label")).find(
    (el): el is HTMLElement => showing(el) && el.textContent?.trim() === action.press,
  );
}

/**
 * Whether a click landed on the control a step asks for. It checks the clicked element and its parents
 * against the step itself, so a click still counts after the screen has redrawn the control.
 */
export function clickMatches(clicked: EventTarget | null, action: Action): boolean {
  if (!(clicked instanceof Element)) return false;
  if ("click" in action) return clicked.closest(action.click) !== null;
  if ("press" in action) {
    const control = clicked.closest("button, a, label");
    return control !== null && control.textContent?.trim() === action.press;
  }
  return false;
}

/** Whether the viewer presses the target themselves. The clock and viewer are set by the bar's button instead. */
export function pressedByViewer(action: Action | undefined): boolean {
  return action !== undefined && ("click" in action || "press" in action);
}
