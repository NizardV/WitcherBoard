/**
 * Logic/state for Create contract.
 *
 * Why split logic into a hook?
 * - The page component stays small and mostly focuses on layout.
 * - This hook owns form state and the POST request.
 * - The container decides what to do after success (navigate, toast, etc.).
 *
 * Backend note:
 * - `reward` is expected to be a string by the API (even if it looks numeric).
 */

import { useState } from "react";
import { API_BASE } from "../../api/config";
import { readErrorMessage } from "../../api/http";

export function useCreateContract({ onCreated }) {
  // Controlled inputs for the form.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  // UI state for the network request.
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Very small client-side validation.
  // We trim so the user can’t submit whitespace-only values.
  const isInvalid = !title.trim() || !description.trim() || !reward.trim();

  async function submit() {
    try {
      setSubmitting(true);
      setError("");

      // Always send a clean payload to the API.
      const payload = {
        title: title.trim(),
        description: description.trim(),
        reward: reward.trim(),
      };

      const res = await fetch(`${API_BASE}/contracts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Convert backend error responses into a readable message.
        throw new Error(await readErrorMessage(res));
      }

      // Delegate “what happens next” to the container.
      onCreated?.();
    } catch (e) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    reward,
    setReward,
    submitting,
    error,
    isInvalid,
    submit,
  };
}
