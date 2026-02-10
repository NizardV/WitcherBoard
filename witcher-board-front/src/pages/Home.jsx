import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Witcher Board</h1>
      <p>Page de test - Router OK</p>

      <Link to="/contracts">Go to Contracts List</Link>
    </div>
  );
}
