import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import "./login.css";
import { API_BASE } from "../../api/config";
import { fetchJsonOrNullOnAbort } from "../../api/http";

/**
 * Login page (simplified authentication).
 *
 * Requirements covered:
 * - Fetch witchers from the backend.
 * - Let the user select one and store the identity.
 * - Persist identity in `sessionStorage` via WitcherProvider.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login, witcher } = useWitcher();

  const [witchers, setWitchers] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Compute the selected witcher object from the selectedId.
   * Using useMemo avoids re-searching the list on every render.
   */
  const selected = useMemo(() => {
    const idNum = Number(selectedId);
    if (!Number.isFinite(idNum)) return null;
    return witchers.find((w) => w.id === idNum) ?? null;
  }, [selectedId, witchers]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJsonOrNullOnAbort(`${API_BASE}/witchers/`, {
          signal: controller.signal,
        });

        if (data == null) return; // aborted

        // Defensive: ensure we always work with an array
        setWitchers(Array.isArray(data) ? data : []);

        // Default selection so the form is usable immediately
        if (Array.isArray(data) && data.length > 0) {
          setSelectedId(String(data[0].id));
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
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    if (!selected) return;

    // Persist witcher identity (sessionStorage) via provider
    login({ id: selected.id, name: selected.name });

    // Redirect to contracts list after login
    navigate("/contracts");
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Retour
        </Link>

        <div className="panel">
          <header className="head">
            <h1 className="h1">Connexion sorceleur</h1>
          </header>

          {witcher && (
            <p className="current">
              Actuellement connecté : <strong>{witcher.name}</strong>
            </p>
          )}

          {loading && <p>Chargement...</p>}
          {error && <p className="error">Erreur : {error}</p>}

          {!loading && !error && (
            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="witcher">Sorceleur</label>
                <select
                  id="witcher"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {witchers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="primary" type="submit" disabled={!selected}>
                Se connecter
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
