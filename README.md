# Feature Request Tracker

Small full-stack app for a technical assessment: list feature requests, add/edit/delete them, change status from the table, filter by status. React on the front, Express + MySQL on the back.

Stack: React 18, Node/Express, MySQL 8, Axios. Validation is express-validator on the API and simple checks on the form.

---

## Running it locally

You need Node 18+ and MySQL running. Two terminals: one for `backend`, one for `frontend`.

**1. Database**

Import `sql/schema.sql` in Workbench, TablePlus, or from a shell (adjust path to `mysql` if it’s not on your PATH):

```bash
mysql -u root -p < sql/schema.sql
```

That creates `feature_tracker`, the table, and a few seed rows.

**2. Backend**

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` — at minimum set `DB_PASSWORD` to match your MySQL user (often `root`). The app loads `.env` from the `backend` folder, so run commands from there or it won’t see the password.

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=feature_tracker
```

Then:

```bash
npm run dev
```

Server listens on port 5000. Hit `GET /api/health` if you want a quick check.

**3. Frontend**

```bash
cd frontend
npm install
npm start
```

Opens on 3000 and proxies `/api` to 5000.

**Production-style (API + UI on one port)** — build React, then run the server from `backend`; Express serves `frontend/build` and the API:

```bash
cd frontend && npm run build && cd ../backend && npm start
```

Open `http://localhost:5000`. If `frontend/build` is missing, `/` stays a small JSON hint instead of the app.

---

## Deploy on Render (one Web Service)

Use **Web Service** (not Static Site).

**Root directory** must be **empty** (repo root with `frontend/` and `backend/`). If it’s set to `backend`, the React build never runs and `/` is only API JSON.

- **Build command:** `npm install && npm run build` (uses root `package.json`)
- **Start command:** `npm start`

**Database:** hosted MySQL elsewhere. In Render → **Environment**, set at least:

- `DB_HOST` — hostname from your DB provider (not `localhost`)
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_PORT` — only if it’s not 3306

Run `sql/schema.sql` on that **remote** database once (same as local), or the app will 500.

**If the UI loads but you see “Couldn’t load data” / Internal Server Error:** the API can’t talk to MySQL. Common fixes:

1. **SSL** — many cloud MySQL hosts require it. Add: `DB_SSL` = `true`. If it still fails, add `DB_SSL_REJECT_UNAUTHORIZED` = `false` (some providers use certs Node doesn’t trust by default).
2. **Firewall / access** — allow **incoming** connections from the internet (or from Render’s IPs if the provider has an allowlist).
3. **Wrong password or database name** — double-check in the provider’s dashboard.
4. **Logs** — Render → your service → **Logs** — look for `ECONNREFUSED`, `Access denied`, or SSL errors when `/api/features` runs.

5. **Debug URL** — open `https://YOUR-APP.onrender.com/api/health/db`. If you see **`ECONNREFUSED`**, Render cannot reach MySQL: `DB_HOST` must be your **cloud** hostname (never `localhost`), `DB_PORT` must match the provider (often `3306`), and the database must allow **public / external** connections.

Optional env **`FRONTEND_BUILD_PATH`** only if you use a custom static build path.

---

## API (short version)

- `GET /api/health` — sanity check  
- `GET /api/features` — list (optional `?status=Open` etc.)  
- `GET /api/features/:id` — one row  
- `POST /api/features` — create (title, description, priority, optional status)  
- `PUT /api/features/:id` — full update  
- `PATCH /api/features/:id/status` — body `{ "status": "..." }`  
- `DELETE /api/features/:id`  

Priority: Low, Medium, High. Status: Open, In Progress, Completed.

Example POST body:

```json
{
  "title": "Something",
  "description": "Details here",
  "priority": "High",
  "status": "Open"
}
```

Quick curl:

```bash
curl http://localhost:5000/api/features
```

---

## Repo layout

Roughly:

- `backend/` — Express entry `server.js`, routes in `routes/features.js`, DB pool in `config/db.js`
- `frontend/` — React app, table UI in `components/FeatureTable.js`, modal in `FeatureModal.js`
- `sql/schema.sql` — schema + seeds

---

## Author

Mohamedi Ally Mohamed  

Email: hackerloum@gmail.com  
Phone: +255 760 442 000  

© 2026
