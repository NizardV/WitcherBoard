import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./contracts.css";
import { API_BASE } from "../../api/config";
import { fetchJson, fetchJsonOrNullOnAbort } from "../../api/http";

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

  // Witchers lookup (used to show avatar/name for assigned contracts)
  // const [witchersById, setWitchersById] = useState(() => new Map());

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
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWitchers() {
      try {
        const data = await fetchJsonOrNullOnAbort(`${API_BASE}/witchers/`, {
          signal: controller.signal,
        });
        if (data == null) return;

        const next = new Map();
        if (Array.isArray(data)) {
          for (const w of data) {
            if (w && typeof w.id === "number") next.set(w.id, w);
          }
        }
        setWitchersById(next);
      } catch {
        // Non-blocking: contracts list still works without avatars
      }
    }

    loadWitchers();
    return () => controller.abort();
  }, []);

  return (
    <div className="page contractsList">
      <div className="container">
        <div className="pageHeader">
          <h1 className="h1">Contracts</h1>
          <Link to="/contracts/new" className="primaryLink">
            + Create contract
          </Link>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="field">
            <label htmlFor="filter-title">Title</label>
            <input
              id="filter-title"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="e.g. Griffin..."
            />
          </div>

          <div className="field">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        <div className="grid">
          {contracts.map((c) => (
            <Link key={c.id} to={`/contracts/${c.id}`} className="cardLink">
              <article className={`card status-${c.status}`}>
                <header className="cardHeader">
                  <h2 className="title">{c.title}</h2>
                  <span className="badge">{c.status}</span>
                </header>
                <p className="desc">{c.description}</p>

                {/* {c.assignedTo != null && witchersById.has(c.assignedTo) && (
                  <div className="assignedRow">
                    {witchersById.get(c.assignedTo)?.avatar ? (
                      <img
                        className="avatar"
                        src={witchersById.get(c.assignedTo).avatar}
                        alt={witchersById.get(c.assignedTo).name}
                      />
                    ) : null}
                    <span className="assignedName">
                      Assigned to: {witchersById.get(c.assignedTo).name}
                    </span>
                  </div>
                )} */}
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
