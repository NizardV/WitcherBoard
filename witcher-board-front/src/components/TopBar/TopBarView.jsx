import { Link } from "react-router-dom";
import "./topBar.css";

/**
 * Presentational component for the global top bar.
 */
export default function TopBarView({ witcher, onLogout }) {
  return (
    <header className="topBar">
      <div className="topBarInner">
        <Link to="/contracts" className="brand">
          Witcher Board
        </Link>

        <div className="right">
          {witcher ? (
            <>
              <span className="who">
                {witcher.avatar ? (
                  <img className="avatar" src={witcher.avatar} alt={witcher.name} />
                ) : null}
                Signed in: {witcher.name}
              </span>
              <button type="button" className="linkBtn" onClick={onLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="who">Signed out</span>
              <Link to="/login" className="linkBtn">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
