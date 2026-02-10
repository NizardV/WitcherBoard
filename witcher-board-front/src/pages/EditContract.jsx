import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./editContract.css";

const API_BASE = "http://localhost:3000/api";

export default function EditContract() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        setContract(null);

        const res = await fetch(`${API_BASE}/contracts/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const c = await res.json();

        setContract(c);
        setTitle(c.title ?? "");
        setDescription(c.description ?? "");
        setReward(c.reward ?? "");
      } catch (e) {
        if (e?.name !== "AbortError") {
          setError(e?.message ?? "Erreur inconnue");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!contract) return;

    try {
      setSubmitting(true);
      setError("");

      // Keep status / assignedTo unchanged (not editable on this page)
      const payload = {
        title: title.trim(),
        description: description.trim(),
        reward: reward.trim(),
        status: contract.status,
        assignedTo: contract.assignedTo ?? null,
      };

      const res = await fetch(`${API_BASE}/contracts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || JSON.stringify(data) || `HTTP ${res.status}`);
        }
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      navigate(`/contracts/${id}`);
    } catch (e2) {
      setError(e2?.message ?? "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = !title.trim() || !description.trim() || !reward.trim();

  return (
    <div className="page">
      <div className="container">
        <Link to={`/contracts/${id}`} className="backLink">
          ← Retour au détail
        </Link>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">Erreur : {error}</p>}

        {contract && (
          <div className="panel">
            <header className="head">
              <h1 className="h1">Modifier le contrat</h1>
              <p className="subtitle">
                Champs modifiables : titre, description, récompense.
              </p>
            </header>

            <div className="meta">
              <div className="metaItem">
                <span className="metaLabel">Statut</span>
                <span className={`badge status-${contract.status}`}>{contract.status}</span>
              </div>
              <div className="metaItem">
                <span className="metaLabel">Assigned to</span>
                <span className="metaValue">
                  {contract.assignedTo == null ? "—" : `#${contract.assignedTo}`}
                </span>
              </div>
            </div>

            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="title">Titre</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="reward">Récompense</label>
                <input
                  id="reward"
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error">Erreur : {error}</p>}

              <button className="primary" type="submit" disabled={submitting || isInvalid}>
                {submitting ? "Envoi..." : "Enregistrer"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
