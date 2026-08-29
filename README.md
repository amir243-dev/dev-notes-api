# DevNotes — The Build Log

A capture-first engineering journal for tracking technical decisions, architecture trade-offs, and project learnings.

## The Problem (The Reframe)

Originally, this repository was a generic "Notes CRUD" app. That framing was fundamentally flawed: nobody logs into a web dashboard to jot down a sticky note. Technical decisions were living scattered across commit messages, local markdown files, and memory—lost the moment the terminal closed.

The product was reframed into a **Build Log**: a structured journal organized by project. The UX was inverted to be capture-first (opening directly into a quick-capture composer), and the backend aggregation was repointed to track meaningful developer metrics instead of generic string lengths.

## Why This Exists

Generic note-taking applications are designed for flat, unstructured capture. For software engineers and other project-based workers, this creates friction. Technical decisions, debugging insights, and architectural choices get lost in a sea of unrelated daily notes, or scattered across commit messages and disconnected documentation tools.

This isn't a notes app. It's a receipt.

A general-purpose notes tool gives you infinite flexibility and infinite setup — you build your own structure, maintain it, and eventually stop maintaining it. DevNotes Build Log is the opposite: the structure is baked in, zero config, and each entry is deliberately short. You're not writing documentation. You're leaving a breadcrumb — "chose X over Y, here's why, in two sentences" — timestamped, scoped to a project, tagged, done. Nobody reorganizes a receipt. They file it and find it later. That's the whole product, and the shortness is the feature. A wiki invites you to write an essay. A receipt asks for a sentence.

Notion and Obsidian are blank canvases that demand you become an architect of your own notes. They're built for documentation, knowledge management, and life organization — heavy, by design. This is built for contextual micro-logging: the difference between a filing cabinet and a pocket notebook you only pull out while standing on the job site. It doesn't try to hold your tasks, your essays, or your personal life. It only holds the "why did I do this?" and "how did I fix this?" moments, scoped strictly to the project at hand. It isn't rivaling them; it's replacing the messy "Scratchpad" or "Untitled Note" you keep at the bottom of your sidebar.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript (Strict Mode)
- **Frontend:** React (JavaScript), Vite, CSS Variables (Custom Design System)
- **Database:** MongoDB (Mongoose ODM)
- **DevOps & Reliability:** GitHub Actions (CI), Sentry (Error Monitoring), Render (Backend), Vercel (Frontend)

## Key Engineering Features

### 1. Capture-First UX & Inline Composer

The app bypasses traditional dashboards. The "front door" is a quick-capture view (Project → Tags → Note → Save). The inline composer allows creating and editing entries directly inside the Project View without losing context or triggering page reloads.

### 2. MongoDB Aggregation Pipelines

Instead of pulling all data into Node memory, the `/api/notes/stats` endpoint leverages native MongoDB aggregations (`$match`, `$group`, `$unwind`, `$lookup`) to calculate:

- Notes logged per project.
- Most-used tags across the entire workspace.
- A dynamically calculated consecutive "logging streak" using JS date logic on the last 30 days of timestamps.

### 3. Strict Data Isolation & Security

Custom JWT middleware enforces route guardrails. Every query, update, and delete operation strictly couples the request to the authenticated user's ID (`req.user._id`), ensuring users can never query or mutate records belonging to someone else. Auth routes are protected by `express-rate-limit` to prevent brute-force attacks.

### 4. Production Reliability

- **Sentry Integration:** Real-time backend error tracking and stack trace monitoring in production.
- **CI Pipeline:** GitHub Actions automatically runs `npm test` (Jest + Supertest + `mongodb-memory-server`) on every push to `main`, blocking merges if tests fail.
- **Environment Segregation:** Strict separation of `NODE_ENV` to strip stack traces from production error responses and dynamically switch CORS origins.

## Local Setup

1. Clone the repository.

2. **Backend:**

   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend:**

   ```bash
   cd client
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

4. **(Optional) Seed the database with dummy data:**
   ```bash
   cd server
   npx tsx seed.ts
   ```

## Live URLs

- **Frontend:** [https://dev-notes-api-five.vercel.app/]
- **Backend API:** [https://dev-notes-api-qmvb.onrender.com/]
