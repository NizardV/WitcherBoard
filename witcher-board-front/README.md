# Witcher Board (Front)

Application React (Vite) de gestion de contrats de chasse.

## Fonctionnalités

- Liste des contrats avec filtres (titre + statut) via query params côté serveur.
- Détail d’un contrat, avec chargement du sorceleur assigné (si `assignedTo`).
- Création d’un contrat.
- Modification d’un contrat.
- Connexion “simplifiée” en tant que sorceleur (stockée en `sessionStorage`).
- Actions depuis le détail : s’assigner un contrat (si disponible) et terminer le contrat (si assigné au sorceleur connecté).

## Routes

- `/` : accueil
- `/contracts` : liste
- `/contracts/new` : création
- `/contracts/:id` : détail
- `/contracts/:id/edit` : édition
- `/login` : connexion sorceleur

## API

Base URL : `http://localhost:3000/api`

Endpoints utilisés :

- `GET /contracts/` (avec `title` et `status` en query params)
- `GET /contracts/:id`
- `POST /contracts/`
- `PUT /contracts/:id`
- `PUT /contracts/:id/assignedTo` (body JSON = un **integer** brut)
- `PUT /contracts/:id/status` (body JSON = la **string** `"Completed"`)
- `GET /witchers/`
- `GET /witchers/:id`

Notes importantes (types attendus par le backend) :

- `reward` est envoyé en **string** lors de la création/édition.
- `assignedTo` n’attend pas `{ "assignedTo": 1 }` mais `1`.
- `status` n’attend pas `{ "status": "Completed" }` mais `"Completed"`.

## Lancer le projet

1) Démarrer le backend sur `http://localhost:3000`
2) Installer et lancer le front :

```bash
npm install
npm run dev
```

Qualité :

```bash
npm run lint
npm run build
```
