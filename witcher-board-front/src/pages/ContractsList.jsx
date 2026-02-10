import { useEffect, useMemo, useState } from "react";
import "./contracts.css";

const API_BASE = "http://localhost:3000/api";

export default function ContractsList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const url = useMemo(() => {
    const u = new URL(`${API_BASE}/contracts/`);

    if (titleFilter.trim()) u.searchParams.set("title", titleFilter.trim());
    if (statusFilter) u.searchParams.set("status", statusFilter);

    return u.toString();
  }, [titleFilter, statusFilter]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setContracts(data);
      } catch (e) {
        setError(e?.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  return (
    <div className="page">
      <div className="container">
        <h1>Contrats</h1>

        {/* Zone de filtre */}
        <div className="filters">
          <div className="field">
            <label htmlFor="filter-title">Titre</label>
            <input
              id="filter-title"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Ex: Griffin..."
            />
          </div>

          <div className="field">
            <label htmlFor="filter-status">Statut</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">Erreur : {error}</p>}

        <div className="grid">
          {contracts.map((c) => (
            <article key={c.id} className={`card status-${c.status}`}>
              <header className="cardHeader">
                <h2 className="title">{c.title}</h2>
                <span className="badge">{c.status}</span>
              </header>
              <p className="desc">{c.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
