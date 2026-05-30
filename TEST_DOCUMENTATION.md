# Test Documentation — CivicFlow Demo

## 1. Test Summary

| Item | Detail |
|------|--------|
| **Total test cases** | 17 (7 authentication, 8 projects UI, 2 API) |
| **Total executions (full matrix)** | 85 (17 × 5 browser/device projects) |
| **Browsers & devices** | Desktop Chrome, Desktop Firefox, Desktop Safari (WebKit), Pixel 5, iPhone 13 |
| **Scope** | Sign-in validation, logout, Projects navigation, custom project CRUD/validation, Automation Exercise API |
| **Tools** | Playwright 1.54, TypeScript, Page Object Model, dotenv, GitHub Actions, Docker |

### Environment (demo)

Configured via `.env` or CI `env` (see `.env.example`):

| Variable | Value |
|----------|-------|
| `BASE_URL` | `http://127.0.0.1:4173` |
| `TEST_EMAIL` | `applicant@example.com` |
| `TEST_PASSWORD` | `Password123!` |

---

## 2. UI Test Cases

### Authentication (`tests/e2e/auth.spec.ts`)

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|---------------|-------|-----------------|
| AUTH-01 | successfully logs in with valid credentials | App on login page; `localStorage` cleared | Enter valid email and password; click Log in | Dashboard heading **Applicant dashboard** is visible |
| AUTH-02 | shows error "Invalid email or password." with wrong password | App on login page; `localStorage` cleared | Enter valid email and wrong password; submit | Error **Invalid email or password.** |
| AUTH-03 | shows error "Invalid email or password." with wrong email | App on login page; `localStorage` cleared | Enter unknown email and valid password; submit | Error **Invalid email or password.** |
| AUTH-04 | shows error "Email is required." when email field is empty | App on login page; `localStorage` cleared | Leave email empty; enter password; submit | Error **Email is required.** |
| AUTH-05 | shows error "Password is required." when password field is empty | App on login page; `localStorage` cleared | Enter email; leave password empty; submit | Error **Password is required.** |
| AUTH-06 | shows error "Enter a valid email address." with invalid email format | App on login page; `localStorage` cleared | Enter invalid email format; enter password; submit | Error **Enter a valid email address.** |
| AUTH-07 | redirects to login page after logout | User signed in | Log in; click Log out in sidebar | Login email and password fields visible again |

### Projects (`tests/e2e/projects.spec.ts`)

| ID | Title | Preconditions | Steps | Expected Result |
|----|-------|---------------|-------|-----------------|
| PRJ-01 | navigates to Projects page via sidebar | User signed in | Click **Projects** in left sidebar | Projects page wrapper visible; **My Project Templates** heading visible |
| PRJ-02 | creates project with required fields only and shows it in the list | User signed in | Open Projects → Create Custom Project; fill name, jurisdiction, address; submit | Redirected to projects list; new card with name and jurisdiction visible |
| PRJ-03 | creates project with all fields including optional and shows description in card | User signed in | Create project with name, jurisdiction, address, unit, description; submit | Card shows formatted address with unit and description text |
| PRJ-04 | shows error "Project name is required." when name is empty | User signed in; on new project form | Fill jurisdiction and address only; submit | Error **Project name is required.** |
| PRJ-05 | shows error "Jurisdiction is required." when jurisdiction is not selected | User signed in; on new project form | Fill name and address; leave jurisdiction default; submit | Error **Jurisdiction is required.** |
| PRJ-06 | shows error "Address line is required." when address is empty | User signed in; on new project form | Fill name and jurisdiction; submit | Error **Address line is required.** |
| PRJ-07 | shows error "Project name already exists." for duplicate name | User signed in; seeded **Garage Addition** exists | Create project with duplicate name **Garage Addition**; submit | Error **Project name already exists.** |
| PRJ-08 | returns to projects list when Cancel is clicked | User signed in; on new project form | Click **Cancel** | Projects page visible with **My Project Templates** |

---

## 3. API Test Cases

| ID | Title | Method | Endpoint | Request Body | Expected Result |
|----|-------|--------|----------|--------------|-----------------|
| API-01 | GET productsList returns 200 with non-empty products array | GET | `https://automationexercise.com/api/productsList` | — | HTTP 200; `responseCode` 200; `products` array length > 0 |
| API-02 | POST verifyLogin with invalid credentials returns responseCode 404 | POST | `https://automationexercise.com/api/verifyLogin` | `email=wrong@test.com`, `password=wrongpass` (form) | HTTP 200; `responseCode` 404 |

---

## 4. Bugs Found

### BUG-01 — Topbar “Create custom project” lacks `data-testid`

| | |
|---|---|
| **Steps** | Sign in; remain on dashboard; inspect topbar primary action |
| **Expected** | Consistent `data-testid` for all primary “create project” entry points (matches `create-project-button` on Projects page) |
| **Actual** | Topbar button has no `data-testid`; only the Projects screen button is testable via `create-project-button` |

**Impact:** Low — tests use the Projects page button; manual/automation paths via topbar require role-based selectors.

### BUG-02 — “Lost your password?” is non-functional

| | |
|---|---|
| **Steps** | On login page, click **Lost your password?** |
| **Expected** | Password recovery flow or informational message |
| **Actual** | Button has no handler; nothing happens |

**Impact:** Low — out of scope for current requirements but inconsistent with visible affordance.

---

## 5. Console and Network Errors

Tests attach listeners for `console` type `error` and `requestfailed` on every E2E test via the auto `browserMonitor` fixture (`tests/fixtures/browser-monitor.ts`). Issues are written to the HTML report with `testInfo.attach()`, not `console.log`.

**Latest run (`chromium-desktop`, 17 tests):**

- **Console errors:** None logged
- **Failed network requests:** None logged

The demo app is fully client-side after load; no external API calls are made during UI flows. API tests call `automationexercise.com` only in `tests/api/api.spec.ts`.

---

## 6. CI and Docker

| Workflow | Description |
|----------|-------------|
| `.github/workflows/playwright.yml` | `npm ci` → install browsers → build → `playwright test` → artifact → GitHub Pages (on push to `main`) |
| `.github/workflows/playwright-docker.yml` | `docker compose up` → same artifact and Pages deploy |

| File | Role |
|------|------|
| `Dockerfile` | Playwright Jammy image, `npm ci`, build, default `npx playwright test` |
| `docker-compose.yml` | Service `playwright`, `CI=true`, report volume mount |
