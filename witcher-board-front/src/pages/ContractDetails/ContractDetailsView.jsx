import { Link } from "react-router-dom";
import "./contractDetails.css";

/**
 * Presentational component for Contract details.
 */
export default function ContractDetailsView({
  id,
  currentWitcher,
  contract,
  witcher,
  loadingContract,
  contractError,
  loadingWitcher,
  witcherError,
  actionLoading,
  actionError,
  assignToCurrentWitcher,
  completeContract,
}) {
  return (
    <div className="page contractDetails">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Back
        </Link>

        {loadingContract && <p>Loading...</p>}
        {contractError && <p className="error">Error: {contractError}</p>}

        {contract && (
          <div className="panel">
            <header className="head">
              <h1 className="h1">{contract.title}</h1>
              <span className={`badge status-${contract.status}`}>{contract.status}</span>
            </header>

            <div className="actions">
              <Link to={`/contracts/${id}/edit`} className="secondaryLink">
                Edit
              </Link>

              {contract.status === "Available" && currentWitcher && (
                <button
                  type="button"
                  className="primaryBtn"
                  onClick={assignToCurrentWitcher}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Assigning..." : `Assign to ${currentWitcher.name}`}
                </button>
              )}

              {contract.status === "Assigned" &&
                currentWitcher &&
                contract.assignedTo === currentWitcher.id && (
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={completeContract}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Completing..." : "Complete"}
                  </button>
                )}
            </div>

            {actionError && <p className="error">Error: {actionError}</p>}

            <p className="desc">{contract.description}</p>

            <p className="line">
              <strong>Reward:</strong> {contract.reward ?? "—"}
            </p>

            <p className="line">
              <strong>Assigned to:</strong>{" "}
              {contract.assignedTo == null ? (
                "—"
              ) : loadingWitcher ? (
                `#${contract.assignedTo} (loading...)`
              ) : witcher ? (
                <span className="assignedTo">
                  {witcher.avatar ? (
                    <img className="avatar" src={witcher.avatar} alt={witcher.name} />
                  ) : null}
                  {witcher.name}
                </span>
              ) : witcherError ? (
                `#${contract.assignedTo} (error: ${witcherError})`
              ) : (
                `#${contract.assignedTo}`
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
