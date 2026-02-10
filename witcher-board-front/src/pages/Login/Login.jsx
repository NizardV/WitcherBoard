import { useNavigate } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import LoginView from "./LoginView";
import { useLogin } from "./useLogin";

/**
 * Login page (simplified authentication).
 *
 * Requirements covered:
 * - Fetch witchers from the backend.
 * - Let the user select one and store the identity.
 * - Persist identity in `sessionStorage` via WitcherProvider.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login, witcher } = useWitcher();

  const vm = useLogin({
    login,
    onLoggedIn: () => navigate("/contracts"),
  });

  return <LoginView witcher={witcher} {...vm} onSubmit={vm.submit} />;
}
