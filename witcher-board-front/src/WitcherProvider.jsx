import { useMemo, useState } from "react";
import { STORAGE_KEY, WitcherContext } from "./witcherSessionContext";

function loadInitialWitcher() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "number" && typeof parsed.name === "string") {
      return parsed;
    }
  } catch {
    // ignore invalid storage
  }
  return null;
}

export default function WitcherProvider({ children }) {
  const [witcher, setWitcher] = useState(loadInitialWitcher);

  const value = useMemo(() => {
    function login(nextWitcher) {
      const normalized = {
        id: Number(nextWitcher.id),
        name: String(nextWitcher.name),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      setWitcher(normalized);
    }

    function logout() {
      sessionStorage.removeItem(STORAGE_KEY);
      setWitcher(null);
    }

    return { witcher, login, logout };
  }, [witcher]);

  return <WitcherContext.Provider value={value}>{children}</WitcherContext.Provider>;
}
