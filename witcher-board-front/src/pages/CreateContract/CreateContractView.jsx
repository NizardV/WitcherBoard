import { Link } from "react-router-dom";
import "./createContract.css";

/**
 * Presentational component for Create contract.
 */
export default function CreateContractView({
  title,
  setTitle,
  description,
  setDescription,
  reward,
  setReward,
  submitting,
  error,
  isInvalid,
  onSubmit,
}) {
  return (
    <div className="page createContract">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Back
        </Link>

        <div className="panel">
          <header className="head">
            <h1 className="h1">Create contract</h1>
          </header>

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
                placeholder="e.g. Griffin contract"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the beast and the area..."
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
                placeholder='e.g. "300 Crowns and a Rune Stone"'
                required
              />
            </div>

            {error && <p className="error">Error: {error}</p>}

            <button className="primary" type="submit" disabled={submitting || isInvalid}>
              {submitting ? "Submitting..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
