import ContractsListView from "./ContractsListView";
import { useContractsList } from "./useContractsList";

/**
 * Contracts list page.
 *
 * Requirements covered:
 * - Display all contracts.
 * - Provide server-side filtering via query params (`title`, `status`).
 * - Navigation to contract details.
 */
export default function ContractsList() {
  const vm = useContractsList();
  return <ContractsListView {...vm} />;
}
