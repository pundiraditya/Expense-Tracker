# Deployment Guide

## Step 1 — Push to GitHub

Open a terminal in the `expense-tracker` folder.

```bash
# Initialise git (skip if already done)
git init
git add .
git commit -m "Initial commit: Expense Tracker"

# Create a new repo on GitHub (github.com → New repository → name it expense-tracker)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render (free)

1. Go to **https://render.com** and sign up / log in
2. Click **New → Web Service**
3. Connect your GitHub account and select the `expense-tracker` repo
4. Fill in the settings:

   | Setting        | Value           |
   |----------------|-----------------|
   | Name           | expense-tracker-api |
   | Root Directory | `server`        |
   | Build Command  | `npm install`   |
   | Start Command  | `npm start`     |
   | Plan           | Free            |

5. Click **Create Web Service**
6. Wait ~2 minutes. Copy the URL shown — it looks like:
   ```
   https://expense-tracker-api.onrender.com
   ```

> ⚠ Free Render services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## Step 3 — Deploy Frontend on Vercel (free)

### Before deploying — update the API URL

Edit `client/src/api.js` and change line 1 from:
```js
const BASE = '/api/expenses';
```
to:
```js
const BASE = process.env.REACT_APP_API_URL || '/api/expenses';
```

Commit and push this change:
```bash
git add client/src/api.js
git commit -m "Use env var for API URL in production"
git push
```

### Deploy on Vercel

1. Go to **https://vercel.com** and sign up / log in with GitHub
2. Click **Add New → Project**
3. Import your `expense-tracker` GitHub repo
4. Set the **Root Directory** to `client`
5. Under **Environment Variables**, add:

   | Name                | Value                                       |
   |---------------------|---------------------------------------------|
   | REACT_APP_API_URL   | https://expense-tracker-api.onrender.com/api/expenses |

6. Click **Deploy**
7. Vercel gives you a live URL like `https://expense-tracker-xyz.vercel.app`

---

## Step 4 — Fix CORS for production

Update `server/app.js` to allow your Vercel URL:

```js
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*'
}));
```

In Render dashboard → your service → Environment, add:
```
ALLOWED_ORIGINS = https://expense-tracker-xyz.vercel.app
```

Then redeploy (Render auto-deploys on git push).

---

## Done! 🎉

- Backend live: `https://expense-tracker-api.onrender.com`
- Frontend live: `https://expense-tracker-xyz.vercel.app`

Any `git push` to `main` will auto-redeploy both services.
