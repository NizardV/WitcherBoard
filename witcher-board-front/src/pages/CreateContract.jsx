import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./createContract.css";

const API_BASE = "http://localhost:3000/api";

export default function CreateContract() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        reward: reward === "" ? null : Number(reward),
      };

      const res = await fetch(`${API_BASE}/contracts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      // Contract created successfully, go back to the list
      navigate("/contracts");
    } catch (e2) {
      setError(e2?.message ?? "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = !title.trim() || !description.trim() || reward === "";

  return (
    <div className="page">
      <div className="container">
        <Link to="/contracts" className="backLink">
          ← Retour
        </Link>

        <div className="panel">
          <header className="head">
            <h1 className="h1">Créer un contrat</h1>
            <p className="subtitle">Champs autorisés : titre, description, récompense.</p>
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
                type="number"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="Ex: 250"
                min={0}
                step={1}
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
