/** UI-only demo session marker. Replaced by real auth later. */
export const SESSION_KEY = "foresite.session";

export function hasSession() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY));
}

export function startDemoSession(email: string, remember: boolean) {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now(), demo: true }));
}

export function endDemoSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}
