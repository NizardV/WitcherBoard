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
        <p className="homeKicker">Tableau de contrats</p>
        <h1 className="homeTitle">Witcher Board</h1>
        <p className="homeSubtitle">
          Consultez les contrats, attribuez-vous une mission, puis marquez-la comme terminée.
        </p>

        <div className="homeCtaRow">
          <Link to="/contracts" className="homePrimaryCta">
            Voir les contrats
          </Link>
          <Link to="/login" className="homeSecondaryCta">
            {witcher ? "Changer de sorceleur" : "Se connecter"}
          </Link>
        </div>

        <div className="homeInfoGrid">
          <div className="homeInfoCard">
            <h2>Filtrer</h2>
            <p>Recherchez par titre et par statut (Available, Assigned, Completed).</p>
          </div>
          <div className="homeInfoCard">
            <h2>Agir</h2>
            <p>Connectez-vous pour vous assigner un contrat disponible et le finaliser.</p>
          </div>
          <div className="homeInfoCard">
            <h2>Gérer</h2>
            <p>Créez un nouveau contrat ou modifiez un contrat existant.</p>
          </div>
        </div>

        <div className="homeSession">
          {witcher ? (
            <p>
              Connecté en tant que <strong>{witcher.name}</strong>.
            </p>
          ) : (
            <p>
              Vous n’êtes pas connecté. Choisissez un sorceleur dans la page de connexion.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
