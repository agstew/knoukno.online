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
| Hosting    | Railway (backend + frontend services)               |
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
- For production, create a free/paid cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), whitelist Railway's egress (or `0.0.0.0/0` for simplicity with a strong password), and set `MONGO_URI` on the Railway backend service to the Atlas connection string.

## 4. Resend (transactional email)

1. Create an account at [resend.com](https://resend.com) and verify the `knoukno.online` sending domain (add the TXT/CNAME/MX records it gives you - in GoDaddy DNS, see below).
2. Create an API key and set `RESEND_API_KEY` and `EMAIL_FROM` on the backend service.
3. Welcome emails are sent on `/api/auth/register`; extend `backend/src/utils/email.js` for more transactional messages (trial-ending reminders, receipts, etc.).

## 5. Docker

- `backend/Dockerfile` - Node 20 Alpine, installs prod deps, runs `node src/server.js`.
- `frontend/Dockerfile` - multi-stage: builds the Vite app, then serves `dist/` via Nginx (`frontend/nginx.conf`), with SPA fallback routing.
- `docker-compose.yml` wires both plus a local Mongo instance for development/testing.

## 6. Railway deployment

Create **two services** from this repo (monorepo - set each service's root directory):

1. **Backend service** → root directory `backend/`
   - Uses `backend/railway.toml` (Dockerfile builder, healthcheck `/api/health`)
   - Environment variables: `MONGO_URI` (Atlas), `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (your frontend URL), `RESEND_API_KEY`, `EMAIL_FROM`
2. **Frontend service** → root directory `frontend/`
   - Uses `frontend/railway.toml` (Dockerfile builder, healthcheck `/health`)
   - Build arg / env var: `VITE_API_URL` = your backend's public Railway URL + `/api`

After both deploy, copy each service's public Railway domain (or attach your custom domain, see below) and update `CLIENT_ORIGIN` / `VITE_API_URL` accordingly, then redeploy.

## 7. GoDaddy DNS → Railway + Resend

In GoDaddy's DNS management for `knoukno.online`:

| Type  | Name              | Value                                  | Purpose                     |
|-------|-------------------|------------------------------------------|------------------------------|
| CNAME | `www`             | `<frontend-service>.up.railway.app`       | Frontend on Railway          |
| CNAME | `api`             | `<backend-service>.up.railway.app`        | Backend API on Railway       |
| CNAME/TXT | (per Resend)  | values shown in Resend's domain setup     | Verify sending domain        |

Then in Railway, attach the custom domains (`www.knoukno.online`, `api.knoukno.online`) to the matching services under **Settings → Domains**, and set `CLIENT_ORIGIN=https://www.knoukno.online` on the backend and `VITE_API_URL=https://api.knoukno.online/api` on the frontend build.

## Logo

`frontend/src/assets/logo.svg` - a Dodger Blue "K" roundel with a black/blue "KnoUKno.online" wordmark. `frontend/public/favicon.svg` is the roundel alone, used as the site favicon.

## Plans

| Plan   | Price | Quota                |
|--------|-------|------------------------|
| Free   | $0    | 5 questions / 3 days   |
| Member | $39   | 50 questions / month   |
| Pro    | $436  | 75 questions / year    |
| Bonus  | $100  | +100 questions (one-time) |
