import { useMemo, useState } from "react";
import { STORAGE_KEY, WitcherContext } from "./witcherSessionContext";

/**
 * Read the initial witcher identity from sessionStorage.
 *
 * We keep this separate so it can be passed directly to useState as an
 * initializer function (runs once on mount).
 *
 * Why:
 * - This avoids reading/parsing sessionStorage on every render.
 * - If storage is corrupt, we safely fall back to null.
 */
function loadInitialWitcher() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "number" && typeof parsed.name === "string") {
      const avatar = typeof parsed.avatar === "string" ? parsed.avatar : "";
      return { id: parsed.id, name: parsed.name, avatar };
    }
  } catch {
    // ignore invalid storage
  }
  return null;
}

/**
 * Provider for the witcher session.
 *
 * Responsibilities:
 * - Expose `witcher`, `login`, `logout` to the whole app.
 * - Persist state to sessionStorage.
 *
 * Note: this is a simplified auth (no token). The backend is assumed to accept
 * actions based on the chosen witcher in the UI (exam exercise).
 */
export default function WitcherProvider({ children }) {
  // Initialize from sessionStorage once.
  const [witcher, setWitcher] = useState(loadInitialWitcher);

  const value = useMemo(() => {
    // Context value is memoized so consumers don't re-render unnecessarily.
    // (They will still re-render when `witcher` changes.)
    function login(nextWitcher) {
      // Normalize to avoid storing unexpected shapes.
      // If id cannot be coerced to a finite number, we still store NaN,
      // but the rest of the UI typically guards against invalid sessions.
      const normalized = {
        id: Number(nextWitcher?.id),
        name: String(nextWitcher?.name ?? ""),
        avatar: String(nextWitcher?.avatar ?? ""),
      };

      // Persist for the duration of the browser tab.
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      // Update in-memory state.
      setWitcher(normalized);
    }

    function logout() {
      // Clear persistence + state.
      sessionStorage.removeItem(STORAGE_KEY);
      setWitcher(null);
    }

    return { witcher, login, logout };
  }, [witcher]);

  return <WitcherContext.Provider value={value}>{children}</WitcherContext.Provider>;
}
