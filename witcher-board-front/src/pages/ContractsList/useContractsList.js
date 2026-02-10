/**
 * Logic/state for the Contracts list page.
 *
 * Split from the view to keep the page easy to read.
 *
 * Key idea:
 * - The view only renders what it receives.
 * - This hook owns the data-fetching, filters, and any derived values.
 */

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../api/config";
import { fetchJson, fetchJsonOrNullOnAbort } from "../../api/http";

export function useContractsList() {
  // Domain data: list of contracts returned by the backend.
  const [contracts, setContracts] = useState([]);

  // Lookup table for witchers (id -> witcher).
  // Why a Map?
  // - O(1) access when rendering each contract card.
  // - Keeps the view simple: it can do `witchersById.get(contract.assignedTo)`.
  const [witchersById, setWitchersById] = useState(() => new Map());

  // UI state for the contracts fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter UI state. These values are used to build the request URL.
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Build the contracts URL from filter state.
  // useMemo ensures a stable string value unless filters change,
  // which makes the data-fetch effect below easy to reason about.
  const url = useMemo(() => {
    const u = new URL(`${API_BASE}/contracts/`);
    if (titleFilter.trim()) u.searchParams.set("title", titleFilter.trim());
    if (statusFilter) u.searchParams.set("status", statusFilter);
    return u.toString();
  }, [titleFilter, statusFilter]);

  useEffect(() => {
    // Fetch contracts every time the computed URL changes (i.e., filters change).
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJson(url);
        // Defensive: backend should return an array, but we guard to keep UI stable.
        setContracts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  useEffect(() => {
    // We load the witchers once so we can display assigned witcher names/avatars.
    // This is intentionally *non-blocking*: if it fails, the contracts list
    // still works, we just won’t have avatar/name enrichment.
    const controller = new AbortController();

    async function loadWitchers() {
      try {
        const data = await fetchJsonOrNullOnAbort(`${API_BASE}/witchers/`, {
          signal: controller.signal,
        });
        if (data == null) return;

        // Normalize into a Map for fast lookup in the view.
        const next = new Map();
        if (Array.isArray(data)) {
          for (const w of data) {
            // Defensive checks: we only store entries we can reliably index by id.
            if (w && typeof w.id === "number") next.set(w.id, w);
          }
        }
        setWitchersById(next);
      } catch {
        // Non-blocking: contracts list still works without avatars
      }
    }

    loadWitchers();
    return () => controller.abort();
  }, []);

  return {
    contracts,
    loading,
    error,
    titleFilter,
    setTitleFilter,
    statusFilter,
    setStatusFilter,
    witchersById,
  };
}
