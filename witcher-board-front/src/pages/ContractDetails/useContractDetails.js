/**
 * Logic/state for the Contract details page.
 *
 * Why this file exists:
 * - Keep the page component mostly “display only” (view) so it’s easy to scan.
 * - Centralize side-effects (fetching, PUT actions) in one place.
 * - Make it clear which state is UI-only (loading/errors) vs domain data (contract/witcher).
 *
 * Important backend quirks (documented in README as well):
 * - Assign endpoint expects a JSON *number* in the body (witcher id), not an object.
 * - Complete endpoint expects a JSON *string* in the body: "Completed".
 */

import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import { fetchJson, readErrorMessage } from "../../api/http";

export function useContractDetails({ id, currentWitcher }) {
  // Domain data
  const [contract, setContract] = useState(null);

  // Derived/related domain data (the witcher assigned to the contract).
  // We fetch this separately because the contract only stores assignedTo as an id.
  const [witcher, setWitcher] = useState(null);

  // Loading + error states are split by concern so the UI can show precise feedback.
  const [loadingContract, setLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");

  const [loadingWitcher, setLoadingWitcher] = useState(false);
  const [witcherError, setWitcherError] = useState("");

  // Action state covers “assign” and “complete”.
  // We keep a separate loading/error here so background data fetches don’t clobber action UX.
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    // AbortController is the standard pattern for React effects that fetch.
    // If the user navigates quickly between contracts, we cancel the in-flight request
    // so we don’t set state on an unmounted component.
    const controller = new AbortController();

    async function load() {
      try {
        // Reset state so the UI doesn’t show stale data while the next contract loads.
        setLoadingContract(true);
        setContractError("");
        setContract(null);

        setActionLoading(false);
        setActionError("");

        setWitcher(null);
        setLoadingWitcher(false);
        setWitcherError("");

        const c = await fetchJson(`${API_BASE}/contracts/${id}`, {
          signal: controller.signal,
        });
        setContract(c);

        // If the contract is assigned, fetch the witcher to display name/avatar.
        if (c.assignedTo != null) {
          try {
            setLoadingWitcher(true);
            setWitcherError("");

            const w = await fetchJson(`${API_BASE}/witchers/${c.assignedTo}`, {
              signal: controller.signal,
            });
            setWitcher(w);
          } catch (e) {
            // AbortError should be ignored (it means we navigated away).
            if (e?.name !== "AbortError") {
              setWitcherError(e?.message ?? "Unknown error");
            }
          } finally {
            setLoadingWitcher(false);
          }
        }
      } catch (e) {
        // Same reasoning: ignore AbortError, report other errors.
        if (e?.name !== "AbortError") {
          setContractError(e?.message ?? "Unknown error");
        }
      } finally {
        setLoadingContract(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  /**
   * Re-fetch contract + assigned witcher.
   *
   * Why not just update local state after actions?
   * - The backend is the source of truth.
   * - It keeps the UI consistent even if the backend mutates additional fields.
   * - It avoids subtle bugs where we “guess” the new state.
   */
  async function refreshContract() {
    try {
      setLoadingContract(true);
      setContractError("");
      setWitcher(null);
      setWitcherError("");

      const c = await fetchJson(`${API_BASE}/contracts/${id}`);
      setContract(c);

      if (c.assignedTo != null) {
        try {
          setLoadingWitcher(true);
          const w = await fetchJson(`${API_BASE}/witchers/${c.assignedTo}`);
          setWitcher(w);
        } catch (e) {
          setWitcherError(e?.message ?? "Unknown error");
        } finally {
          setLoadingWitcher(false);
        }
      }
    } catch (e) {
      setContractError(e?.message ?? "Unknown error");
    } finally {
      setLoadingContract(false);
    }
  }

  /**
   * Assign the contract to the currently signed-in witcher.
   *
   * API quirk: body is a JSON number (witcher id), not `{ assignedTo: id }`.
   */
  async function assignToCurrentWitcher() {
    if (!contract || !currentWitcher) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch(`${API_BASE}/contracts/${id}/assignedTo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentWitcher.id),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      await refreshContract();
    } catch (e) {
      setActionError(e?.message ?? "Unknown error");
    } finally {
      setActionLoading(false);
    }
  }

  /**
   * Mark contract as completed.
   *
   * API quirk: body is a JSON string "Completed".
   */
  async function completeContract() {
    if (!contract) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch(`${API_BASE}/contracts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("Completed"),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      await refreshContract();
    } catch (e) {
      setActionError(e?.message ?? "Unknown error");
    } finally {
      setActionLoading(false);
    }
  }

  return {
    contract,
    witcher,
    loadingContract,
    contractError,
    loadingWitcher,
    witcherError,
    actionLoading,
    actionError,
    assignToCurrentWitcher,
    completeContract,
  };
}
