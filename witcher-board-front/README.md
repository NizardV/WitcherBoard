# Witcher Board (Front)

React (Vite) frontend for a small “contracts board” exam-style project.

## Features

- Contracts list with server-side filters (title + status via query params).
- Contract details page.
- Create a contract.
- Edit a contract.
- Simplified “witcher sign-in” stored in `sessionStorage`.
- Actions from details page:
	- assign an available contract to the current witcher
	- mark a contract as completed (only when it is assigned to the current witcher)
- Witcher avatars:
	- displayed in the TopBar
	- displayed for assigned contracts (when the backend provides `avatar` URLs)

## Routes

- `/` home
- `/contracts` list
- `/contracts/new` create
- `/contracts/:id` details
- `/contracts/:id/edit` edit
- `/login` witcher sign-in

## Architecture (how to read the code)

This codebase follows a simple “container/hook + view” split:

- **Logic** (state + effects + API calls) lives in small hooks:
	- `src/pages/**/use*.js`
- **UI** (rendering only) lives in view components:
	- `src/pages/**/*View.jsx`

Why this split?

- Views stay easy to scan (mostly JSX + CSS classes).
- Hooks become the single place to understand data flow.
- It makes “why/how” clearer: state transitions and fetch patterns are not mixed with markup.

Session/auth is intentionally simplified:

- `src/WitcherProvider.jsx` stores `{ id, name, avatar }` in `sessionStorage`.
- `src/useWitcher.js` is the convenience hook to access `{ witcher, login, logout }`.

## API

Base URL (see `src/api/config.js`):

`http://localhost:3000/api`

Endpoints used:

- `GET /contracts/` (supports `title` and `status` as query params)
- `GET /contracts/:id`
- `POST /contracts/`
- `PUT /contracts/:id`
- `PUT /contracts/:id/assignedTo` (JSON body = a raw **number**)
- `PUT /contracts/:id/status` (JSON body = the raw **string** `"Completed"`)
- `GET /witchers/`
- `GET /witchers/:id`

Important backend payload expectations:

- `reward` is sent as a **string** when creating/editing.
- `assignedTo` endpoint does NOT expect `{ "assignedTo": 1 }`, it expects `1`.
- `status` endpoint does NOT expect `{ "status": "Completed" }`, it expects `"Completed"`.

## Run the project

1) Start the backend on `http://localhost:3000`.

2) Start the frontend (from the `witcher-board-front` folder):

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Troubleshooting

- If `npm run dev` fails from the repository root, make sure your terminal is in the frontend folder (`witcher-board-front`).
- Vite may warn about Node versions (example: Node `22.11.0`). Upgrading to Node `22.12+` (or `20.19+`) removes the warning.
