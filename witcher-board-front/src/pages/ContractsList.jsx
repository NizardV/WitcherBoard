import { useEffect, useState } from "react"
import "./contracts.css"

export default function ContractsList() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch("http://localhost:3000/api/contracts/")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        setContracts(data)
      } catch (e) {
        setError(e?.message ?? "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="page">
      <h1>Contrats</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="error">Erreur : {error}</p>}

      <div className="grid">
        {contracts.map((c) => (
          <article key={c.id} className={`card status-${c.status}`}>
            <header className="cardHeader">
              <h2 className="title">{c.title}</h2>
              <span className="badge">{c.status}</span>
            </header>

            <p className="desc">{c.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}