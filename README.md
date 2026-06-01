# DevNotes API 🚀

A production-ready, highly optimized MERN backend architecture built for managing developer notes. This API implements secure token-based authentication, dynamic query piping (pagination, search, sorting), and real-time business intelligence data aggregation.

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Architecture Pattern:** MVC (Models, Views/Responses, Controllers) with robust error handling middleware.

---

## 📈 Key Engineering Features

### 1. Dynamic Query Pipeline

The `GET /api/notes/all` endpoint doesn't just dump raw collections. It pipes your data through three distinct architectural layers before serving it:

- **Search Filter:** Case-insensitive text filtering using MongoDB Regular Expressions (`$regex`).
- **Dynamic Sorting:** Flexible data ordering allowing user-defined criteria (e.g., chronological or alphabetical).
- **Pagination:** Offsets calculations via `.skip()` and `.limit()` to optimize network bandwidth and frontend loading speeds.

### 2. Database Aggregation (Business Intelligence)

Instead of processing heavy computations in Node.js application memory, the `/api/notes/stats` endpoint leverages native **MongoDB Aggregation Pipelines**. It groups individual user records and pushes complex processing calculations (such as average string length calculations and counts) entirely to the database layer for high-performance indexing.

### 3. Identity and Access Security

Custom middleware enforces route guardrails. Notes are tightly coupled to the authenticated user's ID (`req.user._id`), ensuring data isolation so users can never query, mutate, or analyze records belonging to someone else.

---

## 🚦 API Endpoints Reference

### Authentication Routes

| Method | Endpoint             | Description                          | Access |
| ------ | -------------------- | ------------------------------------ | ------ |
| `POST` | `/api/auth/register` | Register a new user profile          | Public |
| `POST` | `/api/auth/login`    | Authenticate user & return JWT token | Public |

### Note Management Routes

| Method   | Endpoint           | Description                                  | Access                   |
| -------- | ------------------ | -------------------------------------------- | ------------------------ |
| `POST`   | `/api/notes`       | Create a new dev note                        | Private (Token Required) |
| `GET`    | `/api/notes/all`   | Fetch paginated, sortable, searchable notes  | Private (Token Required) |
| `GET`    | `/api/notes/stats` | Run real-time note analytics via Aggregation | Private (Token Required) |
| `GET`    | `/api/notes/:id`   | Retrieve a specific note by its ID           | Private (Token Required) |
| `PUT`    | `/api/notes/:id`   | Update an existing note                      | Private (Token Required) |
| `DELETE` | `/api/notes/:id`   | Remove a note from the cluster               | Private (Token Required) |

---

## 🚀 Local Development Setup

1. **Clone the repository:**

```bash
git clone https://github.com/amir243-dev/dev-notes-api.git
cd dev-notes-api/server

```

2. **Install local production and development dependencies:**

```bash
npm install

```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the server directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key

```

4. **Boot the application server:**

```bash
# Development Mode (with hot reloading)
npm run dev

# Production Mode
npm start

```

---
