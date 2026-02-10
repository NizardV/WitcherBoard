import { useNavigate } from "react-router-dom";
import CreateContractView from "./CreateContractView";
import { useCreateContract } from "./useCreateContract";

/**
 * Create contract page.
 *
 * Requirements covered:
 * - Route `/contracts/new`.
 * - POST a new contract to the backend.
 * - Show validation + loading + error.
 *
 * Backend note:
 * - `reward` is expected as a string by the API.
 */
export default function CreateContract() {
  const navigate = useNavigate();

  const vm = useCreateContract({
    onCreated: () => navigate("/contracts"),
  });

  return <CreateContractView {...vm} onSubmit={vm.submit} />;
}
