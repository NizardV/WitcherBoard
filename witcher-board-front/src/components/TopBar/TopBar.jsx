import { useLocation, useNavigate } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import TopBarView from "./TopBarView";

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
    // Clears sessionStorage + context state (so all pages update instantly).
    logout();

    // Keep the user on the same page, except if already on /login
    // (logging out while on the login page is confusing UX).
    if (location.pathname === "/login") {
      navigate("/contracts");
    }
  }

  return <TopBarView witcher={witcher} onLogout={onLogout} />;
}
