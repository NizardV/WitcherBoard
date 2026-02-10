import { Link } from "react-router-dom";
import "./login.css";

/**
 * Presentational component for Login.
 *
 * What it renders:
 * - The current session (if already signed in)
 * - A dropdown of witchers (loaded by the hook)
 * - A visual preview of the selected witcher (avatar + name)
 *
 * What it does NOT do:
 * - Fetch witchers
 * - Persist session
 * Those are handled by the hook + provider.
 */
export default function LoginView({
  witcher,
  witchers,
  selectedId,
  setSelectedId,
  selected,
  loading,
  error,
  onSubmit,
}) {
  return (
    <div className="page loginPage">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Back
        </Link>

        <div className="panel">
          <header className="head">
            <h1 className="h1">Witcher sign-in</h1>
          </header>

          {witcher && (
            <p className="current">
              {witcher.avatar ? (
                <img className="avatar" src={witcher.avatar} alt={witcher.name} />
              ) : null}
              Signed in as <strong>{witcher.name}</strong>
            </p>
          )}

          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}

          {!loading && !error && (
            <form
              className="form"
              onSubmit={(e) => {
                // Prevent default browser form submit.
                e.preventDefault();
                onSubmit();
              }}
            >
              {selected?.avatar ? (
                <div className="selectedPreview">
                  <img className="avatarLg" src={selected.avatar} alt={selected.name} />
                  <div className="selectedName">{selected.name}</div>
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="witcher">Witcher</label>
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
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
