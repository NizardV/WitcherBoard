import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWitcher } from "../useWitcher";
import "./login.css";

const API_BASE = "http://localhost:3000/api";

export default function Login() {
  const navigate = useNavigate();
  const { login, witcher } = useWitcher();

  const [witchers, setWitchers] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const res = await fetch(`${API_BASE}/witchers/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWitchers(Array.isArray(data) ? data : []);

        // default selection
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

    login({ id: selected.id, name: selected.name });
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
            <p className="subtitle">
              Ceci n’est pas une vraie authentification : sélectionnez un sorceleur.
            </p>
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
