import { Link } from "react-router-dom";
import "./topBar.css";

/**
 * Presentational component for the global top bar.
 *
 * Why split from the container?
 * - The container (`TopBar.jsx`) owns router concerns (navigate + location).
 * - This view only renders based on props.
 *
 * Props:
 * - `witcher`: current session identity or null
 * - `onLogout`: callback triggered by the Sign out button
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
