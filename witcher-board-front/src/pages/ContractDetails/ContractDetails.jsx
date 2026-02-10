import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./contractDetails.css";
import { useWitcher } from "../../useWitcher";
import { API_BASE } from "../../api/config";
import { fetchJson, readErrorMessage } from "../../api/http";

/**
 * Contract details page.
 *
 * Requirements covered:
 * - Route `/contracts/:id`.
 * - Load contract details from the backend.
 * - If the contract has `assignedTo`, load the witcher details.
 * - Show loading/error states.
 * - Provide navigation (back link + edit link).
 * - When a witcher is logged in: allow assigning and completing a contract.
 */
export default function ContractDetails() {
  const { id } = useParams();
  const { witcher: currentWitcher } = useWitcher();

  // Data
  const [contract, setContract] = useState(null);
  const [witcher, setWitcher] = useState(null);

  // Loading/errors for contract and witcher are separated,
  // so the UI can still show contract details even if witcher loading fails.
  const [loadingContract, setLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");

  const [loadingWitcher, setLoadingWitcher] = useState(false);
  const [witcherError, setWitcherError] = useState("");

  // Loading/error for actions (assign/complete)
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  /**
   * Loads the contract and its witcher (if assigned).
   *
   * We use AbortController to avoid setting state after unmount
   * or when the user navigates quickly between contract IDs.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        // Reset state for a clean screen when id changes
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

        // When assigned, fetch the witcher details
        if (c.assignedTo != null) {
          try {
            setLoadingWitcher(true);
            setWitcherError("");

            const w = await fetchJson(`${API_BASE}/witchers/${c.assignedTo}`, {
              signal: controller.signal,
            });
            setWitcher(w);
          } catch (e) {
            // If the witcher call fails, the contract can still be shown
            if (e?.name !== "AbortError") {
              setWitcherError(e?.message ?? "Unknown error");
            }
          } finally {
            setLoadingWitcher(false);
          }
        }
      } catch (e) {
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
   * Reloads the contract after a mutation (assign/complete).
   *
   * This keeps the UI aligned with the backend (single source of truth).
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
   * Assign the current contract to the currently logged in witcher.
   *
   * Important backend detail:
   * - The endpoint expects a JSON integer (e.g. `1`), not `{ assignedTo: 1 }`.
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
   * Mark the contract as completed.
   *
   * Important backend detail:
   * - The endpoint expects the JSON string "Completed".
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

  return (
    <div className="page contractDetails">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Back
        </Link>

        {loadingContract && <p>Loading...</p>}
        {contractError && <p className="error">Error: {contractError}</p>}

        {contract && (
          <div className="panel">
            <header className="head">
              <h1 className="h1">{contract.title}</h1>
              <span className={`badge status-${contract.status}`}>{contract.status}</span>
            </header>

            <div className="actions">
              <Link to={`/contracts/${id}/edit`} className="secondaryLink">
                Edit
              </Link>

              {/* Assign button visible only when:
                 - contract is Available
                 - a witcher is logged in */}
              {contract.status === "Available" && currentWitcher && (
                <button
                  type="button"
                  className="primaryBtn"
                  onClick={assignToCurrentWitcher}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Assigning..." : `Assign to ${currentWitcher.name}`}
                </button>
              )}

              {/* Complete button visible only when:
                 - contract is Assigned
                 - a witcher is logged in
                 - contract is assigned to THIS witcher */}
              {contract.status === "Assigned" &&
                currentWitcher &&
                contract.assignedTo === currentWitcher.id && (
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={completeContract}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Completing..." : "Complete"}
                  </button>
                )}
            </div>

            {actionError && <p className="error">Error: {actionError}</p>}

            <p className="desc">{contract.description}</p>

            <p className="line">
              <strong>Reward:</strong> {contract.reward ?? "—"}
            </p>

            <p className="line">
              <strong>Assigned to:</strong>{" "}
              {contract.assignedTo == null ? (
                "—"
              ) : loadingWitcher ? (
                `#${contract.assignedTo} (chargement...)`
              ) : witcher ? (
                <span className="assignedTo">
                  {witcher.avatar ? (
                    <img className="avatar" src={witcher.avatar} alt={witcher.name} />
                  ) : null}
                  {witcher.name}
                </span>
              ) : witcherError ? (
                `#${contract.assignedTo} (error: ${witcherError})`
              ) : (
                `#${contract.assignedTo}`
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
