import { useContext } from "react";
import { WitcherContext } from "./witcherSessionContext";

/**
 * Convenience hook to access the witcher session.
 *
 * Throws a clear error if used outside the <WitcherProvider> tree.
 * This is helpful during the exam to catch wiring mistakes early.
 */
export function useWitcher() {
  const ctx = useContext(WitcherContext);
  if (!ctx) {
    throw new Error("useWitcher must be used within WitcherProvider");
  }
  return ctx;
}
