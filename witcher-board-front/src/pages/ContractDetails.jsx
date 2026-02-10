import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./contractDetails.css";
import { useWitcher } from "../useWitcher";

const API_BASE = "http://localhost:3000/api";

export default function ContractDetails() {
  const { id } = useParams();
  const { witcher: currentWitcher } = useWitcher();

  const [contract, setContract] = useState(null);
  const [witcher, setWitcher] = useState(null);

  const [loadingContract, setLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");

  const [loadingWitcher, setLoadingWitcher] = useState(false);
  const [witcherError, setWitcherError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingContract(true);
        setContractError("");
        setContract(null);

        setActionLoading(false);
        setActionError("");

        setWitcher(null);
        setLoadingWitcher(false);
        setWitcherError("");

        const res = await fetch(`${API_BASE}/contracts/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const c = await res.json();
        setContract(c);

        if (c.assignedTo != null) {
          try {
            setLoadingWitcher(true);
            setWitcherError("");

            const wRes = await fetch(`${API_BASE}/witchers/${c.assignedTo}`, {
              signal: controller.signal,
            });
            if (!wRes.ok) throw new Error(`HTTP ${wRes.status}`);
            const w = await wRes.json();
            setWitcher(w);
          } catch (e) {
            if (e?.name !== "AbortError") {
              setWitcherError(e?.message ?? "Erreur inconnue");
            }
          } finally {
            setLoadingWitcher(false);
          }
        }
      } catch (e) {
        if (e?.name !== "AbortError") {
          setContractError(e?.message ?? "Erreur inconnue");
        }
      } finally {
        setLoadingContract(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  async function refreshContract() {
    const controller = new AbortController();

    try {
      setLoadingContract(true);
      setContractError("");
      setWitcher(null);
      setWitcherError("");

      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const c = await res.json();
      setContract(c);

      if (c.assignedTo != null) {
        try {
          setLoadingWitcher(true);
          const wRes = await fetch(`${API_BASE}/witchers/${c.assignedTo}`, {
            signal: controller.signal,
          });
          if (!wRes.ok) throw new Error(`HTTP ${wRes.status}`);
          const w = await wRes.json();
          setWitcher(w);
        } catch (e) {
          setWitcherError(e?.message ?? "Erreur inconnue");
        } finally {
          setLoadingWitcher(false);
        }
      }
    } catch (e) {
      setContractError(e?.message ?? "Erreur inconnue");
    } finally {
      setLoadingContract(false);
    }

    return () => controller.abort();
  }

  async function assignToCurrentWitcher() {
    if (!contract || !currentWitcher) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch(`${API_BASE}/contracts/${id}/assignedTo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // API expects an integer in the JSON body
        body: JSON.stringify(currentWitcher.id),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      await refreshContract();
    } catch (e) {
      setActionError(e?.message ?? "Erreur inconnue");
    } finally {
      setActionLoading(false);
    }
  }

  async function completeContract() {
    if (!contract) return;

    try {
      setActionLoading(true);
      setActionError("");

      const res = await fetch(`${API_BASE}/contracts/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // API expects the JSON string "Completed"
        body: JSON.stringify("Completed"),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      await refreshContract();
    } catch (e) {
      setActionError(e?.message ?? "Erreur inconnue");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Retour
        </Link>

        {loadingContract && <p>Chargement...</p>}
        {contractError && <p className="error">Erreur : {contractError}</p>}

        {contract && (
          <div className="panel">
            <header className="head">
              <h1 className="h1">{contract.title}</h1>
              <span className={`badge status-${contract.status}`}>
                {contract.status}
              </span>
            </header>

            <div className="actions">
              <Link to={`/contracts/${id}/edit`} className="secondaryLink">
                Modifier
              </Link>

              {contract.status === "Available" && currentWitcher && (
                <button
                  type="button"
                  className="primaryBtn"
                  onClick={assignToCurrentWitcher}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Assignation..." : `Assigner à ${currentWitcher.name}`}
                </button>
              )}

              {contract.status === "Assigned" &&
                currentWitcher &&
                contract.assignedTo === currentWitcher.id && (
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={completeContract}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Finalisation..." : "Terminer"}
                  </button>
                )}
            </div>

            {actionError && <p className="error">Erreur : {actionError}</p>}

            <p className="desc">{contract.description}</p>

            <p className="line">
              <strong>Reward:</strong> {contract.reward ?? "—"}
            </p>

            <p className="line">
              <strong>Assigned to:</strong>{" "}
              {contract.assignedTo == null
                ? "—"
                : loadingWitcher
                  ? `#${contract.assignedTo} (chargement...)`
                  : witcher
                    ? `${witcher.name}`
                    : witcherError
                      ? `#${contract.assignedTo} (erreur: ${witcherError})`
                      : `#${contract.assignedTo}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
