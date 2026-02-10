import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./contractDetails.css";

const API_BASE = "http://localhost:3000/api";

export default function ContractDetails() {
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [witcher, setWitcher] = useState(null);

  const [loadingContract, setLoadingContract] = useState(true);
  const [contractError, setContractError] = useState("");

  const [loadingWitcher, setLoadingWitcher] = useState(false);
  const [witcherError, setWitcherError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingContract(true);
        setContractError("");
        setContract(null);

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
            </div>

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
