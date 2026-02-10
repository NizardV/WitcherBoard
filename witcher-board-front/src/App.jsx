import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ContractsList from "./pages/ContractsList";
import ContractDetails from "./pages/ContractDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contracts" element={<ContractsList />} />
      <Route path="/contracts/:id" element={<ContractDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
