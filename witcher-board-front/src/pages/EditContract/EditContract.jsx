import { useNavigate, useParams } from "react-router-dom";
import EditContractView from "./EditContractView";
import { useEditContract } from "./useEditContract";

/**
 * Edit contract page.
 *
 * Requirements covered:
 * - Route `/contracts/:id/edit`.
 * - Pre-fill the form using `GET /contracts/:id`.
 * - Update using `PUT /contracts/:id`.
 *
 * Design choice:
 * - `status` and `assignedTo` are displayed read-only here.
 * - We still send them back unchanged to avoid losing fields on update.
 */
export default function EditContract() {
  const { id } = useParams();
  const navigate = useNavigate();

  const vm = useEditContract({
    id,
    onSaved: () => navigate(`/contracts/${id}`),
  });

  return <EditContractView id={id} {...vm} onSubmit={vm.submit} />;
}
