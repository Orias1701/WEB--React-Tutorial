# Oriax Agents Prelaunch Landing Page

Modern prelaunch landing page for an AI agents product.

This project uses:
- React + Vite for the frontend landing page
- Node.js + Express for the backend API
- JSON files for mock content and local waitlist storage

## Features

- Single-page landing with modern glassmorphism-inspired UI
- Smooth section reveal animations and responsive layout
- Dynamic page content loaded from backend JSON
- Waitlist form with validation and backend persistence
- API endpoints for landing content and waitlist signup

## Project Structure

```
Oriax--Comming-Soon-7/
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- client/
|   |-- public/
|   |   |-- .nojekyll
|   |   `-- landing-content.json
|   |-- src/
|   |   |-- App.jsx
|   |   |-- App.module.css
|   |   |-- main.jsx
|   |   |-- services/api.js
|   |   `-- styles/
|   |       |-- base.css
|   |       `-- variables.css
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- controllers/landing.controller.js
|   |   |-- routes/landing.routes.js
|   |   `-- data/
|   |       |-- landing-content.json
|   |       `-- waitlist.json
|   |-- .env.example
|   `-- package.json
|-- package.json
`-- README.md
```

## Getting Started

1. Install root dependencies:

```bash
npm install
```

2. Install client and server dependencies:

```bash
npm run install:all
```

3. Start both frontend and backend in development mode:

```bash
npm run dev
```

Default URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Build For Production

Build the frontend bundle:

```bash
npm run build
```

Run backend server:

```bash
npm start
```

## Deploy To GitHub Pages

This repository already includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

Steps:

1. Push code to `main` or `master`.
2. Open repository settings on GitHub.
3. Go to Pages.
4. Set Source to GitHub Actions.
5. Wait for the workflow "Deploy Landing To GitHub Pages" to finish.

Deployment behavior:

- The workflow builds only the frontend (`client`) and deploys `client/dist` to Pages.
- Build uses base path `/<repository-name>/` automatically.
- GitHub Pages runs in static mode (`VITE_STATIC_MODE=true`).
- Landing content is loaded from `client/public/landing-content.json`.
- Waitlist submit API is not available on Pages unless you host the backend separately.

If you want waitlist submission to work on Pages, deploy the backend elsewhere and set `VITE_API_BASE_URL` to that public API before build.

## API Endpoints

### GET /api/health
Simple health check.

### GET /api/landing-content
Returns landing page content from `server/src/data/landing-content.json`.

### POST /api/waitlist
Stores a waitlist entry in `server/src/data/waitlist.json`.

Request body:

```json
{
	"name": "Alex Morgan",
	"email": "alex@company.com",
	"company": "Northstar Labs",
	"role": "Product Operations"
}
```

Validation rules:
- `name` must be at least 2 characters
- `email` must be valid format
- duplicate email returns HTTP 409

## Environment Variables

Server (`server/.env.example`):

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Client (`client/.env.example`):

```env
VITE_API_BASE_URL=/api
```

## Notes

- Waitlist storage is file-based and intended for prelaunch/demo usage.
- For production scale, replace JSON storage with a real database.
