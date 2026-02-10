import { Link } from "react-router-dom";
import "./contracts.css";

/**
 * Presentational component for the Contracts list.
 */
export default function ContractsListView({
  contracts,
  loading,
  error,
  titleFilter,
  setTitleFilter,
  statusFilter,
  setStatusFilter,
  witchersById,
}) {
  return (
    <div className="page contractsList">
      <div className="container">
        <div className="pageHeader">
          <h1 className="h1">Contracts</h1>
          <Link to="/contracts/new" className="primaryLink">
            + Create contract
          </Link>
        </div>

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
          {contracts.map((c) => {
            const assigned = c.assignedTo != null ? witchersById.get(c.assignedTo) : null;

            return (
              <Link key={c.id} to={`/contracts/${c.id}`} className="cardLink">
                <article className={`card status-${c.status}`}>
                  <header className="cardHeader">
                    <h2 className="title">{c.title}</h2>
                    <span className="badge">{c.status}</span>
                  </header>
                  <p className="desc">{c.description}</p>

                  {assigned ? (
                    <div className="assignedRow">
                      {assigned.avatar ? (
                        <img className="avatar" src={assigned.avatar} alt={assigned.name} />
                      ) : null}
                      <span className="assignedName">Assigned to: {assigned.name}</span>
                    </div>
                  ) : null}
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
