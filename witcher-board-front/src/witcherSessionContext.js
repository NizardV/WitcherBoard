import { createContext } from "react";

/**
 * Key used to persist the logged-in witcher in sessionStorage.
 *
 * We use sessionStorage (not localStorage) to keep the session limited
 * to the current browser tab/window, matching the exam requirements.
 */
export const STORAGE_KEY = "witcher";

/**
 * Witcher session context.
 *
 * Value shape:
 * - witcher: { id: number, name: string, avatar?: string } | null
 * - login: (witcher) => void
 * - logout: () => void
 */
export const WitcherContext = createContext(null);
