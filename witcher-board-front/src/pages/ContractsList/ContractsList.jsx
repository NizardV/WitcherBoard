import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./contracts.css";
import { API_BASE } from "../../api/config";
import { fetchJson } from "../../api/http";

/**
 * Contracts list page.
 *
 * Requirements covered:
 * - Display all contracts.
 * - Provide server-side filtering via query params (`title`, `status`).
 * - Navigation to contract details.
 */
export default function ContractsList() {
  const [contracts, setContracts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /**
   * Build the request URL.
   *
   * We compute it with `useMemo` so that the effect below can depend on it.
   * This keeps the load effect predictable and avoids accidental infinite loops.
   */
  const url = useMemo(() => {
    const u = new URL(`${API_BASE}/contracts/`);

    // Filters are applied server-side: this matches the exam requirements.
    if (titleFilter.trim()) u.searchParams.set("title", titleFilter.trim());
    if (statusFilter) u.searchParams.set("status", statusFilter);

    return u.toString();
  }, [titleFilter, statusFilter]);

  useEffect(() => {
    // We deliberately keep this effect simple and readable.
    async function load() {
      try {
        setLoading(true);
        setError("");

        /** @type {any[]} */
        const data = await fetchJson(url);
        setContracts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  return (
    <div className="page contractsList">
      <div className="container">
        <div className="pageHeader">
          <h1>Contrats</h1>
          <Link to="/contracts/new" className="primaryLink">
            + Créer un contrat
          </Link>
        </div>

        {/* Filters */}
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
            <Link key={c.id} to={`/contracts/${c.id}`} className="cardLink">
              <article className={`card status-${c.status}`}>
                <header className="cardHeader">
                  <h2 className="title">{c.title}</h2>
                  <span className="badge">{c.status}</span>
                </header>
                <p className="desc">{c.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
