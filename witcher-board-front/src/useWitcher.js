import { useContext } from "react";
import { WitcherContext } from "./witcherSessionContext";

/**
 * Convenience hook to access the witcher session.
 *
 * Why a dedicated hook?
 * - Avoid importing useContext + WitcherContext everywhere.
 * - Centralize the "must be inside provider" guard.
 *
 * Throws a clear error if used outside the <WitcherProvider> tree.
 * This is helpful during the exam to catch wiring mistakes early.
 */
export function useWitcher() {
  const ctx = useContext(WitcherContext);
  if (!ctx) {
    // Fail fast: without the provider, the app cannot read/write session state.
    throw new Error("useWitcher must be used within WitcherProvider");
  }
  return ctx;
}
