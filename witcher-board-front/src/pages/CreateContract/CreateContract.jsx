import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./createContract.css";
import { API_BASE } from "../../api/config";
import { readErrorMessage } from "../../api/http";

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

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // Trim inputs to avoid sending accidental leading/trailing spaces
      const payload = {
        title: title.trim(),
        description: description.trim(),
        reward: reward.trim(),
      };

      const res = await fetch(`${API_BASE}/contracts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await readErrorMessage(res));
      }

      // Contract created successfully → go back to list
      navigate("/contracts");
    } catch (e2) {
      setError(e2?.message ?? "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  // Basic front-side validation (backend still validates too)
  const isInvalid = !title.trim() || !description.trim() || !reward.trim();

  return (
    <div className="page">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Retour
        </Link>

        <div className="panel">
          <header className="head">
            <h1 className="h1">Créer un contrat</h1>
          </header>

          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Contrat de griffon"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez la bête et la zone..."
                rows={5}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reward">Récompense</label>
              <input
                id="reward"
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder='Ex: "300 Crowns and a Rune Stone"'
                required
              />
            </div>

            {error && <p className="error">Erreur : {error}</p>}

            <button className="primary" type="submit" disabled={submitting || isInvalid}>
              {submitting ? "Envoi..." : "Créer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
