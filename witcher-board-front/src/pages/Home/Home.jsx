import { Link } from "react-router-dom";
import "./home.css";

/**
 * Home page (simple entry point).
 *
 * This project is an exam exercise: the home page is intentionally minimal,
 * and mostly acts as a quick check that React Router is correctly wired.
 */
export default function Home() {
  return (
    <div className="home">
      <h1>Witcher Board</h1>
      <p>Page de test - Router OK</p>
      <Link to="/contracts">Go to Contracts List</Link>
    </div>
  );
}
