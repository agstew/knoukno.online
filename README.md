# KnoUKno.online

Know you know. A guided business-planning app: name your business, and answer the
questions that build a real plan across four stages - **Law → Location → Hiring → People**.
Every answer is stored, graded A–F, ranked, and printable.

Modeled after the knoukno.net product flow, rebuilt end-to-end for **knoukno.online**.

**Brand colors:** Dodger Blue `#1E90FF`, White `#FFFFFF`, Black `#000000`.

## Stack

| Layer      | Tech                                             |
|------------|---------------------------------------------------|
| Frontend   | React + Vite, served by Nginx in production        |
| Backend    | Node.js + Express (ESM)                            |
| Database   | MongoDB (Mongoose)                                  |
| Email      | Resend (welcome email on signup)                    |
| Auth       | JWT + bcrypt                                        |
| Containers | Docker + docker-compose                             |
| Hosting    | Railway (single combined service, root `Dockerfile`) |
| Domain DNS | GoDaddy                                             |

## Project structure

```
knoukno1.online/
├── backend/          Express API, MongoDB models, auth, email, question engine
├── frontend/          React SPA (Home, Register, Login, Price, Dashboard, Stage)
├── docker-compose.yml Local dev: mongo + backend + frontend
└── README.md
```

## 1. Local development

### Prerequisites
- Node.js 20+
- Docker Desktop (for MongoDB / full container run)
- A [Resend](https://resend.com) API key (optional locally - emails are skipped if absent)

### Backend
```bash
cd backend
cp .env.example .env      # fill in JWT_SECRET, RESEND_API_KEY, etc.
npm install
npm run dev                # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

### Everything with Docker Compose (Mongo + API + web)
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend: http://localhost:5000/api/health
- Mongo: mongodb://localhost:27017/knoukno

## 2. Git

```bash
git init
git add .
git commit -m "Initial commit: KnoUKno.online full stack"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
`.env` files are gitignored - never commit real secrets.

## 3. MongoDB

- Local dev uses the `mongo` service in `docker-compose.yml`.
- Production uses a MongoDB instance hosted as its own service in the same Railway project (not Atlas) - set `MONGO_URI` on the app's Railway service to that instance's connection string.

## 4. Resend (transactional email)

1. Create an account at [resend.com](https://resend.com) and verify the `knoukno.online` sending domain (add the TXT/CNAME/MX records it gives you - in GoDaddy DNS, see below).
2. Create an API key and set `RESEND_API_KEY` and `EMAIL_FROM` on the backend service.
3. Welcome emails are sent on `/api/auth/register`; extend `backend/src/utils/email.js` for more transactional messages (trial-ending reminders, receipts, etc.).

## 5. Docker

- Root `Dockerfile` - what Railway actually builds for production. Multi-stage: builds the Vite frontend, then copies its `dist/` into the Express backend's `public/` folder and serves both the API and the SPA (with a catch-all fallback) from one Node process on port 5000.
- `backend/Dockerfile` / `frontend/Dockerfile` - used only by `docker-compose.yml` for local development (separate Mongo + API + Nginx-served frontend containers). Not used in production.
- `docker-compose.yml` wires those plus a local Mongo instance for development/testing.

## 6. Railway deployment

Railway runs this app as a **single service** built from the root `Dockerfile` (see root `railway.toml`, builder `DOCKERFILE`, healthcheck `/api/health`). There is no separate frontend service and no `api.` subdomain - one container serves everything.

Environment variables set on that one service: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `RESEND_API_KEY`, `EMAIL_FROM`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`, `PAYPAL_MEMBER_PLAN_ID`, `PAYPAL_PRO_PLAN_ID`, `PAYPAL_WEBHOOK_ID`.

Pushing to the connected branch on GitHub triggers an automatic rebuild + redeploy of this one service.

## 7. GoDaddy DNS → Railway + Resend

In GoDaddy's DNS management for `knoukno.online`:

| Type  | Name              | Value                                  | Purpose                     |
|-------|-------------------|------------------------------------------|------------------------------|
| CNAME | `www`             | `<railway-service>.up.railway.app`        | Website + API (single service) |
| CNAME/TXT | (per Resend)  | values shown in Resend's domain setup     | Verify sending domain        |

Then in Railway, attach the custom domain (`www.knoukno.online`) to the single service under **Settings → Domains**.

## Logo

`frontend/src/assets/logo.svg` - a Dodger Blue "K" roundel with a black/blue "KnoUKno.online" wordmark. `frontend/public/favicon.svg` is the roundel alone, used as the site favicon.

## Plans

| Plan   | Price | Quota                |
|--------|-------|------------------------|
| Free   | $0    | 5 questions / 3 days   |
| Member | $39   | 50 questions / month   |
| Pro    | $436  | 75 questions / year    |
| Bonus  | $100  | +100 questions (one-time) |
