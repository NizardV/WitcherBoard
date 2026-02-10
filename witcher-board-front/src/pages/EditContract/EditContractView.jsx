import { Link } from "react-router-dom";
import "./editContract.css";

/**
 * Presentational component for Edit contract.
 */
export default function EditContractView({
  id,
  contract,
  assignedWitcher,
  loadingAssignedWitcher,
  assignedWitcherError,
  title,
  setTitle,
  description,
  setDescription,
  reward,
  setReward,
  loading,
  submitting,
  error,
  isInvalid,
  onSubmit,
}) {
  return (
    <div className="page editContract">
      <div className="container">
        <Link to={`/contracts/${id}`} className="backLink">
          ← Back to details
        </Link>

        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}

        {contract && (
          <div className="panel">
            <header className="head">
              <h1 className="h1">Edit contract</h1>
            </header>

            <div className="meta">
              <div className="metaItem">
                <span className="metaLabel">Status</span>
                <span className={`badge status-${contract.status}`}>{contract.status}</span>
              </div>
              <div className="metaItem">
                <span className="metaLabel">Assigned to</span>
                <span className="metaValue">
                  {contract.assignedTo == null ? (
                    "—"
                  ) : loadingAssignedWitcher ? (
                    "Loading..."
                  ) : assignedWitcher ? (
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
                  ) : assignedWitcherError ? (
                    `#${contract.assignedTo} (error: ${assignedWitcherError})`
                  ) : (
                    `#${contract.assignedTo}`
                  )}
                </span>
              </div>
            </div>

            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="field">
                <label htmlFor="title">Title</label>
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
                <label htmlFor="reward">Reward</label>
                <input
                  id="reward"
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error">Error: {error}</p>}

              <button className="primary" type="submit" disabled={submitting || isInvalid}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
