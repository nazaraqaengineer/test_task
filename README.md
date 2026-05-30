# CivicFlow Demo — Playwright Test Suite (UITOP)

Automated end-to-end and API tests for the **CivicFlow Demo** applicant portal (React + Vite), built with **Playwright** and **TypeScript** for the UITOP AQA exercise.

Coverage includes authentication, project management, cross-browser and mobile viewports, Automation Exercise API checks, Docker execution, and GitHub Actions CI with HTML report publishing to GitHub Pages.

All application data is fake and stored in browser `localStorage`. Tests reset storage before each scenario.

## Prerequisites

- Node.js 20 or newer
- npm
- Docker (optional, for containerized test runs)

## Installation

```bash
npm install
npx playwright install
```

For CI-style runs with system dependencies:

```bash
npx playwright install --with-deps
```

## Environment variables

Copy the example file and adjust values if needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | App URL for Playwright (`vite preview`) | `http://127.0.0.1:4173` |
| `TEST_EMAIL` | Demo applicant email | `applicant@example.com` |
| `TEST_PASSWORD` | Demo applicant password | `Password123!` |

CI workflows set these explicitly; locally they are loaded from `.env` via `dotenv`.

## Run the app locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Playwright uses the production preview server at `BASE_URL` (default [http://127.0.0.1:4173](http://127.0.0.1:4173)), started automatically via `playwright.config.ts`.

## Run tests

```bash
npm run test:e2e
```

Other useful commands:

```bash
npm run build
npm run test:e2e:ui
npx playwright test --project=chromium-desktop
npx playwright show-report
```

## Run with Docker

```bash
docker compose up
```

The Playwright HTML report is written to `./playwright-report` on the host.

## View report

After a test run:

```bash
npx playwright show-report
```

## Project layout

| Path | Purpose |
|------|---------|
| `pages/` | Page Object Model classes |
| `tests/e2e/` | UI tests (auth, projects) |
| `tests/api/` | API tests |
| `tests/fixtures/` | Shared Playwright fixtures (browser monitoring) |
| `TEST_DOCUMENTATION.md` | Test cases, bugs, console/network notes |
| `.github/workflows/` | GitHub Actions (native and Docker) |

## CI

| Workflow | Description |
|----------|-------------|
| `playwright.yml` | Node 20, cached `node_modules`, browsers, build, test, artifact, GitHub Pages on `main` |
| `playwright-docker.yml` | Same via `docker compose` |

## Documentation

See [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md) for the full test case matrix, bugs found, and console/network error notes.
