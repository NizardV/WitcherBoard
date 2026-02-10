import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import ContractsList from "./pages/ContractsList/ContractsList";
import ContractDetails from "./pages/ContractDetails/ContractDetails";
import CreateContract from "./pages/CreateContract/CreateContract";
import EditContract from "./pages/EditContract/EditContract";
import TopBar from "./components/TopBar/TopBar";
import Login from "./pages/Login/Login";

/**
 * Main application component.
 *
 * Contains:
 * - Global TopBar (visible on all pages)
 * - All React Router routes for the exam steps
 */
export default function App() {
  return (
    <>
      <TopBar />
      <Routes>
        {/* Home / router check */}
        <Route path="/" element={<Home />} />

        {/* Witcher login (simplified auth) */}
        <Route path="/login" element={<Login />} />

        {/* Contracts */}
        <Route path="/contracts" element={<ContractsList />} />
        <Route path="/contracts/new" element={<CreateContract />} />
        <Route path="/contracts/:id/edit" element={<EditContract />} />
        <Route path="/contracts/:id" element={<ContractDetails />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
