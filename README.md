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
