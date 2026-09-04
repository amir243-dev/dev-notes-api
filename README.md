# DevNotes — The Build Log

A capture-first engineering journal for tracking technical decisions, architecture trade-offs, and project learnings.

## The Problem (The Reframe)

This started as a generic "Notes CRUD" app. That framing was flawed — nobody logs into a web dashboard to jot down a sticky note. Technical decisions were living scattered across commit messages, local markdown files, and memory, lost the moment the terminal closed.

The product was reframed into a Build Log: a structured journal organized by project. The UX was inverted to be capture-first (opening directly into a quick-capture composer), and backend aggregation was repointed to track meaningful developer metrics instead of generic string lengths.

## Why This Exists

This isn't a notes app. It's a receipt.

Notion and Obsidian are blank canvases — you build your own structure, maintain it, and eventually stop maintaining it. This is the opposite: the structure is baked in, zero config, and each entry is deliberately short. You're not writing documentation, you're leaving a breadcrumb — "chose X over Y, here's why," timestamped, scoped to a project, tagged, done. A wiki invites you to write an essay. A receipt asks for a sentence. Nobody reorganizes a receipt — they file it and find it later. That's the whole product.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript (Strict Mode)
- **Frontend:** React (JavaScript), Vite, CSS Variables (Custom Design System)
- **Database:** MongoDB (Mongoose ODM)
- **DevOps & Reliability:** GitHub Actions (CI), Sentry (Error Monitoring), Render (Backend), Vercel (Frontend)

## Key Engineering Features

**1. Capture-First UX & Inline Composer**
The app bypasses traditional dashboards. The "front door" is a quick-capture view (Project → Tags → Note → Save). The inline composer allows creating and editing entries directly inside the Project View without losing context or triggering page reloads.

**2. MongoDB Aggregation Pipelines**
Instead of pulling all data into Node memory, the `/api/notes/stats` endpoint leverages native MongoDB aggregations (`$match`, `$group`, `$unwind`, `$lookup`) to calculate:
- Notes logged per project
- Most-used tags across the entire workspace
- A dynamically calculated consecutive "logging streak" using JS date logic on the last 30 days of timestamps

**3. Strict Data Isolation & Security**
Custom JWT middleware enforces route guardrails. Every query, update, and delete operation strictly couples the request to the authenticated user's ID (`req.user._id`), ensuring users can never query or mutate records belonging to someone else. Auth routes are protected by `express-rate-limit` to prevent brute-force attacks.

**4. Production Reliability**
- **Sentry Integration:** Real-time backend error tracking and stack trace monitoring in production.
- **CI Pipeline:** GitHub Actions automatically runs `npm test` (Jest + Supertest + mongodb-memory-server) on every push to `main`, blocking merges if tests fail.
- **Environment Segregation:** Strict separation of `NODE_ENV` to strip stack traces from production error responses and dynamically switch CORS origins.

## Roadmap (Stage 2)

**Auth UX**
Password field gets a visibility toggle.

**Field-Level Encryption for Note Content**
Note bodies are encrypted client-side (Web Crypto API, AES-GCM) before they ever reach the API. Tags, project associations, and timestamps stay plaintext, so the aggregation pipeline above keeps working untouched. This is field-level encryption, not full zero-knowledge — an admin with database access cannot read note content, but can still see structural metadata (tags, counts, project names).

**Lower-Friction Capture Surfaces**
The thesis is "capture before it's gone" — every extra click between the thought and the log entry works against that. Two realistic paths, in order of effort:
- **CLI (`npm` package):** `devnotes log "fixed the race condition" --tag auth` — one terminal command, no context switch, arguably the best fit for the thesis of any of these.
- **VS Code extension:** a command-palette entry ("DevNotes: Quick Capture") that opens a quick-input box and posts straight to the API. Highest visibility for a portfolio, since it puts the tool where developers already work.

## Under Consideration (Future)

**Email-Based Password Reset**
Standard reset flow: user requests a reset, receives a time-limited token by email (via a transactional provider such as Resend or SendGrid), and uses it to set a new password. Requires a `resetToken` / `resetTokenExpiry` pair on the `User` schema and a short expiry window (15–60 min). Not scoped for Stage 2 — real infrastructure dependency (email deliverability), not a quick add.

**Git hook integration** — a `post-commit` hook that offers to log a note tied to the commit hash/message at the exact moment a decision is already being written down. Not yet scoped or scheduled; flagged here as the most natural next extension of the capture-before-it's-gone thesis once Stage 2 ships.

## Local Setup

Clone the repository.

**Backend:**
```
cd server
npm install
# Create a .env file based on .env.example
npm run dev
```

**Frontend:**
```
cd client
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
```

**(Optional) Seed the database with dummy data:**
```
cd server
npx tsx seed.ts
```

## Live URLs

- **Frontend:** https://dev-notes-api-five.vercel.app/
- **Backend API:** https://dev-notes-api-qmvb.onrender.com/
