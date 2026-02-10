import { Link } from "react-router-dom";
import { useWitcher } from "../../useWitcher";
import "./home.css";

/**
 * Home page (simple entry point).
 *
 * This project is an exam exercise: the home page is intentionally minimal,
 * and mostly acts as a quick check that React Router is correctly wired.
 */
export default function Home() {
  const { witcher } = useWitcher();

  return (
    <div className="home">
      <div className="homeHero">
        <p className="homeKicker">Contracts board</p>
        <h1 className="homeTitle">Witcher Board</h1>
        <p className="homeSubtitle">
          Browse contracts, assign one to yourself, then mark it as completed.
        </p>

        <div className="homeCtaRow">
          <Link to="/contracts" className="homePrimaryCta">
            View contracts
          </Link>
          <Link to="/login" className="homeSecondaryCta">
            {witcher ? "Switch witcher" : "Sign in"}
          </Link>
        </div>

        <div className="homeInfoGrid">
          <div className="homeInfoCard">
            <h2>Filter</h2>
            <p>Search by title and status (Available, Assigned, Completed).</p>
          </div>
          <div className="homeInfoCard">
            <h2>Act</h2>
            <p>Sign in to assign yourself an available contract and complete it.</p>
          </div>
          <div className="homeInfoCard">
            <h2>Manage</h2>
            <p>Create a new contract or edit an existing one.</p>
          </div>
        </div>

        <div className="homeSession">
          {witcher ? (
            <p>
              Signed in as <strong>{witcher.name}</strong>.
            </p>
          ) : (
            <p>
              You are not signed in. Choose a witcher on the sign-in page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
