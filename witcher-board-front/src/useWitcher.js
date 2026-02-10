import { useContext } from "react";
import { WitcherContext } from "./witcherSessionContext";

export function useWitcher() {
  const ctx = useContext(WitcherContext);
  if (!ctx) {
    throw new Error("useWitcher must be used within WitcherProvider");
  }
  return ctx;
}
