export const STORE_KEY = "stepsafe-session";

export function saveSession<T>(data: T) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function loadSession<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
