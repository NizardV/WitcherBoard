import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import "./topBar.css";

/**
 * Global top navigation bar.
 *
 * Requirements covered:
 * - Display the current witcher on every page.
 * - Offer "login" / "logout" actions.
 * - The identity is stored via `sessionStorage` through WitcherProvider.
 */
export default function TopBar() {
  const { witcher, logout } = useWitcher();
  const navigate = useNavigate();
  const location = useLocation();

  function onLogout() {
    // Clears sessionStorage + context state
    logout();

    // Keep the user on the same page, except if already on /login
    // (logging out while on the login page is confusing UX).
    if (location.pathname === "/login") {
      navigate("/contracts");
    }
  }

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
                Connecté : {witcher.name}
              </span>
              <button type="button" className="linkBtn" onClick={onLogout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <span className="who">Non connecté</span>
              <Link to="/login" className="linkBtn">
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
