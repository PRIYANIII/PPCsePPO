# CareerPilot

CareerPilot is a placement-preparation platform for tracking DSA practice, coding-platform progress, company readiness, and interview preparation.

## Included

- Email/password authentication with user and admin roles
- Profile and coding-platform statistics
- DSA roadmap, filters, progress tracking, a starter question bank, and submission history
- Browser coding editor supporting C, C++, Java, and Python
- Company preparation pages, readiness scores, and interview experiences
- Gemini-powered resume analysis, readiness reports, AI coaching, roadmaps, and interview-experience summaries
- Admin CRUD for topics and companies, plus question APIs
- Dark mode and responsive React UI

## Run locally

Requirements: Node.js 20+, MongoDB (local or Atlas), and Docker Desktop if you want to run/submit code.

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `JWT_SECRET`, admin credentials, and `GEMINI_API_KEY`. Never commit this file.
2. Install packages:

   ```powershell
   npm.cmd run install:all
   ```

3. Create the starter data (this clears existing topics, questions, companies, and non-admin users):

   ```powershell
   npm.cmd run seed --prefix backend
   ```

4. Start the application:

   ```powershell
   npm.cmd run dev
   ```

Open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`.

## Deployment configuration

The frontend defaults to `/api`, which works behind a reverse proxy. For a separately hosted API, set `VITE_API_URL=https://your-api.example.com/api` when building the frontend.

The code runner requires a Docker daemon and downloads language images on first use. It runs each submission in a short-lived container with no network, a read-only filesystem, process limits, memory limits, and a timeout. For a public internet deployment, use a dedicated isolated runner service rather than exposing the application server's Docker socket.

## Gemini AI features

Add your key only to `backend/.env`:

```env
GEMINI_API_KEY=your_key_from_google_ai_studio
GEMINI_MODEL=gemini-3.6-flash
```

The browser never receives this key. The server uses Gemini structured JSON responses for the Resume, AI Coach, and company-readiness features. Resume analysis is stored per user; roadmaps and coaching are generated from the current profile, platform stats, DSA progress, resume analysis, and selected company readiness.

## Current seed data

The seed installs 21 roadmap topics, 3 companies, and 12 runnable starter DSA problems. The topic counts reflect the actual question bank rather than placeholder totals.

## Next content milestones

- Expand the question bank and add editorial solutions/hints for each problem.
- Add full question CRUD controls to the admin UI (the secured APIs already exist).
- Add automated API/UI tests and a CI workflow.
- Add password reset/email verification and production observability.
