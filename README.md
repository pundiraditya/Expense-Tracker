# Expense Tracker

A full-stack expense tracker built with **Node.js + Express** (backend) and **React** (frontend).

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Backend  | Node.js, Express, UUID             |
| Frontend | React 18, plain CSS                |
| Storage  | In-memory (no database needed)     |
| Tests    | Jest + Supertest                   |

---

## Project Structure

```
expense-tracker/
├── server/
│   ├── index.js          # Server entry point
│   ├── app.js            # Express setup
│   ├── store.js          # In-memory data + seed
│   ├── routes/
│   │   └── expenses.js   # All CRUD endpoints
│   └── tests/
│       └── expenses.test.js
├── client/
│   ├── public/index.html
│   └── src/
│       ├── App.jsx         # Root component + state
│       ├── api.js          # API client
│       ├── index.css       # All styles
│       └── components/
│           ├── SummaryPanel.jsx
│           ├── FilterBar.jsx
│           ├── ExpenseForm.jsx
│           ├── ExpenseTable.jsx
│           └── DeleteModal.jsx
├── render.yaml             # Render.com deploy config
└── .gitignore
```

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/health                     | Health check             |
| GET    | /api/expenses                   | List (filter + sort)     |
| POST   | /api/expenses                   | Create expense           |
| GET    | /api/expenses/:id               | Get one                  |
| PUT    | /api/expenses/:id               | Update expense           |
| DELETE | /api/expenses/:id               | Delete expense           |
| GET    | /api/expenses/categories        | Get categories list      |
| GET    | /api/expenses/summary?month=... | Monthly summary          |

---

## Running Locally

**Step 1 — Start the backend**
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

**Step 2 — Start the frontend** (new terminal)
```bash
cd client
npm install
npm start
# App opens at http://localhost:3000
```

**Step 3 — Run tests**
```bash
cd server
npm test
```

---

## Deploying Live (GitHub → Render + Vercel)

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions.
