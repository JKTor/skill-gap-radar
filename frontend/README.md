# Skill-Gap Radar Frontend

React + TypeScript + Vite UI for the Skill-Gap Radar app.

## Run

```bash
npm install
npm run dev
```

Dev server defaults to `http://localhost:5173`.

## Backend

The API base URL defaults to `http://localhost:8000`. To override it:

```bash
cp .env.example .env
```

Then set:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

If the backend health check is unavailable, the UI stays usable in mock mode.

## Scripts

```bash
npm run lint
npm run build
```
