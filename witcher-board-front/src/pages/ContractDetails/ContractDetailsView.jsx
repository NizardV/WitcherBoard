import { Link } from "react-router-dom";
import "./contractDetails.css";

/**
 * Presentational component for Contract details.
 *
 * This component is intentionally "dumb":
 * - It receives data + callbacks as props.
 * - It does not fetch or mutate data.
 *
 * Why:
 * - Easier to read and test.
 * - The logic hook (`useContractDetails`) becomes the single place for API calls.
 *
 * Props quick map:
 * - `contract` is the main entity.
 * - `witcher` is the assigned witcher object (fetched separately when assigned).
 * - `currentWitcher` is the signed-in user (from session context).
 * - `assignToCurrentWitcher` / `completeContract` are action callbacks.
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
              {/* Edit is always visible; mutation actions depend on status + login */}
              <Link to={`/contracts/${id}/edit`} className="secondaryLink">
                Edit
              </Link>

              {/* Only an available contract can be assigned, and only if someone is logged in */}
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

              {/* Completion is only allowed when:
                  - contract is Assigned
                  - user is logged in
                  - and the logged-in witcher is the one assigned
               */}
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
              {/* We render different fallbacks depending on what we have:
                  - null => not assigned
                  - loadingWitcher => show id while loading
                  - witcher => show name/avatar
                  - error => show id + error
                  - else => show raw id
               */}
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
