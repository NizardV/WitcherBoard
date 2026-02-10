import { useParams } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import ContractDetailsView from "./ContractDetailsView";
import { useContractDetails } from "./useContractDetails";

/**
 * Contract details page.
 *
 * Requirements covered:
 * - Route `/contracts/:id`.
 * - Load contract details from the backend.
 * - If the contract has `assignedTo`, load the witcher details.
 * - Show loading/error states.
 * - Provide navigation (back link + edit link).
 * - When a witcher is logged in: allow assigning and completing a contract.
 */
export default function ContractDetails() {
  const { id } = useParams();
  const { witcher: currentWitcher } = useWitcher();

  const vm = useContractDetails({ id, currentWitcher });

  return <ContractDetailsView id={id} currentWitcher={currentWitcher} {...vm} />;
}
