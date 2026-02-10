import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./editContract.css";
import { API_BASE } from "../../api/config";
import { fetchJson, readErrorMessage } from "../../api/http";

/**
 * Edit contract page.
 *
 * Requirements covered:
 * - Route `/contracts/:id/edit`.
 * - Pre-fill the form using `GET /contracts/:id`.
 * - Update using `PUT /contracts/:id`.
 *
 * Design choice:
 * - `status` and `assignedTo` are displayed read-only here.
 * - We still send them back unchanged to avoid losing fields on update.
 */
export default function EditContract() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);

  // Assigned witcher (read-only meta info)
  const [assignedWitcher, setAssignedWitcher] = useState(null);
  const [loadingAssignedWitcher, setLoadingAssignedWitcher] = useState(false);
  const [assignedWitcherError, setAssignedWitcherError] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  // UI state
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

        setAssignedWitcher(null);
        setLoadingAssignedWitcher(false);
        setAssignedWitcherError("");

        // AbortController prevents stale state updates when navigating quickly
        const c = await fetchJson(`${API_BASE}/contracts/${id}`, {
          signal: controller.signal,
        });

        setContract(c);
        setTitle(c.title ?? "");
        setDescription(c.description ?? "");
        setReward(c.reward ?? "");

        // If the contract is assigned, fetch the witcher to display their name.
        if (c.assignedTo != null) {
          try {
            setLoadingAssignedWitcher(true);
            setAssignedWitcherError("");

            const w = await fetchJson(`${API_BASE}/witchers/${c.assignedTo}`, {
              signal: controller.signal,
            });
            setAssignedWitcher(w);
          } catch (e) {
            if (e?.name !== "AbortError") {
              setAssignedWitcherError(e?.message ?? "Erreur inconnue");
            }
          } finally {
            setLoadingAssignedWitcher(false);
          }
        }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      // Back to details after successful update
      navigate(`/contracts/${id}`);
    } catch (e2) {
      setError(e2?.message ?? "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = !title.trim() || !description.trim() || !reward.trim();

  return (
    <div className="page editContract">
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
            </header>

            <div className="meta">
              <div className="metaItem">
                <span className="metaLabel">Statut</span>
                <span className={`badge status-${contract.status}`}>{contract.status}</span>
              </div>
              <div className="metaItem">
                <span className="metaLabel">Assigned to</span>
                <span className="metaValue">
                  {contract.assignedTo == null
                    ? "—"
                    : loadingAssignedWitcher
                      ? "Chargement..."
                      : assignedWitcher
                        ? (
                            <span className="assignedTo">
                              {assignedWitcher.avatar ? (
                                <img
                                  className="avatar"
                                  src={assignedWitcher.avatar}
                                  alt={assignedWitcher.name}
                                />
                              ) : null}
                              {assignedWitcher.name}
                            </span>
                          )
                        : assignedWitcherError
                          ? `#${contract.assignedTo} (erreur: ${assignedWitcherError})`
                          : `#${contract.assignedTo}`}
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
