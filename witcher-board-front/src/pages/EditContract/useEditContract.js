/**
 * Logic/state for Edit contract.
 *
 * This hook:
 * - Fetches the contract by id.
 * - Seeds the controlled form fields from the fetched contract.
 * - Saves changes with a PUT.
 *
 * Important design decision:
 * - Only title/description/reward are editable.
 * - status/assignedTo are preserved from the loaded contract so saving doesn’t
 *   accidentally reset them.
 */

import { useEffect, useState } from "react";
import { API_BASE } from "../../api/config";
import { fetchJson, readErrorMessage } from "../../api/http";

export function useEditContract({ id, onSaved }) {
  // Full contract object from the backend.
  // Needed so we can preserve non-editable fields during PUT.
  const [contract, setContract] = useState(null);

  // Optional enrichment: fetch assigned witcher for name/avatar display.
  const [assignedWitcher, setAssignedWitcher] = useState(null);
  const [loadingAssignedWitcher, setLoadingAssignedWitcher] = useState(false);
  const [assignedWitcherError, setAssignedWitcherError] = useState("");

  // Controlled form fields.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  // loading: initial fetch, submitting: save request.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // AbortController prevents state updates after unmount or id change.
    const controller = new AbortController();

    async function load() {
      try {
        // Reset state so UI does not show stale data.
        setLoading(true);
        setError("");
        setContract(null);

        setAssignedWitcher(null);
        setLoadingAssignedWitcher(false);
        setAssignedWitcherError("");

        const c = await fetchJson(`${API_BASE}/contracts/${id}`, {
          signal: controller.signal,
        });

        setContract(c);

        // Seed the form from the contract.
        setTitle(c.title ?? "");
        setDescription(c.description ?? "");
        setReward(c.reward ?? "");

        // Fetch assigned witcher details (optional, UI-only enrichment).
        if (c.assignedTo != null) {
          try {
            setLoadingAssignedWitcher(true);
            setAssignedWitcherError("");

            const w = await fetchJson(`${API_BASE}/witchers/${c.assignedTo}`, {
              signal: controller.signal,
            });
            setAssignedWitcher(w);
          } catch (e) {
            // Ignore abort errors when navigating quickly.
            if (e?.name !== "AbortError") {
              setAssignedWitcherError(e?.message ?? "Unknown error");
            }
          } finally {
            setLoadingAssignedWitcher(false);
          }
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
  }, [id]);

  const isInvalid = !title.trim() || !description.trim() || !reward.trim();

  async function submit() {
    // Guard: can’t submit until the contract is loaded.
    if (!contract) return;

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        // Editable fields
        title: title.trim(),
        description: description.trim(),
        reward: reward.trim(),

        // Preserved fields
        status: contract.status,
        assignedTo: contract.assignedTo ?? null,
      };

      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      // Delegate navigation to the container.
      onSaved?.();
    } catch (e) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    contract,
    assignedWitcher,
    loadingAssignedWitcher,
    assignedWitcherError,
    title,
    setTitle,
    description,
    setDescription,
    reward,
    setReward,
    loading,
    submitting,
    error,
    isInvalid,
    submit,
  };
}
