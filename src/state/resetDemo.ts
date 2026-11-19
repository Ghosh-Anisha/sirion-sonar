const PREFIX = "sirion-sonar.";

/** Clears everything the demo keeps in this browser, then reloads at sign-in so in-memory state starts fresh too. */
export function resetDemo() {
  try {
    const keys = Array.from({ length: window.localStorage.length }, (_, i) => window.localStorage.key(i)).filter(
      (k): k is string => k !== null && k.startsWith(PREFIX),
    );
    for (const key of keys) window.localStorage.removeItem(key);
  } catch {
    // Storage can be blocked. The reload still resets what is in memory.
  }
  window.location.hash = "#/login";
  window.location.reload();
}
