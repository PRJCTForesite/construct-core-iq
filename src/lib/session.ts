/** UI-only demo session marker. Replaced by real auth later. */
export const SESSION_KEY = "foresite.session";

export function hasSession() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(SESSION_KEY));
}
