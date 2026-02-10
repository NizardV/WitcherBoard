/**
 * Logic/state for Login.
 *
 * This app uses a simplified login:
 * - Fetch witchers from the backend
 * - User picks one
 * - Store identity in sessionStorage via WitcherProvider
 *
 * Technical notes:
 * - <select> values are strings, so we store `selectedId` as a string.
 * - We derive the selected object from the list via useMemo.
 * - We abort the fetch on unmount to avoid setting state after navigation.
 */

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../api/config";
import { fetchJsonOrNullOnAbort } from "../../api/http";

export function useLogin({ login, onLoggedIn }) {
  // Data source for the dropdown.
  const [witchers, setWitchers] = useState([]);

  // String because HTML select values are strings.
  const [selectedId, setSelectedId] = useState("");

  // UI state for the fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Derived state: map selectedId -> witcher object.
  const selected = useMemo(() => {
    const idNum = Number(selectedId);
    if (!Number.isFinite(idNum)) return null;
    return witchers.find((w) => w.id === idNum) ?? null;
  }, [selectedId, witchers]);

  useEffect(() => {
    // Cancel request if the component unmounts.
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJsonOrNullOnAbort(`${API_BASE}/witchers/`, {
          signal: controller.signal,
        });

        if (data == null) return;

        const list = Array.isArray(data) ? data : [];
        setWitchers(list);

        // Auto-select first witcher for convenience.
        if (list.length > 0) {
          setSelectedId(String(list[0].id));
        }
      } catch (e) {
        if (e?.name !== "AbortError") {
          setError(e?.message ?? "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  function submit() {
    // Guard: no valid selection.
    if (!selected) return;

    // Persist session in the provider (sessionStorage + context state).
    login({ id: selected.id, name: selected.name, avatar: selected.avatar });

    // Delegate navigation to the container.
    onLoggedIn?.();
  }

  return {
    witchers,
    selectedId,
    setSelectedId,
    selected,
    loading,
    error,
    submit,
  };
}
