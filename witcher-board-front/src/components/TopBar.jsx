import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWitcher } from "../useWitcher";
import "./topBar.css";

export default function TopBar() {
  const { witcher, logout } = useWitcher();
  const navigate = useNavigate();
  const location = useLocation();

  function onLogout() {
    logout();
    // Stay on the same page, except if already on /login
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
              <span className="who">Connecté : {witcher.name}</span>
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
